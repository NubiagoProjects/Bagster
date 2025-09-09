import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { shipmentCreateSchema, shipmentUpdateSchema, trackingUpdateSchema } from '../validation/schemas';
import { shipmentService } from '../services/shipmentService';
import { ApiResponse, Shipment } from '../types';

const router = Router();

// Create shipment (User)
router.post('/', authenticateToken, validateRequest(shipmentCreateSchema), async (req, res) => {
  try {
    const shipmentData = req.body;
    const shipment = await shipmentService.createShipment(shipmentData);

    const response: ApiResponse<Shipment> = {
      success: true,
      data: {
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        userId: shipment.userId,
        clientId: shipment.clientId,
        carrierId: shipment.carrierId,
        supplierId: shipment.supplierId,
        originAddress: shipment.originAddress,
        destinationAddress: shipment.destinationAddress,
        packageWeight: shipment.packageWeight,
        packageDimensions: shipment.packageDimensions,
        packageDescription: shipment.packageDescription,
        declaredValue: shipment.declaredValue,
        shippingCost: shipment.shippingCost,
        insuranceCost: shipment.insuranceCost,
        totalCost: shipment.totalCost,
        currency: shipment.currency,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        actualDelivery: shipment.actualDelivery,
        nubiagoOrderId: shipment.nubiagoOrderId,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
      },
      message: 'Shipment created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create shipment',
    };
    res.status(500).json(response);
  }
});

// Get user shipments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const shipments = await shipmentService.getShipmentsByUser(req.user.uid);

    const response: ApiResponse<Shipment[]> = {
      success: true,
      data: shipments.map(shipment => ({
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        userId: shipment.userId,
        clientId: shipment.clientId,
        carrierId: shipment.carrierId,
        supplierId: shipment.supplierId,
        originAddress: shipment.originAddress,
        destinationAddress: shipment.destinationAddress,
        packageWeight: shipment.packageWeight,
        packageDimensions: shipment.packageDimensions,
        packageDescription: shipment.packageDescription,
        declaredValue: shipment.declaredValue,
        shippingCost: shipment.shippingCost,
        insuranceCost: shipment.insuranceCost,
        totalCost: shipment.totalCost,
        currency: shipment.currency,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        actualDelivery: shipment.actualDelivery,
        nubiagoOrderId: shipment.nubiagoOrderId,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
      })),
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch shipments',
    };
    res.status(500).json(response);
  }
});

// Get specific shipment
router.get('/:shipmentId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { shipmentId } = req.params;
    const shipment = await shipmentService.getShipmentById(shipmentId);

    if (!shipment) {
      const response: ApiResponse = {
        success: false,
        error: 'Shipment not found',
      };
      res.status(404).json(response);
      return;
    }

    // Check authorization
    if (shipment.userId !== req.user.uid && req.user.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      res.status(403).json(response);
      return;
    }

    const response: ApiResponse<Shipment> = {
      success: true,
      data: {
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        userId: shipment.userId,
        clientId: shipment.clientId,
        carrierId: shipment.carrierId,
        supplierId: shipment.supplierId,
        originAddress: shipment.originAddress,
        destinationAddress: shipment.destinationAddress,
        packageWeight: shipment.packageWeight,
        packageDimensions: shipment.packageDimensions,
        packageDescription: shipment.packageDescription,
        declaredValue: shipment.declaredValue,
        shippingCost: shipment.shippingCost,
        insuranceCost: shipment.insuranceCost,
        totalCost: shipment.totalCost,
        currency: shipment.currency,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        actualDelivery: shipment.actualDelivery,
        nubiagoOrderId: shipment.nubiagoOrderId,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
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

// Update shipment
router.put('/:shipmentId', authenticateToken, validateRequest(shipmentUpdateSchema), async (req, res): Promise<void> => {
  try {
    const { shipmentId } = req.params;
    const updateData = req.body;
    const shipment = await shipmentService.getShipmentById(shipmentId);

    if (!shipment) {
      const response: ApiResponse = {
        success: false,
        error: 'Shipment not found',
      };
      res.status(404).json(response);
      return;
    }

    // Check authorization
    if (shipment.userId !== req.user.uid && req.user.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      res.status(403).json(response);
      return;
    }

    const updatedShipment = await shipmentService.updateShipment(shipmentId, updateData);

    const response: ApiResponse<Shipment> = {
      success: true,
      data: {
        id: updatedShipment.id,
        trackingNumber: updatedShipment.trackingNumber,
        userId: updatedShipment.userId,
        clientId: updatedShipment.clientId,
        carrierId: updatedShipment.carrierId,
        supplierId: updatedShipment.supplierId,
        originAddress: updatedShipment.originAddress,
        destinationAddress: updatedShipment.destinationAddress,
        packageWeight: updatedShipment.packageWeight,
        packageDimensions: updatedShipment.packageDimensions,
        packageDescription: updatedShipment.packageDescription,
        declaredValue: updatedShipment.declaredValue,
        shippingCost: updatedShipment.shippingCost,
        insuranceCost: updatedShipment.insuranceCost,
        totalCost: updatedShipment.totalCost,
        currency: updatedShipment.currency,
        status: updatedShipment.status,
        estimatedDelivery: updatedShipment.estimatedDelivery,
        actualDelivery: updatedShipment.actualDelivery,
        nubiagoOrderId: updatedShipment.nubiagoOrderId,
        createdAt: updatedShipment.createdAt,
        updatedAt: updatedShipment.updatedAt,
      },
      message: 'Shipment updated successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update shipment',
    };
    res.status(500).json(response);
  }
});

// Delete shipment
router.delete('/:shipmentId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { shipmentId } = req.params;
    const shipment = await shipmentService.getShipmentById(shipmentId);

    if (!shipment) {
      const response: ApiResponse = {
        success: false,
        error: 'Shipment not found',
      };
      res.status(404).json(response);
      return;
    }

    // Check authorization
    if (shipment.userId !== req.user.uid && req.user.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      res.status(403).json(response);
      return;
    }

    await shipmentService.deleteShipment(shipmentId);

    const response: ApiResponse = {
      success: true,
      message: 'Shipment deleted successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete shipment',
    };
    res.status(500).json(response);
  }
});

// Get all shipments (Admin only)
router.get('/admin/all', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const shipments = await shipmentService.listShipments();

    const response: ApiResponse<Shipment[]> = {
      success: true,
      data: shipments.map(shipment => ({
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        userId: shipment.userId,
        clientId: shipment.clientId,
        carrierId: shipment.carrierId,
        supplierId: shipment.supplierId,
        originAddress: shipment.originAddress,
        destinationAddress: shipment.destinationAddress,
        packageWeight: shipment.packageWeight,
        packageDimensions: shipment.packageDimensions,
        packageDescription: shipment.packageDescription,
        declaredValue: shipment.declaredValue,
        shippingCost: shipment.shippingCost,
        insuranceCost: shipment.insuranceCost,
        totalCost: shipment.totalCost,
        currency: shipment.currency,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        actualDelivery: shipment.actualDelivery,
        nubiagoOrderId: shipment.nubiagoOrderId,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
      })),
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch shipments',
    };
    res.status(500).json(response);
  }
});

