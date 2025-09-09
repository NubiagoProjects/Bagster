import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { paymentService } from '../services/paymentService';
import { shipmentService } from '../services/shipmentService';
import { notificationService } from '../services/notificationService';
import { ApiResponse, PaymentIntent } from '../types';

const router = Router();

// Create payment intent
router.post('/intent', authenticateToken, async (req, res) => {
  try {
    const { shipmentId, amount, currency = 'USD' } = req.body;

    if (!shipmentId || !amount) {
      const response: ApiResponse = {
        success: false,
        error: 'Shipment ID and amount are required',
      };
      return res.status(400).json(response);
    }

    // Verify shipment exists and user has access
    const shipment = await shipmentService.getShipmentById(shipmentId);
    if (!shipment) {
      const response: ApiResponse = {
        success: false,
        error: 'Shipment not found',
      };
      return res.status(404).json(response);
    }

    if (shipment.userId !== req.user.uid && req.user.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      return res.status(403).json(response);
    }

    const paymentIntent = await paymentService.createPaymentIntent(shipmentId, amount, currency);

    const response: ApiResponse<PaymentIntent> = {
      success: true,
      data: paymentIntent,
      message: 'Payment intent created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create payment intent',
    };
    res.status(500).json(response);
  }
});

// Process payment
router.post('/:paymentId/process', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { paymentMethod, paymentData } = req.body;

    if (!paymentMethod || !paymentData) {
      const response: ApiResponse = {
        success: false,
        error: 'Payment method and payment data are required',
      };
      return res.status(400).json(response);
    }

    const payment = await paymentService.getPaymentIntent(paymentId);
    if (!payment) {
      const response: ApiResponse = {
        success: false,
        error: 'Payment intent not found',
      };
      return res.status(404).json(response);
    }

    // Verify user has access to this payment
    const shipment = await shipmentService.getShipmentById(payment.shipmentId);
    if (!shipment || (shipment.userId !== req.user.uid && req.user.role !== 'admin')) {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      return res.status(403).json(response);
    }

    const processedPayment = await paymentService.processPayment(paymentId, paymentMethod, paymentData);

    // Send notification if payment successful
    if (processedPayment.status === 'completed') {
      await notificationService.notifyPaymentReceived(shipment, processedPayment.amount, processedPayment.currency);
    }

    const response: ApiResponse<PaymentIntent> = {
      success: true,
      data: processedPayment,
      message: processedPayment.status === 'completed' ? 'Payment processed successfully' : 'Payment failed',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to process payment',
    };
    res.status(500).json(response);
  }
});

// Get payment details
router.get('/:paymentId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentService.getPaymentIntent(paymentId);

    if (!payment) {
      const response: ApiResponse = {
        success: false,
        error: 'Payment not found',
      };
      res.status(404).json(response);
      return;
    }

    // Verify user has access
    const shipment = await shipmentService.getShipmentById(payment.shipmentId);
    if (!shipment || (shipment.userId !== req.user.uid && req.user.role !== 'admin')) {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      res.status(403).json(response);
      return;
    }

    const response: ApiResponse<PaymentIntent> = {
      success: true,
      data: payment,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get payment details',
    };
    res.status(500).json(response);
  }
});

// Get payments for a shipment
router.get('/shipment/:shipmentId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { shipmentId } = req.params;

    // Verify shipment exists and user has access
    const shipment = await shipmentService.getShipmentById(shipmentId);
    if (!shipment) {
      const response: ApiResponse = {
        success: false,
        error: 'Shipment not found',
      };
      res.status(404).json(response);
      return;
    }

    if (shipment.userId !== req.user.uid && req.user.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      res.status(403).json(response);
      return;
    }

    const payments = await paymentService.getPaymentsByShipment(shipmentId);

    const response: ApiResponse<PaymentIntent[]> = {
      success: true,
      data: payments,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get shipment payments',
    };
    res.status(500).json(response);
  }
});

// Refund payment (Admin only)
router.post('/:paymentId/refund', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const refundedPayment = await paymentService.refundPayment(paymentId, reason);

    const response: ApiResponse<PaymentIntent> = {
      success: true,
      data: refundedPayment,
      message: 'Payment refunded successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to refund payment',
    };
    res.status(500).json(response);
  }
});

// Calculate shipping cost
router.post('/calculate-shipping', authenticateToken, async (req, res) => {
  try {
    const { weight, distance, transportMode, priority = 'standard' } = req.body;

    if (!weight || !distance || !transportMode) {
      const response: ApiResponse = {
        success: false,
        error: 'Weight, distance, and transport mode are required',
      };
      return res.status(400).json(response);
    }

    const shippingCost = await paymentService.calculateShippingCost(weight, distance, transportMode, priority);

    const response: ApiResponse<{ shippingCost: number }> = {
      success: true,
      data: { shippingCost },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to calculate shipping cost',
    };
    res.status(500).json(response);
  }
});

// Calculate insurance cost
router.post('/calculate-insurance', authenticateToken, async (req, res) => {
  try {
    const { declaredValue, transportMode } = req.body;

    if (!declaredValue || !transportMode) {
      const response: ApiResponse = {
        success: false,
        error: 'Declared value and transport mode are required',
      };
      return res.status(400).json(response);
    }

    const insuranceCost = await paymentService.calculateInsuranceCost(declaredValue, transportMode);

    const response: ApiResponse<{ insuranceCost: number }> = {
      success: true,
      data: { insuranceCost },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to calculate insurance cost',
    };
    res.status(500).json(response);
  }
});

export default router;
