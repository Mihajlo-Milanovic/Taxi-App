import express from 'express';
import * as pc from '../controllers/passengerController';

const passengerRouter = express.Router();



passengerRouter.get('/', pc.getAllPassengers);

passengerRouter.get('/:id', pc.getPassengerById);

passengerRouter.post('/', pc.createPassenger);

passengerRouter.put('/:id', pc.updatePassenger);

passengerRouter.delete('/:id', pc.deletePassenger);


export default passengerRouter;
