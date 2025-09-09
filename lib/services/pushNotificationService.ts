'use client'

import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import app from '@/lib/firebase'
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore'

interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: Record<string, any>
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

interface PushSubscription {
  userId: string
  token: string
  deviceType: 'web' | 'ios' | 'android'
  userAgent: string
  createdAt: Date
  isActive: boolean
}

class PushNotificationService {
  private messaging: any = null
  private vapidKey = 'BKxvxQ9K7Z8Q9K7Z8Q9K7Z8Q9K7Z8Q9K7Z8Q9K7Z8Q9K7Z8Q9K7Z8Q9K7Z8Q9K7Z8Q9K7Z8Q9K7Z8Q'

  constructor() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      this.initializeMessaging()
    }
  }

  private async initializeMessaging() {
    try {
      const { getMessaging } = await import('firebase/messaging')
      this.messaging = getMessaging(app)
    } catch (error) {
      console.error('Failed to initialize Firebase messaging:', error)
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Push notifications not supported in this environment')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  // Get FCM token
  async getToken(userId: string): Promise<string | null> {
    if (!this.messaging) {
      await this.initializeMessaging()
    }

    if (!this.messaging) {
      console.error('Firebase messaging not initialized')
      return null
    }

    try {
      const permission = await this.requestPermission()
      if (!permission) {
        console.warn('Notification permission denied')
        return null
      }

      const token = await getToken(this.messaging, {
        vapidKey: this.vapidKey
      })

      if (token) {
        await this.saveTokenToDatabase(userId, token)
        return token
      }

      console.warn('No registration token available')
      return null
    } catch (error) {
      console.error('Failed to get FCM token:', error)
      return null
    }
  }

  // Save token to database
  private async saveTokenToDatabase(userId: string, token: string) {
    try {
      const subscription: PushSubscription = {
        userId,
        token,
        deviceType: 'web',
        userAgent: navigator.userAgent,
        createdAt: new Date(),
        isActive: true
      }

      // Check if token already exists
      const existingQuery = query(
        collection(db, 'pushSubscriptions'),
        where('token', '==', token)
      )
      const existingDocs = await getDocs(existingQuery)

      if (existingDocs.empty) {
        await addDoc(collection(db, 'pushSubscriptions'), subscription)
        console.log('Push token saved to database')
      } else {
        // Update existing subscription
        const docRef = existingDocs.docs[0].ref
        await updateDoc(docRef, {
          userId,
          isActive: true,
          updatedAt: new Date()
        })
        console.log('Push token updated in database')
      }
    } catch (error) {
      console.error('Failed to save push token:', error)
    }
  }

  // Listen for foreground messages
  onMessage(callback: (payload: any) => void) {
    if (!this.messaging) return

    try {
      onMessage(this.messaging, (payload) => {
        console.log('Foreground message received:', payload)
        
        // Show notification if app is in foreground
        if (payload.notification) {
          this.showNotification(payload.notification, payload.data)
        }
        
        callback(payload)
      })
    } catch (error) {
      console.error('Failed to listen for messages:', error)
    }
  }

  // Show browser notification
  private showNotification(notification: any, data?: any) {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    if (Notification.permission === 'granted') {
      const options: NotificationOptions = {
        body: notification.body,
        icon: notification.icon || '/bagster-icon.svg',
        badge: notification.badge || '/bagster-icon.svg',
        // image: notification.image, // Removed - not supported in NotificationOptions
        data: data,
        requireInteraction: true,
        // actions: notification.actions || [] // Removed - not supported in NotificationOptions
      }

      const notif = new Notification(notification.title, options)

      notif.onclick = (event) => {
        event.preventDefault()
        window.focus()
        
        // Handle notification click based on data
        if (data?.url) {
          window.open(data.url, '_blank')
        } else if (data?.trackingNumber) {
          window.open(`/tracking/${data.trackingNumber}`, '_blank')
        }
        
        notif.close()
      }

      // Auto close after 10 seconds
      setTimeout(() => {
        notif.close()
      }, 10000)
    }
  }

  // Send push notification (server-side simulation)
  async sendPushNotification(
    userId: string,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      // In a real implementation, this would call your server endpoint
      // which would use Firebase Admin SDK to send the notification
      
      // For demo purposes, we'll simulate the server call and show local notification
      console.log(`🔔 Sending push notification to user ${userId}:`, payload)
      
      // Simulate server processing delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Show local notification if user is online
      if (typeof window !== 'undefined' && Notification.permission === 'granted') {
        this.showNotification(payload, payload.data)
      }
      
      // Log to analytics
      await this.logNotificationEvent(userId, 'sent', payload)
      
      return true
    } catch (error) {
      console.error('Error storing notification:', error instanceof Error ? error.message : 'Unknown error')
      await this.logNotificationEvent(userId, 'failed', payload, error instanceof Error ? error.message : 'Unknown error')
      return false
    }
  }

  // Send bulk push notifications
  async sendBulkPushNotifications(
    userIds: string[],
    payload: PushNotificationPayload
  ): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    const promises = userIds.map(async (userId) => {
      try {
        const result = await this.sendPushNotification(userId, payload)
        if (result) success++
        else failed++
      } catch (error) {
        failed++
      }
    })

    await Promise.all(promises)
    
    console.log(`Bulk push notifications sent: ${success} success, ${failed} failed`)
    return { success, failed }
  }

  // Send shipment update notification
  async sendShipmentUpdate(
    userId: string,
    trackingNumber: string,
    status: string,
    location?: string
  ): Promise<boolean> {
    const statusMessages = {
      picked_up: 'Your shipment has been picked up',
      in_transit: 'Your shipment is in transit',
      out_for_delivery: 'Your shipment is out for delivery',
      delivered: 'Your shipment has been delivered',
      exception: 'There\'s an update on your shipment'
    }

    const payload: PushNotificationPayload = {
      title: 'Shipment Update',
      body: `${statusMessages[status as keyof typeof statusMessages] || 'Shipment status updated'} - ${trackingNumber}`,
      icon: '/bagster-icon.svg',
      data: {
        type: 'shipment_update',
        trackingNumber,
        status,
        location,
        url: `/tracking/${trackingNumber}`
      },
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    return this.sendPushNotification(userId, payload)
  }

  // Send carrier assignment notification
  async sendCarrierAssignment(
    userId: string,
    trackingNumber: string,
    carrierName: string
  ): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: 'Carrier Assigned',
      body: `${carrierName} has been assigned to your shipment ${trackingNumber}`,
      icon: '/bagster-icon.svg',
      data: {
        type: 'carrier_assignment',
        trackingNumber,
        carrierName,
        url: `/tracking/${trackingNumber}`
      }
    }

    return this.sendPushNotification(userId, payload)
  }

  // Send system alert
  async sendSystemAlert(
    userId: string,
    title: string,
    message: string,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title,
      body: message,
      icon: '/bagster-icon.svg',
      badge: priority === 'high' ? '/badge-urgent.png' : '/bagster-icon.svg',
      data: {
        type: 'system_alert',
        priority,
        url: '/dashboard'
      }
    }

    return this.sendPushNotification(userId, payload)
  }

  // Log notification events for analytics
  private async logNotificationEvent(
    userId: string,
    event: 'sent' | 'delivered' | 'clicked' | 'failed',
    payload: PushNotificationPayload,
    error?: string
  ) {
    try {
      await addDoc(collection(db, 'notificationEvents'), {
        userId,
        event,
        type: 'push',
        title: payload.title,
        body: payload.body,
        data: payload.data,
        error,
        timestamp: new Date()
      })
    } catch (error) {
      console.error('Failed to log notification event:', error)
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(userId: string): Promise<boolean> {
    try {
      // Deactivate all tokens for user
      const subscriptionsQuery = query(
        collection(db, 'pushSubscriptions'),
        where('userId', '==', userId),
        where('isActive', '==', true)
      )
      
      const subscriptions = await getDocs(subscriptionsQuery)
      
      const promises = subscriptions.docs.map(doc =>
        updateDoc(doc.ref, { isActive: false, unsubscribedAt: new Date() })
      )
      
      await Promise.all(promises)
      
      console.log(`Unsubscribed user ${userId} from push notifications`)
      return true
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  // Get notification statistics
  async getNotificationStats(userId?: string): Promise<{
    total: number
    sent: number
    delivered: number
    clicked: number
    failed: number
  }> {
    try {
      let eventsQuery = query(collection(db, 'notificationEvents'))
      
      if (userId) {
        eventsQuery = query(eventsQuery, where('userId', '==', userId))
      }
      
      const events = await getDocs(eventsQuery)
      
      const stats = {
        total: events.size,
        sent: 0,
        delivered: 0,
        clicked: 0,
        failed: 0
      }
      
      events.docs.forEach(doc => {
        const event = doc.data().event
        if (event in stats) {
          stats[event as keyof typeof stats]++
        }
      })
      
      return stats
    } catch (error) {
      console.error('Failed to get notification stats:', error)
      return { total: 0, sent: 0, delivered: 0, clicked: 0, failed: 0 }
    }
  }
}

export const pushNotificationService = new PushNotificationService()
export default pushNotificationService
