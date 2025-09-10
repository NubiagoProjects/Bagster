'use client'

import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, getDocs, limit, startAfter, DocumentSnapshot } from 'firebase/firestore'

export interface AuditLog {
  id?: string
  userId: string
  userEmail: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  success: boolean
  errorMessage?: string
}

export interface AuditLogFilter {
  userId?: string
  action?: string
  resource?: string
  category?: string
  severity?: string
  startDate?: Date
  endDate?: Date
  success?: boolean
}

class AuditLoggingService {
  // Log user action
  async logAction(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, any> = {},
    severity: AuditLog['severity'] = 'low',
    category: string = 'general',
    success: boolean = true,
    errorMessage?: string
  ): Promise<string> {
    try {
      const auditLog: AuditLog = {
        userId,
        userEmail,
        action,
        resource,
        resourceId,
        details: this.sanitizeDetails(details),
        ipAddress: await this.getClientIP(),
        userAgent: this.getUserAgent(),
        timestamp: new Date(),
        severity,
        category,
        success,
        ...(errorMessage && { errorMessage })
      }

      // Mock database write for demo - replace with actual Firebase in production
      // const docRef = await addDoc(collection(db, 'auditLogs'), auditLog)
      const docRef = { id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }
      
      // Log to console for development
      console.log(`🔍 Audit Log: ${action} on ${resource}/${resourceId} by ${userEmail} [${severity}]`)
      
      return docRef.id
    } catch (error) {
      console.error('Failed to log audit action:', error)
      throw error
    }
  }

  // Authentication logs
  async logLogin(userId: string, userEmail: string, method: string, success: boolean, errorMessage?: string): Promise<string> {
    return this.logAction(
      userId,
      userEmail,
      'login',
      'authentication',
      userId,
      { method },
      success ? 'low' : 'medium',
      'authentication',
      success,
      errorMessage
    )
  }

  async logLogout(userId: string, userEmail: string): Promise<string> {
    return this.logAction(
      userId,
      userEmail,
      'logout',
      'authentication',
      userId,
      {},
      'low',
      'authentication'
    )
  }

  async logPasswordChange(userId: string, userEmail: string, success: boolean): Promise<string> {
    return this.logAction(
      userId,
      userEmail,
      'password_change',
      'authentication',
      userId,
      {},
      'medium',
      'authentication',
      success
    )
  }

  // User management logs
  async logUserCreation(adminId: string, adminEmail: string, newUserId: string, newUserEmail: string): Promise<string> {
    return this.logAction(
      adminId,
      adminEmail,
      'create_user',
      'user',
      newUserId,
      { newUserEmail },
      'medium',
      'user_management'
    )
  }

  async logUserUpdate(adminId: string, adminEmail: string, targetUserId: string, changes: Record<string, any>): Promise<string> {
    return this.logAction(
      adminId,
      adminEmail,
      'update_user',
      'user',
      targetUserId,
      { changes },
      'medium',
      'user_management'
    )
  }

  async logUserDeletion(adminId: string, adminEmail: string, deletedUserId: string, deletedUserEmail: string): Promise<string> {
    return this.logAction(
      adminId,
      adminEmail,
      'delete_user',
      'user',
      deletedUserId,
      { deletedUserEmail },
      'high',
      'user_management'
    )
  }

  // Role management logs
  async logRoleAssignment(adminId: string, adminEmail: string, targetUserId: string, roles: string[]): Promise<string> {
    return this.logAction(
      adminId,
      adminEmail,
      'assign_roles',
      'user',
      targetUserId,
      { roles },
      'medium',
      'role_management'
    )
  }

  async logRoleCreation(adminId: string, adminEmail: string, roleId: string, roleName: string): Promise<string> {
    return this.logAction(
      adminId,
      adminEmail,
      'create_role',
      'role',
      roleId,
      { roleName },
      'medium',
      'role_management'
    )
  }

