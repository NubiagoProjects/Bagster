import { Router } from 'express'
import { authenticateToken, requireRole } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { db } from '../config/firebase'
import { webhookService } from '../services/webhookService'
import Joi from 'joi'

const router = Router()

// Webhook management endpoints (authenticated)
router.post('/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { url, events, secret, maxRetries } = req.body
    const userId = req.user?.uid

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    if (!url || !events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'URL and events array are required' })
    }

    const subscription = await webhookService.createSubscription(userId, url, events, {
      secret,
      maxRetries
    })

    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        url: subscription.url,
        events: subscription.events,
        active: subscription.active,
        created_at: subscription.created_at
      }
    })
  } catch (error) {
    console.error('Create webhook subscription error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create webhook subscription'
    })
  }
})

router.get('/subscriptions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.uid

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    const subscriptions = await webhookService.getUserSubscriptions(userId)

    res.json({
      success: true,
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        url: sub.url,
        events: sub.events,
        active: sub.active,
        created_at: sub.created_at,
        failure_count: sub.failure_count
      }))
    })
  } catch (error) {
    console.error('Get webhook subscriptions error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve webhook subscriptions'
    })
  }
})

router.put('/subscriptions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { url, events, active } = req.body
    const userId = req.user?.uid

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    // Verify ownership
    const subscriptions = await webhookService.getUserSubscriptions(userId)
    const subscription = subscriptions.find(sub => sub.id === id)

    if (!subscription) {
      return res.status(404).json({ error: 'Webhook subscription not found' })
    }

    const updates: any = {}
    if (url) updates.url = url
    if (events) updates.events = events
    if (typeof active === 'boolean') updates.active = active

    await webhookService.updateSubscription(id, updates)

    res.json({
      success: true,
      message: 'Webhook subscription updated successfully'
    })
  } catch (error) {
    console.error('Update webhook subscription error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update webhook subscription'
    })
  }
})

router.delete('/subscriptions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.uid

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    // Verify ownership
    const subscriptions = await webhookService.getUserSubscriptions(userId)
    const subscription = subscriptions.find(sub => sub.id === id)

    if (!subscription) {
      return res.status(404).json({ error: 'Webhook subscription not found' })
    }

    await webhookService.deleteSubscription(id)

    res.json({
      success: true,
      message: 'Webhook subscription deleted successfully'
    })
  } catch (error) {
    console.error('Delete webhook subscription error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete webhook subscription'
    })
  }
})

router.get('/subscriptions/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { days } = req.query
    const userId = req.user?.uid

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    // Verify ownership
    const subscriptions = await webhookService.getUserSubscriptions(userId)
    const subscription = subscriptions.find(sub => sub.id === id)

    if (!subscription) {
      return res.status(404).json({ error: 'Webhook subscription not found' })
    }

    const stats = await webhookService.getDeliveryStats(id, days ? parseInt(days as string) : 7)

    res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Get webhook stats error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve webhook statistics'
    })
  }
})

