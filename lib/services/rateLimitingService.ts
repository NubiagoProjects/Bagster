import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  deleteDoc 
} from 'firebase/firestore';
import { loggingService } from './loggingService';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

export interface RateLimitEntry {
  key: string;
  count: number;
  resetTime: Date;
  createdAt: Date;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

class RateLimitingService {
  private defaultConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  };

  // Check rate limit for a given key
  public async checkRateLimit(
    key: string,
    config: Partial<RateLimitConfig> = {}
  ): Promise<RateLimitResult> {
    try {
      const finalConfig = { ...this.defaultConfig, ...config };
      const now = new Date();
      const windowStart = new Date(now.getTime() - finalConfig.windowMs);

      // Get or create rate limit entry
      const rateLimitRef = doc(db, 'rate_limits', key);
      const rateLimitDoc = await getDoc(rateLimitRef);

      let entry: RateLimitEntry;

      if (!rateLimitDoc.exists()) {
        // Create new entry
        entry = {
          key,
          count: 1,
          resetTime: new Date(now.getTime() + finalConfig.windowMs),
          createdAt: now
        };

        await setDoc(rateLimitRef, {
          ...entry,
          resetTime: serverTimestamp(),
          createdAt: serverTimestamp()
        });

        return {
          allowed: true,
          remaining: finalConfig.maxRequests - 1,
          resetTime: entry.resetTime
        };
      }

      entry = rateLimitDoc.data() as RateLimitEntry;

      // Check if window has expired
      if (entry.resetTime <= now) {
        // Reset the window
        entry = {
          key,
          count: 1,
          resetTime: new Date(now.getTime() + finalConfig.windowMs),
          createdAt: entry.createdAt
        };

        await updateDoc(rateLimitRef, {
          count: entry.count,
          resetTime: serverTimestamp()
        });

        return {
          allowed: true,
          remaining: finalConfig.maxRequests - 1,
          resetTime: entry.resetTime
        };
      }

      // Check if limit exceeded
      if (entry.count >= finalConfig.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime.getTime() - now.getTime()) / 1000);
        
        await loggingService.warn('Rate limit exceeded', {
          service: 'RateLimitingService',
          metadata: {
            key,
            count: entry.count,
            maxRequests: finalConfig.maxRequests,
            retryAfter
          }
        });

        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.resetTime,
          retryAfter
        };
      }

      // Increment counter
      const newCount = entry.count + 1;
      await updateDoc(rateLimitRef, {
        count: newCount
      });

      return {
        allowed: true,
        remaining: finalConfig.maxRequests - newCount,
        resetTime: entry.resetTime
      };
    } catch (error) {
      await loggingService.error('Rate limit check failed', {
        service: 'RateLimitingService',
        metadata: { key }
      }, error as Error);

      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        remaining: 0,
        resetTime: new Date()
      };
    }
  }

  // Generate rate limit key for API requests
  public generateApiKey(
    apiKey: string,
    endpoint: string,
    method: string
  ): string {
    return `api:${apiKey}:${method}:${endpoint}`;
  }

  // Generate rate limit key for user actions
  public generateUserKey(
    userId: string,
    action: string
  ): string {
    return `user:${userId}:${action}`;
  }

  // Generate rate limit key for IP addresses
  public generateIpKey(
    ip: string,
    endpoint?: string
  ): string {
    return endpoint ? `ip:${ip}:${endpoint}` : `ip:${ip}`;
  }

  // Predefined rate limit configurations
  public static readonly configs = {
    // API rate limits
    api: {
      default: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 1000
      },
      strict: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
      },
      premium: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5000
      }
    },

    // User action rate limits
    user: {
      shipmentCreation: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 50
      },
      paymentAttempts: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5
      },
      passwordReset: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 3
      },
      loginAttempts: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 10
      }
    },

    // IP-based rate limits
    ip: {
      registration: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 10
      },
      general: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 1000
      }
    }
  };

  // Check API rate limit
  public async checkApiRateLimit(
    apiKey: string,
    endpoint: string,
    method: string,
    tier: 'default' | 'strict' | 'premium' = 'default'
  ): Promise<RateLimitResult> {
    const key = this.generateApiKey(apiKey, endpoint, method);
    const config = RateLimitingService.configs.api[tier];
    return this.checkRateLimit(key, config);
  }

  // Check user action rate limit
  public async checkUserRateLimit(
    userId: string,
    action: 'shipmentCreation' | 'paymentAttempts' | 'passwordReset' | 'loginAttempts'
  ): Promise<RateLimitResult> {
    const key = this.generateUserKey(userId, action);
    const config = RateLimitingService.configs.user[action];
    return this.checkRateLimit(key, config);
  }

  // Check IP rate limit
  public async checkIpRateLimit(
    ip: string,
    action: 'registration' | 'general',
    endpoint?: string
  ): Promise<RateLimitResult> {
    const key = this.generateIpKey(ip, endpoint);
    const config = RateLimitingService.configs.ip[action];
    return this.checkRateLimit(key, config);
  }

  // Reset rate limit for a key
  public async resetRateLimit(key: string): Promise<void> {
    try {
      const rateLimitRef = doc(db, 'rate_limits', key);
      await deleteDoc(rateLimitRef);
      
      await loggingService.info('Rate limit reset', {
        service: 'RateLimitingService',
        metadata: { key }
      });
    } catch (error) {
      await loggingService.error('Failed to reset rate limit', {
        service: 'RateLimitingService',
        metadata: { key }
      }, error as Error);
    }
  }

  // Get rate limit statistics
  public async getRateLimitStats(
    keyPattern?: string
  ): Promise<{
    totalEntries: number;
    activeEntries: number;
    topLimitedKeys: Array<{ key: string; count: number; resetTime: Date }>;
  }> {
    try {
      let rateLimitsQuery = query(collection(db, 'rate_limits'));

      if (keyPattern) {
        // Simple pattern matching - in production, you might want more sophisticated filtering
        rateLimitsQuery = query(rateLimitsQuery, where('key', '>=', keyPattern));
      }

      const snapshot = await getDocs(rateLimitsQuery);
      const now = new Date();

      const entries = snapshot.docs.map(doc => doc.data() as RateLimitEntry);
      const activeEntries = entries.filter(entry => entry.resetTime > now);

      const topLimitedKeys = entries
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(entry => ({
          key: entry.key,
          count: entry.count,
          resetTime: entry.resetTime
        }));

      return {
        totalEntries: entries.length,
        activeEntries: activeEntries.length,
        topLimitedKeys
      };
    } catch (error) {
      await loggingService.error('Failed to get rate limit stats', {
        service: 'RateLimitingService'
      }, error as Error);

      return {
        totalEntries: 0,
        activeEntries: 0,
        topLimitedKeys: []
      };
    }
  }

  // Cleanup expired rate limit entries
  public async cleanupExpiredEntries(): Promise<number> {
    try {
      const now = new Date();
      const rateLimitsQuery = query(
        collection(db, 'rate_limits'),
        where('resetTime', '<=', now)
      );

      const snapshot = await getDocs(rateLimitsQuery);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      
      await Promise.all(deletePromises);

      await loggingService.info(`Cleaned up ${snapshot.size} expired rate limit entries`, {
        service: 'RateLimitingService',
        metadata: { count: snapshot.size }
      });

      return snapshot.size;
    } catch (error) {
      await loggingService.error('Failed to cleanup expired rate limit entries', {
        service: 'RateLimitingService'
      }, error as Error);

      return 0;
    }
  }

  // Express.js middleware factory
  public createExpressMiddleware(config: Partial<RateLimitConfig> = {}) {
    return async (req: any, res: any, next: any) => {
      try {
        // Generate key based on API key, user ID, or IP
        let key: string;
        
        if (req.headers['x-api-key']) {
          key = this.generateApiKey(
            req.headers['x-api-key'],
            req.path,
            req.method
          );
        } else if (req.user?.id) {
          key = this.generateUserKey(req.user.id, 'general');
        } else {
          const ip = req.ip || req.connection.remoteAddress || 'unknown';
          key = this.generateIpKey(ip, req.path);
        }

        const result = await this.checkRateLimit(key, config);

        // Set rate limit headers
        res.set({
          'X-RateLimit-Limit': config.maxRequests || this.defaultConfig.maxRequests,
          'X-RateLimit-Remaining': result.remaining,
          'X-RateLimit-Reset': Math.ceil(result.resetTime.getTime() / 1000)
        });

        if (!result.allowed) {
          if (result.retryAfter) {
            res.set('Retry-After', result.retryAfter);
          }
          
          return res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: result.retryAfter
          });
        }

        next();
      } catch (error) {
        await loggingService.error('Rate limiting middleware error', {
          service: 'RateLimitingService',
          metadata: {
            path: req.path,
            method: req.method,
            ip: req.ip
          }
        }, error as Error);

        // Fail open - allow request if middleware fails
        next();
      }
    };
  }

  // Next.js API route wrapper
  public withRateLimit(
    handler: (req: any, res: any) => Promise<any>,
    config: Partial<RateLimitConfig> = {}
  ) {
    return async (req: any, res: any) => {
      const middleware = this.createExpressMiddleware(config);
      
      return new Promise((resolve, reject) => {
        middleware(req, res, (error: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(handler(req, res));
          }
        });
      });
    };
  }
}

export const rateLimitingService = new RateLimitingService();
export default rateLimitingService;
