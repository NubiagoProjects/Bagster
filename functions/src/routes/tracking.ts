import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { trackingUpdateSchema } from '../validation/schemas';
import { shipmentService } from '../services/shipmentService';
import { ApiResponse, Shipment, TrackingEvent } from '../types';

const router = Router();

// Public tracking endpoint
router.get('/:trackingNumber', async (req, res): Promise<void> => {
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

// Add tracking event (Authenticated users)
router.post('/:shipmentId/events', authenticateToken, validateRequest(trackingUpdateSchema), async (req, res): Promise<void> => {
  try {
    const { shipmentId } = req.params;
    const { status, notes, location } = req.body;

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
    if (shipment.userId !== req.user.uid && shipment.carrierId !== req.user.uid && req.user.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      res.status(403).json(response);
      return;
    }

    const trackingEvent = await shipmentService.addTrackingEvent(shipmentId, {
      status,
      notes,
      location,
      createdBy: req.user.uid,
    });

    const response: ApiResponse<TrackingEvent> = {
      success: true,
      data: {
        id: trackingEvent.id,
        shipmentId: trackingEvent.shipmentId,
        status: trackingEvent.status,
        location: trackingEvent.location,
        notes: trackingEvent.notes,
        createdBy: trackingEvent.createdBy,
        createdAt: trackingEvent.createdAt,
      },
      message: 'Tracking event added successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to add tracking event',
    };
    res.status(500).json(response);
  }
});

// Get tracking events (Authenticated users)
router.get('/:shipmentId/events', authenticateToken, async (req, res): Promise<void> => {
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
    if (shipment.userId !== req.user.uid && shipment.carrierId !== req.user.uid && req.user.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      res.status(403).json(response);
      return;
    }

    const trackingEvents = await shipmentService.getTrackingEvents(shipmentId);

    const response: ApiResponse<TrackingEvent[]> = {
      success: true,
      data: trackingEvents.map(event => ({
        id: event.id,
        shipmentId: event.shipmentId,
        status: event.status,
        location: event.location,
        notes: event.notes,
        createdBy: event.createdBy,
        createdAt: event.createdAt,
      })),
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch tracking events',
    };
    res.status(500).json(response);
  }
});

// Update shipment status (Carrier only)
router.put('/:shipmentId/status', authenticateToken, requireRole(['carrier']), validateRequest(trackingUpdateSchema), async (req, res): Promise<void> => {
  try {
    const { shipmentId } = req.params;
    const { status, notes } = req.body;

    const shipment = await shipmentService.getShipmentById(shipmentId);

    if (!shipment) {
      const response: ApiResponse = {
        success: false,
        error: 'Shipment not found',
      };
      res.status(404).json(response);
      return;
    }

    // Check if carrier is assigned to this shipment
    if (shipment.carrierId !== req.user.uid) {
      const response: ApiResponse = {
        success: false,
        error: 'Access denied',
      };
      res.status(403).json(response);
      return;
    }

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