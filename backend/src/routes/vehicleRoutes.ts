import express from 'express';
import * as vc from '../controllers/vehicleController';

const vehicleRouter = express.Router();

/**
 * @swagger
 * /vehicles:
 *   post:
 *     tags: [Vehicles]
 *     summary: Create vehicle
 *     description: Create a new vehicles.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewVehicle'
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       400:
 *         description: Vehicle creation failed
 */
vehicleRouter.post('/', vc.createVehicle);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     tags: [Vehicles]
 *     summary: Retrieve a vehicle
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          example: 8ad84a39-25f1-498c-85e8-54e6a510126b
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 */
vehicleRouter.get('/:id', vc.getVehicleById);

/**
 * @swagger
 * /vehicles/:
 *   get:
 *     tags: [Vehicles]
 *     summary: Retrieve a list of vehicles
 *     description: Retrieve a list of all vehicles.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#components/schemas/Vehicle'
 *       400:
 *        description: Bad request
 */
vehicleRouter.get('/', vc.getAllVehicles);

/**
 * @swagger
 * /vehicles/nearby/lat/{lat}/lng/{lng}/radius/{radius}/maxCount/{maxCount}:
 *   get:
 *     tags: [Vehicles]
 *     summary: Retrieve a list of vehicles
 *     description: Retrieve a list of (at most maxCount) vehicles that are within a radius.
 *     parameters:
 *      - in: path
 *        name: lat
 *        required: true
 *        schema:
 *          type: string
 *          example: 44.7866
 *      - in: path
 *        name: lng
 *        required: true
 *        schema:
 *          type: string
 *          example: 20.4489
 *      - in: path
 *        name: radius
 *        required: true
 *        schema:
 *          type: number
 *          example: 100
 *      - in: path
 *        name: maxCount
 *        required: true
 *        schema:
 *          type: number
 *          example: 10
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#components/schemas/Vehicle'
 *       400:
 *        description: Bad request
 */
vehicleRouter.get('/nearby/lat/:lat/lng/:lng/radius/:radius/maxCount/:maxCount', vc.getNearbyVehicles);

/**
 * @swagger
 * /vehicles/{id}/driver:
 *   get:
 *     tags: [Vehicles]
 *     summary: Retrieve a driver of vehicle
 *     description: Get the driver assigned to a specific vehicle by vehicle ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *         example: 63c8048d-e5ee-45e8-b847-7f48bb31e44a
 *     responses:
 *       200:
 *         description: Driver information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Driver information unavailable
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Driver information unavailable.
 */
vehicleRouter.get('/:id/driver', vc.getDriverForVehicle);

/**
 * @swagger
 * /vehicles/{id}/location:
 *   put:
 *     summary: Update vehicle location
 *     description: Update location of vehicle with an ID.
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *            example: 8ad84a39-25f1-498c-85e8-54e6a510126b
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             allOf:
 *               - properties:
 *                   availability:
 *                     type: number
 *                     example: 1
 *               - $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Vehicle location updated successfully
 *       404:
 *         description: Vehicle not found
 */
vehicleRouter.put('/:id/location', vc.updateVehicleLocation);


/**
 * @swagger
 * /vehicles/{id}/availability/{availability}:
 *   put:
 *     summary: Update vehicle availability
 *     description: Update availability of vehicle with an ID.
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *            example: 8ad84a39-25f1-498c-85e8-54e6a510126b
 *       - in: path
 *         name: availability
 *         required: true
 *         schema:
 *            type: number
 *            example: 0
 *     responses:
 *       200:
 *         description: Vehicle availability updated successfully
 *       404:
 *         description: Vehicle not found
 */
vehicleRouter.put('/:id/availability/:availability', vc.updateVehicleAvailability);

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     tags: [Vehicles]
 *     summary: Delete a vehicle
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          example: 8ad84a39-25f1-498c-85e8-54e6a510126a
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 */
vehicleRouter.delete('/:id', vc.deleteVehicle);

export default vehicleRouter;