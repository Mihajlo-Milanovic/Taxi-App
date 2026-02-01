import { Request, Response, NextFunction } from 'express';

/**
 * Dobija sve dostupne voza?e
 * GET /api/drivers
 */
export const getAllDrivers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Dodati Redis logiku za preuzimanje voza?a
        // const drivers = await redis.keys('driver:*');
        // const driverData = await Promise.all(drivers.map(d => redis.hgetall(d)));

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
        // if (!driver || Object.keys(driver).length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Voza? nije prona?en"
        //     });
        // }

        res.status(200).json({
            success: true,
            message: `Voza? sa ID: ${id}`,
            data: {
                driver: {
                    id,
                    name: "Primer"
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
 * Body: { name }
 */
export const createDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body; // ? Parametri iz tela zahteva

        // Validacija
        if (!name) {
            return res.status(400).json({
                success: false,
                error: "Nedostaje obavezno polje: name"
            });
        }

        // TODO: Dodati Redis logiku za kreiranje voza?a
        // const driverId = uuidv4();
        // await redis.hset(`driver:${driverId}`, {
        //     id: driverId,
        //     name
        // });
        res.status(201).json({
            success: true,
            message: "Voza? uspešno kreiran",
            data: {
                driver: {
                    // id: driverId,
                    name
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Ažurira podatke voza?a
 * PUT /api/drivers/:id
 * Body: { name }
 */
export const updateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                error: "Nedostaje obavezno polje: name"
            });
        }

        // TODO: Dodati Redis logiku
        // await redis.hset(`driver:${id}`, 'name', name);

        res.status(200).json({
            success: true,
            message: "Podaci voza?a ažurirani",
            data: {
                id,
                name
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Briše voza?a
 * DELETE /api/drivers/:id
 */
export const deleteDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // TODO: Dodati Redis logiku
        // const result = await redis.del(`driver:${id}`);
        // if (result === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         error: "Voza? nije prona?en"
        //     });
        // }

        res.status(200).json({
            success: true,
            message: "Voza? uspešno obrisan",
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};

