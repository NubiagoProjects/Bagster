import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { shipmentService } from './services/shipmentService';
import { ApiResponse } from './types';

// Import routes
import userRoutes from './routes/users';
import carrierRoutes from './routes/carriers';
import shipmentRoutes from './routes/shipments';
import trackingRoutes from './routes/tracking';
import analyticsRoutes from './routes/analytics';
import paymentRoutes from './routes/payments';
import notificationRoutes from './routes/notifications';
import apiRoutes from './routes/api';
import apiManagementRoutes from './routes/apiManagement';

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/carriers', carrierRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Public API routes for ecommerce integration
app.use('/api', apiRoutes);

// API management routes (authenticated)
app.use('/api', apiManagementRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Bagster API',
    version: '1.0.0',
    description: 'Smart cargo logistics platform for Africa',
    endpoints: {
      users: '/api/users',
      carriers: '/api/carriers',
      shipments: '/api/shipments',
      tracking: '/api/tracking',
      analytics: '/api/analytics',
      payments: '/api/payments',
      notifications: '/api/notifications',
    },
    documentation: 'https://docs.bagster.com',
  });
});

// Public tracking endpoint (no auth required)
app.get('/track/:trackingNumber', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { trackingNumber } = req.params;
    const shipment = await shipmentService.getShipmentByTrackingNumber(trackingNumber);

    if (!shipment) {
      const response: ApiResponse = {
        success: false,
        error: 'Shipment not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: {
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        userId: shipment.userId,
        originAddress: shipment.originAddress,
        destinationAddress: shipment.destinationAddress,
        packageWeight: shipment.packageWeight,
        declaredValue: shipment.declaredValue,
        status: shipment.status,
        totalCost: shipment.totalCost,
        currency: shipment.currency,
        createdAt: shipment.createdAt,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch shipment',
    };
    res.status(500).json(response);
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

export const api = functions.https.onRequest(app);