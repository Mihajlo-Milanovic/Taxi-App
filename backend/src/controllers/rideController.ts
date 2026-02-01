import { Request, Response, NextFunction } from 'express';


export const getAllRides = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Redis logika
        // const rides = await redis.keys('ride:*');
        // const rideData = await Promise.all(rides.map(r => redis.hgetall(r)));

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


export const getRideById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Redis logika
        // const ride = await redis.hgetall(`ride:${id}`);
        // if (!ride || Object.keys(ride).length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Vožnja nije pronađena"
        //     });
        // }

        res.status(200).json({
            success: true,
            message: `Vožnja sa ID: ${id}`,
            data: {
                ride: {
                    id,
                    passengerId: "passenger123",
                    driverId: "driver456",
                    vehicleId: "vehicle789",
                    status: "requested" // requested, accepted, in_progress, finished, cancelled
                }
            }
        });
    } catch (error) {
        next(error);
    }
};


export const createRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            passengerId,
            startLatitude,
            startLongitude,
            destinationLatitude,
            destinationLongitude,
            price
        } = req.body;

        // Validacija
        if (!passengerId || !startLatitude || !startLongitude) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: passengerId, startLatitude, startLongitude"
            });
        }

        // TODO: Redis logika
        // 1. Nađi najbližu dostupnu vozilo (GEORADIUS)
        // const nearbyVehicles = await redis.georadius(
        //     'vehicles:available',
        //     Number(startLongitude),
        //     Number(startLatitude),
        //     5, // radius u km
        //     'km',
        //     'WITHDIST',
        //     'ASC',
        //     'COUNT', 1
        // );
        // 
        // if (!nearbyVehicles || nearbyVehicles.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Nema dostupnih vozila u blizini"
        //     });
        // }
        // 
        // const [vehicleId] = nearbyVehicles[0];
        // const vehicle = await redis.hgetall(`vehicle:${vehicleId}`);
        // 
        // 2. Kreiraj vožnju u Redis-u
        // const rideId = uuidv4();
        // await redis.hset(`ride:${rideId}`, {
        //     id: rideId,
        //     passengerId,
        //     driverId: vehicle.driverId,
        //     vehicleId,
        //     status: 'requested',
        //     startLatitude,
        //     startLongitude,
        //     destinationLatitude: destinationLatitude || '',
        //     destinationLongitude: destinationLongitude || '',
        //     price: price || 0
        // });
        // 
        // 3. Postavi vozilo na "occupied"
        // await redis.hset(`vehicle:${vehicleId}`, 'isAvailable', 'occupied');
        // await redis.zrem('vehicles:available', vehicleId);
        // 
        // 4. Dodaj mapiranje za brzo pretraživanje
        // await redis.set(`passenger:${passengerId}:active-ride`, rideId);
        // await redis.set(`driver:${vehicle.driverId}:active-ride`, rideId);
        // await redis.set(`vehicle:${vehicleId}:active-ride`, rideId);

        res.status(201).json({
            success: true,
            message: "Vožnja uspešno kreirana",
            data: {
                ride: {
                    // id: rideId,
                    passengerId,
                    // driverId: vehicle.driverId,
                    // vehicleId,
                    status: "requested",
                    start: { latitude: startLatitude, longitude: startLongitude },
                    destination: destinationLatitude && destinationLongitude ?
                        { latitude: destinationLatitude, longitude: destinationLongitude } : null,
                    price: price || 0
                }
            }
        });
    } catch (error) {
        next(error);
    }
};


export const acceptRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Redis logika
        // const ride = await redis.hgetall(`ride:${id}`);
        // if (!ride || Object.keys(ride).length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Vožnja nije pronađena"
        //     });
        // }
        // 
        // if (ride.status !== 'requested') {
        //     return res.status(400).json({
        //         success: false,
        //         error: "Vožnja je već prihvaćena ili u toku"
        //     });
        // }
        // 
        // await redis.hset(`ride:${id}`, 'status', 'accepted');

        res.status(200).json({
            success: true,
            message: "Vožnja prihvaćena",
            data: {
                rideId: id,
                status: "accepted"
            }
        });
    } catch (error) {
        next(error);
    }
};


export const startRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Redis logika
        // const ride = await redis.hgetall(`ride:${id}`);
        // if (!ride || Object.keys(ride).length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Vožnja nije pronađena"
        //     });
        // }
        // 
        // if (ride.status !== 'accepted') {
        //     return res.status(400).json({
        //         success: false,
        //         error: "Vožnja mora biti prihvaćena pre početka"
        //     });
        // }
        // 
        // await redis.hset(`ride:${id}`, 'status', 'in_progress');

        res.status(200).json({
            success: true,
            message: "Vožnja počela",
            data: {
                rideId: id,
                status: "in_progress"
            }
        });
    } catch (error) {
        next(error);
    }
};


