import express from 'express';
import {
    getAllRides,
    getRideById,
    createRide,
    acceptRide,
    startRide,
    completeRide,
    cancelRide,
    getActiveRideByPassenger,
    getActiveRideByDriver
} from '../controllers/rideController';

const router = express.Router();

/**
 * GET /api/rides/passenger/:passengerId/active
 * Mora biti PRE /:id rute
 */
router.get('/passenger/:passengerId/active', getActiveRideByPassenger);

/**
 * GET /api/rides/driver/:driverId/active
 * Mora biti PRE /:id rute
 */
router.get('/driver/:driverId/active', getActiveRideByDriver);

/**
 * GET /api/rides
 * Dobija sve vožnje
 */
router.get('/', getAllRides);

/**
 * GET /api/rides/:id
 * Dobija vožnju po ID-u
 */
router.get('/:id', getRideById);

/**
 * POST /api/rides
 * Kreira novu vožnju (naru?ivanje taksija)
 * Body: { passengerId, pickupLatitude, pickupLongitude, destinationLatitude?, destinationLongitude? }
 */
router.post('/', createRide);

/**
 * PATCH /api/rides/:id/accept
 * Voza? prihvata vožnju
 * Body: { driverId }
 */
router.patch('/:id/accept', acceptRide);

/**
 * PATCH /api/rides/:id/start
 * Zapo?inje vožnju
 */
router.patch('/:id/start', startRide);

/**
 * PATCH /api/rides/:id/complete
 * Završava vožnju
 */
router.patch('/:id/complete', completeRide);

/**
 * DELETE /api/rides/:id
 * Otkazuje vožnju
 * Body: { reason? }
 */
router.delete('/:id', cancelRide);

export default router;
