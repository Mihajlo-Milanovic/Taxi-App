import { Request, Response, NextFunction } from 'express';

/**
 * Dobija sve dostupne voza?e
 * GET /api/drivers
 */
export const getAllDrivers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Dodati Redis logiku za preuzimanje voza?a
        // const drivers = await redis.geopos('drivers:available', ...);

        res.status(200).json({
            success: true,
            message: "Lista svih voza?a",
            data: {
                drivers: [] // Ovde ?e biti voza?i iz Redis-a
            }
        });
    } catch (error) {
        next(error); // Šalje grešku u errorHandler middleware
    }
};

/**
 * Dobija voza?a po ID-u
 * GET /api/drivers/:id
 */
export const getDriverById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params; // ? Parametar iz URL putanje

        // TODO: Dodati Redis logiku
        // const driver = await redis.hgetall(`driver:${id}`);
        // if (!driver) return res.status(404).json({ error: "Voza? nije prona?en" });

        res.status(200).json({
            success: true,
            message: `Voza? sa ID: ${id}`,
            data: {
                driver: {
                    id,
                    name: "Primer",
                    latitude: 44.8,
                    longitude: 20.5,
                    isAvailable: true
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Kreira novog voza?a
 * POST /api/drivers
 * Body: { name, latitude, longitude }
 */
export const createDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, latitude, longitude } = req.body; // ? Parametri iz tela zahteva

        // Validacija
        if (!name || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: name, latitude, longitude"
            });
        }

        // TODO: Dodati Redis logiku za kreiranje voza?a
        // const driverId = uuidv4();
        // await redis.hset(`driver:${driverId}`, { name, latitude, longitude, isAvailable: true });
        // await redis.geoadd('drivers:available', longitude, latitude, driverId);

        res.status(201).json({
            success: true,
            message: "Voza? uspešno kreiran",
            data: {
                driver: {
                    // id: driverId,
                    name,
                    latitude,
                    longitude,
                    isAvailable: true
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Ažurira lokaciju voza?a
 * PUT /api/drivers/:id/location
 * Body: { latitude, longitude }
 */
export const updateDriverLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params; // ? Parametar iz URL putanje
        const { latitude, longitude } = req.body; // ? Parametri iz body-a

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: latitude, longitude"
            });
        }

        // TODO: Dodati Redis logiku
        // await redis.hset(`driver:${id}`, { latitude, longitude });
        // await redis.geoadd('drivers:available', longitude, latitude, id);

        res.status(200).json({
            success: true,
            message: "Lokacija voza?a ažurirana",
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

/**
 * Ažurira dostupnost voza?a
 * PATCH /api/drivers/:id/availability
 * Body: { isAvailable }
 */
export const updateDriverAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;

        if (typeof isAvailable !== 'boolean') {
            return res.status(400).json({
                success: false,
                error: "isAvailable mora biti true ili false"
            });
        }

        // TODO: Dodati Redis logiku
        // await redis.hset(`driver:${id}`, 'isAvailable', isAvailable);
        // if (isAvailable) {
        //     const driver = await redis.hgetall(`driver:${id}`);
        //     await redis.geoadd('drivers:available', driver.longitude, driver.latitude, id);
        // } else {
        //     await redis.zrem('drivers:available', id);
        // }

        res.status(200).json({
            success: true,
            message: `Voza? je sada ${isAvailable ? 'dostupan' : 'nedostupan'}`,
            data: { id, isAvailable }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Pronalazi voza?e u blizini odre?ene lokacije
 * GET /api/drivers/nearby?latitude=44.8&longitude=20.5&radius=5
 */
export const getNearbyDrivers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { latitude, longitude, radius = '5' } = req.query; // ? Query parametri

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezni parametri: latitude, longitude"
            });
        }

        // TODO: Dodati Redis GEORADIUS logiku
        // const nearbyDrivers = await redis.georadius(
        //     'drivers:available',
        //     Number(longitude),
        //     Number(latitude),
        //     Number(radius),
        //     'km',
        //     'WITHDIST',
        //     'ASC'
        // );

        res.status(200).json({
            success: true,
            message: `Voza?i u krugu od ${radius}km`,
            data: {
                location: { latitude, longitude },
                radius: Number(radius),
                drivers: [] // Ovde ?e biti rezultati GEORADIUS
            }
        });
    } catch (error) {
        next(error);
    }
};
