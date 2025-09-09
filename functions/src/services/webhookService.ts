import { db } from '../config/firebase';
import * as crypto from 'crypto';

export interface WebhookSubscription {
  id: string;
  user_id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  created_at: Date;
  last_delivery?: Date;
  failure_count: number;
  max_retries: number;
}

export interface WebhookEvent {
  id: string;
  event_type: string;
  data: any;
  timestamp: Date;
  subscription_id: string;
  delivery_attempts: number;
  delivered: boolean;
  last_attempt?: Date;
  next_retry?: Date;
}

export interface WebhookDelivery {
  id: string;
  event_id: string;
  subscription_id: string;
  url: string;
  status_code?: number;
  response_body?: string;
  error_message?: string;
  delivered_at?: Date;
  attempt_number: number;
}

export class WebhookService {
  private static instance: WebhookService;

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  /**
   * Create a new webhook subscription
   */
  async createSubscription(
    userId: string,
    url: string,
    events: string[],
    options: {
      secret?: string;
      maxRetries?: number;
    } = {}
  ): Promise<WebhookSubscription> {
    const subscriptionId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const secret = options.secret || this.generateSecret();

    const subscription: WebhookSubscription = {
      id: subscriptionId,
      user_id: userId,
      url,
      events,
      secret,
      active: true,
      created_at: new Date(),
      failure_count: 0,
      max_retries: options.maxRetries || 3
    };

    await db.collection('webhook_subscriptions').doc(subscriptionId).set(subscription);
    return subscription;
  }

