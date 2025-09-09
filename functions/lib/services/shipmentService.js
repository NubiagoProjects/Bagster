"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentService = exports.ShipmentService = void 0;
const firebase_1 = require("../config/firebase");
const uuid_1 = require("uuid");
class ShipmentService {
    constructor() {
        this.shipmentCollection = firebase_1.db.collection('shipments');
        this.trackingCollection = firebase_1.db.collection('tracking_events');
    }
    // CRUD operations
    async createShipment(shipmentData) {
        try {
            const shipment = {
                id: (0, uuid_1.v4)(),
                trackingNumber: this.generateTrackingNumber(),
                clientId: shipmentData.clientId || '',
                carrierId: shipmentData.carrierId,
                supplierId: shipmentData.supplierId,
                userId: shipmentData.userId || '',
                originAddress: shipmentData.originAddress,
                destinationAddress: shipmentData.destinationAddress,
                packageWeight: shipmentData.packageWeight || 0,
                packageDimensions: shipmentData.packageDimensions,
                packageDescription: shipmentData.packageDescription,
                declaredValue: shipmentData.declaredValue,
                shippingCost: shipmentData.shippingCost || 0,
                insuranceCost: shipmentData.insuranceCost || 0,
                totalCost: shipmentData.totalCost || 0,
                currency: shipmentData.currency || 'USD',
                status: shipmentData.status || 'pending',
                estimatedDelivery: shipmentData.estimatedDelivery,
                actualDelivery: shipmentData.actualDelivery,
                nubiagoOrderId: shipmentData.nubiagoOrderId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await this.shipmentCollection.doc(shipment.id).set(shipment);
            return shipment;
        }
        catch (error) {
            throw new Error(`Failed to create shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getShipmentById(shipmentId) {
        try {
            const doc = await this.shipmentCollection.doc(shipmentId).get();
            if (!doc.exists) {
                return null;
            }
            return Object.assign({ id: doc.id }, doc.data());
        }
        catch (error) {
            throw new Error(`Failed to get shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getShipmentByTrackingNumber(trackingNumber) {
        try {
            const snapshot = await this.shipmentCollection.where('trackingNumber', '==', trackingNumber).get();
            if (snapshot.empty) {
                return null;
            }
            const doc = snapshot.docs[0];
            return Object.assign({ id: doc.id }, doc.data());
        }
        catch (error) {
            throw new Error(`Failed to get shipment by tracking number: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateShipment(shipmentId, updateData) {
        try {
            const updatePayload = Object.assign(Object.assign({}, updateData), { updatedAt: new Date() });
            await this.shipmentCollection.doc(shipmentId).update(updatePayload);
            const updatedShipment = await this.getShipmentById(shipmentId);
            if (!updatedShipment) {
                throw new Error('Shipment not found after update');
            }
            return updatedShipment;
        }
        catch (error) {
            throw new Error(`Failed to update shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteShipment(shipmentId) {
        try {
            await this.shipmentCollection.doc(shipmentId).delete();
        }
        catch (error) {
            throw new Error(`Failed to delete shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async listShipments() {
        try {
            const snapshot = await this.shipmentCollection.orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            throw new Error(`Failed to list shipments: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getShipmentsByCarrier(carrierId) {
        try {
            const snapshot = await this.shipmentCollection.where('carrierId', '==', carrierId).get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            throw new Error(`Failed to get shipments by carrier: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getShipmentsByUser(userId) {
        try {
            const snapshot = await this.shipmentCollection.where('userId', '==', userId).get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            throw new Error(`Failed to get shipments by user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Tracking
    async addTrackingEvent(shipmentId, eventData) {
        try {
            const shipment = await this.getShipmentById(shipmentId);
            if (!shipment) {
                throw new Error('Shipment not found');
            }
            const trackingEvent = {
                id: (0, uuid_1.v4)(),
                shipmentId,
                status: eventData.status || shipment.status,
                location: eventData.location,
                notes: eventData.notes,
                createdBy: eventData.createdBy || 'system',
                createdAt: new Date(),
            };
            await this.trackingCollection.doc(trackingEvent.id).set(trackingEvent);
            // Update shipment status if provided
            if (eventData.status && eventData.status !== shipment.status) {
                await this.updateShipmentStatus(shipmentId, eventData.status, eventData.notes);
            }
            return trackingEvent;
        }
        catch (error) {
            throw new Error(`Failed to add tracking event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getTrackingEvents(shipmentId) {
        try {
            const snapshot = await this.trackingCollection.where('shipmentId', '==', shipmentId).orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            throw new Error(`Failed to get tracking events: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateShipmentStatus(shipmentId, status, notes) {
        try {
            const updateData = {
                status,
                updatedAt: new Date(),
            };
            if (status === 'delivered') {
                updateData.actualDelivery = new Date();
            }
            const updatedShipment = await this.updateShipment(shipmentId, updateData);
            // Add tracking event
            await this.addTrackingEvent(shipmentId, {
                status,
                notes,
                createdBy: 'system',
            });
            return updatedShipment;
        }
        catch (error) {
            throw new Error(`Failed to update shipment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    generateTrackingNumber() {
        const prefix = 'BAG';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }
    async getShipmentWithTracking(trackingNumber) {
        try {
            const shipment = await this.getShipmentByTrackingNumber(trackingNumber);
            if (!shipment) {
                return null;
            }
            const tracking = await this.getTrackingEvents(shipment.id);
            return { shipment, tracking };
        }
        catch (error) {
            throw new Error(`Failed to get shipment with tracking: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.ShipmentService = ShipmentService;
exports.shipmentService = new ShipmentService();
//# sourceMappingURL=shipmentService.js.map