"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carrierService = exports.CarrierService = void 0;
const firebase_1 = require("../config/firebase");
class CarrierService {
    constructor() {
        this.carriersCollection = firebase_1.db.collection('carriers');
        this.routesCollection = firebase_1.db.collection('carrierRoutes');
    }
    async createCarrier(carrierData) {
        try {
            const carrierRef = await this.carriersCollection.add(Object.assign(Object.assign({}, carrierData), { createdAt: new Date(), updatedAt: new Date(), isActive: true, isVerified: false }));
            const carrier = await carrierRef.get();
            return Object.assign({ id: carrierRef.id }, carrier.data());
        }
        catch (error) {
            throw new Error(`Failed to create carrier: ${error}`);
        }
    }
    async getCarrierById(carrierId) {
        try {
            const carrierDoc = await this.carriersCollection.doc(carrierId).get();
            if (!carrierDoc.exists) {
                return null;
            }
            return Object.assign({ id: carrierDoc.id }, carrierDoc.data());
        }
        catch (error) {
            throw new Error(`Failed to get carrier: ${error}`);
        }
    }
    async updateCarrier(carrierId, updateData) {
        try {
            await this.carriersCollection.doc(carrierId).update(Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }));
            const updatedCarrier = await this.getCarrierById(carrierId);
            if (!updatedCarrier) {
                throw new Error('Carrier not found after update');
            }
            return updatedCarrier;
        }
        catch (error) {
            throw new Error(`Failed to update carrier: ${error}`);
        }
    }
    async deleteCarrier(carrierId) {
        try {
            await this.carriersCollection.doc(carrierId).delete();
        }
        catch (error) {
            throw new Error(`Failed to delete carrier: ${error}`);
        }
    }
    async listCarriers(limit = 50) {
        try {
            const query = await this.carriersCollection.limit(limit).get();
            return query.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            throw new Error(`Failed to list carriers: ${error}`);
        }
    }
    async verifyCarrier(carrierId) {
        try {
            await this.carriersCollection.doc(carrierId).update({
                isVerified: true,
                updatedAt: new Date()
            });
            const verifiedCarrier = await this.getCarrierById(carrierId);
            if (!verifiedCarrier) {
                throw new Error('Carrier not found after verification');
            }
            return verifiedCarrier;
        }
        catch (error) {
            throw new Error(`Failed to verify carrier: ${error}`);
        }
    }
    // Carrier Routes
    async createRoute(routeData) {
        try {
            const routeRef = await this.routesCollection.add(Object.assign(Object.assign({}, routeData), { createdAt: new Date(), updatedAt: new Date(), isActive: true }));
            const route = await routeRef.get();
            return Object.assign({ id: routeRef.id }, route.data());
        }
        catch (error) {
            throw new Error(`Failed to create route: ${error}`);
        }
    }
    async getRoutesByCarrier(carrierId) {
        try {
            const query = await this.routesCollection.where('carrierId', '==', carrierId).get();
            return query.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            throw new Error(`Failed to get carrier routes: ${error}`);
        }
    }
    async updateRoute(routeId, updateData) {
        try {
            await this.routesCollection.doc(routeId).update(Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }));
            const routeDoc = await this.routesCollection.doc(routeId).get();
            return Object.assign({ id: routeDoc.id }, routeDoc.data());
        }
        catch (error) {
            throw new Error(`Failed to update route: ${error}`);
        }
    }
    async deleteRoute(routeId) {
        try {
            await this.routesCollection.doc(routeId).delete();
        }
        catch (error) {
            throw new Error(`Failed to delete route: ${error}`);
        }
    }
    // Analytics
    async getCarrierAnalytics(carrierId) {
        try {
            // Mock analytics data - in production, this would calculate from actual data
            const analytics = {
                carrierId,
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
            return analytics;
        }
        catch (error) {
            throw new Error(`Failed to get carrier analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.CarrierService = CarrierService;
exports.carrierService = new CarrierService();
//# sourceMappingURL=carrierService.js.map