  /**
   * Get user's webhook subscriptions
   */
  async getUserSubscriptions(userId: string): Promise<WebhookSubscription[]> {
    const snapshot = await db.collection('webhook_subscriptions')
      .where('user_id', '==', userId)
      .where('active', '==', true)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WebhookSubscription));
  }

  /**
   * Update webhook subscription
   */
  async updateSubscription(
    subscriptionId: string,
    updates: Partial<WebhookSubscription>
  ): Promise<void> {
    await db.collection('webhook_subscriptions').doc(subscriptionId).update(updates);
  }

  /**
   * Delete webhook subscription
   */
  async deleteSubscription(subscriptionId: string): Promise<void> {
    await db.collection('webhook_subscriptions').doc(subscriptionId).update({
      active: false,
      deleted_at: new Date()
    });
  }

  /**
   * Trigger webhook event
   */
  async triggerEvent(
    eventType: string,
    data: any,
    userId?: string
  ): Promise<void> {
    try {
      // Get all active subscriptions for this event type
      let query = db.collection('webhook_subscriptions')
        .where('active', '==', true)
        .where('events', 'array-contains', eventType);

      if (userId) {
        query = query.where('user_id', '==', userId);
      }

      const snapshot = await query.get();
      const subscriptions = snapshot.docs.map(doc => 
        ({ id: doc.id, ...doc.data() } as WebhookSubscription)
      );

      // Create webhook events for each subscription
      const eventPromises = subscriptions.map(subscription => 
        this.createWebhookEvent(eventType, data, subscription)
      );

      await Promise.all(eventPromises);
    } catch (error) {
      console.error('Error triggering webhook event:', error);
    }
  }

  /**
   * Create and queue webhook event
   */
  private async createWebhookEvent(
    eventType: string,
    data: any,
    subscription: WebhookSubscription
  ): Promise<void> {
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const event: WebhookEvent = {
      id: eventId,
      event_type: eventType,
      data,
      timestamp: new Date(),
      subscription_id: subscription.id,
      delivery_attempts: 0,
      delivered: false
    };

    await db.collection('webhook_events').doc(eventId).set(event);

    // Queue for immediate delivery
    await this.deliverWebhook(event, subscription);
  }

  /**
   * Deliver webhook to endpoint
   */
  private async deliverWebhook(
    event: WebhookEvent,
    subscription: WebhookSubscription
  ): Promise<void> {
    const deliveryId = `delivery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const payload = {
        id: event.id,
        event: event.event_type,
        data: event.data,
        timestamp: event.timestamp.toISOString(),
        subscription_id: subscription.id
      };

      const signature = this.generateSignature(JSON.stringify(payload), subscription.secret);
      
      const response = await fetch(subscription.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bagster-Signature': signature,
          'X-Bagster-Event': event.event_type,
          'X-Bagster-Delivery': deliveryId,
          'User-Agent': 'Bagster-Webhooks/1.0'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      const responseBody = await response.text();

      // Record delivery attempt
      const delivery: WebhookDelivery = {
        id: deliveryId,
        event_id: event.id,
        subscription_id: subscription.id,
        url: subscription.url,
        status_code: response.status,
        response_body: responseBody.substring(0, 1000), // Limit response body size
        attempt_number: event.delivery_attempts + 1,
        delivered_at: new Date()
      };

      if (response.ok) {
        // Success
        delivery.delivered_at = new Date();
        await this.markEventDelivered(event.id);
        await this.resetFailureCount(subscription.id);
      } else {
        // HTTP error
        delivery.error_message = `HTTP ${response.status}: ${response.statusText}`;
        await this.handleDeliveryFailure(event, subscription);
      }

      await db.collection('webhook_deliveries').doc(deliveryId).set(delivery);

    } catch (error) {
      // Network or other error
      const delivery: WebhookDelivery = {
        id: deliveryId,
        event_id: event.id,
        subscription_id: subscription.id,
        url: subscription.url,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        attempt_number: event.delivery_attempts + 1
      };

      await db.collection('webhook_deliveries').doc(deliveryId).set(delivery);
      await this.handleDeliveryFailure(event, subscription);
    }
  }

  /**
   * Handle webhook delivery failure
   */
  private async handleDeliveryFailure(
    event: WebhookEvent,
    subscription: WebhookSubscription
  ): Promise<void> {
    const newAttemptCount = event.delivery_attempts + 1;
    
    if (newAttemptCount >= subscription.max_retries) {
      // Max retries reached, mark as failed
      await db.collection('webhook_events').doc(event.id).update({
        delivery_attempts: newAttemptCount,
        delivered: false,
        last_attempt: new Date()
      });

      // Increment subscription failure count
      await this.incrementFailureCount(subscription.id);
    } else {
      // Schedule retry with exponential backoff
      const retryDelay = Math.pow(2, newAttemptCount) * 60000; // 2^n minutes
      const nextRetry = new Date(Date.now() + retryDelay);

      await db.collection('webhook_events').doc(event.id).update({
        delivery_attempts: newAttemptCount,
        last_attempt: new Date(),
        next_retry: nextRetry
      });

      // Schedule retry (in a real implementation, use a job queue)
      setTimeout(() => {
        this.retryWebhook(event.id);
      }, retryDelay);
    }
  }

  /**
   * Retry webhook delivery
   */
  private async retryWebhook(eventId: string): Promise<void> {
    try {
      const eventDoc = await db.collection('webhook_events').doc(eventId).get();
      const subscriptionDoc = await db.collection('webhook_subscriptions')
        .doc(eventDoc.data()?.subscription_id).get();

      if (eventDoc.exists && subscriptionDoc.exists) {
        const event = { id: eventDoc.id, ...eventDoc.data() } as WebhookEvent;
        const subscription = { id: subscriptionDoc.id, ...subscriptionDoc.data() } as WebhookSubscription;

        if (!event.delivered && subscription.active) {
          await this.deliverWebhook(event, subscription);
        }
      }
    } catch (error) {
      console.error('Error retrying webhook:', error);
    }
  }

  /**
   * Mark event as delivered
   */
  private async markEventDelivered(eventId: string): Promise<void> {
    await db.collection('webhook_events').doc(eventId).update({
      delivered: true,
      delivered_at: new Date()
    });
  }

  /**
   * Increment subscription failure count
   */
  private async incrementFailureCount(subscriptionId: string): Promise<void> {
    const doc = await db.collection('webhook_subscriptions').doc(subscriptionId).get();
    const currentCount = doc.data()?.failure_count || 0;
    
    await db.collection('webhook_subscriptions').doc(subscriptionId).update({
      failure_count: currentCount + 1,
      last_failure: new Date()
    });

    // Disable subscription if too many failures
    if (currentCount + 1 >= 10) {
      await this.updateSubscription(subscriptionId, { active: false });
    }
  }

  /**
   * Reset subscription failure count
   */
  private async resetFailureCount(subscriptionId: string): Promise<void> {
    await db.collection('webhook_subscriptions').doc(subscriptionId).update({
      failure_count: 0,
      last_delivery: new Date()
    });
  }

  /**
   * Generate webhook secret
   */
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate webhook signature
   */
  private generateSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Get webhook delivery statistics
   */
  async getDeliveryStats(subscriptionId: string, days: number = 7): Promise<{
    total_deliveries: number;
    successful_deliveries: number;
    failed_deliveries: number;
    success_rate: number;
    avg_response_time: number;
  }> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    
    const snapshot = await db.collection('webhook_deliveries')
      .where('subscription_id', '==', subscriptionId)
      .where('delivered_at', '>=', startDate)
      .get();

    const deliveries = snapshot.docs.map(doc => doc.data());
    const total = deliveries.length;
    const successful = deliveries.filter(d => d.status_code && d.status_code >= 200 && d.status_code < 300).length;
    const failed = total - successful;

    return {
      total_deliveries: total,
      successful_deliveries: successful,
      failed_deliveries: failed,
      success_rate: total > 0 ? (successful / total) * 100 : 0,
      avg_response_time: 0 // Would need to track response times
    };
  }

  /**
   * Process pending webhook retries
   */
  async processPendingRetries(): Promise<void> {
    const now = new Date();
    
    const snapshot = await db.collection('webhook_events')
      .where('delivered', '==', false)
      .where('next_retry', '<=', now)
      .limit(100)
      .get();

    const retryPromises = snapshot.docs.map(doc => 
      this.retryWebhook(doc.id)
    );

    await Promise.all(retryPromises);
  }

  /**
   * Clean up old webhook events and deliveries
   */
  async cleanupOldData(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000));
    
    // Clean up old events
    const eventsSnapshot = await db.collection('webhook_events')
      .where('timestamp', '<', cutoffDate)
      .limit(500)
      .get();

    const eventDeletePromises = eventsSnapshot.docs.map(doc => doc.ref.delete());
    
    // Clean up old deliveries
    const deliveriesSnapshot = await db.collection('webhook_deliveries')
      .where('delivered_at', '<', cutoffDate)
      .limit(500)
      .get();

    const deliveryDeletePromises = deliveriesSnapshot.docs.map(doc => doc.ref.delete());
    
    await Promise.all([...eventDeletePromises, ...deliveryDeletePromises]);
  }
}

export const webhookService = WebhookService.getInstance();
