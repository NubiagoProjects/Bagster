"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.checkRateLimit = exports.rateLimit = exports.createSearchQuery = exports.applyPagination = exports.requireRole = exports.requireAuth = exports.validatePhone = exports.validateEmail = exports.FirebaseError = exports.transaction = exports.batchWrite = exports.generateId = exports.createTimestamp = exports.storageBuckets = exports.collections = exports.auth = exports.storage = exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const storage_1 = require("firebase-admin/storage");
const auth_1 = require("firebase-admin/auth");
// Initialize Firebase Admin
const serviceAccount = require('../../serviceAccountKey.json');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'bagster-d51eb.firebasestorage.app',
    });
}
// Export Firebase services
exports.db = (0, firestore_1.getFirestore)();
exports.storage = (0, storage_1.getStorage)();
exports.auth = (0, auth_1.getAuth)();
// Firestore collections
exports.collections = {
    users: 'users',
    carriers: 'carriers',
    shipments: 'shipments',
    tracking: 'tracking',
    notifications: 'notifications',
    analytics: 'analytics',
    settings: 'settings',
};
// Storage buckets
exports.storageBuckets = {
    avatars: 'avatars',
    carrierDocs: 'carrier-docs',
    shipmentPhotos: 'shipment-photos',
    businessDocs: 'business-docs',
};
// Utility functions
const createTimestamp = () => admin.firestore.Timestamp.now();
exports.createTimestamp = createTimestamp;
const generateId = () => exports.db.collection('_').doc().id;
exports.generateId = generateId;
const batchWrite = () => exports.db.batch();
exports.batchWrite = batchWrite;
const transaction = () => exports.db.runTransaction;
exports.transaction = transaction;
// Error handling
class FirebaseError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'FirebaseError';
    }
}
exports.FirebaseError = FirebaseError;
// Validation helpers
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};
exports.validatePhone = validatePhone;
// Security helpers
const requireAuth = async (idToken) => {
    try {
        const decodedToken = await exports.auth.verifyIdToken(idToken);
        return decodedToken;
    }
    catch (error) {
        throw new FirebaseError('Invalid authentication token', 'auth/invalid-token');
    }
};
exports.requireAuth = requireAuth;
const requireRole = async (idToken, roles) => {
    const decodedToken = await (0, exports.requireAuth)(idToken);
    if (!roles.includes(decodedToken.role)) {
        throw new FirebaseError('Insufficient permissions', 'auth/insufficient-permissions');
    }
    return decodedToken;
};
exports.requireRole = requireRole;
const applyPagination = (query, options) => {
    const { page, limit } = options;
    const offset = (page - 1) * limit;
    return query
        .limit(limit)
        .offset(offset);
};
exports.applyPagination = applyPagination;
// Search helpers
const createSearchQuery = (searchTerm, fields) => {
    const terms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    return terms.map(term => fields.map(field => `${field} >= '${term}' AND ${field} <= '${term}\uf8ff'`).join(' OR ')).join(' AND ');
};
exports.createSearchQuery = createSearchQuery;
// Rate limiting helpers
exports.rateLimit = new Map();
const checkRateLimit = (key, limit, windowMs) => {
    const now = Date.now();
    const record = exports.rateLimit.get(key);
    if (!record || now > record.resetTime) {
        exports.rateLimit.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }
    if (record.count >= limit) {
        return false;
    }
    record.count++;
    return true;
};
exports.checkRateLimit = checkRateLimit;
// Logging
exports.logger = {
    info: (message, data) => {
        console.log(`[INFO] ${message}`, data || '');
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error || '');
    },
    warn: (message, data) => {
        console.warn(`[WARN] ${message}`, data || '');
    },
    debug: (message, data) => {
        console.debug(`[DEBUG] ${message}`, data || '');
    },
};
//# sourceMappingURL=firebase.js.map