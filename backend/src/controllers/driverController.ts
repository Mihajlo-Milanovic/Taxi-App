import { Request, Response, NextFunction } from 'express';
import * as driverService from '../services/driverService';

export const getAllDrivers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const drivers = await driverService.getAllDrivers();

        if (drivers.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Nema vozača u bazi",
                data: { drivers: [] }
            });
        }

        res.status(200).json({
            success: true,
            message: "Lista svih vozača",
            data: { drivers }
        });
    } catch (error) {
        next(error);
    }
};

export const getDriverById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID vozača je obavezan"
            });
        }

        const driver = await driverService.getDriverById(id);

        if (!driver) {
            return res.status(404).json({
                success: false,
                error: "Vozač nije pronađen"
            });
        }

        res.status(200).json({
            success: true,
            message: `Vozač sa ID: ${id}`,
            data: { driver }
        });
    } catch (error) {
        next(error);
    }
};

export const createDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: firstName, lastName"
            });
        }

        const driver = await driverService.createDriver( firstName, lastName );

        res.status(201).json({
            success: true,
            message: "Vozač uspešno kreiran",
            data: { driver }
        });
    } catch (error) {
        next(error);
    }
};

export const updateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const { firstName, lastName } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID vozača je obavezan"
            });
        }

        if (!firstName || !lastName) { 
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: firstName, lastName"
            });
        }

        const driver = await driverService.updateDriver(id, firstName, lastName);

        if (!driver) {
            return res.status(404).json({
                success: false,
                error: "Vozač nije pronađen"
            });
        }

        res.status(200).json({
            success: true,
            message: "Podaci vozača ažurirani",
            data: { driver }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID vozača je obavezan"
            });
        }

        const deleted = await driverService.deleteDriver(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: "Vozač nije pronađen"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vozač uspešno obrisan",
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};