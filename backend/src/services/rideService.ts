import {redisClient} from '../config/db';
import {v4 as uuid} from 'uuid';
import * as vehicleService from './vehicleService';
import {IRedisRide, IRide} from "../data/Interfaces/IRide";
import {VehicleAvailability} from "../data/Enumerations/VehicleAvailability";
import {RideStatus} from "../data/Enumerations/RideStatus";
import {IVehicle} from "../data/Interfaces/IVehicle";


const getRideStatus = async (id: string): Promise<RideStatus | null> => {

    const status = await redisClient.hGet(`rides:${id}`, 'status');

    if(status === null)
        return RideStatus.Cancelled
    else
        return +status;
}

const setRideStatus = async (id: string, status: RideStatus): Promise<void> => {

    await redisClient.hSet(`rides:${id}`, { status: status.toString() });
}

export async function createRide(ride: IRide): Promise<IRide | null> {

    ride.id = uuid();
    ride.status = RideStatus.Requested;
    ride.price = calculatePrice(ride);

    const n = await redisClient.hSet(`rides:${ride.id}`, {
        id: ride.id,
        passengerId: ride.passengerId,
        status: RideStatus.Requested.toString(),
        startLocationLat: ride.startLocation.latitude.toString(),
        startLocationLng: ride.startLocation.longitude.toString(),
        destinationLat: ride.destination.latitude.toString(),
        destinationLng: ride.destination.longitude.toString(),
        price: ride.price.toString()
    });

    if(n < 8)
        return null;

    await redisClient.lPush(`rides:${RideStatus.Requested}`, ride.id);

    const a = await getRideById(ride.id);
    console.debug(a);

    return a;
}

export const findVehicleForRide = async (rideId: string): Promise<void> => {

    const ride = await getRideById(rideId);

    if (!ride)
        throw "Ride not found";

    let nearbyVehicles: Array<IVehicle> = [];

    const rideStatus = await getRideStatus(ride.id);

    while (rideStatus == RideStatus.Requested) {

        console.debug(`Finding vehicle for ride ${ride.id}`);

        nearbyVehicles = await vehicleService.getNearbyVehicles(
            ride.startLocation.latitude,
            ride.startLocation.longitude,
            100,
            1
        );
        if (nearbyVehicles.length == 0) {
            await sleep(30000);
        } else {

            const v = nearbyVehicles[0];
            if (v) {
                const n = await redisClient.hSet(`rides:${ride.id}`, {
                    vehicleId: ride.vehicleId,
                    driverId: ride.driverId,
                    status: ride.status,
                });
                if (n >= 2) { 
                    await vehicleService.updateVehicleAvailability(ride.vehicleId, VehicleAvailability.occupied);

                    // active ride reference
                    await redisClient.set(`passenger:${ride.passengerId}:active-ride`, ride.id);
                    await redisClient.set(`driver:${ride.driverId}:active-ride`, ride.id);
                    await redisClient.set(`vehicles:${ride.vehicleId}:active-ride`, ride.id);
                } else {
                    await setRideStatus(ride.id, RideStatus.Requested);
                }
            }
        }
    }
    console.debug(`Found vehicle for ride ${ride.id}`);
}

export async function getRideById(id: string): Promise<IRide | null> {

    const r = await redisClient.hGetAll(`rides:${id}`) as IRedisRide;

    if (!r || Object.keys(r).length === 0) {
        return null;
    }

    if (!r.id || !r.passengerId || !r.status ||
        !r.startLocationLat || !r.startLocationLng ||
        !r.destinationLat || !r.destinationLng || !r.price)

        return null;
 
    else return {
        id: r.id,
        passengerId: r.passengerId,
        driverId: r.driverId,
        vehicleId: r.vehicleId,
        status: +r.status,
        startLocation: {
            latitude: r.startLocationLat,
            longitude: r.startLocationLng,
        },
        destination: {
            latitude: r.destinationLat,
            longitude: r.destinationLng
        },
        rideTimespan: (+r.completionTime - +r.startingTime),
        price: +r.price
    } as IRide;
}

export async function deleteRide(id: string): Promise<boolean> {

    const ride = await getRideById(id);

    if (!ride) {
        return false;
    }

    await redisClient.del(`rides:${id}`);

    return true;
}

