import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'bagster-d51eb.firebasestorage.app',
  });
}

// Export Firebase services
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();

// Firestore collections
export const collections = {
  users: 'users',
  carriers: 'carriers',
  shipments: 'shipments',
  tracking: 'tracking',
  notifications: 'notifications',
  analytics: 'analytics',
  settings: 'settings',
} as const;

// Storage buckets
export const storageBuckets = {
  avatars: 'avatars',
  carrierDocs: 'carrier-docs',
  shipmentPhotos: 'shipment-photos',
  businessDocs: 'business-docs',
} as const;

// Utility functions
export const createTimestamp = () => admin.firestore.Timestamp.now();

export const generateId = () => db.collection('_').doc().id;

export const batchWrite = () => db.batch();

export const transaction = () => db.runTransaction;

// Error handling
export class FirebaseError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'FirebaseError';
  }
}

// Validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Security helpers
export const requireAuth = async (idToken: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new FirebaseError('Invalid authentication token', 'auth/invalid-token');
  }
};

export const requireRole = async (idToken: string, roles: string[]) => {
  const decodedToken = await requireAuth(idToken);
  if (!roles.includes(decodedToken.role)) {
    throw new FirebaseError('Insufficient permissions', 'auth/insufficient-permissions');
  }
  return decodedToken;
};

// Pagination helpers
export interface PaginationOptions {
  page: number;
  limit: number;
}

export const applyPagination = (query: FirebaseFirestore.Query, options: PaginationOptions) => {
  const { page, limit } = options;
  const offset = (page - 1) * limit;
  
  return query
    .limit(limit)
    .offset(offset);
};

// Search helpers
export const createSearchQuery = (searchTerm: string, fields: string[]) => {
  const terms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
  
  return terms.map(term => 
    fields.map(field => 
      `${field} >= '${term}' AND ${field} <= '${term}\uf8ff'`
    ).join(' OR ')
  ).join(' AND ');
};

// Rate limiting helpers
export const rateLimit = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimit.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
};

// Logging
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  },
  debug: (message: string, data?: any) => {
    console.debug(`[DEBUG] ${message}`, data || '');
  },
};