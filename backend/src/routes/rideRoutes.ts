import express from 'express';
import * as rc from '../controllers/rideController';

const rideRouter = express.Router();


rideRouter.post('/request', rc.createRide);

rideRouter.get('/:id', rc.getRideById);

rideRouter.delete('/:id', rc.deleteRide);

rideRouter.put('/:id/cancel', rc.cancelRide);
rideRouter.put('/:id/assignVehicle', rc.acceptRide);
rideRouter.put('/:id/start', rc.startRide);
rideRouter.put('/:id/complete', rc.completeRide);


rideRouter.get('/passenger/:passengerId/active', rc.getActiveRideByPassenger);

rideRouter.get('/driver/:driverId/active', rc.getActiveRideByDriver);

rideRouter.get('/vehicle/:vehicleId/active', rc.getActiveRideByVehicle);


    //TODO: Za ove gore dve ne znam moze li redis to da ostvari
    //moralo bi da se koristi neka struktura ako ima za to ali onda ne verujem da moze i po
    //putniku i po vozacu da se pretrazuje


// rideRouter.get('/', rc.getAllRides);

export default rideRouter;