// export async function getAllRides(): Promise<IRide[]> {
//     const keys = await redisClient.keys('ride:*');
//
//     if (keys.length === 0) {
//         return [];
//     }
//
//     const rides = await Promise.all(
//         keys.map(async (key: string) => {
//             const ride = await redisClient.hGetAll(key);
//             return ride as unknown as IRide;
//         })
//     );
//
//     return rides;
// }

export async function cancelRide(id: string) {

    const ride = await getRideById(id);

    if (ride != null) {

        if(ride.status < RideStatus.InProgress && ride.status > RideStatus.Cancelled) {

            if (ride.vehicleId != null && ride.status == RideStatus.Accepted)
                await vehicleService.updateVehicleAvailability(ride.vehicleId, VehicleAvailability.available);

            await redisClient.hSet(`rides:${id}`, {status: RideStatus.Cancelled});
            await redisClient.hExpire(`rides:${id}`, Object.keys(ride), 60);

            return { ride: await getRideById(id), success: true};
        }
    }

    return { ride: await getRideById(id), success: false};
}

export async function acceptRide(rid: string, vid: string, did: string) {

    const ride = await getRideById(rid);

    if (ride != null) {

        if(ride.status == RideStatus.Requested) {

            if (ride.vehicleId != null)
                await vehicleService.updateVehicleAvailability(vid, VehicleAvailability.available);

            await redisClient.hSet(`rides:${rid}`, {
                status: RideStatus.Accepted,
            });

            ride.vehicleId = vid;
            ride.driverId = did;
            ride.status = RideStatus.Accepted;

            const n = await redisClient.hSet(`rides:${ride.id}`, {
                vehicleId: ride.vehicleId,
                driverId: ride.driverId,
                status: ride.status,
            });

            if (n != 3) {
                await setRideStatus(ride.id, RideStatus.Requested);
                return false;
            }

            await vehicleService.updateVehicleAvailability(ride.vehicleId, VehicleAvailability.occupied)

            await redisClient.set(`drivers:${ride.driverId}:active-ride`, ride.id);
            await redisClient.set(`vehicles:${ride.vehicleId}:active-ride`, ride.id);

            return true;
        }
    }
    return false;
}

export async function startRide(id: string){

    const ride = await getRideById(id);

    if (ride != null) {

        if(ride.status == RideStatus.Accepted) {

            await redisClient.hSet(`rides:${id}`, {
                status: RideStatus.InProgress,
                startingTime: Date.now(),
            });
            await redisClient.set(`passengers:${ride.passengerId}:active-ride`, ride.id);

            return { ride: await getRideById(id), success: true};
        }
    }
    return { ride: await getRideById(id), success: false};
}

export async function completeRide(id: string) {

    const ride = await getRideById(id);

    if (ride != null) {

        if(ride.status == RideStatus.InProgress) {

            await redisClient.hSet(`rides:${id}`, {
                status: RideStatus.Finished,
                completionTime: Date.now(),
            });

            await redisClient.del(`passengers:${ride.passengerId}:active-ride`);
            await redisClient.del(`drivers:${ride.driverId}:active-ride`);
            await redisClient.del(`vehicles:${ride.vehicleId}:active-ride`);

            return { ride: await getRideById(id), success: true};
        }
    }
    return { ride: await getRideById(id), success: false};
}


export async function getActiveRideByPassenger(passengerId: string): Promise<IRide | null> {

    const rideId = await redisClient.get(`passengers:${passengerId}:active-ride`);

    if (!rideId) {
        return null;
    }

    return await getRideById(rideId);
}

export async function getActiveRideByDriver(driverId: string): Promise<IRide | null> {

    const rideId = await redisClient.get(`drivers:${driverId}:active-ride`);

    if (!rideId) {
        return null;
    }

    return await getRideById(rideId);
}

export async function getActiveRideByVehicle(vehicleId: string): Promise<IRide | null> {

    const rideId = await redisClient.get(`vehicles:${vehicleId}:active-ride`);

    if (!rideId) {
        return null;
    }

    return await getRideById(rideId);
}


const calculatePrice = (ride: IRide) => {
    return Math.floor(Math.random() * (10000 - 80)) + 80;
}

const sleep = (ms: number) => new Promise(
    resolve => setTimeout(resolve, ms)
);