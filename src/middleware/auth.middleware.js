import jwt from 'jsonwebtoken';
import db from '../lib/db.js';
import config from '../lib/config.js'; // Importing centralized config

/**
 * Middleware to authenticate users based on JWT token.
 * Verifies the token, fetches the user, and attaches user details to the request object.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authMiddleware = async (req, res, next) => {
    try {
        // Extract JWT token from cookies
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied: No authentication token provided. Please sign in.',
            });
        }

        // Retrieve JWT secret from config
        if (!config.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error: Missing authentication configuration. Please contact support.',
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, config.JWT_SECRET);

        if (!decoded?.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token: Unable to verify user identity. Please sign in again.',
            });
        }

        // Fetch user details from database
        const user = await db.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true }, // Excluding sensitive fields
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: User does not exist. Please register or sign in with a valid account.',
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('❌ Error in authMiddleware:', error.message);

        // Return appropriate error response
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token: Your session may have been tampered with. Please sign in again.',
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired: Your authentication token has expired. Please sign in again to continue.',
            });
        }

        res.status(500).json({
            success: false,
            message:
                'Internal Server Error: Unable to authenticate request. Please try again later or contact support.',
        });
    }
};
