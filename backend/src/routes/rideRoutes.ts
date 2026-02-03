import express from 'express';
import * as rc from '../controllers/rideController';

const rideRouter = express.Router();

/**
 * @swagger
 * /rides/request:
 *   post:
 *     tags: [Rides]
 *     summary: Request a new ride
 *     description: Create a new ride request with passenger, driver, vehicle, and location information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewRide'
 *     responses:
 *       201:
 *         description: Vožnja uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RideResponse'
 *       400:
 *         description: Invalid request - missing required fields
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Invalid request
 *       404:
 *         description: No available vehicles nearby
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: Nema dostupnih vozila u blizini
 */
rideRouter.post('/request', rc.createRide);

/**
 * @swagger
 * /rides/{id}:
 *   get:
 *     tags: [Rides]
 *     summary: Get ride by ID
 *     description: Retrieve details of a specific ride
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *     responses:
 *       200:
 *         description: Vožnja sa ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RideResponse'
 *       404:
 *         description: Vožnja nije prona?ena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: Vožnja nije prona?ena
 *       400:
 *         description: ID vožnje je obavezan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: ID vožnje je obavezan
 *
 *   delete:
 *     tags: [Rides]
 *     summary: Delete a ride
 *     description: Delete a ride by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *     responses:
 *       200:
 *         description: Vožnja obrisana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Vožnja obrisana
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *       404:
 *         description: Vožnja nije prona?ena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID vožnje je obavezan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
rideRouter.get('/:id', rc.getRideById);
rideRouter.delete('/:id', rc.deleteRide);

/**
 * @swagger
 * /rides/{id}/cancel:
 *   put:
 *     tags: [Rides]
 *     summary: Cancel a ride
 *     description: Cancel an existing ride with an optional reason
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *                 example: Passenger changed plans
 *     responses:
 *       200:
 *         description: Vožnja otkazana
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RideResponse'
 *             example:
 *               success: true
 *               message: Vožnja otkazana
 *               data:
 *                 ride:
 *                   id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                   status: cancelled
 *       404:
 *         description: Vožnja nije prona?ena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request - ride already completed/cancelled or ID missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               alreadyCancelled:
 *                 value:
 *                   success: false
 *                   error: Vožnja je ve? završena ili otkazana
 *               missingId:
 *                 value:
 *                   success: false
 *                   error: ID vožnje je obavezan
 */
rideRouter.put('/:id/cancel', rc.cancelRide);

/**
 * @swagger
 * /rides/{id}/assignVehicle:
 *   put:
 *     tags: [Rides]
 *     summary: Accept/assign vehicle to ride
 *     description: Driver accepts the ride and assigns their vehicle
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *     responses:
 *       200:
 *         description: Vožnja prihva?ena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RideResponse'
 *             example:
 *               success: true
 *               message: Vožnja prihva?ena
 *               data:
 *                 ride:
 *                   id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                   status: accepted
 *       404:
 *         description: Vožnja nije prona?ena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request - ride already accepted/in progress or ID missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               alreadyAccepted:
 *                 value:
 *                   success: false
 *                   error: Vožnja je ve? prihva?ena ili u toku
 *               missingId:
 *                 value:
 *                   success: false
 *                   error: ID vožnje je obavezan
 */
rideRouter.put('/:id/assignVehicle', rc.acceptRide);

/**
 * @swagger
 * /rides/{id}/start:
 *   put:
 *     tags: [Rides]
 *     summary: Start a ride
 *     description: Driver starts the ride (must be accepted first)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *     responses:
 *       200:
 *         description: Vožnja po?ela
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RideResponse'
 *             example:
 *               success: true
 *               message: Vožnja po?ela
 *               data:
 *                 ride:
 *                   id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                   status: in_progress
 *       404:
 *         description: Vožnja nije prona?ena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request - ride must be accepted first or ID missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notAccepted:
 *                 value:
 *                   success: false
 *                   error: Vožnja mora biti prihva?ena pre po?etka
 *               missingId:
 *                 value:
 *                   success: false
 *                   error: ID vožnje je obavezan
 */
rideRouter.put('/:id/start', rc.startRide);

