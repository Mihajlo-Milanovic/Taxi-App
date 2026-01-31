import express from 'express';
import {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriverLocation,
    updateDriverAvailability,
    getNearbyDrivers
} from '../controllers/driverController';

const router = express.Router();

// Rute za voza?e

/**
 * GET /api/drivers/nearby?latitude=44.8&longitude=20.5&radius=5
 * Mora biti PRE /:id rute jer ina?e Express misli da je "nearby" :id parametar
 */
router.get('/nearby', getNearbyDrivers);

/**
 * GET /api/drivers
 * Dobija sve voza?e
 */
router.get('/', getAllDrivers);

/**
 * GET /api/drivers/:id
 * Dobija voza?a po ID-u
 */
router.get('/:id', getDriverById);

/**
 * POST /api/drivers
 * Kreira novog voza?a
 * Body: { name, latitude, longitude }
 */
router.post('/', createDriver);

/**
 * PUT /api/drivers/:id/location
 * Ažurira lokaciju voza?a
 * Body: { latitude, longitude }
 */
router.put('/:id/location', updateDriverLocation);

/**
 * PATCH /api/drivers/:id/availability
 * Ažurira dostupnost voza?a
 * Body: { isAvailable }
 */
router.patch('/:id/availability', updateDriverAvailability);

export default router;
