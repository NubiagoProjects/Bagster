'use client'

import { pushNotificationService } from './pushNotificationService'
import { smsEmailService, NotificationResult } from './smsEmailService'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  serverTimestamp,
  setDoc,
  deleteDoc,
  query,
  where,
  getDocs 
} from 'firebase/firestore'
import { db } from '../firebase'

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
  type: 'shipment_update' | 'carrier_confirmation' | 'payment_received' | 'system_alert' | 'assignment_created'
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: Date
  channels: string[]
  status: 'pending' | 'sent' | 'failed'
  sentAt?: Date
  deliveryResults?: {
    successful: number
    failed: number
    details: any[]
  }
  email?: string
  phone?: string
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
      const channels: string[] = []
      if (preferences?.email !== false) channels.push('email')
      if (preferences?.sms !== false) channels.push('sms')
      if (preferences?.push !== false) channels.push('push')

      // Create notification record
      const notification: NotificationData = {
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date(),
        channels,
        status: 'pending'
      }

      // Save to Firebase
      const notificationRef = doc(collection(db, 'notifications'))
      await setDoc(notificationRef, {
        ...notification,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      const notificationId = notificationRef.id

      // Send via multiple channels concurrently
      const results = await Promise.allSettled([
        this.sendEmailNotification(notification),
        this.sendSMSNotification(notification),
        this.sendPushNotification(notification)
      ])

      // Update notification status based on results
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      await updateDoc(notificationRef, {
        status: successful > 0 ? 'sent' : 'failed',
        sentAt: serverTimestamp(),
        deliveryResults: {
          successful,
          failed,
          details: results
        }
      })

      return notificationId
    } catch (error) {
      console.error('Failed to send notification:', error)
      throw error
    }
  }

  private async sendEmailNotification(notification: NotificationData): Promise<boolean> {
    try {
      if (!notification.channels.includes('email') || !notification.data?.email) {
        return false
      }

      let emailContent
      if (notification.type === 'shipment_update') {
        emailContent = smsEmailService.generateShipmentNotificationEmail(
          notification.data?.shipmentId || '',
          notification.data?.status || '',
          notification.data?.trackingNumber || '',
          notification.data?.customerName || 'Customer'
        )
      } else {
        emailContent = {
          subject: notification.title,
          html: `<p>${notification.message}</p>`,
          text: notification.message
        }
      }

      const result = await smsEmailService.sendEmail(
        notification.data.email,
        emailContent.subject,
        emailContent.html,
        emailContent.text,
        notification.id
      )

      return result.success
    } catch (error) {
      console.error('Email notification failed:', error)
      return false
    }
  }

  private async sendSMSNotification(notification: NotificationData): Promise<boolean> {
    try {
      if (!notification.channels.includes('sms') || !notification.data?.phone) {
        return false
      }

      let smsMessage
      if (notification.type === 'assignment_created' && notification.data) {
        smsMessage = smsEmailService.generateCarrierAssignmentSMS(
          notification.data.carrierName || 'Carrier',
          notification.data.shipmentId || '',
          notification.data.pickupAddress || '',
          new Date(notification.data.expiresAt || Date.now() + 7 * 60 * 60 * 1000)
        )
      } else {
        smsMessage = `${notification.title}: ${notification.message}`
      }

      const result = await smsEmailService.sendSMS(
        notification.data.phone,
        smsMessage,
        notification.id
      )

      return result.success
    } catch (error) {
      console.error('SMS notification failed:', error)
      return false
    }
  }

  private async sendPushNotification(notification: NotificationData): Promise<boolean> {
    try {
      if (!notification.channels.includes('push')) {
        return false
      }

      return await pushNotificationService.sendPushNotification(
        notification.userId,
        {
          title: notification.title,
          body: notification.message,
          data: notification.data
        }
      )
    } catch (error) {
      console.error('Push notification error:', error)
      return false
    }
  }

  // Replace template variables
  private replaceTemplateVars(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      // Mock mark as read for demo
      console.log(`Mock: Marked notification ${notificationId} as read`)
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
  
  public async retryFailedNotification(notificationId: string): Promise<NotificationResult> {
    return await smsEmailService.retryFailedNotification(notificationId)
  }
}

export const notificationService = new NotificationService()
export default notificationService
