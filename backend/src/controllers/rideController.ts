import { Request, Response, NextFunction } from 'express';

/**
 * Dobija sve vožnje
 * GET /api/rides
 */
export const getAllRides = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Redis logika
        res.status(200).json({
            success: true,
            message: "Lista svih vožnji",
            data: {
                rides: []
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Dobija vožnju po ID-u
 * GET /api/rides/:id
 */
export const getRideById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        res.status(200).json({
            success: true,
            message: `Vožnja sa ID: ${id}`,
            data: {
                ride: {
                    id,
                    passengerId: "passenger123",
                    driverId: "driver456",
                    status: "active"
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Kreira novu vožnju (putnik naru?uje taksi)
 * POST /api/rides
 * Body: { passengerId, pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude }
 */
export const createRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            passengerId,
            pickupLatitude,
            pickupLongitude,
            destinationLatitude,
            destinationLongitude
        } = req.body;

        // Validacija
        if (!passengerId || !pickupLatitude || !pickupLongitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja"
            });
        }

        // TODO: Redis logika
        // 1. Na?i najbližeg dostupnog voza?a (GEORADIUS)
        // 2. Kreiraj vožnju u Redis-u
        // 3. Dodeli voza?a vožnji
        // 4. Postavi status voza?a na "unavailable"

        res.status(201).json({
            success: true,
            message: "Vožnja uspešno kreirana",
            data: {
                ride: {
                    // id: rideId,
                    passengerId,
                    // driverId: nearestDriver.id,
                    status: "pending",
                    pickup: { latitude: pickupLatitude, longitude: pickupLongitude },
                    destination: destinationLatitude ?
                        { latitude: destinationLatitude, longitude: destinationLongitude } : null
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Voza? prihvata vožnju
 * PATCH /api/rides/:id/accept
 * Body: { driverId }
 */
export const acceptRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { driverId } = req.body;

        if (!driverId) {
            return res.status(400).json({
                success: false,
                error: "Nedostaje driverId"
            });
        }

        // TODO: Redis logika
        // 1. Proveri da li vožnja postoji
        // 2. Ažuriraj status na "accepted"
        // 3. Dodeli voza?a

        res.status(200).json({
            success: true,
            message: "Vožnja prihva?ena",
            data: {
                rideId: id,
                driverId,
                status: "accepted"
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Zapo?inje vožnju (voza? je stigao do putnika)
 * PATCH /api/rides/:id/start
 */
export const startRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Redis logika - ažuriraj status na "in_progress"

        res.status(200).json({
            success: true,
            message: "Vožnja po?ela",
            data: {
                rideId: id,
                status: "in_progress"
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Završava vožnju
 * PATCH /api/rides/:id/complete
 */
export const completeRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Redis logika
        // 1. Ažuriraj status na "completed"
        // 2. Postavi voza?a ponovo kao "available"

        res.status(200).json({
            success: true,
            message: "Vožnja završena",
            data: {
                rideId: id,
                status: "completed"
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Otkazuje vožnju
 * DELETE /api/rides/:id
 * Body: { reason }
 */
export const cancelRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // TODO: Redis logika
        // 1. Ažuriraj status na "cancelled"
        // 2. Postavi voza?a ponovo kao "available" ako je bio dodeljen

        res.status(200).json({
            success: true,
            message: "Vožnja otkazana",
            data: {
                rideId: id,
                status: "cancelled",
                reason: reason || "Nije navedeno"
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Dobija aktivnu vožnju putnika
 * GET /api/rides/passenger/:passengerId/active
 */
export const getActiveRideByPassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { passengerId } = req.params;

        // TODO: Redis logika - prona?i aktivnu vožnju za putnika

        res.status(200).json({
            success: true,
            message: "Aktivna vožnja putnika",
            data: {
                ride: null // ili vožnja ako postoji
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Dobija aktivnu vožnju voza?a
 * GET /api/rides/driver/:driverId/active
 */
export const getActiveRideByDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // TODO: Redis logika - prona?i aktivnu vožnju za voza?a

        res.status(200).json({
            success: true,
            message: "Aktivna vožnja voza?a",
            data: {
                ride: null // ili vožnja ako postoji
            }
        });
    } catch (error) {
        next(error);
    }
};
