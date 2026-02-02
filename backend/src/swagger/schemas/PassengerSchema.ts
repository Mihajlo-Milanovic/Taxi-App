/**
 * @swagger
 * components:
 *   schemas:
 *     NewPassenger:
 *       type: object
 *       required:
 *         - name
 *         - telephone
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the passenger
 *           example: Marko Markovic
 *         telephone:
 *           type: string
 *           description: Contact telephone number
 *           example: +381641234567
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Passenger:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Passenger ID
 *               example: 5d501b67-4f49-4cbb-ba42-0141beb20c85
 *         - $ref: '#/components/schemas/NewPassenger'
 */