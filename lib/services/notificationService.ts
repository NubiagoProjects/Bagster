'use client'

import { db } from '@/lib/firebase'
import { collection, addDoc, doc, updateDoc, query, where, orderBy, getDocs, deleteDoc } from 'firebase/firestore'

export interface NotificationTemplate {
  subject: string
  body: string
  sms: string
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
}

export interface NotificationData {
  id?: string
  userId: string
  type: 'shipment_update' | 'carrier_confirmation' | 'payment_received' | 'system_alert'
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: Date
  deliveryChannels: string[]
  deliveryStatus: {
    email?: 'pending' | 'sent' | 'failed'
    sms?: 'pending' | 'sent' | 'failed'
    push?: 'pending' | 'sent' | 'failed'
  }
}

class NotificationService {
  private templates: Record<string, NotificationTemplate> = {
    shipment_created: {
      subject: 'Shipment Created - {{trackingNumber}}',
      body: 'Your shipment {{trackingNumber}} has been created and is being processed. You can track its progress at any time.',
      sms: 'Bagster: Shipment {{trackingNumber}} created. Track at bagster.com/track/{{trackingNumber}}'
    },
    shipment_picked_up: {
      subject: 'Shipment Picked Up - {{trackingNumber}}',
      body: 'Great news! Your shipment {{trackingNumber}} has been picked up by {{carrierName}} and is now in transit.',
      sms: 'Bagster: Shipment {{trackingNumber}} picked up by {{carrierName}}. Track progress online.'
    },
    shipment_in_transit: {
      subject: 'Shipment In Transit - {{trackingNumber}}',
      body: 'Your shipment {{trackingNumber}} is currently in transit to {{destination}}. Estimated delivery: {{estimatedDelivery}}.',
      sms: 'Bagster: Shipment {{trackingNumber}} in transit. ETA: {{estimatedDelivery}}'
    },
    shipment_delivered: {
      subject: 'Shipment Delivered - {{trackingNumber}}',
      body: 'Excellent! Your shipment {{trackingNumber}} has been successfully delivered to {{destination}}.',
      sms: 'Bagster: Shipment {{trackingNumber}} delivered successfully!'
    },
    carrier_assigned: {
      subject: 'Carrier Assigned - {{trackingNumber}}',
      body: 'A carrier has been assigned to your shipment {{trackingNumber}}. {{carrierName}} will handle your delivery.',
      sms: 'Bagster: Carrier {{carrierName}} assigned to shipment {{trackingNumber}}'
    },
    payment_received: {
      subject: 'Payment Confirmed - {{trackingNumber}}',
      body: 'We have received your payment for shipment {{trackingNumber}}. Amount: {{amount}} {{currency}}.',
      sms: 'Bagster: Payment confirmed for {{trackingNumber}}. Amount: {{amount}} {{currency}}'
    }
  }

  // Send notification via multiple channels
  async sendNotification(
    userId: string,
    type: NotificationData['type'],
    templateKey: string,
    data: Record<string, any>,
    preferences?: NotificationPreferences
  ): Promise<string> {
    try {
      const template = this.templates[templateKey]
      if (!template) {
        throw new Error(`Template ${templateKey} not found`)
      }

      // Replace template variables
      const title = this.replaceTemplateVars(template.subject, data)
      const message = this.replaceTemplateVars(template.body, data)
      const smsMessage = this.replaceTemplateVars(template.sms, data)

      // Determine delivery channels based on preferences
      const deliveryChannels: string[] = []
      if (preferences?.email !== false) deliveryChannels.push('email')
      if (preferences?.sms !== false) deliveryChannels.push('sms')
      if (preferences?.push !== false) deliveryChannels.push('push')

      // Create notification record
      const notification: NotificationData = {
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date(),
        deliveryChannels,
        deliveryStatus: {}
      }

      const docRef = await addDoc(collection(db, 'notifications'), notification)
      const notificationId = docRef.id

      // Send via each channel
      await Promise.all([
        this.sendEmail(userId, title, message, notificationId),
        this.sendSMS(userId, smsMessage, notificationId),
        this.sendPushNotification(userId, title, message, notificationId)
      ])

      return notificationId
    } catch (error) {
      console.error('Failed to send notification:', error)
      throw error
    }
  }

