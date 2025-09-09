import { db } from '../config/firebase';
import { ApiResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export interface ApiKey {
  id: string;
  keyHash: string;
  name: string;
  userId: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  usage: {
    totalRequests: number;
    requestsToday: number;
    lastResetDate: string;
  };
}

export interface ApiKeyUsage {
  keyId: string;
  endpoint: string;
  method: string;
  timestamp: string;
  responseTime: number;
  statusCode: number;
  ipAddress?: string;
}

class ApiKeyService {
  private readonly collection = 'apiKeys';
  private readonly usageCollection = 'apiKeyUsage';

  // Generate new API key
  async generateApiKey(params: {
    userId: string;
    name: string;
    permissions?: string[];
    rateLimit?: { requestsPerMinute: number; requestsPerDay: number };
    expiresAt?: string;
  }): Promise<{ apiKey: string; keyData: ApiKey }> {
    const rawKey = `bgs_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const keyData: ApiKey = {
      id: uuidv4(),
      keyHash,
      name: params.name,
      userId: params.userId,
      permissions: params.permissions || ['rates:read', 'shipments:create', 'tracking:read'],
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: params.expiresAt,
      rateLimit: params.rateLimit || {
        requestsPerMinute: 60,
        requestsPerDay: 1000
      },
      usage: {
        totalRequests: 0,
        requestsToday: 0,
        lastResetDate: new Date().toISOString().split('T')[0]
      }
    };

    await db.collection(this.collection).doc(keyData.id).set(keyData);

    return { apiKey: rawKey, keyData };
  }

  // Validate API key
  async validateApiKey(rawKey: string): Promise<ApiKey | null> {
    try {
      const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
      
      const snapshot = await db.collection(this.collection)
        .where('keyHash', '==', keyHash)
        .where('isActive', '==', true)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const keyData = snapshot.docs[0].data() as ApiKey;

      // Check if key has expired
      if (keyData.expiresAt && new Date(keyData.expiresAt) < new Date()) {
        await this.deactivateApiKey(keyData.id);
        return null;
      }

      return keyData;
    } catch (error) {
      console.error('API key validation error:', error);
      return null;
    }
  }

  // Check rate limits
  async checkRateLimit(keyData: ApiKey): Promise<{ allowed: boolean; resetTime?: number }> {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Reset daily counter if it's a new day
      if (keyData.usage.lastResetDate !== today) {
        await this.resetDailyUsage(keyData.id);
        keyData.usage.requestsToday = 0;
        keyData.usage.lastResetDate = today;
      }

      // Check daily limit
      if (keyData.usage.requestsToday >= keyData.rateLimit.requestsPerDay) {
        const resetTime = new Date(today);
        resetTime.setDate(resetTime.getDate() + 1);
        return { allowed: false, resetTime: resetTime.getTime() };
      }

      // Check minute limit (simplified - in production, use Redis or similar)
      const minuteAgo = new Date(now.getTime() - 60000);
      const recentUsage = await db.collection(this.usageCollection)
        .where('keyId', '==', keyData.id)
        .where('timestamp', '>=', minuteAgo.toISOString())
        .get();

      if (recentUsage.size >= keyData.rateLimit.requestsPerMinute) {
        return { allowed: false, resetTime: now.getTime() + 60000 };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { allowed: false };
    }
  }

  // Record API usage
  async recordUsage(keyData: ApiKey, usage: Omit<ApiKeyUsage, 'keyId'>): Promise<void> {
    try {
      const usageRecord: ApiKeyUsage = {
        keyId: keyData.id,
        ...usage
      };

      // Record usage
      await db.collection(this.usageCollection).add(usageRecord);

      // Update key usage stats
      await db.collection(this.collection).doc(keyData.id).update({
        'usage.totalRequests': keyData.usage.totalRequests + 1,
        'usage.requestsToday': keyData.usage.requestsToday + 1,
        lastUsedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Usage recording error:', error);
    }
  }

  // Get API keys for user
  async getUserApiKeys(userId: string): Promise<ApiKey[]> {
    try {
      const snapshot = await db.collection(this.collection)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as ApiKey);
    } catch (error) {
      console.error('Get user API keys error:', error);
      return [];
    }
  }

  // Deactivate API key
  async deactivateApiKey(keyId: string): Promise<void> {
    try {
      await db.collection(this.collection).doc(keyId).update({
        isActive: false,
        deactivatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Deactivate API key error:', error);
      throw error;
    }
  }

  // Reset daily usage
  private async resetDailyUsage(keyId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      await db.collection(this.collection).doc(keyId).update({
        'usage.requestsToday': 0,
        'usage.lastResetDate': today
      });
    } catch (error) {
      console.error('Reset daily usage error:', error);
    }
  }

  // Get API key analytics
  async getApiKeyAnalytics(keyId: string, days: number = 30): Promise<{
    totalRequests: number;
    requestsByDay: Array<{ date: string; count: number }>;
    requestsByEndpoint: Array<{ endpoint: string; count: number }>;
    averageResponseTime: number;
    errorRate: number;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const snapshot = await db.collection(this.usageCollection)
        .where('keyId', '==', keyId)
        .where('timestamp', '>=', startDate.toISOString())
        .get();

      const usage = snapshot.docs.map(doc => doc.data() as ApiKeyUsage);

      // Calculate metrics
      const totalRequests = usage.length;
      const requestsByDay = this.groupRequestsByDay(usage);
      const requestsByEndpoint = this.groupRequestsByEndpoint(usage);
      const averageResponseTime = usage.reduce((sum, u) => sum + u.responseTime, 0) / totalRequests || 0;
      const errorRequests = usage.filter(u => u.statusCode >= 400).length;
      const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;

      return {
        totalRequests,
        requestsByDay,
        requestsByEndpoint,
        averageResponseTime: Math.round(averageResponseTime),
        errorRate: Math.round(errorRate * 100) / 100
      };
    } catch (error) {
      console.error('API key analytics error:', error);
      return {
        totalRequests: 0,
        requestsByDay: [],
        requestsByEndpoint: [],
        averageResponseTime: 0,
        errorRate: 0
      };
    }
  }

  private groupRequestsByDay(usage: ApiKeyUsage[]): Array<{ date: string; count: number }> {
    const groups: { [date: string]: number } = {};
    
    usage.forEach(u => {
      const date = u.timestamp.split('T')[0];
      groups[date] = (groups[date] || 0) + 1;
    });

    return Object.entries(groups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private groupRequestsByEndpoint(usage: ApiKeyUsage[]): Array<{ endpoint: string; count: number }> {
    const groups: { [endpoint: string]: number } = {};
    
    usage.forEach(u => {
      const endpoint = `${u.method} ${u.endpoint}`;
      groups[endpoint] = (groups[endpoint] || 0) + 1;
    });

    return Object.entries(groups)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Check permission
  hasPermission(keyData: ApiKey, permission: string): boolean {
    return keyData.permissions.includes(permission) || keyData.permissions.includes('*');
  }
}

export const apiKeyService = new ApiKeyService();
