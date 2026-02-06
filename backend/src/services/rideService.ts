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

    findVehicleForRide(ride)

    return await getRideById(ride.id);
}

const findVehicleForRide = async (ride: IRide): Promise<void> => {

    let nearbyVehicles: Array<IVehicle> = [];

    while ((await getRideStatus(ride.id)) == RideStatus.Requested) {
        nearbyVehicles = await vehicleService.getNearbyVehicles(
            ride.startLocation.latitude,
            ride.startLocation.longitude,
            20,
            1
        );
        if (nearbyVehicles.length == 0) {
            await sleep(30000);
        } else {

            const v = nearbyVehicles[0];
            if (v) {
                ride.vehicleId = v.id;
                ride.driverId = v.driverId;
                ride.status = RideStatus.Accepted;

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
}

export async function getRideById(id: string): Promise<IRide | null> {

    const r = await redisClient.hGetAll(`rides:${id}`) as IRedisRide;

    if (!r || Object.keys(r).length === 0) {
        return null;
    }

    if (!r.id || !r.passengerId || !r.status ||
        !r.startLocationLat || !r.startLocationLng ||
        !r.destinationLat || !r.destinationLng || !r.price) {
        return null;
    }

    return {
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

export async function cancelRide(id: string): Promise<IRide | null> {

    const ride = await redisClient.hSetEx(`rides:${id}`, {
        TTL: 60,
        status : RideStatus.Cancelled
    });

    const vid = await redisClient.hGet(`rides:${id}`, 'vehicleId')

    if (vid)
        await vehicleService.updateVehicleAvailability(vid, VehicleAvailability.available);

    return await getRideById(id);
}


export async function acceptRide(id: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`rides:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    if (ride.status !== 'requested') {
        throw new Error('Vo�nja je ve? prihva?ena ili u toku');
    }

    await redisClient.hSet(`rides:${id}`, 'status', 'accepted');

    return await getRideById(id);
}

export async function startRide(id: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`rides:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    if (ride.status !== 'accepted') {
        throw new Error('Vo�nja mora biti prihva?ena pre po?etka');
    }

    await redisClient.hSet(`rides:${id}`, 'status', 'in_progress');

    return await getRideById(id);
}

export async function completeRide(id: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`rides:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    if (ride.status !== 'in_progress') {
        throw new Error('Vo�nja mora biti u toku da bi se zavr�ila');
    }

    await redisClient.hSet(`rides:${id}`, 'status', 'finished');

    const vehicleId = ride.vehicleId;
    if (!vehicleId) {
        throw new Error('Vo�nja nema dodeljeno vozilo');
    }

    const location = await redisClient.geoPos('vehicles:2', vehicleId);

    await redisClient.hSet(`vehicles:${vehicleId}`, 'availability', VehicleAvailability.available.toString());
    await redisClient.zRem('vehicles:2', vehicleId);

    if (location && location[0]) {
        await redisClient.geoAdd('vehicles:1', {
            longitude: location[0].longitude,
            latitude: location[0].latitude,
            member: vehicleId
        });
    }

    await redisClient.del(`passenger:${ride.passengerId}:active-ride`);

    const driverId = ride.driverId;
    if (driverId) {
        await redisClient.del(`driver:${driverId}:active-ride`);
    }
    await redisClient.del(`vehicles:${vehicleId}:active-ride`);

    return await getRideById(id);
}



export async function getActiveRideByPassenger(passengerId: string): Promise<IRide | null> {
    const rideId = await redisClient.get(`passenger:${passengerId}:active-ride`);

    if (!rideId) {
        return null;
    }

    return await getRideById(rideId);
}

export async function getActiveRideByDriver(driverId: string): Promise<IRide | null> {
    const rideId = await redisClient.get(`driver:${driverId}:active-ride`);

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

export async function deleteRide(id: string): Promise<boolean> {
    const ride = await redisClient.hGetAll(`rides:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return false;
    }

    await redisClient.del(`rides:${id}`);
    await redisClient.del(`passenger:${ride.passengerId}:active-ride`);

    if (ride.driverId) {
        await redisClient.del(`driver:${ride.driverId}:active-ride`);
    }

    if (ride.vehicleId) {
        await redisClient.del(`vehicles:${ride.vehicleId}:active-ride`);
    }

    return true;
}

const calculatePrice = (ride: IRide) => {
    return Math.floor(Math.random() * (10000 - 80)) + 80;
}

const sleep = (ms: number) => new Promise(
    resolve => setTimeout(resolve, ms)
);