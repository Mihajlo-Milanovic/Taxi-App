import swaggerJSDoc from 'swagger-jsdoc';
import {PORT} from "../config/config";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Taxi API',
            version: '1.0.0',
            description: 'API documentation using Swagger and JSDoc',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Local development server',
            },
        ],
    },
    apis: [ './src/routes/*.ts', './src/swagger/schemas/*.ts' ],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);


