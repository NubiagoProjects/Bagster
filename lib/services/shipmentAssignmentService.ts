'use client'

import { ShipmentAssignment, ShipmentStatus, CarrierShipmentView, CountdownTimer, QRCodeData } from '@/lib/types/shipment-assignment'

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

// Real-time database collections
const assignmentsCollection = collection(db, 'shipment_assignments');
const statusesCollection = collection(db, 'shipment_statuses');
let countdownTimers: Map<string, NodeJS.Timeout> = new Map()

export class ShipmentAssignmentService {
  private readonly ASSIGNMENT_TIMEOUT_HOURS = 7
  private readonly MAX_REASSIGNMENT_ATTEMPTS = 3

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

    // Create initial status
    await this.createStatusUpdate(shipmentId, carrierId, 'assigned', {
      notes: 'Shipment assigned to carrier',
      qrCodeScanned: false
    })

    // Start countdown timer
    this.startCountdownTimer(assignment)

    // Send notification to carrier
    await this.notifyCarrierAssignment(carrierId, assignment)

    console.log(`📦 Shipment ${shipmentId} assigned to carrier ${carrierId}, expires at ${expiresAt.toISOString()}`)
    
    return assignment
  }

  // Accept assignment
  async acceptAssignment(assignmentId: string, carrierId: string): Promise<ShipmentAssignment> {
    try {
      const assignmentDoc = await getDoc(doc(assignmentsCollection, assignmentId));
      
      if (!assignmentDoc.exists()) {
        throw new Error('Assignment not found');
      }

      const assignment = { id: assignmentDoc.id, ...assignmentDoc.data() } as ShipmentAssignment;

      if (assignment.carrierId !== carrierId) {
        throw new Error('Assignment not assigned to this carrier');
      }

      if (assignment.status !== 'pending') {
        throw new Error(`Assignment already ${assignment.status}`);
      }

      if (new Date() > assignment.expiresAt.toDate()) {
        await updateDoc(doc(assignmentsCollection, assignmentId), {
          status: 'expired',
          updatedAt: serverTimestamp()
        });
        throw new Error('Assignment has expired');
      }

      // Update assignment
      await updateDoc(doc(assignmentsCollection, assignmentId), {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Clear countdown timer
      this.clearCountdownTimer(assignmentId);

      // Create initial status
      await this.createShipmentStatus(assignment.shipmentId, 'accepted', carrierId, 'Assignment accepted by carrier');

      return { ...assignment, status: 'accepted', acceptedAt: new Date() };
    } catch (error) {
      throw new Error(`Failed to accept assignment: ${error}`);
    }
    return true
  }

  // Decline shipment assignment
  async declineAssignment(assignmentId: string, carrierId: string, reason?: string): Promise<void> {
    const assignment = assignments.find(a => a.id === assignmentId && a.carrierId === carrierId)
    
    if (!assignment) {
      throw new Error('Assignment not found or not assigned to this carrier')
    }

    if (assignment.status !== 'pending') {
      throw new Error(`Assignment already ${assignment.status}`)
    }

    // Update assignment
    assignment.status = 'declined'
    assignment.declinedAt = new Date()

    // Clear countdown timer
    this.clearCountdownTimer(assignmentId)

    // Trigger reassignment
    await this.reassignShipment(assignment, reason)

    console.log(`❌ Assignment ${assignmentId} declined by carrier ${carrierId}`)
  }

  // Auto-reassignment when timer expires
  private async handleAssignmentExpiry(assignment: ShipmentAssignment): Promise<void> {
    console.log(`⏰ Assignment ${assignment.id} expired for carrier ${assignment.carrierId}`)
    
    assignment.status = 'expired'
    
    // Trigger reassignment
    await this.reassignShipment(assignment, 'Assignment expired - no response from carrier')
  }

  // Reassign shipment to next best carrier
  private async reassignShipment(originalAssignment: ShipmentAssignment, reason: string): Promise<void> {
    if (originalAssignment.reassignmentCount >= this.MAX_REASSIGNMENT_ATTEMPTS) {
      console.error(`🚨 Max reassignment attempts reached for shipment ${originalAssignment.shipmentId}`)
      await this.escalateToAdmin(originalAssignment, reason)
      return
    }

    try {
      // Get next best carrier using smart selection (excluding previous carriers)
      const nextCarrier = await this.getNextBestCarrier(
        originalAssignment.shipmentId,
        [...originalAssignment.previousCarrierIds, originalAssignment.carrierId]
      )

      if (!nextCarrier) {
        console.error(`🚨 No available carriers for shipment ${originalAssignment.shipmentId}`)
        await this.escalateToAdmin(originalAssignment, 'No available carriers')
        return
      }

      // Create new assignment
      const newAssignment = await this.createAssignment(
        originalAssignment.shipmentId,
        nextCarrier.id,
        originalAssignment.priority
      )

      // Update reassignment tracking
      newAssignment.reassignmentCount = originalAssignment.reassignmentCount + 1
      newAssignment.previousCarrierIds = [...originalAssignment.previousCarrierIds, originalAssignment.carrierId]

      console.log(`🔄 Shipment ${originalAssignment.shipmentId} reassigned to carrier ${nextCarrier.id} (attempt ${newAssignment.reassignmentCount})`)
      
    } catch (error) {
      console.error('Failed to reassign shipment:', error)
      await this.escalateToAdmin(originalAssignment, `Reassignment failed: ${error}`)
    }
  }

  // Get next best carrier using smart selection
  private async getNextBestCarrier(shipmentId: string, excludeCarrierIds: string[]): Promise<any> {
    // Mock implementation - integrate with actual smart carrier selection
    const availableCarriers = [
      { id: 'carrier_1', name: 'FastTrack Logistics', rating: 4.8, available: true },
      { id: 'carrier_2', name: 'Swift Delivery', rating: 4.6, available: true },
      { id: 'carrier_3', name: 'Express Couriers', rating: 4.7, available: true },
      { id: 'carrier_4', name: 'Quick Ship', rating: 4.5, available: true }
    ]

    const eligibleCarriers = availableCarriers.filter(
      carrier => !excludeCarrierIds.includes(carrier.id) && carrier.available
    )

    // Return highest rated available carrier
    return eligibleCarriers.sort((a, b) => b.rating - a.rating)[0] || null
  }

  // Start countdown timer for assignment
  private startCountdownTimer(assignment: ShipmentAssignment): void {
    const timeUntilExpiry = assignment.expiresAt.getTime() - Date.now()
    
    if (timeUntilExpiry <= 0) {
      this.handleAssignmentExpiry(assignment)
      return
    }

    const timer = setTimeout(() => {
      this.handleAssignmentExpiry(assignment)
    }, timeUntilExpiry)

    countdownTimers.set(assignment.id, timer)

    // Set warning timers (1 hour and 30 minutes before expiry)
    const oneHourWarning = timeUntilExpiry - (60 * 60 * 1000)
    const thirtyMinWarning = timeUntilExpiry - (30 * 60 * 1000)

    if (oneHourWarning > 0) {
      setTimeout(() => {
        this.sendExpiryWarning(assignment, '1 hour')
      }, oneHourWarning)
    }

    if (thirtyMinWarning > 0) {
      setTimeout(() => {
        this.sendExpiryWarning(assignment, '30 minutes')
      }, thirtyMinWarning)
    }
  }

  // Clear countdown timer
  private clearCountdownTimer(assignmentId: string): void {
    const timer = countdownTimers.get(assignmentId)
    if (timer) {
      clearTimeout(timer)
      countdownTimers.delete(assignmentId)
    }
  }

  // Send expiry warning to carrier
  private async sendExpiryWarning(assignment: ShipmentAssignment, timeRemaining: string): Promise<void> {
    console.log(`⚠️ Sending ${timeRemaining} warning to carrier ${assignment.carrierId} for assignment ${assignment.id}`)
    // Integrate with notification service
  }

  // Escalate to admin when all reassignment attempts fail
  private async escalateToAdmin(assignment: ShipmentAssignment, reason: string): Promise<void> {
    console.log(`🚨 ADMIN ESCALATION: Shipment ${assignment.shipmentId} - ${reason}`)
    // Integrate with admin notification system
  }

  // Notify carrier of new assignment
  private async notifyCarrierAssignment(carrierId: string, assignment: ShipmentAssignment): Promise<void> {
    console.log(`📱 Notifying carrier ${carrierId} of new assignment ${assignment.id}`)
    // Integrate with push notification service
  }

  // Create status update
  async createStatusUpdate(
    shipmentId: string,
    carrierId: string,
    status: ShipmentStatus['status'],
    data: Partial<ShipmentStatus> = {}
  ): Promise<ShipmentStatus> {
    const statusUpdate: ShipmentStatus = {
      id: `status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shipmentId,
      carrierId,
      status,
      timestamp: new Date(),
      qrCodeScanned: data.qrCodeScanned || false,
      qrCodeData: data.qrCodeData,
      location: data.location,
      notes: data.notes,
      photoProof: data.photoProof,
      signature: data.signature
    }

    shipmentStatuses.push(statusUpdate)
    
    console.log(`📊 Status update: ${shipmentId} -> ${status}`)
    
    return statusUpdate
  }

  // Update shipment status via QR code scan
  async updateStatusByQRCode(qrCodeData: string, carrierId: string): Promise<ShipmentStatus> {
    try {
      const qrData: QRCodeData = JSON.parse(atob(qrCodeData))
      
      // Validate QR code
      if (!this.validateQRCode(qrData, carrierId)) {
        throw new Error('Invalid or expired QR code')
      }

      // Check if carrier is assigned to this shipment
      const assignment = assignments.find(
        a => a.shipmentId === qrData.shipmentId && 
             a.carrierId === carrierId && 
             a.status === 'accepted'
      )

      if (!assignment) {
        throw new Error('Shipment not assigned to this carrier or not accepted')
      }

      // Determine next status based on current status
      const currentStatus = this.getCurrentShipmentStatus(qrData.shipmentId)
      const nextStatus = this.getNextStatus(currentStatus?.status || 'accepted')

      return await this.createStatusUpdate(qrData.shipmentId, carrierId, nextStatus, {
        qrCodeScanned: true,
        qrCodeData,
        notes: `Status updated via QR code scan`
      })

    } catch (error) {
      throw new Error(`QR code scan failed: ${error}`)
    }
  }

  // Get current shipment status
  getCurrentShipmentStatus(shipmentId: string): ShipmentStatus | null {
    const statuses = shipmentStatuses
      .filter(s => s.shipmentId === shipmentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    
    return statuses[0] || null
  }

  // Get next logical status
  private getNextStatus(currentStatus: string): ShipmentStatus['status'] {
    const statusFlow: Record<string, ShipmentStatus['status']> = {
      'assigned': 'accepted',
      'accepted': 'picked_up',
      'picked_up': 'in_transit',
      'in_transit': 'out_for_delivery',
      'out_for_delivery': 'delivered'
    }

    return statusFlow[currentStatus] || 'in_transit'
  }

  // Validate QR code
  private validateQRCode(qrData: QRCodeData, carrierId: string): boolean {
    // Check if QR code is not expired (valid for 24 hours)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    const age = Date.now() - qrData.timestamp
    
    if (age > maxAge) {
      return false
    }

    // Check if carrier matches
    if (qrData.carrierId !== carrierId) {
      return false
    }

    // Additional security validation would go here
    return true
  }

  // Get carrier's shipments with different views
  async getCarrierShipments(
    carrierId: string,
    view: 'all' | 'pending' | 'accepted' | 'active'
  ): Promise<CarrierShipmentView[]> {
    let filteredAssignments = assignments.filter(a => a.carrierId === carrierId)

    switch (view) {
      case 'pending':
        filteredAssignments = filteredAssignments.filter(a => a.status === 'pending')
        break
      case 'accepted':
        filteredAssignments = filteredAssignments.filter(a => a.status === 'accepted')
        break
      case 'active':
        filteredAssignments = filteredAssignments.filter(a => 
          a.status === 'accepted' && 
          !this.isShipmentDelivered(a.shipmentId)
        )
        break
      // 'all' returns everything
    }

    // Convert to CarrierShipmentView format
    return filteredAssignments.map(assignment => this.buildCarrierShipmentView(assignment))
  }

  // Check if shipment is delivered
  private isShipmentDelivered(shipmentId: string): boolean {
    const currentStatus = this.getCurrentShipmentStatus(shipmentId)
    return currentStatus?.status === 'delivered'
  }

  // Build carrier shipment view
  private buildCarrierShipmentView(assignment: ShipmentAssignment): CarrierShipmentView {
    const currentStatus = this.getCurrentShipmentStatus(assignment.shipmentId)
    const statusHistory = shipmentStatuses
      .filter(s => s.shipmentId === assignment.shipmentId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    // Mock shipment data - replace with actual database query
    return {
      shipment: {
        id: assignment.shipmentId,
        trackingNumber: `BG${assignment.shipmentId.slice(-8).toUpperCase()}`,
        origin: 'Lagos, Nigeria',
        destination: 'Abuja, Nigeria',
        weight: 2.5,
        dimensions: { length: 30, width: 20, height: 15 },
        value: 50000,
        currency: 'NGN',
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: assignment.priority === 'urgent' ? 'express' : 'normal'
      },
      assignment,
      currentStatus: currentStatus!,
      statusHistory,
      customer: {
        name: 'John Doe',
        phone: '+234 801 234 5678',
        email: 'john.doe@example.com',
        address: '123 Main Street, Abuja'
      },
      sender: {
        name: 'Jane Smith',
        phone: '+234 802 345 6789',
        email: 'jane.smith@example.com',
        address: '456 Business Ave, Lagos'
      },
      earnings: {
        baseRate: 5000,
        bonuses: 500,
        total: 5500,
        currency: 'NGN'
      }
    }
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

  // Get countdown timer info
  getCountdownTimer(assignmentId: string): CountdownTimer | null {
    const assignment = assignments.find(a => a.id === assignmentId)
    
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
      warningsSent: 0 // Track in production
    }
  }
}

export const shipmentAssignmentService = new ShipmentAssignmentService()
export default shipmentAssignmentService
