import { Request, Response, NextFunction } from 'express';
import * as passengerService from '../services/passengerService';

export const getAllPassengers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const passengers = await passengerService.getAllPassengers();

        if (passengers.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Nema putnika u bazi",
                data: { passengers: [] }
            });
        }

        res.status(200).json({
            success: true,
            message: "Lista svih putnika",
            data: { passengers }
        });
    } catch (error) {
        next(error);
    }
};

export const getPassengerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID putnika je obavezan"
            });
        }

        const passenger = await passengerService.getPassengerById(id);

        if (!passenger) {
            return res.status(404).json({
                success: false,
                error: "Putnik nije pronađen"
            });
        }

        res.status(200).json({
            success: true,
            message: `Putnik sa ID: ${id}`,
            data: { passenger }
        });
    } catch (error) {
        next(error);
    }
};

export const createPassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, telephone } = req.body;

        if (!name || !telephone) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: name, telephone"
            });
        }

        const passenger = await passengerService.createPassenger(name, telephone);

        res.status(201).json({
            success: true,
            message: "Putnik uspešno kreiran",
            data: { passenger }
        });
    } catch (error) {
        next(error);
    }
};

export const updatePassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const { name, telephone } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID putnika je obavezan"
            });
        }

        if (!name && !telephone) {
            return res.status(400).json({
                success: false,
                error: "Potrebno je poslati bar jedno polje: name ili telephone"
            });
        }

        const passenger = await passengerService.updatePassenger(id, { name, telephone });

        if (!passenger) {
            return res.status(404).json({
                success: false,
                error: "Putnik nije pronađen"
            });
        }

        res.status(200).json({
            success: true,
            message: "Podaci putnika ažurirani",
            data: { passenger }
        });
    } catch (error) {
        next(error);
    }
};

export const deletePassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID putnika je obavezan"
            });
        }

        const deleted = await passengerService.deletePassenger(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: "Putnik nije pronađen"
            });
        }

        res.status(200).json({
            success: true,
            message: "Putnik uspešno obrisan",
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};