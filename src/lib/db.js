import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

// Using a global variable to prevent multiple instances of PrismaClient in development
const globalForPrisma = globalThis;

// Check if PrismaClient is already assigned (helps in avoiding hot-reload issues in development)
const db = globalForPrisma.prisma || new PrismaClient();

// If not in production, store Prisma instance globally
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db;
}

/**
 * Connects to the database using Prisma Client.
 * Logs success or failure messages.
 */
async function connectDatabase() {
    try {
        await db.$connect();
        logger.info('✅ Successfully connected to the database ✔');
    } catch (error) {
        logger.error('❌ Database connection failed ✘ :', error);
        throw error;
    }
}

export { db as default, connectDatabase };
