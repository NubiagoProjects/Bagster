"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const schemas_1 = require("../validation/schemas");
const shipmentService_1 = require("../services/shipmentService");
const router = (0, express_1.Router)();
// Create shipment (User)
router.post('/', auth_1.authenticateToken, (0, validation_1.validateRequest)(schemas_1.shipmentCreateSchema), async (req, res) => {
    try {
        const shipmentData = req.body;
        const shipment = await shipmentService_1.shipmentService.createShipment(shipmentData);
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
            message: 'Shipment created successfully',
        };
        res.status(201).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to create shipment',
        };
        res.status(500).json(response);
    }
});
// Get user shipments
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const shipments = await shipmentService_1.shipmentService.getShipmentsByUser(req.user.uid);
        const response = {
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
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch shipments',
        };
        res.status(500).json(response);
    }
});
// Get specific shipment
router.get('/:shipmentId', auth_1.authenticateToken, async (req, res) => {
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
        if (shipment.userId !== req.user.uid && req.user.role !== 'admin') {
            const response = {
                success: false,
                error: 'Access denied',
            };
            res.status(403).json(response);
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
// Update shipment
router.put('/:shipmentId', auth_1.authenticateToken, (0, validation_1.validateRequest)(schemas_1.shipmentUpdateSchema), async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const updateData = req.body;
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
        if (shipment.userId !== req.user.uid && req.user.role !== 'admin') {
            const response = {
                success: false,
                error: 'Access denied',
            };
            res.status(403).json(response);
            return;
        }
        const updatedShipment = await shipmentService_1.shipmentService.updateShipment(shipmentId, updateData);
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
            message: 'Shipment updated successfully',
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to update shipment',
        };
        res.status(500).json(response);
    }
});
// Delete shipment
router.delete('/:shipmentId', auth_1.authenticateToken, async (req, res) => {
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
        if (shipment.userId !== req.user.uid && req.user.role !== 'admin') {
            const response = {
                success: false,
                error: 'Access denied',
            };
            res.status(403).json(response);
            return;
        }
        await shipmentService_1.shipmentService.deleteShipment(shipmentId);
        const response = {
            success: true,
            message: 'Shipment deleted successfully',
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to delete shipment',
        };
        res.status(500).json(response);
    }
});
// Get all shipments (Admin only)
router.get('/admin/all', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const shipments = await shipmentService_1.shipmentService.listShipments();
        const response = {
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
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch shipments',
        };
        res.status(500).json(response);
    }
});
// Get carrier shipments (Carrier only)
router.get('/carrier/all', auth_1.authenticateToken, (0, auth_1.requireRole)(['carrier']), async (req, res) => {
    try {
        const shipments = await shipmentService_1.shipmentService.getShipmentsByCarrier(req.user.uid);
        const response = {
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
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch shipments',
        };
        res.status(500).json(response);
    }
});
// Update shipment status (Carrier only)
router.put('/:shipmentId/status', auth_1.authenticateToken, (0, auth_1.requireRole)(['carrier']), (0, validation_1.validateRequest)(schemas_1.trackingUpdateSchema), async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const { status, notes } = req.body;
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
//# sourceMappingURL=shipments.js.map