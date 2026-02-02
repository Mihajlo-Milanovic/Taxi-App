import { redisClient } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

import { IRide, CreateRideData } from "../data/Interfaces/IRide";
import { Availability } from "../data/Enumerations/Availabilaty";


export async function getAllRides(): Promise<IRide[]> {
    const keys = await redisClient.keys('ride:*');

    if (keys.length === 0) {
        return [];
    }

    const rides = await Promise.all(
        keys.map(async (key: string) => {
            const ride = await redisClient.hGetAll(key);
            return ride as unknown as IRide;
        })
    );

    return rides;
}

export async function getRideById(id: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`ride:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    return ride as unknown as IRide;
}

export async function createRide(data: CreateRideData): Promise<IRide | null> {
    const { passengerId, startLatitude, startLongitude, destinationLatitude, destinationLongitude, price } = data;

    const nearbyVehicles = await redisClient.geoSearch(
        'vehicles:1',
        {
            longitude: startLongitude,
            latitude: startLatitude
        },
        {
            radius: 5,
            unit: 'km'
        },
        {
            SORT: 'ASC',
            COUNT: 1
        }
    );

    if (!nearbyVehicles || nearbyVehicles.length === 0) {
        return null; 
    }

    const vehicleId = nearbyVehicles[0] as string;
    const vehicle = await redisClient.hGetAll(`vehicles:${vehicleId}`);

    if (!vehicle || Object.keys(vehicle).length === 0) {
        return null;
    }

    const rideId = uuidv4();
    const driverId = vehicle.driverId || '';

    await redisClient.hSet(`ride:${rideId}`, {
        id: rideId,
        passengerId,
        driverId: driverId,
        vehicleId,
        status: 'requested',
        startLatitude: startLatitude.toString(),
        startLongitude: startLongitude.toString(),
        destinationLatitude: destinationLatitude?.toString() || '',
        destinationLongitude: destinationLongitude?.toString() || '',
        price: price?.toString() || '0'
    });

 
    const location = await redisClient.geoPos('vehicles:1', vehicleId);

    await redisClient.hSet(`vehicles:${vehicleId}`, 'availability', Availability.occupied.toString());
    await redisClient.zRem('vehicles:1', vehicleId);

    if (location && location[0]) {
        await redisClient.geoAdd('vehicles:2', {
            longitude: location[0].longitude,
            latitude: location[0].latitude,
            member: vehicleId
        });
    }

    await redisClient.set(`passenger:${passengerId}:active-ride`, rideId);
    if (driverId) {
        await redisClient.set(`driver:${driverId}:active-ride`, rideId);
    }
    await redisClient.set(`vehicles:${vehicleId}:active-ride`, rideId);

    const result: IRide = {
        id: rideId,
        passengerId,
        vehicleId,
        status: 'requested',
        startLatitude: startLatitude.toString(),
        startLongitude: startLongitude.toString()
    };

    if (driverId) {
        result.driverId = driverId;
    }
    if (destinationLatitude !== undefined) {
        result.destinationLatitude = destinationLatitude.toString();
    }
    if (destinationLongitude !== undefined) {
        result.destinationLongitude = destinationLongitude.toString();
    }
    if (price !== undefined) {
        result.price = price.toString();
    }

    return result;
}

export async function acceptRide(id: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`ride:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    if (ride.status !== 'requested') {
        throw new Error('Vo�nja je ve? prihva?ena ili u toku');
    }

    await redisClient.hSet(`ride:${id}`, 'status', 'accepted');

    return await getRideById(id);
}

export async function startRide(id: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`ride:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    if (ride.status !== 'accepted') {
        throw new Error('Vo�nja mora biti prihva?ena pre po?etka');
    }

    await redisClient.hSet(`ride:${id}`, 'status', 'in_progress');

    return await getRideById(id);
}

export async function completeRide(id: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`ride:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    if (ride.status !== 'in_progress') {
        throw new Error('Vo�nja mora biti u toku da bi se zavr�ila');
    }

    await redisClient.hSet(`ride:${id}`, 'status', 'finished');

    const vehicleId = ride.vehicleId;
    if (!vehicleId) {
        throw new Error('Vo�nja nema dodeljeno vozilo');
    }

    const location = await redisClient.geoPos('vehicles:2', vehicleId);

    await redisClient.hSet(`vehicles:${vehicleId}`, 'availability', Availability.available.toString());
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

export async function cancelRide(id: string, reason?: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`ride:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    if (ride.status === 'finished' || ride.status === 'cancelled') {
        throw new Error('Vo�nja je ve? zavr�ena ili otkazana');
    }

    await redisClient.hSet(`ride:${id}`, 'status', 'cancelled');
    if (reason) {
        await redisClient.hSet(`ride:${id}`, 'cancelReason', reason);
    }

    if (ride.vehicleId) {
        const vehicleId = ride.vehicleId;

        const location = await redisClient.geoPos('vehicles:2', vehicleId);

        await redisClient.hSet(`vehicles:${vehicleId}`, 'availability', Availability.available.toString());
        await redisClient.zRem('vehicles:1', vehicleId);

        if (location && location[0]) {
            await redisClient.geoAdd('vehicles:1', {
                longitude: location[0].longitude,
                latitude: location[0].latitude,
                member: vehicleId
            });
        }

        if (ride.driverId) {
            await redisClient.del(`driver:${ride.driverId}:active-ride`);
        }
        await redisClient.del(`vehicles:${vehicleId}:active-ride`);
    }

    await redisClient.del(`passenger:${ride.passengerId}:active-ride`);

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
    const ride = await redisClient.hGetAll(`ride:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return false;
    }

    await redisClient.del(`ride:${id}`);
    await redisClient.del(`passenger:${ride.passengerId}:active-ride`);

    if (ride.driverId) {
        await redisClient.del(`driver:${ride.driverId}:active-ride`);
    }

    if (ride.vehicleId) {
        await redisClient.del(`vehicles:${ride.vehicleId}:active-ride`);
    }

    return true;
}