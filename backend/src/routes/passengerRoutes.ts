import express from 'express';
import * as pc from '../controllers/passengerController';

const passengerRouter = express.Router();


passengerRouter.post('/', pc.createPassenger);

passengerRouter.get('/', pc.getAllPassengers);

passengerRouter.get('/:id', pc.getPassengerById);

passengerRouter.put('/:id', pc.updatePassenger);

export default passengerRouter;
