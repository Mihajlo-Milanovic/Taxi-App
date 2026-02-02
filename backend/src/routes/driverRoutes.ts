import express from 'express';
import * as dc from '../controllers/driverController';

const driverRouter = express.Router();

/**
 * @swagger
 * /drivers:
 *   get:
 *     tags: [Drivers]
 *     summary: Retrieve a list of drivers
 *     description: Retrieve a list of all drivers from the application.
 *     responses:
 *       200:
 *         description: Lista svih vozaca
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
 *                   example: Lista svih vozaca
 *                 data:
 *                   type: object
 *                   properties:
 *                     drivers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Driver'
 */
driverRouter.get('/', dc.getAllDrivers);

/**
 * @swagger
 * /drivers/{id}:
 *   get:
 *     tags: [Drivers]
 *     summary: Retrieve a driver
 *     description: Retrieve a single driver by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *         example: db765c0e-837d-429f-af82-150c8a99cead
 *     responses:
 *       200:
 *         description: Vozac sa ID
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
 *                   example: Vozac sa ID db765c0e-837d-429f-af82-150c8a99cead
 *                 data:
 *                   type: object
 *                   properties:
 *                     driver:
 *                       $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Vozac nije pronadjen
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
 *                   example: Vozac nije pronadjen
 *       400:
 *         description: ID vozaca je obavezan
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
 *                   example: ID vozaca je obavezan
 *
 *   put:
 *     tags: [Drivers]
 *     summary: Update a driver
 *     description: Update driver information by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *         example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewDriver'
 *     responses:
 *       200:
 *         description: Podaci vozaca azurirani
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
 *                   example: Podaci vozaca azurirani
 *                 data:
 *                   type: object
 *                   properties:
 *                     driver:
 *                       $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Vozac nije pronadjen
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
 *                   example: Vozac nije pronadjen
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
 *                   example: Nedostaju obavezna polja firstName, lastName
 *
 *   delete:
 *     tags: [Drivers]
 *     summary: Delete a driver
 *     description: Delete a driver by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *         example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *     responses:
 *       200:
 *         description: Vozac uspesno obrisan
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
 *                   example: Vozac uspesno obrisan
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *       404:
 *         description: Vozac nije pronadjen
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
 *                   example: Vozac nije pronadjen
 *       400:
 *         description: ID vozaca je obavezan
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
 *                   example: ID vozaca je obavezan
 */
driverRouter.get('/:id', dc.getDriverById);

/**
 * @swagger
 * /drivers:
 *   post:
 *     tags: [Drivers]
 *     summary: Create a driver
 *     description: Create a new driver.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewDriver'
 *     responses:
 *       201:
 *         description: Vozac uspesno kreiran
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
 *                   example: Vozac uspesno kreiran
 *                 data:
 *                   type: object
 *                   properties:
 *                     driver:
 *                       $ref: '#/components/schemas/Driver'
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
 *                   example: Nedostaju obavezna polja firstName, lastName
 */
driverRouter.post('/', dc.createDriver);

/**
 * @swagger
 * /drivers/{id}:
 *   put:
 *     tags: [Drivers]
 *     summary: Update a driver
 *     description: Update driver information by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewDriver'
 *     responses:
 *       200:
 *         description: Podaci vozaca azurirani
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
 *                   example: Podaci vozaca azurirani
 *                 data:
 *                   type: object
 *                   properties:
 *                     driver:
 *                       $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Vozac nije pronadjen
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
 *                   example: Vozac nije pronadjen
 *       400:
 *         description: Nedostaju obavezna polja
 */
driverRouter.put('/:id', dc.updateDriver);

/**
 * @swagger
 * /drivers/{id}:
 *   delete:
 *     tags: [Drivers]
 *     summary: Delete a driver
 *     description: Delete a driver by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *     responses:
 *       200:
 *         description: Voza? uspešno obrisan
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
 *                   example: Voza? uspešno obrisan
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *       404:
 *         description: Voza? nije prona?en
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
 *                   example: Voza? nije prona?en
 *       400:
 *         description: ID voza?a je obavezan
 */
driverRouter.delete('/:id', dc.deleteDriver);

export default driverRouter;