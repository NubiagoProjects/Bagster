export interface Carrier {
  id: string
  name: string
  rating: number
  service_areas: string[]
  transport_modes: string[]
  services: string[]
  insurance_available: boolean
  verified: boolean
  contact: {
    phone: string
    email: string
    website: string
  }
  capabilities: {
    max_weight_kg: number
    max_dimensions_cm: string
    special_handling: string[]
    tracking_available: boolean
    real_time_updates: boolean
  }
  pricing: {
    base_rate_per_kg: number
    minimum_charge: number
    pickup_fee: number
    insurance_rate: number
  }
  coverage: {
    domestic: boolean
    international: boolean
    same_day: boolean
    next_day: boolean
  }
  // Admin fields
  status?: 'pending' | 'approved' | 'rejected' | 'suspended'
  country?: string
  deliveryCountries?: string[]
  totalDeliveries?: number
  joinedAt?: string
  lastActive?: string
}

export interface CreateCarrierRequest {
  name: string
  email: string
  phone: string
  company: string
  country: string
  deliveryCountries: string[]
  pricePerKg: number
  currency: string
  serviceAreas: string[]
  specializations: string[]
  maxWeight: number
  minWeight: number
  estimatedDeliveryDays: number
}

export interface UpdateCarrierRequest extends Partial<CreateCarrierRequest> {
  id: string
  status?: 'pending' | 'approved' | 'rejected' | 'suspended'
}

export interface CarrierFilters {
  status?: string
  country?: string
  deliveryCountry?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}