// Webhook validation schemas
const carrierWebhookSchema = Joi.object({
  trackingNumber: Joi.string().required(),
  status: Joi.string().valid('picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'exception').required(),
  location: Joi.string().required(),
  timestamp: Joi.date().iso().required(),
  description: Joi.string().optional(),
  carrierName: Joi.string().required(),
  estimatedDelivery: Joi.date().iso().optional()
})

const paymentWebhookSchema = Joi.object({
  paymentId: Joi.string().required(),
  status: Joi.string().valid('completed', 'failed', 'refunded', 'cancelled').required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  transactionId: Joi.string().required(),
  timestamp: Joi.date().iso().required(),
  metadata: Joi.object().optional()
})

const notificationWebhookSchema = Joi.object({
  userId: Joi.string().required(),
  channel: Joi.string().valid('email', 'sms', 'push').required(),
  status: Joi.string().valid('delivered', 'failed', 'bounced').required(),
  messageId: Joi.string().required(),
  timestamp: Joi.date().iso().required(),
  errorCode: Joi.string().optional(),
  errorMessage: Joi.string().optional()
})

// Carrier tracking webhook
router.post('/carrier/tracking', validateRequest(carrierWebhookSchema), async (req, res) => {
  try {
    const { trackingNumber, status, location, timestamp, description, carrierName, estimatedDelivery } = req.body

    // Update shipment status in database
    await db.collection('shipments').doc(trackingNumber).update({
      status,
      lastLocation: location,
      updatedAt: new Date(),
      ...(estimatedDelivery && { estimatedDelivery: new Date(estimatedDelivery) })
    })

    // Add tracking event
    const trackingEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status,
      location,
      timestamp: new Date(timestamp),
      description: description || `Shipment ${status.replace('_', ' ')}`,
      carrierName
    }

    await db.collection('shipments').doc(trackingNumber).collection('events').add(trackingEvent)

    // Trigger webhook events for subscribers
    await webhookService.triggerEvent('shipment.status_updated', {
      tracking_number: trackingNumber,
      status,
      location,
      timestamp,
      carrier_name: carrierName,
      estimated_delivery: estimatedDelivery
    })

    // Send notification to user (if shipment exists)
    try {
      // Get shipment data to find user
      const shipmentDoc = await db.collection('shipments').doc(trackingNumber).get()
      if (shipmentDoc.exists) {
        const shipmentData = shipmentDoc.data()
        if (shipmentData) {
          // Trigger user-specific webhook event
          await webhookService.triggerEvent('shipment.user_update', {
            user_id: shipmentData.userId,
            tracking_number: trackingNumber,
            status,
            location,
            carrier_name: carrierName,
            estimated_delivery: estimatedDelivery,
            destination: shipmentData.destinationAddress?.city || 'destination'
          }, shipmentData.userId)
        }
      }
    } catch (notificationError) {
      console.error('Failed to send tracking notification:', notificationError)
      // Don't fail the webhook for notification errors
    }

    console.log(`📦 Tracking update received: ${trackingNumber} -> ${status} at ${location}`)

    res.json({
      success: true,
      message: 'Tracking update processed successfully',
      trackingNumber,
      status
    })
  } catch (error) {
    console.error('Carrier webhook error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process tracking update',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Payment status webhook
router.post('/payment/status', validateRequest(paymentWebhookSchema), async (req, res) => {
  try {
    const { paymentId, status, amount, currency, transactionId, timestamp, metadata } = req.body

    // Update payment record
    await db.collection('payments').doc(paymentId).update({
      status,
      transactionId,
      processedAt: new Date(timestamp),
      updatedAt: new Date(),
      ...(metadata && { metadata })
    })

    // Log payment event
    await db.collection('payments').doc(paymentId).collection('events').add({
      type: 'status_change',
      status,
      amount,
      currency,
      transactionId,
      timestamp: new Date(timestamp),
      metadata
    })

    // Trigger webhook events for subscribers
    await webhookService.triggerEvent('payment.status_updated', {
      payment_id: paymentId,
      status,
      amount,
      currency,
      transaction_id: transactionId,
      timestamp
    })

    // Send notification to user
    try {
      // Get payment data to find user
      const paymentDoc = await db.collection('payments').doc(paymentId).get()
      if (paymentDoc.exists) {
        const paymentData = paymentDoc.data()
        if (paymentData) {
          // Trigger user-specific webhook event
          await webhookService.triggerEvent('payment.user_update', {
            user_id: paymentData.userId,
            payment_id: paymentId,
            status,
            amount,
            currency,
            tracking_number: paymentData.trackingNumber
          }, paymentData.userId)
        }
      }
    } catch (notificationError) {
      console.error('Failed to send payment notification:', notificationError)
    }

    console.log(`💳 Payment update received: ${paymentId} -> ${status} (${amount} ${currency})`)

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      paymentId,
      status,
      transactionId
    })
  } catch (error) {
    console.error('Payment webhook error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process payment update',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Notification delivery webhook
router.post('/notification/delivery', validateRequest(notificationWebhookSchema), async (req, res) => {
  try {
    const { userId, channel, status, messageId, timestamp, errorCode, errorMessage } = req.body

    // Update notification delivery status
    await db.collection('notifications').doc(messageId).update({
      [`deliveryStatus.${channel}`]: status,
      updatedAt: new Date(),
      ...(errorCode && { [`deliveryError.${channel}`]: { code: errorCode, message: errorMessage } })
    })

    // Log delivery event
    await db.collection('notifications').doc(messageId).collection('deliveryEvents').add({
      channel,
      status,
      timestamp: new Date(timestamp),
      errorCode,
      errorMessage
    })

    // Trigger webhook events for subscribers
    await webhookService.triggerEvent('notification.delivery_updated', {
      user_id: userId,
      message_id: messageId,
      channel,
      status,
      error_code: errorCode,
      error_message: errorMessage
    }, userId)

    console.log(`📬 Notification delivery update: ${messageId} via ${channel} -> ${status}`)

    res.json({
      success: true,
      message: 'Delivery status updated successfully',
      messageId,
      channel,
      status
    })
  } catch (error) {
    console.error('Notification webhook error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process delivery update',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Generic webhook for third-party integrations
router.post('/external/:service', async (req, res) => {
  try {
    const { service } = req.params
    const payload = req.body
    const headers = req.headers

    // Log webhook for debugging
    console.log(`🔗 External webhook received from ${service}:`, {
      headers: {
        'content-type': headers['content-type'],
        'user-agent': headers['user-agent'],
        authorization: headers.authorization ? '[REDACTED]' : undefined
      },
      payload
    })

    // Store webhook data for processing
    await db.collection('webhooks').add({
      service,
      payload,
      headers: {
        'content-type': headers['content-type'],
        'user-agent': headers['user-agent']
      },
      receivedAt: new Date(),
      processed: false
    })

    // Service-specific processing
    switch (service) {
      case 'fedex':
      case 'ups':
      case 'dhl':
        await processCarrierWebhook(service, payload)
        break
      
      case 'stripe':
      case 'paypal':
        await processPaymentWebhook(service, payload)
        break
      
      case 'twilio':
      case 'sendgrid':
        await processNotificationWebhook(service, payload)
        break
      
      default:
        console.log(`Unknown service webhook: ${service}`)
    }

    res.json({
      success: true,
      message: `Webhook from ${service} processed successfully`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error(`External webhook error for ${req.params.service}:`, error)
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Helper functions for processing different webhook types
async function processCarrierWebhook(service: string, payload: any) {
  try {
    // Transform service-specific payload to standard format
    let standardPayload
    
    switch (service) {
      case 'fedex':
        standardPayload = {
          trackingNumber: payload.trackingNumber,
          status: mapFedExStatus(payload.status),
          location: `${payload.city}, ${payload.state}`,
          timestamp: payload.timestamp,
          carrierName: 'FedEx'
        }
        break
      
      case 'ups':
        standardPayload = {
          trackingNumber: payload.tracking_number,
          status: mapUPSStatus(payload.status_code),
          location: payload.location,
          timestamp: payload.event_time,
          carrierName: 'UPS'
        }
        break
      
      default:
        console.log(`Unsupported carrier service: ${service}`)
        return
    }

    // Process using standard webhook handler
    // This would call the same logic as the /carrier/tracking endpoint
    console.log(`Processed ${service} webhook:`, standardPayload)
  } catch (error) {
    console.error(`Failed to process ${service} webhook:`, error)
  }
}

async function processPaymentWebhook(service: string, payload: any) {
  try {
    let standardPayload
    
    switch (service) {
      case 'stripe':
        standardPayload = {
          paymentId: payload.data.object.id,
          status: payload.data.object.status === 'succeeded' ? 'completed' : 'failed',
          amount: payload.data.object.amount / 100, // Stripe uses cents
          currency: payload.data.object.currency,
          transactionId: payload.data.object.id,
          timestamp: new Date(payload.data.object.created * 1000).toISOString()
        }
        break
      
      default:
        console.log(`Unsupported payment service: ${service}`)
        return
    }

    console.log(`Processed ${service} payment webhook:`, standardPayload)
  } catch (error) {
    console.error(`Failed to process ${service} payment webhook:`, error)
  }
}

async function processNotificationWebhook(service: string, payload: any) {
  try {
    let standardPayload
    
    switch (service) {
      case 'twilio':
        standardPayload = {
          userId: payload.userId, // This would need to be included in the original message
          channel: 'sms',
          status: payload.MessageStatus === 'delivered' ? 'delivered' : 'failed',
          messageId: payload.MessageSid,
          timestamp: new Date().toISOString()
        }
        break
      
      case 'sendgrid':
        standardPayload = {
          userId: payload.userId,
          channel: 'email',
          status: payload.event === 'delivered' ? 'delivered' : 'failed',
          messageId: payload.sg_message_id,
          timestamp: new Date(payload.timestamp * 1000).toISOString()
        }
        break
      
      default:
        console.log(`Unsupported notification service: ${service}`)
        return
    }

    console.log(`Processed ${service} notification webhook:`, standardPayload)
  } catch (error) {
    console.error(`Failed to process ${service} notification webhook:`, error)
  }
}

// Status mapping functions
function mapFedExStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'PU': 'picked_up',
    'IT': 'in_transit',
    'OD': 'out_for_delivery',
    'DL': 'delivered'
  }
  return statusMap[status] || 'in_transit'
}

function mapUPSStatus(statusCode: string): string {
  const statusMap: Record<string, string> = {
    'M': 'picked_up',
    'I': 'in_transit',
    'O': 'out_for_delivery',
    'D': 'delivered'
  }
  return statusMap[statusCode] || 'in_transit'
}

// Webhook health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Webhook service is healthy',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/carrier/tracking',
      '/payment/status',
      '/notification/delivery',
      '/external/:service'
    ]
  })
})

export default router
