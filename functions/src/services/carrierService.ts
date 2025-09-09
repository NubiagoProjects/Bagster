import { db } from '../config/firebase';
import { Carrier, CarrierRoute, CarrierAnalytics } from '../types';

export class CarrierService {
  private carriersCollection = db.collection('carriers');
  private routesCollection = db.collection('carrierRoutes');

  async createCarrier(carrierData: Partial<Carrier>): Promise<Carrier> {
    try {
      const carrierRef = await this.carriersCollection.add({
        ...carrierData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: false
      });

      const carrier = await carrierRef.get();
      return { id: carrierRef.id, ...carrier.data() } as Carrier;
    } catch (error) {
      throw new Error(`Failed to create carrier: ${error}`);
    }
  }

  async getCarrierById(carrierId: string): Promise<Carrier | null> {
    try {
      const carrierDoc = await this.carriersCollection.doc(carrierId).get();
      if (!carrierDoc.exists) {
        return null;
      }
      return { id: carrierDoc.id, ...carrierDoc.data() } as Carrier;
    } catch (error) {
      throw new Error(`Failed to get carrier: ${error}`);
    }
  }

  async updateCarrier(carrierId: string, updateData: Partial<Carrier>): Promise<Carrier> {
    try {
      await this.carriersCollection.doc(carrierId).update({
        ...updateData,
        updatedAt: new Date()
      });

      const updatedCarrier = await this.getCarrierById(carrierId);
      if (!updatedCarrier) {
        throw new Error('Carrier not found after update');
      }
      return updatedCarrier;
    } catch (error) {
      throw new Error(`Failed to update carrier: ${error}`);
    }
  }

  async deleteCarrier(carrierId: string): Promise<void> {
    try {
      await this.carriersCollection.doc(carrierId).delete();
    } catch (error) {
      throw new Error(`Failed to delete carrier: ${error}`);
    }
  }

  async listCarriers(limit = 50): Promise<Carrier[]> {
    try {
      const query = await this.carriersCollection.limit(limit).get();
      return query.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Carrier);
    } catch (error) {
      throw new Error(`Failed to list carriers: ${error}`);
    }
  }

  async getCarriers(filters?: { country?: string; transportMode?: string }): Promise<Carrier[]> {
    try {
      let query = this.carriersCollection.where('isActive', '==', true);
      
      if (filters?.country) {
        query = query.where('country', '==', filters.country);
      }
      
      if (filters?.transportMode) {
        query = query.where('transportModes', 'array-contains', filters.transportMode);
      }
      
      const result = await query.get();
      return result.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Carrier);
    } catch (error) {
      throw new Error(`Failed to get carriers: ${error}`);
    }
  }

  async findAvailableCarriers(criteria: {
    origin: string;
    destination: string;
    transportMode?: string;
    weight?: number;
    packageType?: string;
  }): Promise<Carrier[]> {
    try {
      let query = this.carriersCollection.where('isActive', '==', true).where('isVerified', '==', true);
      
      if (criteria.transportMode) {
        query = query.where('transportModes', 'array-contains', criteria.transportMode);
      }
      
      const result = await query.get();
      const carriers = result.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Carrier);
      
      // Filter carriers based on route coverage (simplified logic)
      return carriers.filter(carrier => {
        // In production, this would check actual route coverage
        // For now, return all active verified carriers
        return carrier.isActive && carrier.isVerified;
      });
    } catch (error) {
      throw new Error(`Failed to find available carriers: ${error}`);
    }
  }

  async verifyCarrier(carrierId: string): Promise<Carrier> {
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
    } catch (error) {
      throw new Error(`Failed to verify carrier: ${error}`);
    }
  }

  // Carrier Routes
  async createRoute(routeData: Partial<CarrierRoute>): Promise<CarrierRoute> {
    try {
      const routeRef = await this.routesCollection.add({
        ...routeData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });

      const route = await routeRef.get();
      return { id: routeRef.id, ...route.data() } as CarrierRoute;
    } catch (error) {
      throw new Error(`Failed to create route: ${error}`);
    }
  }

  async getRoutesByCarrier(carrierId: string): Promise<CarrierRoute[]> {
    try {
      const query = await this.routesCollection.where('carrierId', '==', carrierId).get();
      return query.docs.map(doc => ({ id: doc.id, ...doc.data() }) as CarrierRoute);
    } catch (error) {
      throw new Error(`Failed to get carrier routes: ${error}`);
    }
  }

  async updateRoute(routeId: string, updateData: Partial<CarrierRoute>): Promise<CarrierRoute> {
    try {
      await this.routesCollection.doc(routeId).update({
        ...updateData,
        updatedAt: new Date()
      });

      const routeDoc = await this.routesCollection.doc(routeId).get();
      return { id: routeDoc.id, ...routeDoc.data() } as CarrierRoute;
    } catch (error) {
      throw new Error(`Failed to update route: ${error}`);
    }
  }

  async deleteRoute(routeId: string): Promise<void> {
    try {
      await this.routesCollection.doc(routeId).delete();
    } catch (error) {
      throw new Error(`Failed to delete route: ${error}`);
    }
  }

  // Analytics
  async getCarrierAnalytics(carrierId: string): Promise<CarrierAnalytics> {
    try {
      // Mock analytics data - in production, this would calculate from actual data
      const analytics: CarrierAnalytics = {
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
        date: new Date() as any,
      };

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get carrier analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const carrierService = new CarrierService();