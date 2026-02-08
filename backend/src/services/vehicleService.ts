import {IRedisVehicle, IVehicle} from "../data/Interfaces/IVehicle";
import {IDriver, IRedisDriver} from "../data/Interfaces/IDriver";
import {VehicleAvailability} from "../data/Enumerations/VehicleAvailability";
import {redisClient} from '../config/db';
import {v4 as uuid} from 'uuid';
import {GEO_REPLY_WITH} from "redis";
import {ILocation} from "../data/Interfaces/ILocation";
import {getDriverById} from "./driverService";


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

    let res = false;
    if (vehicle.location != null) {
         res = await updateVehicleLocation(vid, +vehicle.location.latitude, +vehicle.location.longitude, vehicle.availability)
    }

    if (res)
        return vid;
    else
        return "";
}

const getRedisVehicle = async (id: string): Promise<IRedisVehicle> => {
    return await redisClient.hGetAll(`vehicles:${id}`, ) as IRedisVehicle;
}

export const getVehicleById = async (id: string): Promise<IVehicle | null> => {

    const rv = await getRedisVehicle(id);
    if (Object.keys(rv).length == 0)
        return null;

    const rvl = await redisClient.geoPos('vehicles:' + rv.availability, id) as unknown as {latitude: string; longitude: string} | null;
    return {
        ...rv,
        availability: +rv.availability,
        location: rvl
    };
}

export const getAllVehicles = async () => {

    const vehicles = [];

    for await (const keys of redisClient.scanIterator({
        MATCH: "vehicles:*",
        COUNT: 1
    })) {
        for (const key of keys) {
            if(key.length > 10) {
                const data = await redisClient.hGetAll(key) as IRedisVehicle;
                const location = await getVehicleLocation(key.substring(9), +data.availability);
                vehicles.push({ ...data, location: location});
            }
        }
    }

    return vehicles;
}

export const getNearbyVehicles = async (lat: number, lng:number, radius:number, maxCount: number): Promise<Array<IVehicle>> => {

    const nearby = await redisClient.geoSearchWith(
            `vehicles:${VehicleAvailability.available}`,
            { latitude: lat, longitude: lng },
            { radius: radius, unit: "km" },
            [ GEO_REPLY_WITH.COORDINATES ],
            { COUNT: maxCount,  }
    );

    const result: Array<IVehicle> = [];
    for( const nv of nearby){

        const rv = await getRedisVehicle(nv.member);
        let availability = parseInt(rv.availability);
        result.push({
            ...rv,
            availability: availability,
            location: await getVehicleLocation(rv.id, availability)
        });
    }

     return result;
}

export const getDriverForVehicle = async (id: string): Promise<IDriver | null> => {

    const driverId = await redisClient.hGet(`vehicles:${id}`, 'driverId');
    if (driverId != null)
        return await getDriverById(driverId);
    else
        return null;
}

export const getVehicleLocation = async (id: string, availability: VehicleAvailability): Promise<ILocation | null> => {

    const res =  await redisClient.geoPos(`vehicles:${availability}`, id);

    const r = res.at(0);
    if (r !== undefined)
        return r;
    return null;
}

const getVehicleAvailability = async (id: string): Promise<VehicleAvailability | null> => {
    const res = await redisClient.hGet(`vehicles:${id}`, 'availability');
    if (res)
        return +res;
    return null;
}

export const updateVehicleLocation = async (id: string, lat: number, lng: number, availability: VehicleAvailability): Promise<boolean> => {

    if(await getVehicleAvailability(id) != availability){
        await deleteLocation(id, availability);
    }
    const result = await redisClient.geoAdd(`vehicles:${availability}`,
        {
            member: id,
            longitude: lng,
            latitude: lat,
        },
        {
            CH: true,
            //     XX: true,
        }
    );

    return result > 0;
}

const deleteLocation = async (id: string, availability: VehicleAvailability): Promise<boolean> => {
    return (await redisClient.zRem(`vehicles:${availability}`, id)) > 0;
}

export const updateVehicleAvailability = async (id: string, availability: VehicleAvailability): Promise<boolean> => {

    const oldAvailability = await getVehicleAvailability(id);

    if (oldAvailability != null){
        if(oldAvailability == availability)
            return true;

        const oldLocation = await getVehicleLocation(id, oldAvailability);
        if (oldLocation) {
            if(await updateVehicleLocation(id, +oldLocation.latitude, +oldLocation.longitude, availability)) {
                if (await deleteLocation(id, oldAvailability)) {
                    await redisClient.hSet(`vehicles:${id}`, {availability: availability});
                    return true;
                }
            }
        }
    }
    return false;
}

export const deleteVehicle = async (id: string): Promise<boolean> => {
    const a = await getVehicleAvailability(id);
    if(a != null) {
        await deleteLocation(id, a)
        await redisClient.hDel(`vehicles:${id}`,
            [
                "id",
                "driverId",
                "make",
                "model",
                "registration",
                "availability"
            ]);
    }

    return (await getRedisVehicle(id)).id == null;
}