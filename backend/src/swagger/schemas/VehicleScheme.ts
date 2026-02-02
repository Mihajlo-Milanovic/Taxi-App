
//TODO: Add example values to Vehicle
/**
 * @swagger
 * components:
 *   schemas:
 *     NewVehicle:
 *       type: object
 *       properties:
 *         driverId:
 *           type: string
 *         make:
 *           type: string
 *         model:
 *           type: string
 *         registration:
 *           type: string;
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: string
 *             longitude:
 *               type: string
 *         availability:
 *           type: number
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
 *               example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *         - $ref: '#components/schemas/NewVehicle'
 */