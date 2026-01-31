import express from 'express';
import * as dc from '../controllers/driverController';

const driverRouter = express.Router();

/**
 * GET /drivers/nearby?lat=44.8&lng=20.5&radius=5
 * Mora biti PRE /:id rute jer ina?e Express misli da je "nearby" :id parametar
 */
driverRouter.get('/nearby', dc.getNearbyDrivers); //TODO: staviti u vozilo

/**
 * PUT /drivers/:id/location
 * Body: { latitude, longitude }
 */
driverRouter.put('/:id/location', dc.updateDriverLocation);

driverRouter.get('/', dc.getAllDrivers);

driverRouter.get('/:id', dc.getDriverById);

driverRouter.post('/', dc.createDriver);

/**
 * Body: { isAvailable [offline, occupied, available] }
 */
driverRouter.put('/:id/availability', dc.updateDriverAvailability);

export default driverRouter;
