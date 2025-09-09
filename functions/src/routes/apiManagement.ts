import express from 'express';
import { auth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { apiKeyService } from '../services/apiKeyService';
import { ApiResponse } from '../types';
import Joi from 'joi';

const router = express.Router();

// API Key creation schema
const createApiKeySchema = Joi.object({
  name: Joi.string().required().min(3).max(50).description('API key name'),
  permissions: Joi.array().items(Joi.string()).optional().description('API permissions'),
  rateLimit: Joi.object({
    requestsPerMinute: Joi.number().min(1).max(1000).default(60),
    requestsPerDay: Joi.number().min(1).max(10000).default(1000)
  }).optional(),
  expiresAt: Joi.string().isoDate().optional().description('Expiration date')
});

/**
 * POST /api/keys
 * Create a new API key
 */
router.post('/keys',
  auth,
  validateRequest({ body: createApiKeySchema }),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { name, permissions, rateLimit, expiresAt } = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User authentication required'
        };
        res.status(401).json(response);
        return;
      }

      const { apiKey, keyData } = await apiKeyService.generateApiKey({
        userId,
        name,
        permissions,
        rateLimit,
        expiresAt
      });

      const response: ApiResponse = {
        success: true,
        data: {
          id: keyData.id,
          name: keyData.name,
          apiKey: apiKey, // Only shown once during creation
          permissions: keyData.permissions,
          rateLimit: keyData.rateLimit,
          createdAt: keyData.createdAt,
          expiresAt: keyData.expiresAt
        }
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('API key creation error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create API key'
      };
      res.status(500).json(response);
    }
  }
);

/**
 * GET /api/keys
 * Get user's API keys
 */
router.get('/keys',
  auth,
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const userId = req.user?.uid;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User authentication required'
        };
        res.status(401).json(response);
        return;
      }

      const apiKeys = await apiKeyService.getUserApiKeys(userId);

      const response: ApiResponse = {
        success: true,
        data: {
          apiKeys: apiKeys.map(key => ({
            id: key.id,
            name: key.name,
            permissions: key.permissions,
            isActive: key.isActive,
            createdAt: key.createdAt,
            lastUsedAt: key.lastUsedAt,
            expiresAt: key.expiresAt,
            rateLimit: key.rateLimit,
            usage: key.usage
          }))
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Get API keys error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch API keys'
      };
      res.status(500).json(response);
    }
  }
);

/**
 * DELETE /api/keys/:keyId
 * Deactivate an API key
 */
router.delete('/keys/:keyId',
  auth,
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { keyId } = req.params;
      const userId = req.user?.uid;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User authentication required'
        };
        res.status(401).json(response);
        return;
      }

      // Verify ownership
      const userKeys = await apiKeyService.getUserApiKeys(userId);
      const keyExists = userKeys.some(key => key.id === keyId);

      if (!keyExists) {
        const response: ApiResponse = {
          success: false,
          error: 'API key not found or access denied'
        };
        res.status(404).json(response);
        return;
      }

      await apiKeyService.deactivateApiKey(keyId);

      const response: ApiResponse = {
        success: true,
        message: 'API key deactivated successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('API key deactivation error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to deactivate API key'
      };
      res.status(500).json(response);
    }
  }
);

/**
 * GET /api/keys/:keyId/analytics
 * Get API key usage analytics
 */
router.get('/keys/:keyId/analytics',
  auth,
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { keyId } = req.params;
      const { days = '30' } = req.query;
      const userId = req.user?.uid;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User authentication required'
        };
        res.status(401).json(response);
        return;
      }

      // Verify ownership
      const userKeys = await apiKeyService.getUserApiKeys(userId);
      const keyExists = userKeys.some(key => key.id === keyId);

      if (!keyExists) {
        const response: ApiResponse = {
          success: false,
          error: 'API key not found or access denied'
        };
        res.status(404).json(response);
        return;
      }

      const analytics = await apiKeyService.getApiKeyAnalytics(keyId, parseInt(days as string));

      const response: ApiResponse = {
        success: true,
        data: analytics
      };

      res.json(response);
    } catch (error) {
      console.error('API key analytics error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch analytics'
      };
      res.status(500).json(response);
    }
  }
);

/**
 * GET /api/documentation
 * Get API documentation
 */
router.get('/documentation',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const documentation = {
        version: '1.0.0',
        baseUrl: 'https://api.bagster.com',
        authentication: {
          type: 'Bearer Token',
          header: 'Authorization: Bearer YOUR_API_KEY',
          description: 'All API requests require a valid API key in the Authorization header'
        },
        endpoints: [
          {
            method: 'GET',
            path: '/api/v1/rates',
            description: 'Get shipping rates from available carriers',
            parameters: [
              { name: 'origin', type: 'string', required: true, description: 'Origin location' },
              { name: 'destination', type: 'string', required: true, description: 'Destination location' },
              { name: 'weight', type: 'number', required: true, description: 'Package weight in kg' },
              { name: 'dimensions', type: 'string', required: false, description: 'Package dimensions' },
              { name: 'transport_mode', type: 'string', required: false, description: 'Transport mode preference' }
            ],
            example: {
              request: 'GET /api/v1/rates?origin=Lagos,Nigeria&destination=Abuja,Nigeria&weight=25',
              response: {
                success: true,
                data: {
                  carriers: [
                    {
                      id: 'carrier_123',
                      name: 'Express Logistics',
                      price_per_kg: 2.50,
                      total_cost: 62.50,
                      delivery_time: '2-3 days'
                    }
                  ]
                }
              }
            }
          },
          {
            method: 'POST',
            path: '/api/v1/shipments',
            description: 'Create a new shipment',
            parameters: [
              { name: 'carrier_id', type: 'string', required: true, description: 'Selected carrier ID' },
              { name: 'origin', type: 'string', required: true, description: 'Origin location' },
              { name: 'destination', type: 'string', required: true, description: 'Destination location' },
              { name: 'weight', type: 'number', required: true, description: 'Package weight' },
              { name: 'pickup_address', type: 'string', required: true, description: 'Pickup address' },
              { name: 'delivery_address', type: 'string', required: true, description: 'Delivery address' },
              { name: 'contact_info', type: 'object', required: true, description: 'Contact information' }
            ]
          },
          {
            method: 'GET',
            path: '/api/v1/tracking/{tracking_number}',
            description: 'Get shipment tracking information',
            parameters: [
              { name: 'tracking_number', type: 'string', required: true, description: 'Tracking number' }
            ]
          },
          {
            method: 'GET',
            path: '/api/v1/carriers',
            description: 'Get available carriers',
            parameters: [
              { name: 'country', type: 'string', required: false, description: 'Filter by country' },
              { name: 'transport_mode', type: 'string', required: false, description: 'Filter by transport mode' }
            ]
          }
        ],
        rateLimits: {
          default: {
            requestsPerMinute: 60,
            requestsPerDay: 1000
          },
          premium: {
            requestsPerMinute: 300,
            requestsPerDay: 10000
          }
        },
        errorCodes: {
          400: 'Bad Request - Invalid parameters',
          401: 'Unauthorized - Invalid or missing API key',
          403: 'Forbidden - Insufficient permissions',
          404: 'Not Found - Resource not found',
          429: 'Too Many Requests - Rate limit exceeded',
          500: 'Internal Server Error - Server error'
        }
      };

      const response: ApiResponse = {
        success: true,
        data: documentation
      };

      res.json(response);
    } catch (error) {
      console.error('Documentation error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch documentation'
      };
      res.status(500).json(response);
    }
  }
);

export default router;
