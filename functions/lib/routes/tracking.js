"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const schemas_1 = require("../validation/schemas");
const shipmentService_1 = require("../services/shipmentService");
const router = (0, express_1.Router)();
// Public tracking endpoint
router.get('/:trackingNumber', async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        const shipment = await shipmentService_1.shipmentService.getShipmentByTrackingNumber(trackingNumber);
        if (!shipment) {
            const response = {
                success: false,
                error: 'Shipment not found',
            };
            res.status(404).json(response);
            return;
        }
        const response = {
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
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch shipment',
        };
        res.status(500).json(response);
    }
});
// Add tracking event (Authenticated users)
router.post('/:shipmentId/events', auth_1.authenticateToken, (0, validation_1.validateRequest)(schemas_1.trackingUpdateSchema), async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const { status, notes, location } = req.body;
        const shipment = await shipmentService_1.shipmentService.getShipmentById(shipmentId);
        if (!shipment) {
            const response = {
                success: false,
                error: 'Shipment not found',
            };
            res.status(404).json(response);
            return;
        }
        // Check authorization
        if (shipment.userId !== req.user.uid && shipment.carrierId !== req.user.uid && req.user.role !== 'admin') {
            const response = {
                success: false,
                error: 'Access denied',
            };
            res.status(403).json(response);
            return;
        }
        const trackingEvent = await shipmentService_1.shipmentService.addTrackingEvent(shipmentId, {
            status,
            notes,
            location,
            createdBy: req.user.uid,
        });
        const response = {
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
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to add tracking event',
        };
        res.status(500).json(response);
    }
});
// Get tracking events (Authenticated users)
router.get('/:shipmentId/events', auth_1.authenticateToken, async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const shipment = await shipmentService_1.shipmentService.getShipmentById(shipmentId);
        if (!shipment) {
            const response = {
                success: false,
                error: 'Shipment not found',
            };
            res.status(404).json(response);
            return;
        }
        // Check authorization
        if (shipment.userId !== req.user.uid && shipment.carrierId !== req.user.uid && req.user.role !== 'admin') {
            const response = {
                success: false,
                error: 'Access denied',
            };
            res.status(403).json(response);
            return;
        }
        const trackingEvents = await shipmentService_1.shipmentService.getTrackingEvents(shipmentId);
        const response = {
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
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch tracking events',
        };
        res.status(500).json(response);
    }
});
// Update shipment status (Carrier only)
router.put('/:shipmentId/status', auth_1.authenticateToken, (0, auth_1.requireRole)(['carrier']), (0, validation_1.validateRequest)(schemas_1.trackingUpdateSchema), async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const { status, notes } = req.body;
        const shipment = await shipmentService_1.shipmentService.getShipmentById(shipmentId);
        if (!shipment) {
            const response = {
                success: false,
                error: 'Shipment not found',
            };
            res.status(404).json(response);
            return;
        }
        // Check if carrier is assigned to this shipment
        if (shipment.carrierId !== req.user.uid) {
            const response = {
                success: false,
                error: 'Access denied',
            };
            res.status(403).json(response);
            return;
        }
        const updatedShipment = await shipmentService_1.shipmentService.updateShipmentStatus(shipmentId, status, notes);
        const response = {
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
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to update shipment status',
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=tracking.js.map