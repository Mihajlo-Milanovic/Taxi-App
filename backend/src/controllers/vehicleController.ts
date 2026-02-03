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
        const data = req.params as { lat: string, lng: string, radius: string, maxCount: string };

       const result = await vehicleService.getNearbyVehicles(data.lat, data.lng, +data.radius, +data.maxCount);

       return res.status(200).json(result).end();

    } catch (error) {
        next(error);
    }
};

export const getDriverForVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        const result = await vehicleService.getDriverForVehicle(id);

        if (result && result.id) {
            res.status(200).json(result).end();
        } else {
            res.status(404).send("Driver information unavailable.").end();
        }

    } catch (error) {
        next(error);
    }
};

export const updateVehicleLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //TODO: Validation
        const id = req.params.id as string;
        const { latitude, longitude, availability } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: latitude, longitude"
            });
        }

        const result = await vehicleService.updateVehicleLocation(id, +latitude, +longitude, +availability);

        if (result)
            res.status(201).send("Vehicle location updated successfully.").end();
        else
            res.status(404).send("Vehicle not found.").end();
    } catch (error) {
        next(error);
    }
};

export const updateVehicleAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //TODO: Validation
        const id = req.params.id as string;
        const availability = req.params.availability as string;

       const result = await vehicleService.updateVehicleAvailability(id, +availability);
        if (result)
            return res.status(201).send("Vehicle availability updated successfully.").end();
        else
            return res.status(404).send("Vehicle not found.").end();

    } catch (error) {
        next(error);
    }
};

export const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //TODO: Validation
        const id = req.params.id as string;

        const result = await vehicleService.deleteVehicle(id);

        if (result)
            res.status(200).send("Vehicle deleted successfully.").end();
        else
            res.status(404).send("Vehicle not found.").end();

    } catch (error) {
        next(error);
    }
};