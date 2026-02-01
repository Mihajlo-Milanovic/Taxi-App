import express from 'express';
import * as vc from '../controllers/vehicleController';

const vehicleRouter = express.Router();

vehicleRouter.get('/nearby', vc.getNearbyVehicles);

vehicleRouter.get('/driver/:driverId', vc.getVehiclesByDriver);

vehicleRouter.get('/', vc.getAllVehicles);

vehicleRouter.get('/:id', vc.getVehicleById);

vehicleRouter.post('/', vc.createVehicle);

vehicleRouter.put('/:id/location', vc.updateVehicleLocation);

vehicleRouter.put('/:id/availability', vc.updateVehicleAvailability);

vehicleRouter.delete('/:id', vc.deleteVehicle);

export default vehicleRouter;