  // Email delivery simulation
  private async sendEmail(userId: string, subject: string, body: string, notificationId: string): Promise<void> {
    try {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      // Simulate 95% success rate
      const success = Math.random() > 0.05
      
      if (success) {
        console.log(`📧 Email sent to user ${userId}: ${subject}`)
        await this.updateDeliveryStatus(notificationId, 'email', 'sent')
      } else {
        console.error(`📧 Email failed for user ${userId}: ${subject}`)
        await this.updateDeliveryStatus(notificationId, 'email', 'failed')
      }
    } catch (error) {
      console.error('Email delivery error:', error)
      await this.updateDeliveryStatus(notificationId, 'email', 'failed')
    }
  }

  // SMS delivery simulation
  private async sendSMS(userId: string, message: string, notificationId: string): Promise<void> {
    try {
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500))
      
      // Simulate 90% success rate
      const success = Math.random() > 0.1
      
      if (success) {
        console.log(`📱 SMS sent to user ${userId}: ${message}`)
        await this.updateDeliveryStatus(notificationId, 'sms', 'sent')
      } else {
        console.error(`📱 SMS failed for user ${userId}: ${message}`)
        await this.updateDeliveryStatus(notificationId, 'sms', 'failed')
      }
    } catch (error) {
      console.error('SMS delivery error:', error)
      await this.updateDeliveryStatus(notificationId, 'sms', 'failed')
    }
  }

  // Push notification simulation
  private async sendPushNotification(userId: string, title: string, body: string, notificationId: string): Promise<void> {
    try {
      // Simulate push notification delay
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800))
      
      // Simulate 98% success rate
      const success = Math.random() > 0.02
      
      if (success) {
        console.log(`🔔 Push notification sent to user ${userId}: ${title}`)
        await this.updateDeliveryStatus(notificationId, 'push', 'sent')
        
        // Show browser notification if supported
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body, icon: '/bagster-icon.svg' })
        }
      } else {
        console.error(`🔔 Push notification failed for user ${userId}: ${title}`)
        await this.updateDeliveryStatus(notificationId, 'push', 'failed')
      }
    } catch (error) {
      console.error('Push notification error:', error)
      await this.updateDeliveryStatus(notificationId, 'push', 'failed')
    }
  }

  // Update delivery status
  private async updateDeliveryStatus(
    notificationId: string, 
    channel: 'email' | 'sms' | 'push', 
    status: 'sent' | 'failed'
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        [`deliveryStatus.${channel}`]: status
      })
    } catch (error) {
      console.error('Failed to update delivery status:', error)
    }
  }

  // Replace template variables
  private replaceTemplateVars(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }

  // Get user notifications
  async getUserNotifications(userId: string, limit: number = 50): Promise<NotificationData[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as NotificationData[]
    } catch (error) {
      console.error('Failed to get user notifications:', error)
      return []
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      throw error
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId))
    } catch (error) {
      console.error('Failed to delete notification:', error)
      throw error
    }
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false)
      )
      
      const snapshot = await getDocs(q)
      return snapshot.size
    } catch (error) {
      console.error('Failed to get unread count:', error)
      return 0
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  // Bulk send notifications
  async sendBulkNotifications(
    userIds: string[],
    type: NotificationData['type'],
    templateKey: string,
    data: Record<string, any>
  ): Promise<void> {
    try {
      const promises = userIds.map(userId => 
        this.sendNotification(userId, type, templateKey, data)
      )
      
      await Promise.all(promises)
      console.log(`Bulk notifications sent to ${userIds.length} users`)
    } catch (error) {
      console.error('Failed to send bulk notifications:', error)
      throw error
    }
  }

  // Send system alert
  async sendSystemAlert(
    userId: string,
    title: string,
    message: string,
    data?: any
  ): Promise<string> {
    return this.sendNotification(userId, 'system_alert', 'system_alert', {
      title,
      message,
      ...data
    })
  }
}

export const notificationService = new NotificationService()
export default notificationService