export const completeRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Redis logika
        // const ride = await redis.hgetall(`ride:${id}`);
        // if (!ride || Object.keys(ride).length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Vožnja nije pronađena"
        //     });
        // }
        // 
        // if (ride.status !== 'in_progress') {
        //     return res.status(400).json({
        //         success: false,
        //         error: "Vožnja mora biti u toku da bi se završila"
        //     });
        // }
        // 
        // 1. Ažuriraj status vožnje
        // await redis.hset(`ride:${id}`, 'status', 'finished');
        // 
        // 2. Postavi vozilo ponovo kao "available"
        // const vehicleId = ride.vehicleId;
        // await redis.hset(`vehicle:${vehicleId}`, 'isAvailable', 'available');
        // 
        // 3. Vrati vozilo u geo index
        // const vehicle = await redis.hgetall(`vehicle:${vehicleId}`);
        // await redis.geoadd('vehicles:available', vehicle.longitude, vehicle.latitude, vehicleId);
        // 
        // 4. Ukloni mapiranja aktivnih vožnji
        // await redis.del(`passenger:${ride.passengerId}:active-ride`);
        // await redis.del(`driver:${ride.driverId}:active-ride`);
        // await redis.del(`vehicle:${vehicleId}:active-ride`);

        res.status(200).json({
            success: true,
            message: "Vožnja završena",
            data: {
                rideId: id,
                status: "finished"
            }
        });
    } catch (error) {
        next(error);
    }
};


export const cancelRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // TODO: Redis logika
        // const ride = await redis.hgetall(`ride:${id}`);
        // if (!ride || Object.keys(ride).length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Vožnja nije pronađena"
        //     });
        // }
        // 
        // if (ride.status === 'finished' || ride.status === 'cancelled') {
        //     return res.status(400).json({
        //         success: false,
        //         error: "Vožnja je već završena ili otkazana"
        //     });
        // }
        // 
        // 1. Ažuriraj status vožnje
        // await redis.hset(`ride:${id}`, 'status', 'cancelled');
        // if (reason) {
        //     await redis.hset(`ride:${id}`, 'cancelReason', reason);
        // }
        // 
        // 2. Postavi vozilo ponovo kao "available" ako je bilo dodeljeno
        // if (ride.vehicleId) {
        //     const vehicleId = ride.vehicleId;
        //     await redis.hset(`vehicle:${vehicleId}`, 'isAvailable', 'available');
        //     
        //     const vehicle = await redis.hgetall(`vehicle:${vehicleId}`);
        //     await redis.geoadd('vehicles:available', vehicle.longitude, vehicle.latitude, vehicleId);
        //     
        //     await redis.del(`driver:${ride.driverId}:active-ride`);
        //     await redis.del(`vehicle:${vehicleId}:active-ride`);
        // }
        // 
        // await redis.del(`passenger:${ride.passengerId}:active-ride`);

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


export const getActiveRideByPassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { passengerId } = req.params;

        // TODO: Redis logika - koristi mapirani ključ za brzo pretraživanje
        // const rideId = await redis.get(`passenger:${passengerId}:active-ride`);
        // if (!rideId) {
        //     return res.status(200).json({
        //         success: true,
        //         message: "Nema aktivne vožnje",
        //         data: { ride: null }
        //     });
        // }
        // 
        // const ride = await redis.hgetall(`ride:${rideId}`);

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


export const getActiveRideByDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { driverId } = req.params;

        // TODO: Redis logika - koristi mapirani ključ za brzo pretraživanje
        // const rideId = await redis.get(`driver:${driverId}:active-ride`);
        // if (!rideId) {
        //     return res.status(200).json({
        //         success: true,
        //         message: "Nema aktivne vožnje",
        //         data: { ride: null }
        //     });
        // }
        // 
        // const ride = await redis.hgetall(`ride:${rideId}`);

        res.status(200).json({
            success: true,
            message: "Aktivna vožnja vozača",
            data: {
                ride: null // ili vožnja ako postoji
            }
        });
    } catch (error) {
        next(error);
    }
};


export const getActiveRideByVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vehicleId } = req.params;

        // TODO: Redis logika - koristi mapirani ključ za brzo pretraživanje
        // const rideId = await redis.get(`vehicle:${vehicleId}:active-ride`);
        // if (!rideId) {
        //     return res.status(200).json({
        //         success: true,
        //         message: "Nema aktivne vožnje",
        //         data: { ride: null }
        //     });
        // }
        // 
        // const ride = await redis.hgetall(`ride:${rideId}`);

        res.status(200).json({
            success: true,
            message: "Aktivna vožnja vozila",
            data: {
                ride: null // ili vožnja ako postoji
            }
        });
    } catch (error) {
        next(error);
    }
};


export const deleteRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Redis logika
        // const ride = await redis.hgetall(`ride:${id}`);
        // if (!ride || Object.keys(ride).length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Vožnja nije pronađena"
        //     });
        // }
        // 
        // // Obriši sve povezane ključeve
        // await redis.del(`ride:${id}`);
        // await redis.del(`passenger:${ride.passengerId}:active-ride`);
        // if (ride.driverId) {
        //     await redis.del(`driver:${ride.driverId}:active-ride`);
        // }
        // if (ride.vehicleId) {
        //     await redis.del(`vehicle:${ride.vehicleId}:active-ride`);
        // }

        res.status(200).json({
            success: true,
            message: "Vožnja obrisana",
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};