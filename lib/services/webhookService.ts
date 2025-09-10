import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import crypto from 'crypto';

export interface WebhookEndpoint {
  id?: string;
  userId: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  failureCount: number;
  maxRetries: number;
}

export interface WebhookEvent {
  id?: string;
  endpointId: string;
  eventType: string;
  payload: any;
  status: 'pending' | 'sent' | 'failed' | 'retry';
  attempts: number;
  lastAttempt?: Date;
  nextRetry?: Date;
  response?: {
    status: number;
    body: string;
    headers: Record<string, string>;
  };
  createdAt: Date;
}

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: any;
  signature?: string;
}

class WebhookService {
  private readonly maxRetries = 3;
  private readonly retryDelays = [1000, 5000, 15000]; // 1s, 5s, 15s

  // Register a new webhook endpoint
  public async registerWebhook(
    userId: string,
    url: string,
    events: string[],
    secret?: string
  ): Promise<string> {
    try {
      const webhookSecret = secret || this.generateSecret();
      
      const webhook: WebhookEndpoint = {
        userId,
        url,
        events,
        secret: webhookSecret,
        isActive: true,
        createdAt: new Date(),
        failureCount: 0,
        maxRetries: this.maxRetries
      };

      const docRef = await addDoc(collection(db, 'webhooks'), {
        ...webhook,
        createdAt: serverTimestamp()
      });

      console.log(`Webhook registered: ${docRef.id} for user ${userId}`);
      return docRef.id;
    } catch (error) {
      console.error('Failed to register webhook:', error);
      throw error;
    }
  }

