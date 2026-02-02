/**
 * @swagger
 * components:
 *   schemas:
 *     NewDriver:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: Bora
 *         lastName:
 *           type: string
 *           example: Djordjevic
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Driver ID
 *               example: 550d8b9e-47db-4cf4-be1a-f54bd3647949
 *         - $ref: '#components/schemas/NewDriver'
 */


