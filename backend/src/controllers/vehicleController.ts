import { Request, Response, NextFunction } from 'express';
import * as vehicleService from '../services/vehicleService';
import { IVehicle } from "../data/Interfaces/IVehicle";

export const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //TODO: Validation
        const vehicle : IVehicle = req.body;

        const result = await vehicleService.createVehicle(vehicle);

        if(result.length > 0)
            res.status(201).json({
                    "vehicleId": result
                }).send("Vehicle created successfully.").end();
        else
            res.status(400).send("Vehicle creation failed.").end();

    } catch (error) {
        next(error);
    }
};

export const getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //TODO: Validation
        const id: string = req.params.id as string;

        const result = await vehicleService.getVehicleById(id);

        if (result)
            res.status(200).json(result).end();
        else
            res.status(404).send("Vehicle not found.").end();
    } catch (error) {
        next(error);
    }
};

// export const getAllVehicles = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//
//         const vehicles = await vehicleService.getAllVehicles();
//
//         res.status(200).json(vehicles).end();
//
//     } catch (error) {
//         next(error);
//     }
// };

export const getNearbyVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //TODO: Validation
        const locRad = req.params as { lat: string, lng: string, radius: string };

       const result = await vehicleService.getNearbyVehicles(locRad.lat, locRad.lng, +locRad.radius);

       return res.status(200).json(result).end();

    } catch (error) {
        next(error);
    }
};

export const getDriverForVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await vehicleService.getDriverForVehicle()

        res.status(200).json({
            success: true,
            message: `Vozila voza?a ${driverId}`,
            data: {
                vehicles: [] // Lista vozila
            }
        });
    } catch (error) {
        next(error);
    }
};



export const updateVehicleLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: latitude, longitude"
            });
        }

        // TODO: Dodati Redis logiku
        // await redis.hset(`vehicle:${id}`, { latitude, longitude });
        // 
        // // A�uriraj poziciju u geo indexu
        // const status = await redis.hget(`vehicle:${id}`, 'isAvailable');
        // if (status === 'available') {
        //     await redis.geoadd('vehicles:available', longitude, latitude, id);
        // }

        res.status(200).json({
            success: true,
            message: "Lokacija vozila a�urirana",
            data: {
                id,
                latitude,
                longitude
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateVehicleAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;

        const validStatuses = ['offline', 'available', 'occupied'];
        if (!validStatuses.includes(isAvailable)) {
            return res.status(400).json({
                success: false,
                error: "isAvailable mora biti: offline, available ili occupied"
            });
        }

        // TODO: Dodati Redis logiku
        // await redis.hset(`vehicle:${id}`, 'isAvailable', isAvailable);
        // 
        // if (isAvailable === 'available') {
        //     // Dodaj u geo index ako je dostupno
        //     const vehicle = await redis.hgetall(`vehicle:${id}`);
        //     await redis.geoadd('vehicles:available', vehicle.longitude, vehicle.latitude, id);
        // } else {
        //     // Ukloni iz geo indexa ako nije dostupno
        //     await redis.zrem('vehicles:available', id);
        // }

        res.status(200).json({
            success: true,
            message: `Vozilo je sada ${isAvailable}`,
            data: { id, isAvailable }
        });
    } catch (error) {
        next(error);
    }
};



export const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Dodati Redis logiku za brisanje vozila
        // const vehicle = await redis.hgetall(`vehicle:${id}`);
        // 
        // if (!vehicle || Object.keys(vehicle).length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Vozilo nije prona?eno"
        //     });
        // }
        // 
        // // Ukloni vozilo iz geo indexa
        // await redis.zrem('vehicles:available', id);
        // 
        // // Obri�i vozilo
        // await redis.del(`vehicle:${id}`);

        res.status(200).json({
            success: true,
            message: `Vozilo sa ID: ${id} uspe�no obrisano`,
            data: {
                id
            }
        });
    } catch (error) {
        next(error);
    }
};