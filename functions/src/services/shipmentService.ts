import { db } from '../config/firebase';
import { Shipment, TrackingEvent, ShipmentStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ShipmentService {
  private shipmentCollection = db.collection('shipments');
  private trackingCollection = db.collection('tracking_events');

  // CRUD operations
  async createShipment(shipmentData: Partial<Shipment>): Promise<Shipment> {
    try {
      const shipment: Shipment = {
        id: uuidv4(),
        trackingNumber: this.generateTrackingNumber(),
        clientId: shipmentData.clientId || '',
        carrierId: shipmentData.carrierId,
        supplierId: shipmentData.supplierId,
        userId: shipmentData.userId || '',
        originAddress: shipmentData.originAddress!,
        destinationAddress: shipmentData.destinationAddress!,
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
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };

      await this.shipmentCollection.doc(shipment.id).set(shipment);
      return shipment;
    } catch (error) {
      throw new Error(`Failed to create shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getShipmentById(shipmentId: string): Promise<Shipment | null> {
    try {
      const doc = await this.shipmentCollection.doc(shipmentId).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() } as Shipment;
    } catch (error) {
      throw new Error(`Failed to get shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    try {
      const snapshot = await this.shipmentCollection.where('trackingNumber', '==', trackingNumber).get();
      if (snapshot.empty) {
        return null;
      }
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Shipment;
    } catch (error) {
      throw new Error(`Failed to get shipment by tracking number: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateShipment(shipmentId: string, updateData: Partial<Shipment>): Promise<Shipment> {
    try {
      const updatePayload = {
        ...updateData,
        updatedAt: new Date() as any,
      };

      await this.shipmentCollection.doc(shipmentId).update(updatePayload);
      const updatedShipment = await this.getShipmentById(shipmentId);
      if (!updatedShipment) {
        throw new Error('Shipment not found after update');
      }
      return updatedShipment;
    } catch (error) {
      throw new Error(`Failed to update shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteShipment(shipmentId: string): Promise<void> {
    try {
      await this.shipmentCollection.doc(shipmentId).delete();
    } catch (error) {
      throw new Error(`Failed to delete shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listShipments(): Promise<Shipment[]> {
    try {
      const snapshot = await this.shipmentCollection.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Shipment);
    } catch (error) {
      throw new Error(`Failed to list shipments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getShipmentsByCarrier(carrierId: string): Promise<Shipment[]> {
    try {
      const snapshot = await this.shipmentCollection.where('carrierId', '==', carrierId).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Shipment);
    } catch (error) {
      throw new Error(`Failed to get shipments by carrier: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getShipmentsByUser(userId: string): Promise<Shipment[]> {
    try {
      const snapshot = await this.shipmentCollection.where('userId', '==', userId).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Shipment);
    } catch (error) {
      throw new Error(`Failed to get shipments by user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Tracking
  async addTrackingEvent(shipmentId: string, eventData: Partial<TrackingEvent>): Promise<TrackingEvent> {
    try {
      const shipment = await this.getShipmentById(shipmentId);
      if (!shipment) {
        throw new Error('Shipment not found');
      }

      const trackingEvent: TrackingEvent = {
        id: uuidv4(),
        shipmentId,
        status: eventData.status || shipment.status,
        location: eventData.location,
        notes: eventData.notes,
        createdBy: eventData.createdBy || 'system',
        createdAt: new Date() as any,
      };

      await this.trackingCollection.doc(trackingEvent.id).set(trackingEvent);

      // Update shipment status if provided
      if (eventData.status && eventData.status !== shipment.status) {
        await this.updateShipmentStatus(shipmentId, eventData.status, eventData.notes);
      }

      return trackingEvent;
    } catch (error) {
      throw new Error(`Failed to add tracking event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTrackingEvents(shipmentId: string): Promise<TrackingEvent[]> {
    try {
      const snapshot = await this.trackingCollection.where('shipmentId', '==', shipmentId).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as TrackingEvent);
    } catch (error) {
      throw new Error(`Failed to get tracking events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateShipmentStatus(shipmentId: string, status: ShipmentStatus, notes?: string): Promise<Shipment> {
    try {
      const updateData: Partial<Shipment> = {
        status,
        updatedAt: new Date() as any,
      };

      if (status === 'delivered') {
        updateData.actualDelivery = new Date() as any;
      }

      const updatedShipment = await this.updateShipment(shipmentId, updateData);

      // Add tracking event
      await this.addTrackingEvent(shipmentId, {
        status,
        notes,
        createdBy: 'system',
      });

      return updatedShipment;
    } catch (error) {
      throw new Error(`Failed to update shipment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  generateTrackingNumber(): string {
    const prefix = 'BAG';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  async getShipmentWithTracking(trackingNumber: string): Promise<{ shipment: Shipment; tracking: TrackingEvent[] }> {
    try {
      const shipment = await this.getShipmentByTrackingNumber(trackingNumber);
      if (!shipment) {
        throw new Error('Shipment not found');
      }

      const tracking = await this.getTrackingEvents(shipment.id);
      return { shipment, tracking };
    } catch (error) {
      throw new Error(`Failed to get shipment with tracking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getShipmentTimeline(trackingNumber: string): Promise<TrackingEvent[]> {
    try {
      const shipment = await this.getShipmentByTrackingNumber(trackingNumber);
      if (!shipment) {
        throw new Error('Shipment not found');
      }

      return await this.getTrackingEvents(shipment.id);
    } catch (error) {
      throw new Error(`Failed to get shipment timeline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const shipmentService = new ShipmentService();