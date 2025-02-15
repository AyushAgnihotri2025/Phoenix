import jwt from 'jsonwebtoken';
import config from '../lib/config.js'; // Importing config variables

// Generate JWT Token and set it in cookies
export const generateToken = (userId, res) => {
    const { JWT_SECRET, JWT_EXPIRES_IN } = config;

    if (!JWT_SECRET) {
        console.error('❌ JWT_SECRET is not defined ✘');
        throw new Error('JWT_SECRET is not defined ✘');
    }

    const expiresIn = JWT_EXPIRES_IN || '1d'; // Default to 1 day if not provided

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn });

    res.cookie('jwt', token, {
        maxAge: parseExpiryToMs(expiresIn),
        httpOnly: true,
        sameSite: 'strict',
        secure: config.NODE_ENV !== 'development',
    });

    return token;
};

/**
 * Converts JWT expiry time from string (e.g., '1d', '2h', '30m') to milliseconds.
 * @param {string} expiry - JWT expiration time (e.g., '1d', '2h', '30m').
 * @returns {number} Expiry time in milliseconds.
 */
function parseExpiryToMs(expiry) {
    const timeUnitMap = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
        console.warn('⚠ Invalid JWT_EXPIRES_IN format, using default (1d)');
        return 86400000; // Default to 1 day
    }

    const [, value, unit] = match;
    return Number(value) * timeUnitMap[unit];
}