  // Update webhook endpoint
  public async updateWebhook(
    webhookId: string,
    updates: Partial<WebhookEndpoint>
  ): Promise<void> {
    try {
      const webhookRef = doc(db, 'webhooks', webhookId);
      await updateDoc(webhookRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      console.log(`Webhook updated: ${webhookId}`);
    } catch (error) {
      console.error('Failed to update webhook:', error);
      throw error;
    }
  }

  // Deactivate webhook
  public async deactivateWebhook(webhookId: string): Promise<void> {
    try {
      await this.updateWebhook(webhookId, { 
        isActive: false 
      });
      console.log(`Webhook deactivated: ${webhookId}`);
    } catch (error) {
      console.error('Failed to deactivate webhook:', error);
      throw error;
    }
  }

  // Trigger webhook for specific event
  public async triggerWebhook(
    eventType: string,
    data: any,
    userId?: string
  ): Promise<void> {
    try {
      // Find all active webhooks that listen to this event
      let webhooksQuery = query(
        collection(db, 'webhooks'),
        where('isActive', '==', true),
        where('events', 'array-contains', eventType)
      );

      if (userId) {
        webhooksQuery = query(webhooksQuery, where('userId', '==', userId));
      }

      const webhooksSnapshot = await getDocs(webhooksQuery);
      
      if (webhooksSnapshot.empty) {
        console.log(`No active webhooks found for event: ${eventType}`);
        return;
      }

      // Create webhook events for each endpoint
      const promises = webhooksSnapshot.docs.map(async (webhookDoc) => {
        const webhook = webhookDoc.data() as WebhookEndpoint;
        webhook.id = webhookDoc.id;

        const webhookEvent: WebhookEvent = {
          endpointId: webhook.id!,
          eventType,
          payload: data,
          status: 'pending',
          attempts: 0,
          createdAt: new Date()
        };

        const eventRef = await addDoc(collection(db, 'webhook_events'), {
          ...webhookEvent,
          createdAt: serverTimestamp()
        });

        // Immediately attempt to send the webhook
        await this.sendWebhookEvent(eventRef.id, webhook, webhookEvent);
      });

      await Promise.all(promises);
      console.log(`Triggered ${promises.length} webhooks for event: ${eventType}`);
    } catch (error) {
      console.error('Failed to trigger webhooks:', error);
      throw error;
    }
  }

  // Send individual webhook event
  private async sendWebhookEvent(
    eventId: string,
    webhook: WebhookEndpoint,
    event: WebhookEvent
  ): Promise<void> {
    try {
      const payload: WebhookPayload = {
        event: event.eventType,
        timestamp: new Date().toISOString(),
        data: event.payload
      };

      // Generate signature for payload verification
      payload.signature = this.generateSignature(payload, webhook.secret);

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Bagster-Webhooks/1.0',
          'X-Bagster-Signature': payload.signature,
          'X-Bagster-Event': event.eventType,
          'X-Bagster-Delivery': eventId
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      const responseBody = await response.text();
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Update event with response
      const eventRef = doc(db, 'webhook_events', eventId);
      
      if (response.ok) {
        await updateDoc(eventRef, {
          status: 'sent',
          attempts: event.attempts + 1,
          lastAttempt: serverTimestamp(),
          response: {
            status: response.status,
            body: responseBody.substring(0, 1000), // Limit response body size
            headers: responseHeaders
          }
        });

        // Update webhook last triggered time
        const webhookRef = doc(db, 'webhooks', webhook.id!);
        await updateDoc(webhookRef, {
          lastTriggered: serverTimestamp(),
          failureCount: 0 // Reset failure count on success
        });

        console.log(`Webhook sent successfully: ${eventId} to ${webhook.url}`);
      } else {
        throw new Error(`HTTP ${response.status}: ${responseBody}`);
      }
    } catch (error) {
      await this.handleWebhookFailure(eventId, webhook, event, error);
    }
  }

  // Handle webhook delivery failure
  private async handleWebhookFailure(
    eventId: string,
    webhook: WebhookEndpoint,
    event: WebhookEvent,
    error: any
  ): Promise<void> {
    try {
      const newAttempts = event.attempts + 1;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.error(`Webhook failed (attempt ${newAttempts}): ${eventId} - ${errorMessage}`);

      // Update event status
      const eventRef = doc(db, 'webhook_events', eventId);
      
      if (newAttempts >= this.maxRetries) {
        // Max retries reached, mark as failed
        await updateDoc(eventRef, {
          status: 'failed',
          attempts: newAttempts,
          lastAttempt: serverTimestamp(),
          response: {
            status: 0,
            body: errorMessage,
            headers: {}
          }
        });

        // Update webhook failure count
        const webhookRef = doc(db, 'webhooks', webhook.id!);
        const newFailureCount = webhook.failureCount + 1;
        
        await updateDoc(webhookRef, {
          failureCount: newFailureCount
        });

        // Deactivate webhook if too many failures
        if (newFailureCount >= 10) {
          await updateDoc(webhookRef, {
            isActive: false,
            deactivatedReason: 'Too many consecutive failures'
          });
          console.log(`Webhook deactivated due to failures: ${webhook.id}`);
        }
      } else {
        // Schedule retry
        const nextRetry = new Date(Date.now() + this.retryDelays[newAttempts - 1]);
        
        await updateDoc(eventRef, {
          status: 'retry',
          attempts: newAttempts,
          lastAttempt: serverTimestamp(),
          nextRetry: nextRetry,
          response: {
            status: 0,
            body: errorMessage,
            headers: {}
          }
        });

        // Schedule the retry (in a real implementation, this would use a job queue)
        setTimeout(() => {
          this.retryWebhookEvent(eventId);
        }, this.retryDelays[newAttempts - 1]);
      }
    } catch (updateError) {
      console.error('Failed to handle webhook failure:', updateError);
    }
  }

  // Retry failed webhook event
  private async retryWebhookEvent(eventId: string): Promise<void> {
    try {
      // Fetch event and webhook details
      const eventRef = doc(db, 'webhook_events', eventId);
      const eventDoc = await eventRef.get();
      
      if (!eventDoc.exists()) {
        console.error(`Webhook event not found: ${eventId}`);
        return;
      }

      const event = eventDoc.data() as WebhookEvent;
      
      const webhookRef = doc(db, 'webhooks', event.endpointId);
      const webhookDoc = await webhookRef.get();
      
      if (!webhookDoc.exists()) {
        console.error(`Webhook not found: ${event.endpointId}`);
        return;
      }

      const webhook = webhookDoc.data() as WebhookEndpoint;
      webhook.id = webhookDoc.id;

      // Only retry if webhook is still active and event is in retry status
      if (webhook.isActive && event.status === 'retry') {
        await this.sendWebhookEvent(eventId, webhook, event);
      }
    } catch (error) {
      console.error('Failed to retry webhook event:', error);
    }
  }

  // Generate webhook secret
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate signature for payload verification
  private generateSignature(payload: WebhookPayload, secret: string): string {
    const payloadString = JSON.stringify(payload);
    return crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');
  }

  // Verify webhook signature
  public verifySignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      console.error('Failed to verify webhook signature:', error);
      return false;
    }
  }

  // Get webhook statistics
  public async getWebhookStats(userId?: string): Promise<{
    totalWebhooks: number;
    activeWebhooks: number;
    totalEvents: number;
    successfulEvents: number;
    failedEvents: number;
    retryingEvents: number;
  }> {
    try {
      let webhooksQuery = query(collection(db, 'webhooks'));
      let eventsQuery = query(collection(db, 'webhook_events'));

      if (userId) {
        webhooksQuery = query(webhooksQuery, where('userId', '==', userId));
        
        // For events, we need to join with webhooks to filter by userId
        // This is a simplified approach - in production, you'd denormalize this data
      }

      const [webhooksSnapshot, eventsSnapshot] = await Promise.all([
        getDocs(webhooksQuery),
        getDocs(eventsQuery)
      ]);

      const activeWebhooks = webhooksSnapshot.docs.filter(
        doc => doc.data().isActive
      ).length;

      const eventStats = eventsSnapshot.docs.reduce(
        (stats, doc) => {
          const status = doc.data().status;
          switch (status) {
            case 'sent':
              stats.successful++;
              break;
            case 'failed':
              stats.failed++;
              break;
            case 'retry':
            case 'pending':
              stats.retrying++;
              break;
          }
          return stats;
        },
        { successful: 0, failed: 0, retrying: 0 }
      );

      return {
        totalWebhooks: webhooksSnapshot.size,
        activeWebhooks,
        totalEvents: eventsSnapshot.size,
        ...eventStats
      };
    } catch (error) {
      console.error('Failed to get webhook stats:', error);
      return {
        totalWebhooks: 0,
        activeWebhooks: 0,
        totalEvents: 0,
        successfulEvents: 0,
        failedEvents: 0,
        retryingEvents: 0
      };
    }
  }

  // Predefined webhook events for common Bagster events
  public async triggerShipmentCreated(shipmentData: any): Promise<void> {
    await this.triggerWebhook('shipment.created', shipmentData, shipmentData.userId);
  }

  public async triggerShipmentStatusUpdated(shipmentData: any): Promise<void> {
    await this.triggerWebhook('shipment.status_updated', shipmentData, shipmentData.userId);
  }

  public async triggerCarrierAssigned(assignmentData: any): Promise<void> {
    await this.triggerWebhook('carrier.assigned', assignmentData, assignmentData.userId);
  }

  public async triggerPaymentReceived(paymentData: any): Promise<void> {
    await this.triggerWebhook('payment.received', paymentData, paymentData.userId);
  }

  public async triggerDeliveryCompleted(deliveryData: any): Promise<void> {
    await this.triggerWebhook('delivery.completed', deliveryData, deliveryData.userId);
  }
}

export const webhookService = new WebhookService();
export default webhookService;
