"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.weeklyReport = exports.dailyAnalytics = exports.onShipmentDeleted = exports.onShipmentUpdated = exports.onShipmentCreated = exports.analytics = exports.tracking = exports.shipments = exports.carriers = exports.users = exports.api = void 0;
const express_1 = __importDefault(require("express"));
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
// Middleware
const auth_1 = require("./middleware/auth");
// Routes
const users_1 = __importDefault(require("./routes/users"));
const carriers_1 = __importDefault(require("./routes/carriers"));
const shipments_1 = __importDefault(require("./routes/shipments"));
const tracking_1 = __importDefault(require("./routes/tracking"));
const analytics_1 = __importDefault(require("./routes/analytics"));
// Services
const shipmentService_1 = require("./services/shipmentService");
const app = (0, express_1.default)();
// Apply middleware
app.use(auth_1.corsMiddleware);
app.use(auth_1.requestLogger);
app.use(auth_1.securityHeaders);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, auth_1.rateLimit)(100, 15 * 60 * 1000)); // 100 requests per 15 minutes
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/users', users_1.default);
app.use('/api/carriers', carriers_1.default);
app.use('/api/shipments', shipments_1.default);
app.use('/api/tracking', tracking_1.default);
app.use('/api/analytics', analytics_1.default);
// Public tracking endpoint
app.get('/track/:trackingNumber', async (req, res) => {
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
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch shipment',
        };
        res.status(500).json(response);
    }
});
// Export the Express app as a Firebase Function
exports.api = (0, https_1.onRequest)(app);
// Individual function exports for backward compatibility
exports.users = (0, https_1.onRequest)(app);
exports.carriers = (0, https_1.onRequest)(app);
exports.shipments = (0, https_1.onRequest)(app);
exports.tracking = (0, https_1.onRequest)(app);
exports.analytics = (0, https_1.onRequest)(app);
// Firestore triggers
exports.onShipmentCreated = (0, firestore_1.onDocumentCreated)('shipments/{shipmentId}', (event) => {
    var _a;
    // Handle shipment creation
    console.log('Shipment created:', (_a = event.data) === null || _a === void 0 ? void 0 : _a.data());
});
exports.onShipmentUpdated = (0, firestore_1.onDocumentUpdated)('shipments/{shipmentId}', (event) => {
    var _a, _b;
    // Handle shipment updates
    console.log('Shipment updated:', (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data());
});
exports.onShipmentDeleted = (0, firestore_1.onDocumentDeleted)('shipments/{shipmentId}', (event) => {
    var _a;
    // Handle shipment deletion
    console.log('Shipment deleted:', (_a = event.data) === null || _a === void 0 ? void 0 : _a.data());
});
// Scheduled functions
exports.dailyAnalytics = (0, scheduler_1.onSchedule)('0 0 * * *', () => {
    // Run daily analytics
    console.log('Running daily analytics...');
});
exports.weeklyReport = (0, scheduler_1.onSchedule)('0 0 * * 0', () => {
    // Generate weekly reports
    console.log('Generating weekly report...');
});
//# sourceMappingURL=index.js.map