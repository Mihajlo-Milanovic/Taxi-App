import { redisClient } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import {IDriver} from "../data/Interfaces/IDriver";

export async function getAllDrivers(): Promise<IDriver[]> {
    const keys = await redisClient.keys('driver:*');

    if (keys.length === 0) {
        return [];
    }

    const drivers = await Promise.all(
        keys.map(async (key: string) => {
            const driver = await redisClient.hGetAll(key);
            return driver as unknown as IDriver;
        })
    );

    return drivers;
}

export async function getDriverById(id: string): Promise<IDriver | null> {
    const driver = await redisClient.hGetAll(`driver:${id}`);

    if (!driver || Object.keys(driver).length === 0) {
        return null;
    }

    return driver as unknown as IDriver;
}

export async function createDriver(name: string): Promise<IDriver> {
    const driverId = uuidv4();

    await redisClient.hSet(`driver:${driverId}`, {
        id: driverId,
        name
    });

    return {
        id: driverId,
        name
    };
}

export async function updateDriver(id: string, name: string): Promise<IDriver | null> {
    const exists = await redisClient.exists(`driver:${id}`);

    if (!exists) {
        return null;
    }

    await redisClient.hSet(`driver:${id}`, 'name', name);

    return {
        id,
        name
    };
}

export async function deleteDriver(id: string): Promise<boolean> {
    const exists = await redisClient.exists(`driver:${id}`);

    if (!exists) {
        return false;
    }

    await redisClient.del(`driver:${id}`);
    return true;
}