// Get carrier shipments (Carrier only)
router.get('/carrier/all', authenticateToken, requireRole(['carrier']), async (req, res) => {
  try {
    const shipments = await shipmentService.getShipmentsByCarrier(req.user.uid);

    const response: ApiResponse<Shipment[]> = {
      success: true,
      data: shipments.map(shipment => ({
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        userId: shipment.userId,
        clientId: shipment.clientId,
        carrierId: shipment.carrierId,
        supplierId: shipment.supplierId,
        originAddress: shipment.originAddress,
        destinationAddress: shipment.destinationAddress,
        packageWeight: shipment.packageWeight,
        packageDimensions: shipment.packageDimensions,
        packageDescription: shipment.packageDescription,
        declaredValue: shipment.declaredValue,
        shippingCost: shipment.shippingCost,
        insuranceCost: shipment.insuranceCost,
        totalCost: shipment.totalCost,
        currency: shipment.currency,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        actualDelivery: shipment.actualDelivery,
        nubiagoOrderId: shipment.nubiagoOrderId,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
      })),
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch shipments',
    };
    res.status(500).json(response);
  }
});

// Update shipment status (Carrier only)
router.put('/:shipmentId/status', authenticateToken, requireRole(['carrier']), validateRequest(trackingUpdateSchema), async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { status, notes } = req.body;

    const updatedShipment = await shipmentService.updateShipmentStatus(shipmentId, status, notes);

    const response: ApiResponse<Shipment> = {
      success: true,
      data: {
        id: updatedShipment.id,
        trackingNumber: updatedShipment.trackingNumber,
        userId: updatedShipment.userId,
        clientId: updatedShipment.clientId,
        carrierId: updatedShipment.carrierId,
        supplierId: updatedShipment.supplierId,
        originAddress: updatedShipment.originAddress,
        destinationAddress: updatedShipment.destinationAddress,
        packageWeight: updatedShipment.packageWeight,
        packageDimensions: updatedShipment.packageDimensions,
        packageDescription: updatedShipment.packageDescription,
        declaredValue: updatedShipment.declaredValue,
        shippingCost: updatedShipment.shippingCost,
        insuranceCost: updatedShipment.insuranceCost,
        totalCost: updatedShipment.totalCost,
        currency: updatedShipment.currency,
        status: updatedShipment.status,
        estimatedDelivery: updatedShipment.estimatedDelivery,
        actualDelivery: updatedShipment.actualDelivery,
        nubiagoOrderId: updatedShipment.nubiagoOrderId,
        createdAt: updatedShipment.createdAt,
        updatedAt: updatedShipment.updatedAt,
      },
      message: 'Shipment status updated successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update shipment status',
    };
    res.status(500).json(response);
  }
});

export default router;