  // Shipment logs
  async logShipmentCreation(userId: string, userEmail: string, shipmentId: string, details: Record<string, any>): Promise<string> {
    return this.logAction(
      userId,
      userEmail,
      'create_shipment',
      'shipment',
      shipmentId,
      details,
      'low',
      'shipment_management'
    )
  }

  async logShipmentStatusUpdate(userId: string, userEmail: string, shipmentId: string, oldStatus: string, newStatus: string): Promise<string> {
    return this.logAction(
      userId,
      userEmail,
      'update_shipment_status',
      'shipment',
      shipmentId,
      { oldStatus, newStatus },
      'low',
      'shipment_management'
    )
  }

  async logShipmentDeletion(userId: string, userEmail: string, shipmentId: string): Promise<string> {
    return this.logAction(
      userId,
      userEmail,
      'delete_shipment',
      'shipment',
      shipmentId,
      {},
      'medium',
      'shipment_management'
    )
  }

  // Carrier logs
  async logCarrierRegistration(carrierId: string, carrierEmail: string, carrierName: string): Promise<string> {
    return this.logAction(
      carrierId,
      carrierEmail,
      'register_carrier',
      'carrier',
      carrierId,
      { carrierName },
      'medium',
      'carrier_management'
    )
  }

  async logCarrierVerification(adminId: string, adminEmail: string, carrierId: string, verified: boolean): Promise<string> {
    return this.logAction(
      adminId,
      adminEmail,
      'verify_carrier',
      'carrier',
      carrierId,
      { verified },
      'medium',
      'carrier_management'
    )
  }

  // Payment logs
  async logPaymentProcessing(userId: string, userEmail: string, paymentId: string, amount: number, currency: string, success: boolean): Promise<string> {
    return this.logAction(
      userId,
      userEmail,
      'process_payment',
      'payment',
      paymentId,
      { amount, currency },
      success ? 'low' : 'high',
      'financial',
      success
    )
  }

  async logRefundProcessing(adminId: string, adminEmail: string, paymentId: string, amount: number, reason: string): Promise<string> {
    return this.logAction(
      adminId,
      adminEmail,
      'process_refund',
      'payment',
      paymentId,
      { amount, reason },
      'medium',
      'financial'
    )
  }

  // System logs
  async logSystemSettingChange(adminId: string, adminEmail: string, setting: string, oldValue: any, newValue: any): Promise<string> {
    return this.logAction(
      adminId,
      adminEmail,
      'change_system_setting',
      'system',
      setting,
      { oldValue, newValue },
      'high',
      'system_administration'
    )
  }

  async logDataExport(userId: string, userEmail: string, dataType: string, recordCount: number): Promise<string> {
    return this.logAction(
      userId,
      userEmail,
      'export_data',
      'data',
      dataType,
      { recordCount },
      'medium',
      'data_access'
    )
  }

  // Security logs
  async logSuspiciousActivity(userId: string, userEmail: string, activity: string, details: Record<string, any>): Promise<string> {
    return this.logAction(
      userId,
      userEmail,
      'suspicious_activity',
      'security',
      userId,
      details,
      'critical',
      'security'
    )
  }

  async logFailedLoginAttempt(email: string, ipAddress: string, reason: string): Promise<string> {
    return this.logAction(
      'anonymous',
      email,
      'failed_login',
      'authentication',
      email,
      { reason, attemptedEmail: email },
      'medium',
      'security',
      false
    )
  }

  // Query audit logs
  async getAuditLogs(
    filter: AuditLogFilter = {},
    pageSize: number = 50,
    lastDoc?: DocumentSnapshot
  ): Promise<{ logs: AuditLog[]; lastDoc: DocumentSnapshot | null; hasMore: boolean }> {
    try {
      // Mock implementation for demo - replace with actual Firebase in production
      return { logs: [], lastDoc: null, hasMore: false }
    } catch (error) {
      console.error('Failed to get audit logs:', error)
      return { logs: [], lastDoc: null, hasMore: false }
    }
  }

