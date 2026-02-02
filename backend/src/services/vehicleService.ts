import {IRedisHashVehicle, IVehicle} from "../data/Interfaces/IVehicle";
import {Availability} from "../data/Enumerations/availabilaty";
import {redisClient} from '../config/db';
import {v4 as uuid} from 'uuid';
import {GEO_REPLY_WITH} from "redis";
import {IDriver} from "./driverService";


export const createVehicle = async (vehicle: IVehicle): Promise<string> => {

    const vid = uuid();
    const resV  = await redisClient.hSet(`vehicles:${vid}`, {
        id: vid,
        driverId: vehicle.driverId,
        make: vehicle.make,
        model: vehicle.model,
        registration: vehicle.registration,
        availability: vehicle.availability
    });

    if (resV != 6)
        return "";

    let resL = 0;
    if (vehicle.location != null) {
         resL = await redisClient.geoAdd(`vehicles:${vehicle.availability}`, {
                latitude: vehicle.location.latitude,
                longitude: vehicle.location.longitude,
                member: vid
            }
        );
    }

    if (resL == 1)
        return vid;
    else
        return "";
}

const getRedisVehicle = async (id: string): Promise<IRedisHashVehicle> => {
    return await redisClient.hGetAll(`vehicles:${id}`, ) as IRedisHashVehicle;
}


export const getVehicleById = async (id: string): Promise<IVehicle | null> => {

    const rv = await getRedisVehicle(id);
    if (Object.keys(rv).length == 0)
        return null;

    const rvl = await redisClient.geoPos('vehicles:' + rv.availability, id) as unknown as {latitude: string; longitude: string} | null;
    return {
        ...rv,
        availability: parseInt(rv.availability),
        location: rvl
    };
}

// export const getAllVehicles = async (): Promise<Array<IVehicle>> => {
//
//     return await redisClient.hGetAll("vehicles:") as unknown as Array<IVehicle>;
// }

export const getNearbyVehicles = async (lat: string, lng:string, radius:number): Promise<Array<IVehicle>> => {

    const nearby = await redisClient.geoSearchWith(
            `vehicles:${Availability.available}`,
            { latitude: lat, longitude: lng },
            { radius: radius, unit: "km" },
            [ GEO_REPLY_WITH.COORDINATES ],
            { COUNT: 10,  }
    );

    const result: Array<IVehicle> = [];
    for( const nv of nearby){

        const rv = await getRedisVehicle(nv.member);
        result.push({
            ...rv,
            availability: parseInt(rv.availability),
            location: {
                latitude: `${nv.coordinates?.latitude}`,
                longitude: `${nv.coordinates?.longitude}`,
            }
        });
    }

     return result;
}

export const getDriverForVehicle = async (id: string): Promise<IDriver> => {

    // return await redisClient.hGetAll(`driver:${id}`, ) as IDriver;
}

