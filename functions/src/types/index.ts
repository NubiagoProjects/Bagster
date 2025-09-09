import { Timestamp } from 'firebase-admin/firestore';

// User Types
export type UserType = 'client' | 'carrier' | 'supplier' | 'admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type TransportMode = 'air' | 'sea' | 'road';
export type ShipmentStatus =
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'in_transit'
  | 'customs'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

// Address Interface
export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Dimensions Interface
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

// User Interface
export interface User {
  id: string; // Auto-generated document ID
  email: string;
  userType: UserType;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  preferences?: UserPreferences;

  // Additional fields by user type
  profile?: {
    companyName?: string; // For carriers/suppliers
    businessLicense?: string;
    address?: Address;
  };
}

// User Preferences Interface
export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: string;
  timezone: string;
  currency: string;
}

// Carrier Interface
export interface Carrier {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  companyName: string;
  businessLicense: string;
  insuranceNumber?: string;
  transportModes: TransportMode[];
  serviceAreas: {
    countries: string[];
    cities: string[];
  };
  basePricePerKg: number;
  maxWeightCapacity: number;
  rating: number;
  totalReviews: number;
  totalDeliveries: number;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  isActive: boolean;
  isAvailable: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Carrier Route Interface
export interface CarrierRoute {
  id: string;
  carrierId: string;
  origin: Address;
  destination: Address;
  transportMode: TransportMode;
  price: number;
  pricePerKg: number;
  frequency: string;
  estimatedDays: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Shipment Interface
export interface Shipment {
  id: string;
  trackingNumber: string;
  userId: string;
  clientId: string;
  carrierId?: string;
  supplierId?: string;
  originAddress: Address;
  destinationAddress: Address;
  packageWeight: number;
  packageDimensions?: Dimensions;
  packageDescription?: string;
  declaredValue?: number;
  shippingCost: number;
  insuranceCost: number;
  totalCost: number;
  currency: string;
  status: ShipmentStatus;
  estimatedDelivery?: Timestamp;
  actualDelivery?: Timestamp;
  nubiagoOrderId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tracking Event Interface
export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  location?: Address;
  notes?: string;
  createdBy: string;
  createdAt: Timestamp;
}

// Payment Intent Interface
export interface PaymentIntent {
  id: string;
  shipmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string;
  type: 'shipment_update' | 'carrier_confirmation' | 'payment_received' | 'system_alert';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Timestamp;
}

// Carrier Analytics Interface
export interface CarrierAnalytics {
  carrierId: string;
  totalShipments: number;
  completedShipments: number;
  cancelledShipments: number;
  totalRevenue: number;
  averageRating: number;
  onTimeDeliveryRate: number;
  averageDeliveryTime: number;
  activeShipments: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Timestamp;
}

// Platform Analytics Interface
export interface PlatformAnalytics {
  totalUsers: number;
  totalCarriers: number;
  totalShipments: number;
  totalRevenue: number;
  activeShipments: number;
  averageRating: number;
  onTimeDeliveryRate: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Timestamp;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter Types
export interface CarrierSearchFilters {
  countries?: string[];
  cities?: string[];
  transportModes?: TransportMode[];
  maxPrice?: number;
  minRating?: number;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}

export interface ShipmentFilters {
  status?: ShipmentStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  carrierId?: string;
  clientId?: string;
  page?: number;
  limit?: number;
}

export interface UserFilters {
  userType?: UserType;
  isVerified?: boolean;
  isActive?: boolean;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

// NubiaGo Integration Types
export interface NubiaGoQuoteRequest {
  origin: Address;
  destination: Address;
  weight: number;
  dimensions?: Dimensions;
  declaredValue?: number;
  priority?: 'standard' | 'express' | 'economy';
}

export interface NubiaGoQuoteResponse {
  carriers: {
    id: string;
    companyName: string;
    price: number;
    estimatedDays: number;
    rating: number;
    transportMode: TransportMode;
    score: number;
  }[];
  totalQuotes: number;
  request: NubiaGoQuoteRequest;
}

export interface NubiaGoShipmentRequest {
  orderId: string;
  carrierId: string;
  origin: Address;
  destination: Address;
  weight: number;
  dimensions?: Dimensions;
  declaredValue?: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  priority?: 'standard' | 'express' | 'economy';
}

export interface NubiaGoShipmentResponse {
  success: boolean;
  data?: {
    shipmentId: string;
    trackingNumber: string;
    estimatedDelivery: Timestamp;
    totalCost: number;
    currency: string;
  };
  error?: string;
  message?: string;
}

export interface NubiaGoTrackingResponse {
  success: boolean;
  data?: {
    orderId: string;
    trackingNumber: string;
    status: ShipmentStatus;
    origin: Address;
    destination: Address;
    estimatedDelivery: Timestamp;
    actualDelivery?: Timestamp;
    tracking: TrackingEvent[];
  };
  error?: string;
  message?: string;
}

// Webhook Types
export interface WebhookEvent {
  type: 'shipment_created' | 'shipment_updated' | 'carrier_confirmed' | 'delivery_completed';
  data: any;
  timestamp: Timestamp;
  signature?: string;
}