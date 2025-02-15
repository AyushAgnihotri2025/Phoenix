import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import config from '../lib/config.js'; // Importing from config.js

const LOG_TO_FILE = config.LOG_TO_FILE === 'true'; // Toggle file logging
const LOG_DIR = 'logs'; // Directory for logs
const LOG_FILE_PATH = path.join(LOG_DIR, config.LOG_FILE_NAME || 'log.txt'); // Default file name

// Ensure directory & file are only created if logging is enabled
if (LOG_TO_FILE) {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true }); // Ensure directory exists
    }
    if (!fs.existsSync(LOG_FILE_PATH)) {
        fs.writeFileSync(LOG_FILE_PATH, ''); // Create empty log file
    }
}

// Color map for HTTP methods
const methodColors = {
    GET: chalk.green.bold,
    POST: chalk.blue.bold,
    PUT: chalk.yellow.bold,
    DELETE: chalk.red.bold,
    PATCH: chalk.magenta.bold,
};

// Color map for status codes
const statusColors = {
    success: chalk.green.bold, // 2xx
    redirect: chalk.cyan.bold, // 3xx
    clientError: chalk.yellow.bold, // 4xx
    serverError: chalk.red.bold, // 5xx
};

// Helper function to log messages to a file
const logToFile = (logObj) => {
    const logString = JSON.stringify(logObj) + '\n';
    fs.appendFile(LOG_FILE_PATH, logString, (err) => {
        if (err) console.error('Failed to write log:', err);
    });
};

// Logger object
const logger = {
    /**
     * Logs informational messages.
     * @param {...any} args - Messages to log.
     */
    info: (...args) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${chalk.cyan(timestamp)}] [INFO] ${args.join(' ')}`;

        console.log(logMessage);

        if (LOG_TO_FILE) {
            logToFile({ timestamp, level: 'INFO', message: args.join(' ') });
        }
    },

    /**
     * Logs error messages with stack trace.
     * @param {...any} args - Error messages to log.
     */
    error: (...args) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${chalk.red(timestamp)}] [ERROR] ${chalk.red(args.join(' '))}`;

        console.error(logMessage);

        if (LOG_TO_FILE) {
            logToFile({ timestamp, level: 'ERROR', message: args.join(' '), stack: new Error().stack });
        }
    },

    /**
     * Middleware to log incoming requests with execution time.
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @param {Function} next - Express next function.
     */
    requestLogger: (req, res, next) => {
        const start = process.hrtime();

        res.on('finish', () => {
            const [seconds, nanoseconds] = process.hrtime(start);
            const executionTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

            const methodColor = methodColors[req.method] || chalk.white.bold;
            const statusCategory =
                res.statusCode >= 500
                    ? 'serverError'
                    : res.statusCode >= 400
                      ? 'clientError'
                      : res.statusCode >= 300
                        ? 'redirect'
                        : 'success';
            const statusColor = statusColors[statusCategory] || chalk.white.bold;

            const logMessage = `[${chalk.gray(new Date().toISOString())}] ${methodColor(req.method)} ${chalk.white(req.originalUrl)} → ${statusColor(res.statusCode)} (${executionTime}ms)`;

            console.log(logMessage);

            if (LOG_TO_FILE) {
                logToFile({
                    timestamp: new Date().toISOString(),
                    method: req.method,
                    url: req.originalUrl,
                    status: res.statusCode,
                    executionTime: `${executionTime}ms`,
                });
            }
        });

        next();
    },
};

export default logger;
