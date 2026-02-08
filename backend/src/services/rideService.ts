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

    await redisClient.hSet(`rides:${id}`, { status: status });
}

export const createRide = async (ride: IRide): Promise<IRide | null> => {

    ride.id = uuid();
    ride.status = RideStatus.Requested;
    ride.price = calculatePrice(ride);

    const n = await redisClient.hSet(`rides:${ride.id}`, {
        id: ride.id,
        passengerId: ride.passengerId,
        status: RideStatus.Requested,
        startLocationLat: ride.startLocation.latitude.toString(),
        startLocationLng: ride.startLocation.longitude.toString(),
        destinationLat: ride.destination.latitude.toString(),
        destinationLng: ride.destination.longitude.toString(),
        price: ride.price
    });

    if(n < 8)
        return null;

    await redisClient.set(`passengers:${ride.passengerId}:active-ride`, ride.id);
    await redisClient.lPush(`rides:${RideStatus.Requested}`, ride.id);

    return await getRideById(ride.id);
}

export const findVehicleForRide = async (rideId: string): Promise<string | null> => {

    const ride = await getRideById(rideId);

    if (ride == null)
        throw "Ride not found";

    let nearbyVehicles: Array<IVehicle> = [];

    let rideStatus = await getRideStatus(ride.id);

    if(rideStatus != RideStatus.Requested)
        return null;

    do {
        console.debug(`Finding vehicle for ride <${ride.id}>`);

        nearbyVehicles = await vehicleService.getNearbyVehicles(
            +ride.startLocation.latitude,
            +ride.startLocation.longitude,
            100,
            1
        );

        if (nearbyVehicles.length == 0)
            await sleep(30000);
        else {

            const vehicle = nearbyVehicles.pop();

            if (vehicle) {
                const res = await acceptRide(ride.id, vehicle.id, vehicle.driverId);

                if (res) {
                    console.debug(`Found vehicle <${vehicle.id}> for ride <${ride.id}>`);
                    return vehicle.id;
                }
            }
        }
    } while( rideStatus == RideStatus.Requested);

    return null
}

export const getRideById = async (id: string): Promise<IRide | null> => {

    const r = await redisClient.hGetAll(`rides:${id}`) as IRedisRide;

    if (!r.id)
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

export const deleteRide = async (id: string): Promise<boolean> => {

    const ride = await getRideById(id);

    if (!ride) {
        return false;
    }
    if(ride.status > RideStatus.Requested) {
        await redisClient.del(`passengers:${ride.passengerId}:active-ride`);
        await redisClient.del(`drivers:${ride.driverId}:active-ride`);
        await redisClient.del(`vehicles:${ride.vehicleId}:active-ride`);
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

export const cancelRide = async (id: string) => {

    const ride = await getRideById(id);

    if (ride != null) {

        if(ride.status < RideStatus.InProgress && ride.status > RideStatus.Cancelled) {

            if (ride.vehicleId != null && ride.status == RideStatus.Accepted)
                await vehicleService.updateVehicleAvailability(ride.vehicleId, VehicleAvailability.available);

            await redisClient.hSet(`rides:${id}`, {status: RideStatus.Cancelled});
            await redisClient.expire(`rides:${id}`, 60);

            await redisClient.del(`passengers:${ride.passengerId}:active-ride`);

            return { ride: await getRideById(id), success: true};
        }
    }

    return { ride: await getRideById(id), success: false};
}

export const acceptRide =  async (rid: string, vid: string, did: string) => {

    const ride = await getRideById(rid);

    if (ride != null) {

        if(ride.status == RideStatus.Requested) {

            if (ride.vehicleId != null)
                await vehicleService.updateVehicleAvailability(vid, VehicleAvailability.available);

            ride.vehicleId = vid;
            ride.driverId = did;
            ride.status = RideStatus.Accepted;

            const n = await redisClient.hSet(`rides:${ride.id}`, {
                vehicleId: ride.vehicleId,
                driverId: ride.driverId,
                status: ride.status,
            });

            await vehicleService.updateVehicleAvailability(ride.vehicleId, VehicleAvailability.occupied);

            await redisClient.set(`drivers:${ride.driverId}:active-ride`, ride.id);
            await redisClient.set(`vehicles:${ride.vehicleId}:active-ride`, ride.id);

            return true;
        }
    }
    return false;
}

export const startRide = async (id: string)=> {

    const ride = await getRideById(id);

    if (ride != null) {

        if(ride.status == RideStatus.Accepted) {

            await redisClient.hSet(`rides:${id}`, {
                status: RideStatus.InProgress,
                startingTime: Date.now(),
            });

            return { ride: await getRideById(id), success: true};
        }
    }
    return { ride: await getRideById(id), success: false};
}

export const completeRide = async (id: string) => {

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


export const getActiveRideByPassenger = async (passengerId: string): Promise<IRide | null> => {

    const rideId = await redisClient.get(`passengers:${passengerId}:active-ride`);

    if (!rideId) {
        return null;
    }

    return await getRideById(rideId);
}

export const getActiveRideByDriver = async (driverId: string): Promise<IRide | null> => {

    const rideId = await redisClient.get(`drivers:${driverId}:active-ride`);

    if (!rideId) {
        return null;
    }

    return await getRideById(rideId);
}

export const getActiveRideByVehicle = async (vehicleId: string): Promise<IRide | null> => {

    const rideId = await redisClient.get(`vehicles:${vehicleId}:active-ride`);

    if (!rideId) {
        return null;
    }

    return await getRideById(rideId);
}


const calculatePrice = (ride: IRide) => {
    return Math.floor(Math.random() * 9920) + 80;
}

const sleep = (ms: number) => new Promise(
    resolve => setTimeout(resolve, ms)
);