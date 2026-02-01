import express from 'express';
import * as dc from '../controllers/driverController';

const driverRouter = express.Router();

driverRouter.get('/', dc.getAllDrivers);

driverRouter.get('/:id', dc.getDriverById);

driverRouter.post('/', dc.createDriver);

driverRouter.put('/:id', dc.updateDriver);

driverRouter.delete('/:id', dc.deleteDriver);

export default driverRouter;