import { Request, Response, NextFunction } from 'express';

/**
 * Dobija sve putnike
 * GET /api/passengers
 */
export const getAllPassengers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Redis logika
        // const passengers = await redis.keys('passenger:*');
        // const passengerData = await Promise.all(passengers.map(p => redis.hgetall(p)));

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

        // TODO: Redis logika
        // const passenger = await redis.hgetall(`passenger:${id}`);
        // if (!passenger || Object.keys(passenger).length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Putnik nije pronađen"
        //     });
        // }

        res.status(200).json({
            success: true,
            message: `Putnik sa ID: ${id}`,
            data: {
                passenger: {
                    id,
                    name: "Primer Putnik",
                    telephone: "+381601234567"
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
 * Body: { name, telephone }
 */
export const createPassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, telephone } = req.body;

        if (!name || !telephone) {
            return res.status(400).json({
                success: false,
                error: "Nedostaju obavezna polja: name, telephone"
            });
        }

        // TODO: Redis logika
        // const passengerId = uuidv4();
        // await redis.hset(`passenger:${passengerId}`, {
        //     id: passengerId,
        //     name,
        //     telephone
        // });

        res.status(201).json({
            success: true,
            message: "Putnik uspešno kreiran",
            data: {
                passenger: {
                    // id: passengerId,
                    name,
                    telephone
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Ažurira podatke putnika
 * PUT /api/passengers/:id
 * Body: { name, telephone }
 */
export const updatePassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, telephone } = req.body;

        if (!name && !telephone) {
            return res.status(400).json({
                success: false,
                error: "Potrebno je poslati bar jedno polje: name ili telephone"
            });
        }

        // TODO: Redis logika
        // const updates: any = {};
        // if (name) updates.name = name;
        // if (telephone) updates.telephone = telephone;
        // await redis.hset(`passenger:${id}`, updates);

        res.status(200).json({
            success: true,
            message: "Podaci putnika ažurirani",
            data: { id, name, telephone }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Briše putnika
 * DELETE /api/passengers/:id
 */
export const deletePassenger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Redis logika
        // const result = await redis.del(`passenger:${id}`);
        // if (result === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Putnik nije pronađen"
        //     });
        // }

        res.status(200).json({
            success: true,
            message: "Putnik uspešno obrisan",
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};