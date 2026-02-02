import { redisClient } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { IPassenger, UpdatePassengerData } from "../data/Interfaces/IPassenger";



export async function getAllPassengers(): Promise<IPassenger[]> {
    const keys = await redisClient.keys('passenger:*');

    if (keys.length === 0) {
        return [];
    }

    const passengers = await Promise.all(
        keys.map(async (key: string) => {
            const passenger = await redisClient.hGetAll(key);
            return passenger as unknown as IPassenger;
        })
    );

    return passengers;
}

export async function getPassengerById(id: string): Promise<IPassenger | null> {
    const passenger = await redisClient.hGetAll(`passenger:${id}`);

    if (!passenger || Object.keys(passenger).length === 0) {
        return null;
    }

    return passenger as unknown as IPassenger;
}

export async function createPassenger(name: string, telephone: string): Promise<IPassenger> {
    const passengerId = uuidv4();

    await redisClient.hSet(`passenger:${passengerId}`, {
        id: passengerId,
        name,
        telephone
    });

    return {
        id: passengerId,
        name,
        telephone
    };
}

export async function updatePassenger(id: string, data: UpdatePassengerData): Promise<IPassenger | null> {
    const exists = await redisClient.exists(`passenger:${id}`);

    if (!exists) {
        return null;
    }

    const updates: Record<string, string> = {};
    if (data.name) updates.name = data.name;
    if (data.telephone) updates.telephone = data.telephone;

    await redisClient.hSet(`passenger:${id}`, updates);

    const updatedPassenger = await getPassengerById(id);
    return updatedPassenger;
}

export async function deletePassenger(id: string): Promise<boolean> {
    const result = await redisClient.del(`passenger:${id}`);

    return result > 0;
}