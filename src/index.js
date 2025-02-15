import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import routes from './routes/index.js'; // Import all route handlers
import setupSwagger from './lib/swagger.js'; // Swagger API documentation setup
import logger from './utils/logger.js'; // Logger middleware
import errorHandler from './utils/errorHandler.js'; // Global error handler
import { connectDatabase } from './lib/db.js'; // Database connection
import config from './lib/config.js'; // Centralized configuration

// Load environment variables from .env file
dotenv.config();

// Server class to encapsulate application logic
class Server {
    constructor() {
        this.app = express(); // Initialize Express app
        this.setupMiddlewares(); // Configure middleware
        this.initializeRoutes(); // Setup API routes
        setupSwagger(this.app); // Initialize Swagger documentation
        this.setupErrorHandling(); // Setup error handlers
    }

    // Middleware setup (parsing JSON, cookies, logging, etc.)
    setupMiddlewares() {
        this.app.use(express.json()); // Enable JSON parsing
        this.app.use(cookieParser()); // Enable cookie parsing
        this.app.use(logger.requestLogger); // Request logging middleware
    }

    // Route initialization
    initializeRoutes() {
        // Root welcome route
        this.app.get('/', (req, res) =>
            res.json({
                message: 'Welcome to the Impossible Mission Force API',
                version: '1.0.0',
                documentation: 'https://documenter.getpostman.com/view/12363299/TzJx8w5x',
                created_by: 'Ayush Agnihotri',
            })
        );

        // Health check endpoint
        this.app.get('/health', (req, res) =>
            res.json({
                status: 'healthy',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            })
        );

        // Load all defined API routes dynamically
        routes.forEach((route) => this.app.use(route.path, route.handler));
    }

    // Error handling middleware
    setupErrorHandling() {
        // 404 handler for unmatched routes
        this.app.use((req, res) =>
            res.status(404).json({
                error: 'Not Found',
                path: req.originalUrl,
            })
        );

        // Global error handler for server-side errors
        this.app.use(errorHandler);
    }

    // Method to start the server
    async start() {
        try {
            await connectDatabase(); // Connect to the database
            logger.info('Database connection established ✔');

            this.app.listen(config.PORT, () => {
                logger.info(`🚀 Server running on http://localhost:${config.PORT} ✔`);
                logger.info(`📄 Swagger Docs available at http://localhost:${config.PORT}/api-docs ✔`);
            });
        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1); // Exit process if server fails to start
        }
    }
}

// Create and start the server
const server = new Server();
server.start();

// Export the Express app for testing or future integrations
export default server.app;
