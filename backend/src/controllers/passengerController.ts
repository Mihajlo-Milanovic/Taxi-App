import { Request, Response, NextFunction } from 'express';

/**
 * Dobija sve putnike
 * GET /api/passengers
 */
export const getAllPassengers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Redis logika
        res.status(200).json({
            success: true,
            message: "Lista svih putnika",
            data: {
                passengers: []
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Dobija putnika po ID-u
 * GET /api/passengers/:id
 */
export const getPassengerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        res.status(200).json({
            success: true,
            message: `Putnik sa ID: ${id}`,
            data: {
                passenger: {
                    id,
                    latitude: 44.8,
                    longitude: 20.5
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Kreira novog putnika
 * POST /api/passengers
 * Body: { latitude, longitude }
 */
export const createPassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: latitude, longitude"
            });
        }

        // TODO: Redis logika
        // const passengerId = uuidv4();
        // await redis.hset(`passenger:${passengerId}`, { latitude, longitude });

        res.status(201).json({
            success: true,
            message: "Putnik uspe�no kreiran",
            data: {
                passenger: {
                    // id: passengerId,
                    latitude,
                    longitude
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * A�urira lokaciju putnika
 * PUT /api/passengers/:id/location
 * Body: { latitude, longitude }
 */
export const updatePassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: latitude, longitude"
            });
        }

        // TODO: Redis logika

        res.status(200).json({
            success: true,
            message: "Lokacija putnika a�urirana",
            data: { id, latitude, longitude }
        });
    } catch (error) {
        next(error);
    }
};
