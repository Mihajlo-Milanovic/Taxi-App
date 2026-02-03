import express from 'express';
import * as pc from '../controllers/passengerController';

const passengerRouter = express.Router();

/**
 * @swagger
 * /passengers:
 *   get:
 *     tags: [Passengers]
 *     summary: Retrieve a list of passengers
 *     description: Retrieve a list of all passengers from the application.
 *     responses:
 *       200:
 *         description: Lista svih putnika
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
 *                   example: Lista svih putnika
 *                 data:
 *                   type: object
 *                   properties:
 *                     passengers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Passenger'
 *   post:
 *     tags: [Passengers]
 *     summary: Create a passenger
 *     description: Create a new passenger.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewPassenger'
 *     responses:
 *       201:
 *         description: Putnik uspesno kreiran
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
 *                   example: Putnik uspesno kreiran
 *                 data:
 *                   type: object
 *                   properties:
 *                     passenger:
 *                       $ref: '#/components/schemas/Passenger'
 *       400:
 *         description: Nedostaju obavezna polja
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Nedostaju obavezna polja name, telephone
 */
passengerRouter.get('/', pc.getAllPassengers);
passengerRouter.post('/', pc.createPassenger);

/**
 * @swagger
 * /passengers/{id}:
 *   get:
 *     tags: [Passengers]
 *     summary: Retrieve a passenger
 *     description: Retrieve a single passenger by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passenger ID
 *         example: f642eb0f-eeb0-4f35-beef-65c63d2f7469
 *     responses:
 *       200:
 *         description: Putnik sa ID
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
 *                   example: Putnik sa ID f642eb0f-eeb0-4f35-beef-65c63d2f7469
 *                 data:
 *                   type: object
 *                   properties:
 *                     passenger:
 *                       $ref: '#/components/schemas/Passenger'
 *       404:
 *         description: Putnik nije pronadjen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Putnik nije pronadjen
 *       400:
 *         description: ID putnika je obavezan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: ID putnika je obavezan
 *   put:
 *     tags: [Passengers]
 *     summary: Update a passenger
 *     description: Update passenger information by ID. You can update name, telephone, or both.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passenger ID
 *         example: f642eb0f-eeb0-4f35-beef-65c63d2f7469
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Marko Markovic
 *               telephone:
 *                 type: string
 *                 example: +381641234567
 *     responses:
 *       200:
 *         description: Podaci putnika azurirani
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
 *                   example: Podaci putnika azurirani
 *                 data:
 *                   type: object
 *                   properties:
 *                     passenger:
 *                       $ref: '#/components/schemas/Passenger'
 *       404:
 *         description: Putnik nije pronadjen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Putnik nije pronadjen
 *       400:
 *         description: Potrebno je poslati bar jedno polje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Potrebno je poslati bar jedno polje name ili telephone
 *   delete:
 *     tags: [Passengers]
 *     summary: Delete a passenger
 *     description: Delete a passenger by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passenger ID
 *         example: f642eb0f-eeb0-4f35-beef-65c63d2f7469
 *     responses:
 *       200:
 *         description: Putnik uspesno obrisan
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
 *                   example: Putnik uspesno obrisan
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: f642eb0f-eeb0-4f35-beef-65c63d2f7469
 *       404:
 *         description: Putnik nije pronadjen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Putnik nije pronadjen
 *       400:
 *         description: ID putnika je obavezan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: ID putnika je obavezan
 */
passengerRouter.get('/:id', pc.getPassengerById);
passengerRouter.put('/:id', pc.updatePassenger);
passengerRouter.delete('/:id', pc.deletePassenger);

export default passengerRouter;