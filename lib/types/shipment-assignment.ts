export interface ShipmentAssignment {
  id: string
  shipmentId: string
  carrierId: string
  assignedAt: Date
  expiresAt: Date
  status: 'pending' | 'accepted' | 'expired' | 'declined'
  acceptedAt?: Date
  declinedAt?: Date
  reassignmentCount: number
  previousCarrierIds: string[]
  priority: 'normal' | 'high' | 'urgent'
  autoReassign: boolean
}

export interface ShipmentStatus {
  id: string
  shipmentId: string
  carrierId: string
  status: 'assigned' | 'accepted' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  timestamp: Date
  qrCodeScanned: boolean
  qrCodeData?: string
  notes?: string
  photoProof?: string[]
  signature?: string
}

export interface CarrierShipmentView {
  shipment: {
    id: string
    trackingNumber: string
    origin: string
    destination: string
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    value: number
    currency: string
    specialInstructions?: string
    deliveryDate: Date
    priority: 'normal' | 'express' | 'overnight'
  }
  assignment: ShipmentAssignment
  currentStatus: ShipmentStatus
  statusHistory: ShipmentStatus[]
  customer: {
    name: string
    phone: string
    email: string
    address: string
  }
  sender: {
    name: string
    phone: string
    email: string
    address: string
  }
  earnings: {
    baseRate: number
    bonuses: number
    total: number
    currency: string
  }
}

export interface CarrierDashboardStats {
  totalAssigned: number
  pendingAcceptance: number
  activeShipments: number
  completedToday: number
  totalEarnings: number
  averageRating: number
  onTimeDeliveryRate: number
}

export interface QRCodeData {
  shipmentId: string
  carrierId: string
  timestamp: number
  securityToken: string
  allowedActions: string[]
}

export interface CountdownTimer {
  assignmentId: string
  expiresAt: Date
  timeRemaining: number
  isExpired: boolean
  warningsSent: number
}
