import { Request, Response, NextFunction } from 'express';
import * as rideService from '../services/rideService';
import {IRide} from "../data/Interfaces/IRide";


export const createRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ride: IRide = req.body;

        if (
            ride === undefined ||
            ride.passengerId === undefined ||
            ride.driverId === undefined ||
            ride.vehicleId === undefined ||
            ride.status === undefined ||
            ride.startLocation === undefined ||
            ride.destination === undefined ||
            ride.price === undefined
        ) {
            return res.status(400).send("Invalid request").end();
        }

        const result = await rideService.createRide(ride);

        if (result != null)
            res.status(201).json(result).end();
        else
            return res.status(400).send("Invalid request").end();

    } catch (error) {
        next(error);
    }
};

export const getRideById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        if (id === undefined) {
            return res.status(400).send("Invalid request").end();
        }

        const ride = await rideService.getRideById(id);

        if (ride)
            res.status(200).json(ride).end();
        else
            res.status(404).send("Ride not found").end();

    } catch (error) {
        next(error);
    }
};

// export const getAllRides = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const rides = await rideService.getAllRides();
//
//         if (rides.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 message: "Nema vožnji u bazi",
//                 data: { rides: [] }
//             });
//         }
//
//         res.status(200).json({
//             success: true,
//             message: "Lista svih vožnji",
//             data: { rides }
//         });
//     } catch (error) {
//         next(error);
//     }
// };

export const cancelRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        // const { reason } = req.body;

        if (id === undefined) {
            return res.status(400).send("Invalid request").end();
        }

        const ride = await rideService.cancelRide(id);

        if (!ride) {
            return res.status(404).json({
                success: false,
                error: "Vožnja nije pronađena"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vožnja otkazana",
            data: { ride }
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Vožnja je već završena ili otkazana') {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        next(error);
    }
};

export const acceptRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID vožnje je obavezan"
            });
        }

        const ride = await rideService.acceptRide(id);

        if (!ride) {
            return res.status(404).json({
                success: false,
                error: "Vožnja nije pronađena"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vožnja prihvaćena",
            data: { ride }
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Vožnja je već prihvaćena ili u toku') {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        next(error);
    }
};

export const startRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID vožnje je obavezan"
            });
        }

        const ride = await rideService.startRide(id);

        if (!ride) {
            return res.status(404).json({
                success: false,
                error: "Vožnja nije pronađena"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vožnja počela",
            data: { ride }
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Vožnja mora biti prihvaćena pre početka') {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        next(error);
    }
};

export const completeRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID vožnje je obavezan"
            });
        }

        const ride = await rideService.completeRide(id);

        if (!ride) {
            return res.status(404).json({
                success: false,
                error: "Vožnja nije pronađena"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vožnja završena",
            data: { ride }
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === 'Vožnja mora biti u toku da bi se završila' ||
                error.message === 'Vožnja nema dodeljeno vozilo') {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
        }
        next(error);
    }
};


export const getActiveRideByPassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const passengerId = req.params.passengerId as string;

        if (!passengerId) {
            return res.status(400).json({
                success: false,
                error: "ID putnika je obavezan"
            });
        }

        const ride = await rideService.getActiveRideByPassenger(passengerId);

        if (!ride) {
            return res.status(200).json({
                success: true,
                message: "Nema aktivne vožnje",
                data: { ride: null }
            });
        }

        res.status(200).json({
            success: true,
            message: "Aktivna vožnja putnika",
            data: { ride }
        });
    } catch (error) {
        next(error);
    }
};

export const getActiveRideByDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = req.params.driverId as string;

        if (!driverId) {
            return res.status(400).json({
                success: false,
                error: "ID vozača je obavezan"
            });
        }

        const ride = await rideService.getActiveRideByDriver(driverId);

        if (!ride) {
            return res.status(200).json({
                success: true,
                message: "Nema aktivne vožnje",
                data: { ride: null }
            });
        }

        res.status(200).json({
            success: true,
            message: "Aktivna vožnja vozača",
            data: { ride }
        });
    } catch (error) {
        next(error);
    }
};

export const getActiveRideByVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vehicleId = req.params.vehicleId as string;

        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                error: "ID vozila je obavezan"
            });
        }

        const ride = await rideService.getActiveRideByVehicle(vehicleId);

        if (!ride) {
            return res.status(200).json({
                success: true,
                message: "Nema aktivne vožnje",
                data: { ride: null }
            });
        }

        res.status(200).json({
            success: true,
            message: "Aktivna vožnja vozila",
            data: { ride }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "ID vožnje je obavezan"
            });
        }

        const deleted = await rideService.deleteRide(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: "Vožnja nije pronađena"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vožnja obrisana",
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};