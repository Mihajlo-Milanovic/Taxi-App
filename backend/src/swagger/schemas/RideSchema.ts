
/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required:
 *         - latitude
 *         - longitude
 *       properties:
 *         latitude:
 *           type: number
 *           example: 44.7866
 *         longitude:
 *           type: number
 *           example: 20.4489
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     NewRide:
 *       type: object
 *       required:
 *         - passengerId
 *         - startLocation
 *         - destination
 *       properties:
 *         passengerId:
 *           type: string
 *           description: ID of the passenger requesting the ride
 *           example: 5d501b67-4f49-4cbb-ba42-0141beb20c85
 *         startLocation:
 *           $ref: '#/components/schemas/Location'
 *         destination:
 *           $ref: '#/components/schemas/Location'

 *
 *     Ride:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Ride ID
 *               example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *             driverId:
 *               type: string
 *               description: ID of the assigned driver
 *               example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *             vehicleId:
 *               type: string
 *               description: ID of the assigned vehicle
 *               example: 63c8048d-e5ee-45e8-b847-7f48bb31e44a
 *             status:
 *               type: integer
 *               format: int64
 *               enum: [requested=0, accepted=1, in_progress=2, completed=3, cancelled=-1]
 *               description: Current status of the ride
 *               example: requested
 *             price:
 *               type: number
 *               description: Price of the ride
 *               example: 500
 *         - $ref: '#/components/schemas/NewRide'
 *
 *     RideResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Ride'
 *
 *     ErrorResponse:
 *       type: string
 *       example: Voznja nije pronadjena
 */