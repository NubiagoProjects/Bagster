'use client'

import { ShipmentAssignment, ShipmentStatus, CarrierShipmentView, CountdownTimer, QRCodeData } from '@/lib/types/shipment-assignment'

// Mock data stores (replace with real database in production)
const assignments: ShipmentAssignment[] = []
const shipmentStatuses: any[] = []
let countdownTimers: Map<string, NodeJS.Timeout> = new Map()

export class ShipmentAssignmentService {
  private readonly ASSIGNMENT_TIMEOUT_HOURS = 7
  private readonly MAX_REASSIGNMENT_ATTEMPTS = 3

  // Get assignment by ID
  async getAssignment(assignmentId: string): Promise<ShipmentAssignment | null> {
    const assignment = assignments.find((a: ShipmentAssignment) => a.id === assignmentId)
    return assignment || null
  }

  // Create new shipment assignment with countdown
  async createAssignment(
    shipmentId: string,
    carrierId: string,
    priority: 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<ShipmentAssignment> {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + (this.ASSIGNMENT_TIMEOUT_HOURS * 60 * 60 * 1000))

    const assignment: ShipmentAssignment = {
      id: `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shipmentId,
      carrierId,
      assignedAt: now,
      expiresAt,
      status: 'pending',
      reassignmentCount: 0,
      previousCarrierIds: [],
      priority,
      autoReassign: true
    }

    assignments.push(assignment)

    console.log(`📦 Shipment ${shipmentId} assigned to carrier ${carrierId}`)

    return assignment
  }

  // Accept assignment
  async acceptAssignment(assignmentId: string, carrierId: string): Promise<ShipmentAssignment> {
    const assignment = assignments.find((a: ShipmentAssignment) => a.id === assignmentId && a.carrierId === carrierId)

    if (!assignment) {
      throw new Error('Assignment not found or not assigned to this carrier')
    }

    if (assignment.status !== 'pending') {
      throw new Error(`Assignment already ${assignment.status}`)
    }

    assignment.status = 'accepted'
    assignment.acceptedAt = new Date()

    return assignment
  }

  // Decline assignment
  async declineAssignment(assignmentId: string, carrierId: string, reason?: string): Promise<void> {
    const assignment = assignments.find((a: ShipmentAssignment) => a.id === assignmentId && a.carrierId === carrierId)

    if (!assignment) {
      throw new Error('Assignment not found or not assigned to this carrier')
    }

    if (assignment.status !== 'pending') {
      throw new Error(`Assignment already ${assignment.status}`)
    }

    assignment.status = 'declined'
    assignment.declinedAt = new Date()

    console.log(`❌ Assignment ${assignmentId} declined by carrier ${carrierId}`)
  }

  // Get carrier's shipments
  async getCarrierShipments(
    carrierId: string,
    view: 'all' | 'pending' | 'accepted' | 'active'
  ): Promise<CarrierShipmentView[]> {
    let filteredAssignments = assignments.filter((a: ShipmentAssignment) => a.carrierId === carrierId)

    switch (view) {
      case 'pending':
        filteredAssignments = filteredAssignments.filter((a: ShipmentAssignment) => a.status === 'pending')
        break
      case 'accepted':
        filteredAssignments = filteredAssignments.filter((a: ShipmentAssignment) => a.status === 'accepted')
        break
      case 'active':
        filteredAssignments = filteredAssignments.filter((a: ShipmentAssignment) => a.status === 'accepted')
        break
    }

    return filteredAssignments.map((assignment: ShipmentAssignment): CarrierShipmentView => ({
      shipment: {
        id: assignment.shipmentId,
        trackingNumber: `BG${assignment.shipmentId.slice(-8).toUpperCase()}`,
        origin: 'New York, NY',
        destination: 'Los Angeles, CA',
        weight: 2.5,
        dimensions: { length: 30, width: 20, height: 15 },
        value: 150,
        currency: 'USD',
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: assignment.priority === 'urgent' ? 'express' : 'normal'
      },
      assignment,
      currentStatus: {
        id: `status_${Date.now()}`,
        shipmentId: assignment.shipmentId,
        carrierId: assignment.carrierId,
        status: 'assigned',
        timestamp: new Date(),
        qrCodeScanned: false
      },
      statusHistory: [],
      customer: {
        name: 'John Doe',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
        address: '123 Main St, Los Angeles, CA 90210'
      },
      sender: {
        name: 'Jane Smith',
        phone: '+1 (555) 987-6543',
        email: 'jane.smith@example.com',
        address: '456 Business Ave, New York, NY 10001'
      },
      earnings: {
        baseRate: 45,
        bonuses: 5,
        total: 50,
        currency: 'USD'
      }
    }))
  }

  // Get countdown timer info
  getCountdownTimer(assignmentId: string): CountdownTimer | null {
    const assignment = assignments.find((a: ShipmentAssignment) => a.id === assignmentId)

    if (!assignment || assignment.status !== 'pending') {
      return null
    }

    const now = Date.now()
    const expiresAt = assignment.expiresAt.getTime()
    const timeRemaining = Math.max(0, expiresAt - now)

    return {
      assignmentId,
      expiresAt: assignment.expiresAt,
      timeRemaining,
      isExpired: timeRemaining === 0,
      warningsSent: 0
    }
  }

  // Update shipment status via QR code scan
  async updateStatusByQRCode(qrCodeData: string, carrierId: string): Promise<any> {
    try {
      const qrData: QRCodeData = JSON.parse(atob(qrCodeData))
      
      // Basic validation
      if (qrData.carrierId !== carrierId) {
        throw new Error('Invalid QR code for this carrier')
      }

      // Check if QR code is not expired (24 hours)
      const maxAge = 24 * 60 * 60 * 1000
      const age = Date.now() - qrData.timestamp
      
      if (age > maxAge) {
        throw new Error('QR code has expired')
      }

      // Return mock status update
      return {
        id: `status_${Date.now()}`,
        shipmentId: qrData.shipmentId,
        carrierId,
        status: 'in_transit',
        timestamp: new Date(),
        qrCodeScanned: true,
        notes: 'Status updated via QR code scan'
      }

    } catch (error) {
      throw new Error(`QR code scan failed: ${error}`)
    }
  }

  // Handle assignment expiry
  async handleAssignmentExpiry(assignmentId: string): Promise<void> {
    const assignment = assignments.find((a: ShipmentAssignment) => a.id === assignmentId)
    
    if (!assignment) {
      console.log(`Assignment ${assignmentId} not found`)
      return
    }

    if (assignment.status !== 'pending') {
      console.log(`Assignment ${assignmentId} already processed`)
      return
    }

    // Mark as expired
    assignment.status = 'expired'
    
    console.log(`⏰ Assignment ${assignmentId} expired for carrier ${assignment.carrierId}`)
  }

  // Generate QR code for shipment
  generateQRCode(shipmentId: string, carrierId: string): string {
    const qrData: QRCodeData = {
      shipmentId,
      carrierId,
      timestamp: Date.now(),
      securityToken: Math.random().toString(36).substr(2, 16),
      allowedActions: ['update_status', 'add_photo', 'add_signature']
    }

    return btoa(JSON.stringify(qrData))
  }
}

export const shipmentAssignmentService = new ShipmentAssignmentService()
export default shipmentAssignmentService
