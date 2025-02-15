import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/dbname',
    BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`, // Default to localhost
    LOG_TO_FILE: process.env.LOG_TO_FILE || 'false', // Toggle file logging
    LOG_FILE_NAME: process.env.LOG_FILE_NAME || 'log.txt', // Default log file
};

export default config;
