"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityHeaders = exports.requestLogger = exports.corsMiddleware = exports.rateLimit = exports.optionalAuth = exports.requireAuth = exports.requireRole = exports.authenticateToken = void 0;
const firebase_1 = require("../config/firebase");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            const response = {
                success: false,
                error: 'Access denied',
                message: 'No token provided',
            };
            res.status(401).json(response);
            return;
        }
        const decodedToken = await firebase_1.auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Invalid token',
            message: 'Token is invalid or expired',
        };
        res.status(401).json(response);
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            const response = {
                success: false,
                error: 'Access denied',
                message: 'Authentication required',
            };
            res.status(401).json(response);
            return;
        }
        const userRole = req.user.role;
        if (!roles.includes(userRole)) {
            const response = {
                success: false,
                error: 'Access denied',
                message: 'Insufficient permissions',
            };
            res.status(403).json(response);
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireAuth = (req, res, next) => {
    if (!req.user) {
        const response = {
            success: false,
            error: 'Access denied',
            message: 'Authentication required',
        };
        res.status(401).json(response);
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decodedToken = await firebase_1.auth.verifyIdToken(token);
            req.user = decodedToken;
        }
        next();
    }
    catch (error) {
        // Continue without authentication
        next();
    }
};
exports.optionalAuth = optionalAuth;
// Rate limiting middleware
const rateLimit = (maxRequests, windowMs) => {
    const requests = new Map();
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        const userRequests = requests.get(ip);
        if (!userRequests || now > userRequests.resetTime) {
            requests.set(ip, { count: 1, resetTime: now + windowMs });
            next();
            return;
        }
        if (userRequests.count >= maxRequests) {
            const response = {
                success: false,
                error: 'Rate limit exceeded',
                message: 'Too many requests, please try again later',
            };
            res.status(429).json(response);
            return;
        }
        userRequests.count++;
        next();
    };
};
exports.rateLimit = rateLimit;
// CORS middleware
const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
};
exports.corsMiddleware = corsMiddleware;
// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
// Security headers middleware
const securityHeaders = (req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.header('Content-Security-Policy', "default-src 'self'");
    next();
};
exports.securityHeaders = securityHeaders;
//# sourceMappingURL=auth.js.map