/**
 * @swagger
 * /rides/{id}/complete:
 *   put:
 *     tags: [Rides]
 *     summary: Complete a ride
 *     description: Driver completes the ride (must be in progress)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *     responses:
 *       200:
 *         description: Vožnja završena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RideResponse'
 *             example:
 *               success: true
 *               message: Vožnja završena
 *               data:
 *                 ride:
 *                   id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                   status: completed
 *       404:
 *         description: Vožnja nije prona?ena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request - ride must be in progress or no vehicle assigned or ID missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notInProgress:
 *                 value:
 *                   success: false
 *                   error: Vožnja mora biti u toku da bi se završila
 *               noVehicle:
 *                 value:
 *                   success: false
 *                   error: Vožnja nema dodeljeno vozilo
 *               missingId:
 *                 value:
 *                   success: false
 *                   error: ID vožnje je obavezan
 */
rideRouter.put('/:id/complete', rc.completeRide);

/**
 * @swagger
 * /rides/passenger/{passengerId}/active:
 *   get:
 *     tags: [Rides]
 *     summary: Get active ride for passenger
 *     description: Retrieve the current active ride for a specific passenger
 *     parameters:
 *       - in: path
 *         name: passengerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Passenger ID
 *         example: 5d501b67-4f49-4cbb-ba42-0141beb20c85
 *     responses:
 *       200:
 *         description: Active ride information or null if no active ride
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Aktivna vožnja putnika
 *                 data:
 *                   type: object
 *                   properties:
 *                     ride:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/Ride'
 *                         - type: 'null'
 *             examples:
 *               withRide:
 *                 value:
 *                   success: true
 *                   message: Aktivna vožnja putnika
 *                   data:
 *                     ride:
 *                       id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                       status: in_progress
 *               noRide:
 *                 value:
 *                   success: true
 *                   message: Nema aktivne vožnje
 *                   data:
 *                     ride: null
 *       400:
 *         description: ID putnika je obavezan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
rideRouter.get('/passenger/:passengerId/active', rc.getActiveRideByPassenger);

/**
 * @swagger
 * /rides/driver/{driverId}/active:
 *   get:
 *     tags: [Rides]
 *     summary: Get active ride for driver
 *     description: Retrieve the current active ride for a specific driver
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *         example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *     responses:
 *       200:
 *         description: Active ride information or null if no active ride
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Aktivna vožnja voza?a
 *                 data:
 *                   type: object
 *                   properties:
 *                     ride:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/Ride'
 *                         - type: 'null'
 *             examples:
 *               withRide:
 *                 value:
 *                   success: true
 *                   message: Aktivna vožnja voza?a
 *                   data:
 *                     ride:
 *                       id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                       status: in_progress
 *               noRide:
 *                 value:
 *                   success: true
 *                   message: Nema aktivne vožnje
 *                   data:
 *                     ride: null
 *       400:
 *         description: ID voza?a je obavezan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
rideRouter.get('/driver/:driverId/active', rc.getActiveRideByDriver);

/**
 * @swagger
 * /rides/vehicle/{vehicleId}/active:
 *   get:
 *     tags: [Rides]
 *     summary: Get active ride for vehicle
 *     description: Retrieve the current active ride for a specific vehicle
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *         example: 63c8048d-e5ee-45e8-b847-7f48bb31e44a
 *     responses:
 *       200:
 *         description: Active ride information or null if no active ride
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Aktivna vožnja vozila
 *                 data:
 *                   type: object
 *                   properties:
 *                     ride:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/Ride'
 *                         - type: 'null'
 *             examples:
 *               withRide:
 *                 value:
 *                   success: true
 *                   message: Aktivna vožnja vozila
 *                   data:
 *                     ride:
 *                       id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                       status: in_progress
 *               noRide:
 *                 value:
 *                   success: true
 *                   message: Nema aktivne vožnje
 *                   data:
 *                     ride: null
 *       400:
 *         description: ID vozila je obavezan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
rideRouter.get('/vehicle/:vehicleId/active', rc.getActiveRideByVehicle);

// Commented out endpoint - uncomment if needed
// /**
//  * @swagger
//  * /rides:
//  *   get:
//  *     tags: [Rides]
//  *     summary: Get all rides
//  *     description: Retrieve a list of all rides
//  *     responses:
//  *       200:
//  *         description: Lista svih vožnji
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: Lista svih vožnji
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     rides:
//  *                       type: array
//  *                       items:
//  *                         $ref: '#/components/schemas/Ride'
//  */
// rideRouter.get('/', rc.getAllRides);

export default rideRouter;