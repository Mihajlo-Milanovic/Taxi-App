/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         latitude:
 *           type: number
 *           example: 44.7866
 *         longitude:
 *           type: number
 *           example: 20.4489
 *       required:
 *         - latitude
 *         - longitude
 *
 *     NewRide:
 *       type: object
 *       required:
 *         - passengerId
 *         - driverId
 *         - vehicleId
 *         - status
 *         - startLocation
 *         - destination
 *         - price
 *       properties:
 *         passengerId:
 *           type: string
 *           description: ID of the passenger requesting the ride
 *           example: 5d501b67-4f49-4cbb-ba42-0141beb20c85
 *         driverId:
 *           type: string
 *           description: ID of the assigned driver
 *           example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *         vehicleId:
 *           type: string
 *           description: ID of the assigned vehicle
 *           example: 63c8048d-e5ee-45e8-b847-7f48bb31e44a
 *         status:
 *           type: string
 *           enum: [requested, accepted, in_progress, completed, cancelled]
 *           description: Current status of the ride
 *           example: requested
 *         startLocation:
 *           $ref: '#/components/schemas/Location'
 *         destination:
 *           $ref: '#/components/schemas/Location'
 *         price:
 *           type: number
 *           description: Price of the ride
 *           example: 500
 *
 *     Ride:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Ride ID
 *               example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the ride was created
 *               example: 2026-02-03T10:30:00Z
 *         - $ref: '#/components/schemas/NewRide'
 *
 *     RideResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Vo�nja uspe�no kreirana
 *         data:
 *           type: object
 *           properties:
 *             ride:
 *               $ref: '#/components/schemas/Ride'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: Vo�nja nije prona?ena
 */