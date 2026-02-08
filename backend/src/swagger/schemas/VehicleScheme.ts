/**
 * @swagger
 * components:
 *   schemas:
 *     NewVehicle:
 *       type: object
 *       properties:
 *         driverId:
 *           type: string
 *           example: 511351b0-f52a-478c-a8fa-674e9254e45e
 *         make:
 *           type: string
 *           example: Toyota
 *         model:
 *           type: string
 *           example: Camry
 *         registration:
 *           type: string
 *           example: BG-123-AB
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: string
 *               example: "44.7866"
 *             longitude:
 *               type: string
 *               example: "20.4489"
 *         availability:
 *           type: number
 *           example: 1
 *           description: 0 = offline, 1 = available, 2 = occupied
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Vehicle ID
 *               example: 63c8048d-e5ee-45e8-b847-7f48bb31e44a
 *         - $ref: '#/components/schemas/NewVehicle'
 */