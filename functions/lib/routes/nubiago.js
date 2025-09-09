"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipmentService_1 = require("../services/shipmentService");
const carrierService_1 = require("../services/carrierService");
const validation_1 = require("../middleware/validation");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
// POST /api/nubiago/quote - Get shipping quotes for NubiaGo
router.post('/quote', (0, validation_1.validateRequest)(schemas_1.nubiagoQuoteSchema), async (req, res) => {
    try {
        const { origin, destination, weight, dimensions, declaredValue, priority } = req.body;
        const result = await shipmentService_1.ShipmentService.findMatchingCarriers({
            originAddress: origin,
            destinationAddress: destination,
            packageWeight: weight,
            packageDimensions: dimensions,
            declaredValue,
            priority,
        });
        if (result.success) {
            // Format response for NubiaGo
            const carriers = result.data.map(match => ({
                id: match.carrier.id,
                companyName: match.carrier.companyName,
                price: match.estimatedCost,
                estimatedDays: match.estimatedDays,
                rating: match.carrier.rating,
                transportMode: match.carrier.transportModes[0], // Use first transport mode
                score: match.score,
            }));
            res.json({
                success: true,
                data: {
                    carriers,
                    totalQuotes: carriers.length,
                    request: {
                        origin,
                        destination,
                        weight,
                        priority,
                    },
                },
            });
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        console.error('NubiaGo quote error:', error);
        res.status(500).json({
            success: false,
            error: 'Quote generation failed',
            message: 'Failed to generate shipping quotes',
        });
    }
});
// POST /api/nubiago/shipment - Create shipment from NubiaGo
router.post('/shipment', (0, validation_1.validateRequest)(schemas_1.nubiagoShipmentSchema), async (req, res) => {
    try {
        const { orderId, carrierId, origin, destination, weight, dimensions, declaredValue, customerInfo } = req.body;
        // Verify carrier exists
        const carrierResult = await carrierService_1.CarrierService.getCarrierById(carrierId);
        if (!carrierResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Invalid carrier',
                message: 'Selected carrier does not exist',
            });
        }
        // Create shipment
        const shipmentData = {
            clientId: 'nubiago-system', // Special client ID for NubiaGo
            carrierId,
            originAddress: origin,
            destinationAddress: destination,
            packageWeight: weight,
            packageDimensions: dimensions,
            declaredValue,
            nubiagoOrderId: orderId,
        };
        const result = await shipmentService_1.ShipmentService.createShipment(shipmentData);
        if (result.success) {
            res.status(201).json({
                success: true,
                data: {
                    shipmentId: result.data.id,
                    trackingNumber: result.data.trackingNumber,
                    estimatedDelivery: result.data.estimatedDelivery,
                    totalCost: result.data.totalCost,
                    currency: result.data.currency,
                    orderId,
                },
                message: 'Shipment created successfully',
            });
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        console.error('NubiaGo shipment creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Shipment creation failed',
            message: 'Failed to create shipment from NubiaGo',
        });
    }
});
// GET /api/nubiago/tracking/:trackingNumber - Get tracking for NubiaGo
router.get('/tracking/:trackingNumber', (0, validation_1.validateParams)({ trackingNumber: 'string' }), async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        const shipmentResult = await shipmentService_1.ShipmentService.getShipmentByTrackingNumber(trackingNumber);
        if (!shipmentResult.success) {
            return res.status(404).json({
                success: false,
                error: 'Shipment not found',
                message: 'No shipment found with this tracking number',
            });
        }
        const trackingResult = await shipmentService_1.ShipmentService.getTrackingHistory(shipmentResult.data.id);
        // Format response for NubiaGo
        const shipment = shipmentResult.data;
        const tracking = trackingResult.success ? trackingResult.data : [];
        res.json({
            success: true,
            data: {
                orderId: shipment.nubiagoOrderId,
                trackingNumber: shipment.trackingNumber,
                status: shipment.status,
                origin: shipment.originAddress,
                destination: shipment.destinationAddress,
                estimatedDelivery: shipment.estimatedDelivery,
                actualDelivery: shipment.actualDelivery,
                tracking: tracking.map(event => ({
                    status: event.status,
                    location: event.location,
                    notes: event.notes,
                    timestamp: event.createdAt,
                })),
            },
        });
    }
    catch (error) {
        console.error('NubiaGo tracking error:', error);
        res.status(500).json({
            success: false,
            error: 'Tracking retrieval failed',
            message: 'Failed to get tracking information',
        });
    }
});
// POST /api/nubiago/webhook - Handle NubiaGo webhooks
router.post('/webhook', (0, validation_1.validateRequest)({
    event: 'string',
    orderId: 'string',
    data: 'object',
}), async (req, res) => {
    try {
        const { event, orderId, data } = req.body;
        console.log('NubiaGo webhook received:', { event, orderId, data });
        // Handle different webhook events
        switch (event) {
            case 'order.cancelled':
                // Handle order cancellation
                // Find shipment by orderId and cancel it
                break;
            case 'order.updated':
                // Handle order updates
                break;
            case 'payment.completed':
                // Handle payment completion
                break;
            default:
                console.log('Unknown webhook event:', event);
        }
        res.json({
            success: true,
            message: 'Webhook processed successfully',
        });
    }
    catch (error) {
        console.error('NubiaGo webhook error:', error);
        res.status(500).json({
            success: false,
            error: 'Webhook processing failed',
            message: 'Failed to process webhook',
        });
    }
});
// GET /api/nubiago/status - Get NubiaGo integration status
router.get('/status', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                status: 'active',
                version: '1.0.0',
                lastSync: new Date().toISOString(),
                endpoints: {
                    quote: '/api/nubiago/quote',
                    shipment: '/api/nubiago/shipment',
                    tracking: '/api/nubiago/tracking/:trackingNumber',
                    webhook: '/api/nubiago/webhook',
                },
            },
        });
    }
    catch (error) {
        console.error('NubiaGo status error:', error);
        res.status(500).json({
            success: false,
            error: 'Status retrieval failed',
            message: 'Failed to get integration status',
        });
    }
});
exports.default = router;
//# sourceMappingURL=nubiago.js.map