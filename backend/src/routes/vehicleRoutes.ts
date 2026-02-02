import express from 'express';
import * as vc from '../controllers/vehicleController';

const vehicleRouter = express.Router();

vehicleRouter.post('/', vc.createVehicle);

vehicleRouter.get('/:id', vc.getVehicleById);

// vehicleRouter.get('/', vc.getAllVehicles);

vehicleRouter.get('/nearby/lat/:lat/lng/:lng/radius/:radius', vc.getNearbyVehicles);

vehicleRouter.get('/:id/driver', vc.getDriverForVehicle);

vehicleRouter.put('/:id/location', vc.updateVehicleLocation);

vehicleRouter.put('/:id/availability', vc.updateVehicleAvailability);

vehicleRouter.delete('/:id', vc.deleteVehicle);

export default vehicleRouter;