  // Get audit statistics
  async getAuditStats(filter: AuditLogFilter = {}): Promise<{
    totalLogs: number
    successRate: number
    topActions: Array<{ action: string; count: number }>
    topUsers: Array<{ userEmail: string; count: number }>
    severityBreakdown: Record<string, number>
    categoryBreakdown: Record<string, number>
  }> {
    try {
      const { logs } = await this.getAuditLogs(filter, 1000) // Get more logs for stats

      const totalLogs = logs.length
      const successfulLogs = logs.filter(log => log.success).length
      const successRate = totalLogs > 0 ? (successfulLogs / totalLogs) * 100 : 0

      // Top actions
      const actionCounts = logs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const topActions = Object.entries(actionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([action, count]) => ({ action, count }))

      // Top users
      const userCounts = logs.reduce((acc, log) => {
        acc[log.userEmail] = (acc[log.userEmail] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const topUsers = Object.entries(userCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([userEmail, count]) => ({ userEmail, count }))

      // Severity breakdown
      const severityBreakdown = logs.reduce((acc, log) => {
        acc[log.severity] = (acc[log.severity] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Category breakdown
      const categoryBreakdown = logs.reduce((acc, log) => {
        acc[log.category] = (acc[log.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        totalLogs,
        successRate,
        topActions,
        topUsers,
        severityBreakdown,
        categoryBreakdown
      }
    } catch (error) {
      console.error('Failed to get audit stats:', error)
      return {
        totalLogs: 0,
        successRate: 0,
        topActions: [],
        topUsers: [],
        severityBreakdown: {},
        categoryBreakdown: {}
      }
    }
  }

  // Search audit logs
  async searchAuditLogs(searchTerm: string, pageSize: number = 50): Promise<AuditLog[]> {
    try {
      // This is a simplified search - in production you'd use a proper search service
      const { logs } = await this.getAuditLogs({}, 1000)
      
      const searchLower = searchTerm.toLowerCase()
      return logs.filter(log => 
        log.action.toLowerCase().includes(searchLower) ||
        log.resource.toLowerCase().includes(searchLower) ||
        log.userEmail.toLowerCase().includes(searchLower) ||
        log.resourceId.toLowerCase().includes(searchLower) ||
        JSON.stringify(log.details).toLowerCase().includes(searchLower)
      ).slice(0, pageSize)
    } catch (error) {
      console.error('Failed to search audit logs:', error)
      return []
    }
  }

  // Helper methods
  private sanitizeDetails(details: Record<string, any>): Record<string, any> {
    const sanitized = { ...details }
    
    // Remove sensitive information
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credential']
    
    for (const key in sanitized) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]'
      }
    }
    
    return sanitized
  }

  private async getClientIP(): Promise<string> {
    try {
      // In a real application, you'd get this from the request headers
      // For demo purposes, we'll use a placeholder
      return '127.0.0.1'
    } catch (error) {
      return 'unknown'
    }
  }

  private getUserAgent(): string {
    if (typeof window !== 'undefined' && navigator.userAgent) {
      return navigator.userAgent
    }
    return 'unknown'
  }

  // Bulk operations
  async bulkLogActions(actions: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>[]): Promise<string[]> {
    try {
      const promises = actions.map(async (action) => {
        const auditLog: AuditLog = {
          ...action,
          details: this.sanitizeDetails(action.details),
          ipAddress: await this.getClientIP(),
          userAgent: this.getUserAgent(),
          timestamp: new Date()
        }
        
        // Mock database write for demo
        const docRef = { id: `bulk_audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }
        return docRef.id
      })
      
      return Promise.all(promises)
    } catch (error) {
      console.error('Failed to bulk log actions:', error)
      throw error
    }
  }

  // Cleanup old logs
  async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
      
      // Mock cleanup for demo - replace with actual Firebase in production
      console.log(`Mock cleanup: would remove logs older than ${daysToKeep} days`)
      return 0
    } catch (error) {
      console.error('Failed to cleanup old logs:', error)
      return 0
    }
  }
}

export const auditLoggingService = new AuditLoggingService()
export default auditLoggingService
