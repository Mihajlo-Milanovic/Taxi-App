import { redisClient } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import {IDriver} from "../data/Interfaces/IDriver";

export async function getAllDrivers(): Promise<IDriver[]> {
    const keys = await redisClient.keys('drivers:*');

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
    const driver = await redisClient.hGetAll(`drivers:${id}`);

    if (!driver || Object.keys(driver).length === 0) {
        return null;
    }

    return driver as unknown as IDriver;
}

export async function createDriver(firstName: string, lastName: string): Promise<IDriver> {
    const driverId = uuidv4();

    await redisClient.hSet(`drivers:${driverId}`, {
        id: driverId,
        firstName,
        lastName
    });

    return {
        id: driverId,
        firstName,
        lastName
    };

}

export async function updateDriver(id: string, firstName: string, lastName: string): Promise<IDriver | null> {
    const exists = await redisClient.exists(`drivers:${id}`);

    if (!exists) {
        return null;
    }

    await redisClient.hSet(`drivers:${id}`, 'firstName', firstName);
    await redisClient.hSet(`drivers:${id}`, 'lastName', lastName);


    return {
        id,
        firstName,
        lastName
    };
}

export async function deleteDriver(id: string): Promise<boolean> {
    const exists = await redisClient.exists(`drivers:${id}`);

    if (!exists) {
        return false;
    }

    await redisClient.del(`drivers:${id}`);
    return true;
}