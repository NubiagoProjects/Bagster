"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Platform Analytics (Admin only)
router.get('/platform', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        // Mock platform analytics data
        const analytics = {
            totalUsers: 1250,
            totalCarriers: 89,
            totalShipments: 3420,
            totalRevenue: 1250000,
            activeShipments: 156,
            averageRating: 4.2,
            onTimeDeliveryRate: 94.5,
            period: 'monthly',
            date: new Date(),
        };
        const response = {
            success: true,
            data: analytics,
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch platform analytics',
        };
        res.status(500).json(response);
    }
});
// Carrier Analytics (Carrier only)
router.get('/carrier', auth_1.authenticateToken, (0, auth_1.requireRole)(['carrier']), async (req, res) => {
    try {
        // Mock carrier analytics data
        const analytics = {
            carrierId: req.user.uid,
            totalShipments: 45,
            completedShipments: 38,
            cancelledShipments: 2,
            totalRevenue: 12500,
            averageRating: 4.5,
            onTimeDeliveryRate: 96.2,
            averageDeliveryTime: 3.2,
            activeShipments: 5,
            period: 'monthly',
            date: new Date(),
        };
        const response = {
            success: true,
            data: analytics,
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch carrier analytics',
        };
        res.status(500).json(response);
    }
});
// User Analytics (All authenticated users)
router.get('/user', auth_1.authenticateToken, async (req, res) => {
    try {
        // Mock user analytics data
        const analytics = {
            totalShipments: 12,
            completedShipments: 10,
            cancelledShipments: 1,
            totalSpent: 2500,
            averageRating: 4.3,
            period: 'monthly',
            date: new Date(),
        };
        const response = {
            success: true,
            data: analytics,
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch user analytics',
        };
        res.status(500).json(response);
    }
});
// Shipment Analytics (Admin only)
router.get('/shipments', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        // Mock shipment analytics data
        const analytics = {
            totalShipments: 3420,
            pendingShipments: 156,
            inTransitShipments: 89,
            deliveredShipments: 3120,
            cancelledShipments: 55,
            averageDeliveryTime: 4.2,
            onTimeDeliveryRate: 94.5,
            totalRevenue: 1250000,
            period: 'monthly',
            date: new Date(),
        };
        const response = {
            success: true,
            data: analytics,
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch shipment analytics',
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=analytics.js.map