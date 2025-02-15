import authRoutes from './auth.route.js';
import gadgetRoutes from './gadgets.route.js';
import { authMiddleware } from '../middleware/auth.middleware.js'; // Authentication middleware

// Centralized routing
const routes = [
    { path: '/api/v1/auth', handler: authRoutes },
    { path: '/api/v1/gadgets', handler: [authMiddleware, gadgetRoutes] },
];

export default routes;
