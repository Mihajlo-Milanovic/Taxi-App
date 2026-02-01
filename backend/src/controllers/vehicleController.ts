import { Request, Response, NextFunction } from 'express';

/**
 * Dobija sva vozila
 * GET /api/vehicles
 */
export const getAllVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Dodati Redis logiku za preuzimanje svih vozila
        // const vehicles = await redis.keys('vehicle:*');
        // const vehicleData = await Promise.all(vehicles.map(v => redis.hgetall(v)));

        res.status(200).json({
            success: true,
            message: "Lista svih vozila",
            data: {
                vehicles: [] // Ovde ?e biti vozila iz Redis-a
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Dobija vozilo po ID-u
 * GET /api/vehicles/:id
 */
export const getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Dodati Redis logiku
        // const vehicle = await redis.hgetall(`vehicle:${id}`);
        // if (!vehicle || Object.keys(vehicle).length === 0) {
        //     return res.status(404).json({ 
        //         success: false,
        //         error: "Vozilo nije prona?eno" 
        //     });
        // }

        res.status(200).json({
            success: true,
            message: `Vozilo sa ID: ${id}`,
            data: {
                vehicle: {
                    id,
                    driverId: "driver123",
                    number: "BG-123-AB",
                    registration: "ABC123",
                    latitude: 44.8,
                    longitude: 20.5,
                    isAvailable: "available" // offline, available, occupied
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Kreira novo vozilo
 * POST /api/vehicles
 * Body: { driverId, number, registration, latitude, longitude }
 */
export const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId, number, registration, latitude, longitude } = req.body;

        // Validacija
        if (!driverId || !number || !registration || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: driverId, number, registration, latitude, longitude"
            });
        }

        // TODO: Dodati Redis logiku za kreiranje vozila
        // const vehicleId = uuidv4();
        // await redis.hset(`vehicle:${vehicleId}`, {
        //     id: vehicleId,
        //     driverId,
        //     number,
        //     registration,
        //     latitude,
        //     longitude,
        //     isAvailable: 'available'
        // });
        // 
        // // Dodaj vozilo u geo index
        // await redis.geoadd('vehicles:available', longitude, latitude, vehicleId);

        res.status(201).json({
            success: true,
            message: "Vozilo uspešno kreirano",
            data: {
                vehicle: {
                    // id: vehicleId,
                    driverId,
                    number,
                    registration,
                    latitude,
                    longitude,
                    isAvailable: 'available'
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Ažurira lokaciju vozila
 * PUT /api/vehicles/:id/location
 * Body: { latitude, longitude }
 */
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
        // // Ažuriraj poziciju u geo indexu
        // const status = await redis.hget(`vehicle:${id}`, 'isAvailable');
        // if (status === 'available') {
        //     await redis.geoadd('vehicles:available', longitude, latitude, id);
        // }

        res.status(200).json({
            success: true,
            message: "Lokacija vozila ažurirana",
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
 * Ažurira dostupnost vozila
 * PATCH /api/vehicles/:id/availability
 * Body: { isAvailable: "offline" | "available" | "occupied" }
 */
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

/**
 * Pronalazi vozila u blizini odre?ene lokacije
 * GET /api/vehicles/nearby?latitude=44.8&longitude=20.5&radius=5
 */
export const getNearbyVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { latitude, longitude, radius = '5' } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezni parametri: latitude, longitude"
            });
        }

        // TODO: Dodati Redis GEORADIUS logiku
        // const nearbyVehicles = await redis.georadius(
        //     'vehicles:available',
        //     Number(longitude),
        //     Number(latitude),
        //     Number(radius),
        //     'km',
        //     'WITHDIST',
        //     'ASC'
        // );
        // 
        // // Preuzmi detalje za svako vozilo
        // const vehicleDetails = await Promise.all(
        //     nearbyVehicles.map(async ([vehicleId, distance]) => {
        //         const vehicle = await redis.hgetall(`vehicle:${vehicleId}`);
        //         return { ...vehicle, distance: parseFloat(distance) };
        //     })
        // );

        res.status(200).json({
            success: true,
            message: `Vozila u krugu od ${radius}km`,
            data: {
                location: { latitude, longitude },
                radius: Number(radius),
                vehicles: [] // Ovde ?e biti rezultati GEORADIUS
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Dobija vozila odre?enog voza?a
 * GET /api/vehicles/driver/:driverId
 */
export const getVehiclesByDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // TODO: Redis logika - prona?i sva vozila sa tim driverId
        // const allVehicles = await redis.keys('vehicle:*');
        // const driverVehicles = [];
        // for (const key of allVehicles) {
        //     const vehicle = await redis.hgetall(key);
        //     if (vehicle.driverId === driverId) {
        //         driverVehicles.push(vehicle);
        //     }
        // }

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