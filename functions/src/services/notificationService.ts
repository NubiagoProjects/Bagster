import { db } from '../config/firebase';
import { Notification, User, Shipment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class NotificationService {
  private notificationCollection = db.collection('notifications');
  private userCollection = db.collection('users');

  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: any
  ): Promise<Notification> {
    try {
      const notification: Notification = {
        id: uuidv4(),
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date() as any,
      };

      await this.notificationCollection.doc(notification.id).set(notification);

      // Send notification based on user preferences
      await this.sendNotification(userId, notification);

      return notification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    try {
      const snapshot = await this.notificationCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Notification);
    } catch (error) {
      throw new Error(`Failed to get user notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.notificationCollection.doc(notificationId).update({
        isRead: true,
      });
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const snapshot = await this.notificationCollection
        .where('userId', '==', userId)
        .where('isRead', '==', false)
        .get();

      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
      });

      await batch.commit();
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await this.notificationCollection.doc(notificationId).delete();
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const snapshot = await this.notificationCollection
        .where('userId', '==', userId)
        .where('isRead', '==', false)
        .get();

      return snapshot.size;
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Specific notification types
  async notifyShipmentUpdate(shipment: Shipment, status: string, notes?: string): Promise<void> {
    try {
      const title = `Shipment ${shipment.trackingNumber} Updated`;
      const message = `Your shipment status has been updated to: ${status}${notes ? `. ${notes}` : ''}`;

      await this.createNotification(
        shipment.userId,
        'shipment_update',
        title,
        message,
        {
          shipmentId: shipment.id,
          trackingNumber: shipment.trackingNumber,
          status,
          notes,
        }
      );

      // Also notify carrier if assigned
      if (shipment.carrierId && shipment.carrierId !== shipment.userId) {
        await this.createNotification(
          shipment.carrierId,
          'shipment_update',
          `Shipment ${shipment.trackingNumber} Status Update`,
          `Shipment status updated to: ${status}`,
          {
            shipmentId: shipment.id,
            trackingNumber: shipment.trackingNumber,
            status,
          }
        );
      }
    } catch (error) {
      console.error('Failed to send shipment update notification:', error);
    }
  }

  async notifyCarrierConfirmation(shipment: Shipment, carrierId: string): Promise<void> {
    try {
      // Notify shipper
      await this.createNotification(
        shipment.userId,
        'carrier_confirmation',
        'Carrier Confirmed',
        `A carrier has been assigned to your shipment ${shipment.trackingNumber}`,
        {
          shipmentId: shipment.id,
          trackingNumber: shipment.trackingNumber,
          carrierId,
        }
      );

      // Notify carrier
      await this.createNotification(
        carrierId,
        'carrier_confirmation',
        'New Shipment Assignment',
        `You have been assigned to shipment ${shipment.trackingNumber}`,
        {
          shipmentId: shipment.id,
          trackingNumber: shipment.trackingNumber,
        }
      );
    } catch (error) {
      console.error('Failed to send carrier confirmation notification:', error);
    }
  }

  async notifyPaymentReceived(shipment: Shipment, amount: number, currency: string): Promise<void> {
    try {
      await this.createNotification(
        shipment.userId,
        'payment_received',
        'Payment Confirmed',
        `Payment of ${amount} ${currency} has been received for shipment ${shipment.trackingNumber}`,
        {
          shipmentId: shipment.id,
          trackingNumber: shipment.trackingNumber,
          amount,
          currency,
        }
      );
    } catch (error) {
      console.error('Failed to send payment notification:', error);
    }
  }

  async notifySystemAlert(userId: string, title: string, message: string, data?: any): Promise<void> {
    try {
      await this.createNotification(
        userId,
        'system_alert',
        title,
        message,
        data
      );
    } catch (error) {
      console.error('Failed to send system alert:', error);
    }
  }

  private async sendNotification(userId: string, notification: Notification): Promise<void> {
    try {
      // Get user preferences
      const userDoc = await this.userCollection.doc(userId).get();
      if (!userDoc.exists) {
        return;
      }

      const user = userDoc.data() as User;
      const preferences = user.preferences;

      if (!preferences) {
        return;
      }

      // Send email notification
      if (preferences.notifications.email) {
        await this.sendEmailNotification(user, notification);
      }

      // Send SMS notification
      if (preferences.notifications.sms && user.phone) {
        await this.sendSMSNotification(user, notification);
      }

      // Send push notification
      if (preferences.notifications.push) {
        await this.sendPushNotification(user, notification);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  private async sendEmailNotification(user: User, notification: Notification): Promise<void> {
    try {
      // In production, integrate with email service (SendGrid, AWS SES, etc.)
      console.log(`Sending email to ${user.email}:`, {
        subject: notification.title,
        body: notification.message,
      });

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  private async sendSMSNotification(user: User, notification: Notification): Promise<void> {
    try {
      // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
      console.log(`Sending SMS to ${user.phone}:`, {
        message: `${notification.title}: ${notification.message}`,
      });

      // Simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    }
  }

  private async sendPushNotification(user: User, notification: Notification): Promise<void> {
    try {
      // In production, integrate with push notification service (FCM, APNs, etc.)
      console.log(`Sending push notification to user ${user.id}:`, {
        title: notification.title,
        body: notification.message,
        data: notification.data,
      });

      // Simulate push notification sending
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  }

  // Bulk notification methods
  async notifyAllUsers(title: string, message: string, data?: any): Promise<void> {
    try {
      const usersSnapshot = await this.userCollection.where('isActive', '==', true).get();
      
      const batch = db.batch();
      usersSnapshot.docs.forEach(userDoc => {
        const notificationId = uuidv4();
        const notification: Notification = {
          id: notificationId,
          userId: userDoc.id,
          type: 'system_alert',
          title,
          message,
          data,
          isRead: false,
          createdAt: new Date() as any,
        };

        batch.set(this.notificationCollection.doc(notificationId), notification);
      });

      await batch.commit();
    } catch (error) {
      throw new Error(`Failed to notify all users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async notifyUsersByType(userType: string, title: string, message: string, data?: any): Promise<void> {
    try {
      const usersSnapshot = await this.userCollection
        .where('userType', '==', userType)
        .where('isActive', '==', true)
        .get();
      
      const batch = db.batch();
      usersSnapshot.docs.forEach(userDoc => {
        const notificationId = uuidv4();
        const notification: Notification = {
          id: notificationId,
          userId: userDoc.id,
          type: 'system_alert',
          title,
          message,
          data,
          isRead: false,
          createdAt: new Date() as any,
        };

        batch.set(this.notificationCollection.doc(notificationId), notification);
      });

      await batch.commit();
    } catch (error) {
      throw new Error(`Failed to notify users by type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const notificationService = new NotificationService();
