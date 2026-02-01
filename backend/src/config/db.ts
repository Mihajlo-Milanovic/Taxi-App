import { createClient } from 'redis';
import {REDIS_URI} from "./config";

export const redisClient = createClient({
    url: `redis://${REDIS_URI}`,
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export const connectToRedisDB = async () => {
    await redisClient.connect();
}

export const disconnectFromRedisDB = async () => {
    await redisClient.quit();
}

export const testConnection= async () => {

    await redisClient.set('test', 'WORKS!');
    const value = await redisClient.get('test');
    console.log(value);

    await redisClient.hSet('testUser', {
        name: 'John',
        surname: 'Smith',
        company: 'Redis',
        age: 29
    })

    const testUser = await redisClient.hGetAll('testUser');
    console.log(JSON.stringify(testUser, null, 2));

    console.log(await redisClient.PING());
}

