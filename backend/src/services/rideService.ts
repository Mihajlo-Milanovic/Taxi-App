import { redisClient } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export interface IRide {
    id: string;
    passengerId: string;
    driverId?: string;
    vehicleId?: string;
    status: 'requested' | 'accepted' | 'in_progress' | 'finished' | 'cancelled';
    startLatitude: string | undefined;
    startLongitude: string | undefined;
    destinationLatitude?: string;
    destinationLongitude?: string;
    price?: string;
    cancelReason?: string;
}

export interface CreateRideData {
    passengerId: string;
    startLatitude: number;
    startLongitude: number;
    destinationLatitude?: number | undefined;
    destinationLongitude?: number | undefined;
    price?: number | undefined;
}

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

    // 1. Na?i najbližu dostupno vozilo (GEORADIUS)
    const nearbyVehicles = await redisClient.geoRadius(
        'vehicles:available',
        {
            longitude: startLongitude,
            latitude: startLatitude
        },
        5, // radius u km
        'km',
        {
            WITHDIST: true,
            SORT: 'ASC',
            COUNT: 1
        }
    );

    if (!nearbyVehicles || nearbyVehicles.length === 0) {
        return null; // Nema dostupnih vozila
    }

    const vehicleId = nearbyVehicles[0].member as string;
    const vehicle = await redisClient.hGetAll(`vehicle:${vehicleId}`);

    if (!vehicle || Object.keys(vehicle).length === 0) {
        return null;
    }

    // 2. Kreiraj vožnju u Redis-u
    const rideId = uuidv4();
    await redisClient.hSet(`ride:${rideId}`, {
        id: rideId,
        passengerId,
        driverId: vehicle.driverId || '',
        vehicleId,
        status: 'requested',
        startLatitude: startLatitude.toString(),
        startLongitude: startLongitude.toString(),
        destinationLatitude: destinationLatitude?.toString() || '',
        destinationLongitude: destinationLongitude?.toString() || '',
        price: price?.toString() || '0'
    });

    // 3. Postavi vozilo na "occupied"
    await redisClient.hSet(`vehicle:${vehicleId}`, 'isAvailable', 'occupied');
    await redisClient.zRem('vehicles:available', vehicleId);

    // 4. Dodaj mapiranje za brzo pretraživanje
    await redisClient.set(`passenger:${passengerId}:active-ride`, rideId);
    await redisClient.set(`driver:${vehicle.driverId}:active-ride`, rideId);
    await redisClient.set(`vehicle:${vehicleId}:active-ride`, rideId);

    return {
        id: rideId,
        passengerId,
        driverId: vehicle.driverId,
        vehicleId,
        status: 'requested',
        startLatitude: startLatitude.toString(),
        startLongitude: startLongitude.toString(),
        destinationLatitude: destinationLatitude?.toString(),
        destinationLongitude: destinationLongitude?.toString(),
        price: price?.toString()
    };
}

export async function acceptRide(id: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`ride:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    if (ride.status !== 'requested') {
        throw new Error('Vožnja je ve? prihva?ena ili u toku');
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
        throw new Error('Vožnja mora biti prihva?ena pre po?etka');
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
        throw new Error('Vožnja mora biti u toku da bi se završila');
    }

    // 1. Ažuriraj status vožnje
    await redisClient.hSet(`ride:${id}`, 'status', 'finished');

    // 2. Postavi vozilo ponovo kao "available"
    const vehicleId = ride.vehicleId;
    await redisClient.hSet(`vehicle:${vehicleId}`, 'isAvailable', 'available');

    // 3. Vrati vozilo u geo index
    const vehicle = await redisClient.hGetAll(`vehicle:${vehicleId}`);
    await redisClient.geoAdd('vehicles:available', {
        longitude: parseFloat(vehicle.longitude),
        latitude: parseFloat(vehicle.latitude),
        member: vehicleId
    });

    // 4. Ukloni mapiranja aktivnih vožnji
    await redisClient.del(`passenger:${ride.passengerId}:active-ride`);
    await redisClient.del(`driver:${ride.driverId}:active-ride`);
    await redisClient.del(`vehicle:${vehicleId}:active-ride`);

    return await getRideById(id);
}

export async function cancelRide(id: string, reason?: string): Promise<IRide | null> {
    const ride = await redisClient.hGetAll(`ride:${id}`);

    if (!ride || Object.keys(ride).length === 0) {
        return null;
    }

    if (ride.status === 'finished' || ride.status === 'cancelled') {
        throw new Error('Vožnja je ve? završena ili otkazana');
    }

    // 1. Ažuriraj status vožnje
    await redisClient.hSet(`ride:${id}`, 'status', 'cancelled');
    if (reason) {
        await redisClient.hSet(`ride:${id}`, 'cancelReason', reason);
    }

    // 2. Postavi vozilo ponovo kao "available" ako je bilo dodeljeno
    if (ride.vehicleId) {
        const vehicleId = ride.vehicleId;
        await redisClient.hSet(`vehicle:${vehicleId}`, 'isAvailable', 'available');

        const vehicle = await redisClient.hGetAll(`vehicle:${vehicleId}`);
        await redisClient.geoAdd('vehicles:available', {
            longitude: parseFloat(vehicle.longitude),
            latitude: parseFloat(vehicle.latitude),
            member: vehicleId
        });

        await redisClient.del(`driver:${ride.driverId}:active-ride`);
        await redisClient.del(`vehicle:${vehicleId}:active-ride`);
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
    const rideId = await redisClient.get(`vehicle:${vehicleId}:active-ride`);

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
        await redisClient.del(`vehicle:${ride.vehicleId}:active-ride`);
    }

    return true;
}