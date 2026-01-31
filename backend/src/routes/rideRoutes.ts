import express from 'express';
import * as rc from '../controllers/rideController';

const rideRouter = express.Router();

rideRouter.get('/passenger/:passengerId/active', rc.getActiveRideByPassenger);

rideRouter.get('/driver/:driverId/active', rc.getActiveRideByDriver);

    //TODO: Za ove gore dve ne znam moze li redis to da ostvari
    //moralo bi da se koristi neka struktura ako ima za to ali onda ne verujem da moze i po
    //putniku i po vozacu da se pretrazuje


rideRouter.post('/', rc.createRide);

rideRouter.get('/', rc.getAllRides);

rideRouter.get('/:id', rc.getRideById);


rideRouter.put('/:id/accept', rc.acceptRide);
rideRouter.put('/:id/start', rc.startRide);
rideRouter.put('/:id/complete', rc.completeRide);
rideRouter.put('/:id/cancel', rc.cancelRide);

rideRouter.delete('/:id', rc.deleteRide);

export default rideRouter;
