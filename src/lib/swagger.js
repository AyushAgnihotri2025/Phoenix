import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import logger from '../utils/logger.js';
import config from '../lib/config.js'; // Centralized config file

// Resolve directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routesPath = join(__dirname, '..', 'routes');
const authRoutePath = join(routesPath, 'auth.route.js');
const gadgetsRoutePath = join(routesPath, 'gadgets.route.js');

// Base API path
const BASE_PATH = '/api/v1';

/**
 * Swagger API Documentation Configuration
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'IMF Gadget API || Phoenix Assignment || Ayush Agnihotri',
            version: '1.0.0',
            description: 'API for managing IMF gadgets with JWT cookie authentication',
            termsOfService: `${config.BASE_URL}/terms`,
            contact: {
                name: 'Ayush Agnihotri',
                email: 'ayushagnihotri2025@gmial.com',
                url: `https://www.mrayush.in/contact`,
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url:
                    config.NODE_ENV === 'production'
                        ? `${config.BASE_URL}${BASE_PATH}`
                        : `http://localhost:${config.PORT}${BASE_PATH}`,
                description: config.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'jwt',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                    },
                },
                Gadget: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        status: {
                            type: 'string',
                            enum: ['available', 'deployed', 'destroyed', 'decommissioned'],
                        },
                        success_probability: { type: 'number', format: 'float' },
                        createdAt: { type: 'string', format: 'date-time' },
                        decommissionedAt: { type: 'string', format: 'date-time' },
                        destroyedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Status: {
                    type: 'string',
                    enum: ['available', 'deployed', 'destroyed', 'decommissioned'],
                },
            },
        },
        security: [{ cookieAuth: [] }],
    },
    apis: [authRoutePath, gadgetsRoutePath], // Path to API route files
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(swaggerOptions);

/**
 * Swagger UI options for customization
 */
const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        withCredentials: true,
        displayRequestDuration: true,
        filter: true,
    },
    customSiteTitle: 'Phoenix: API Documentation || Ayush Agnihotri',
};

/**
 * Sets up Swagger UI middleware in the Express app.
 * @param {Object} app - Express app instance.
 */
const setupSwagger = (app) => {
    logger.info('Swagger Docs📄 generated successfully ✔');

    // Allow CORS for Swagger endpoints
    app.use('/api-docs', (req, res, next) => {
        res.setHeader(
            'Access-Control-Allow-Origin',
            config.NODE_ENV === 'production' ? config.BASE_URL : `http://localhost:${config.PORT}`
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });

    // Setup Swagger UI
    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

    // Expose raw Swagger JSON spec
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};

export default setupSwagger;
