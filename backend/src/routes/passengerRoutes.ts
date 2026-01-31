import express from 'express';
import {
    getAllPassengers,
    getPassengerById,
    createPassenger,
    updatePassengerLocation
} from '../controllers/passengerController';

const router = express.Router();

/**
 * GET /api/passengers
 * Dobija sve putnike
 */
router.get('/', getAllPassengers);

/**
 * GET /api/passengers/:id
 * Dobija putnika po ID-u
 */
router.get('/:id', getPassengerById);

/**
 * POST /api/passengers
 * Kreira novog putnika
 * Body: { latitude, longitude }
 */
router.post('/', createPassenger);

/**
 * PUT /api/passengers/:id/location
 * Ažurira lokaciju putnika
 * Body: { latitude, longitude }
 */
router.put('/:id/location', updatePassengerLocation);

export default router;
