import { db } from '../config/firebase';
import { PlatformAnalytics, CarrierAnalytics, Shipment, User, Carrier } from '../types';

export class AnalyticsService {
  private shipmentCollection = db.collection('shipments');
  private userCollection = db.collection('users');
  private carrierCollection = db.collection('carriers');
  private analyticsCollection = db.collection('analytics');

  async getPlatformAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<PlatformAnalytics> {
    try {
      const dateRange = this.getDateRange(period);
      
      // Get total users
      const usersSnapshot = await this.userCollection.where('isActive', '==', true).get();
      const totalUsers = usersSnapshot.size;

      // Get total carriers
      const carriersSnapshot = await this.carrierCollection.where('isActive', '==', true).get();
      const totalCarriers = carriersSnapshot.size;

      // Get shipments in period
      const shipmentsSnapshot = await this.shipmentCollection
        .where('createdAt', '>=', dateRange.start)
        .where('createdAt', '<=', dateRange.end)
        .get();

      const shipments = shipmentsSnapshot.docs.map(doc => doc.data() as Shipment);
      const totalShipments = shipments.length;

      // Calculate revenue
      const totalRevenue = shipments.reduce((sum, shipment) => sum + (shipment.totalCost || 0), 0);

      // Get active shipments
      const activeShipmentsSnapshot = await this.shipmentCollection
        .where('status', 'in', ['confirmed', 'picked_up', 'in_transit', 'customs', 'out_for_delivery'])
        .get();
      const activeShipments = activeShipmentsSnapshot.size;

      // Calculate average rating (mock data for now)
      const averageRating = 4.3;

      // Calculate on-time delivery rate
      const deliveredShipments = shipments.filter(s => s.status === 'delivered');
      const onTimeDeliveries = deliveredShipments.filter(s => 
        s.actualDelivery && s.estimatedDelivery && 
        s.actualDelivery <= s.estimatedDelivery
      );
      const onTimeDeliveryRate = deliveredShipments.length > 0 
        ? (onTimeDeliveries.length / deliveredShipments.length) * 100 
        : 0;

      const analytics: PlatformAnalytics = {
        totalUsers,
        totalCarriers,
        totalShipments,
        totalRevenue,
        activeShipments,
        averageRating,
        onTimeDeliveryRate,
        period,
        date: new Date() as any,
      };

      // Cache analytics
      await this.cacheAnalytics('platform', period, analytics);

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get platform analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCarrierAnalytics(carrierId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<CarrierAnalytics> {
    try {
      const dateRange = this.getDateRange(period);

      // Get carrier shipments in period
      const shipmentsSnapshot = await this.shipmentCollection
        .where('carrierId', '==', carrierId)
        .where('createdAt', '>=', dateRange.start)
        .where('createdAt', '<=', dateRange.end)
        .get();

      const shipments = shipmentsSnapshot.docs.map(doc => doc.data() as Shipment);
      const totalShipments = shipments.length;

      // Calculate completed and cancelled shipments
      const completedShipments = shipments.filter(s => s.status === 'delivered').length;
      const cancelledShipments = shipments.filter(s => s.status === 'cancelled').length;

      // Calculate revenue
      const totalRevenue = shipments.reduce((sum, shipment) => sum + (shipment.shippingCost || 0), 0);

      // Get active shipments
      const activeShipmentsSnapshot = await this.shipmentCollection
        .where('carrierId', '==', carrierId)
        .where('status', 'in', ['confirmed', 'picked_up', 'in_transit', 'customs', 'out_for_delivery'])
        .get();
      const activeShipments = activeShipmentsSnapshot.size;

      // Calculate average rating (mock for now)
      const averageRating = 4.5;

      // Calculate on-time delivery rate
      const deliveredShipments = shipments.filter(s => s.status === 'delivered');
      const onTimeDeliveries = deliveredShipments.filter(s => 
        s.actualDelivery && s.estimatedDelivery && 
        s.actualDelivery <= s.estimatedDelivery
      );
      const onTimeDeliveryRate = deliveredShipments.length > 0 
        ? (onTimeDeliveries.length / deliveredShipments.length) * 100 
        : 0;

      // Calculate average delivery time
      const deliveryTimes = deliveredShipments
        .filter(s => s.actualDelivery && s.createdAt)
        .map(s => {
          const created = s.createdAt as any;
          const delivered = s.actualDelivery as any;
          return (delivered.toDate().getTime() - created.toDate().getTime()) / (1000 * 60 * 60 * 24);
        });

      const averageDeliveryTime = deliveryTimes.length > 0 
        ? deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length 
        : 0;

      const analytics: CarrierAnalytics = {
        carrierId,
        totalShipments,
        completedShipments,
        cancelledShipments,
        totalRevenue,
        averageRating,
        onTimeDeliveryRate,
        averageDeliveryTime,
        activeShipments,
        period,
        date: new Date() as any,
      };

      // Cache analytics
      await this.cacheAnalytics(`carrier_${carrierId}`, period, analytics);

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get carrier analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getShipmentTrends(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<any[]> {
    try {
      const dateRange = this.getDateRange(period);
      const intervals = this.getIntervals(period, dateRange);

      const trends = await Promise.all(
        intervals.map(async (interval) => {
          const snapshot = await this.shipmentCollection
            .where('createdAt', '>=', interval.start)
            .where('createdAt', '<', interval.end)
            .get();

          return {
            date: interval.start,
            count: snapshot.size,
            period: interval.label,
          };
        })
      );

      return trends;
    } catch (error) {
      throw new Error(`Failed to get shipment trends: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRevenueTrends(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<any[]> {
    try {
      const dateRange = this.getDateRange(period);
      const intervals = this.getIntervals(period, dateRange);

      const trends = await Promise.all(
        intervals.map(async (interval) => {
          const snapshot = await this.shipmentCollection
            .where('createdAt', '>=', interval.start)
            .where('createdAt', '<', interval.end)
            .get();

          const revenue = snapshot.docs.reduce((sum, doc) => {
            const shipment = doc.data() as Shipment;
            return sum + (shipment.totalCost || 0);
          }, 0);

          return {
            date: interval.start,
            revenue,
            period: interval.label,
          };
        })
      );

      return trends;
    } catch (error) {
      throw new Error(`Failed to get revenue trends: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTopCarriers(limit: number = 10): Promise<any[]> {
    try {
      // Get all carriers with their shipment counts
      const carriersSnapshot = await this.carrierCollection.where('isActive', '==', true).get();
      
      const carrierStats = await Promise.all(
        carriersSnapshot.docs.map(async (carrierDoc) => {
          const carrier = carrierDoc.data() as Carrier;
          
          // Get shipment count for this carrier
          const shipmentsSnapshot = await this.shipmentCollection
            .where('carrierId', '==', carrierDoc.id)
            .get();

          const shipments = shipmentsSnapshot.docs.map(doc => doc.data() as Shipment);
          const totalShipments = shipments.length;
          const completedShipments = shipments.filter(s => s.status === 'delivered').length;
          const totalRevenue = shipments.reduce((sum, s) => sum + (s.shippingCost || 0), 0);

          return {
            id: carrierDoc.id,
            name: carrier.name,
            companyName: carrier.companyName,
            totalShipments,
            completedShipments,
            totalRevenue,
            rating: carrier.rating,
          };
        })
      );

      // Sort by total shipments and return top carriers
      return carrierStats
        .sort((a, b) => b.totalShipments - a.totalShipments)
        .slice(0, limit);
    } catch (error) {
      throw new Error(`Failed to get top carriers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getShipmentStatusDistribution(): Promise<any[]> {
    try {
      const snapshot = await this.shipmentCollection.get();
      const shipments = snapshot.docs.map(doc => doc.data() as Shipment);

      const statusCounts = shipments.reduce((acc, shipment) => {
        acc[shipment.status] = (acc[shipment.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: (count / shipments.length) * 100,
      }));
    } catch (error) {
      throw new Error(`Failed to get shipment status distribution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getDateRange(period: string): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date();

    switch (period) {
      case 'daily':
        start.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        start.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { start, end: now };
  }

  private getIntervals(period: string, dateRange: { start: Date; end: Date }): any[] {
    const intervals = [];
    const current = new Date(dateRange.start);

    while (current < dateRange.end) {
      const intervalStart = new Date(current);
      const intervalEnd = new Date(current);

      switch (period) {
        case 'daily':
          intervalEnd.setHours(23, 59, 59, 999);
          current.setDate(current.getDate() + 1);
          break;
        case 'weekly':
          intervalEnd.setDate(intervalEnd.getDate() + 6);
          current.setDate(current.getDate() + 7);
          break;
        case 'monthly':
          intervalEnd.setMonth(intervalEnd.getMonth() + 1);
          intervalEnd.setDate(0);
          current.setMonth(current.getMonth() + 1);
          break;
        case 'yearly':
          intervalEnd.setFullYear(intervalEnd.getFullYear() + 1);
          intervalEnd.setDate(0);
          current.setFullYear(current.getFullYear() + 1);
          break;
      }

      intervals.push({
        start: intervalStart,
        end: intervalEnd,
        label: intervalStart.toISOString().split('T')[0],
      });
    }

    return intervals;
  }

  private async cacheAnalytics(key: string, period: string, data: any): Promise<void> {
    try {
      const cacheKey = `${key}_${period}`;
      await this.analyticsCollection.doc(cacheKey).set({
        ...data,
        cachedAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to cache analytics:', error);
    }
  }

  async getCachedAnalytics(key: string, period: string): Promise<any | null> {
    try {
      const cacheKey = `${key}_${period}`;
      const doc = await this.analyticsCollection.doc(cacheKey).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      const cachedAt = data?.cachedAt?.toDate();
      const now = new Date();
      
      // Cache is valid for 1 hour
      if (cachedAt && (now.getTime() - cachedAt.getTime()) < 3600000) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Failed to get cached analytics:', error);
      return null;
    }
  }
}

export const analyticsService = new AnalyticsService();
