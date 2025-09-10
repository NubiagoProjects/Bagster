/**
 * Bagster JavaScript/TypeScript SDK
 * Official SDK for integrating Bagster logistics API into your applications
 */

export interface BagsterConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface ShippingRate {
  id: string;
  name: string;
  rating: number;
  price_per_kg: number;
  total_cost: number;
  delivery_time: string;
  transport_modes: string[];
  services: string[];
  insurance_available: boolean;
  tracking_available: boolean;
  currency: string;
}

export interface RateRequest {
  origin: string;
  destination: string;
  weight: number;
  dimensions?: string;
  transport_mode?: 'air' | 'sea' | 'road';
  package_type?: 'standard' | 'fragile' | 'hazardous' | 'perishable';
  insurance_required?: boolean;
  pickup_required?: boolean;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface ShipmentRequest {
  carrier_id: string;
  origin: string;
  destination: string;
  weight: number;
  dimensions?: string;
  description?: string;
  pickup_address: string;
  delivery_address: string;
  contact_info: ContactInfo;
  declared_value?: number;
  special_instructions?: string;
  preferred_pickup_time?: string;
  insurance_required?: boolean;
}

export interface Shipment {
  shipment_id: string;
  tracking_number: string;
  status: string;
  carrier: {
    id: string;
    name: string;
    contact?: string;
  };
  estimated_delivery: string;
  total_cost: number;
  currency: string;
  pickup_address: string;
  delivery_address: string;
  created_at: string;
}

export interface TrackingInfo {
  tracking_number: string;
  status: string;
  carrier: string;
  origin: string;
  destination: string;
  estimated_delivery: string;
  current_location: string;
  timeline: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
  package_info: {
    weight: number;
    dimensions?: string;
    description?: string;
  };
}

export interface Carrier {
  id: string;
  name: string;
  rating: number;
  service_areas: string[];
  transport_modes: string[];
  services: string[];
  insurance_available: boolean;
  verified: boolean;
  contact: {
    phone: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SmartSelectionCriteria {
  prioritize: 'cheapest' | 'best_rated' | 'balanced' | 'destination_focused';
  destination_country?: string;
  max_price?: number;
  min_rating?: number;
  required_services?: string[];
}

export interface CarrierScore {
  id: string;
  name: string;
  rating: number;
  total_cost: number;
  price_per_kg: number;
  delivery_time: string;
  transport_modes: string[];
  services: string[];
  insurance_available: boolean;
  tracking_available: boolean;
  currency: string;
  deliveryCountries: string[];
  status: string;
  priceScore: number;
  ratingScore: number;
  destinationScore: number;
  totalScore: number;
  selectionReason: string;
}

export interface SmartSelectionResponse {
  selected_carrier: CarrierScore;
  recommendations: CarrierScore[];
  selection_criteria: SmartSelectionCriteria;
  total_evaluated: number;
  scoring_breakdown: {
    weights_used: {
      price: number;
      rating: number;
      destination: number;
    };
    explanation: string;
  };
  route_info: {
    origin: string;
    destination: string;
    weight: number;
    estimated_distance_km: number;
  };
}

export class BagsterSDK {
  private config: BagsterConfig;
  private baseUrl: string;

  constructor(config: BagsterConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.bagster.com';
    
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Bagster-JS-SDK/1.0.0'
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, mergedOptions);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  /**
   * Get shipping rates from available carriers
   */
  async getRates(request: RateRequest): Promise<ApiResponse<{ carriers: ShippingRate[]; total_carriers: number }>> {
    const params = new URLSearchParams();
    
    params.append('origin', request.origin);
    params.append('destination', request.destination);
    params.append('weight', request.weight.toString());
    
    if (request.dimensions) params.append('dimensions', request.dimensions);
    if (request.transport_mode) params.append('transport_mode', request.transport_mode);
    if (request.package_type) params.append('package_type', request.package_type);
    if (request.insurance_required !== undefined) params.append('insurance_required', request.insurance_required.toString());
    if (request.pickup_required !== undefined) params.append('pickup_required', request.pickup_required.toString());

    return this.makeRequest(`/api/v1/rates?${params.toString()}`);
  }

  /**
   * Create a new shipment
   */
  async createShipment(request: ShipmentRequest): Promise<ApiResponse<Shipment>> {
    return this.makeRequest('/api/v1/shipments', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  /**
   * Track a shipment by tracking number
   */
  async trackShipment(trackingNumber: string): Promise<ApiResponse<TrackingInfo>> {
    return this.makeRequest(`/api/v1/tracking/${trackingNumber}`);
  }

  /**
   * Get available carriers
   */
  async getCarriers(filters?: {
    country?: string;
    transport_mode?: string;
    service_area?: string;
    min_rating?: number;
    insurance_required?: boolean;
    verified_only?: boolean;
  }): Promise<ApiResponse<{ carriers: Carrier[]; total_count: number }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const query = params.toString();
    return this.makeRequest(`/api/v1/carriers${query ? `?${query}` : ''}`);
  }

  /**
   * Smart carrier selection with multi-criteria scoring
   */
  async selectBestCarrier(
    origin: string,
    destination: string,
    weight: number,
    criteria?: SmartSelectionCriteria,
    options?: any
  ): Promise<ApiResponse<SmartSelectionResponse>> {
    const requestBody = {
      origin,
      destination,
      weight,
      selection_criteria: criteria || { prioritize: 'balanced' },
      options: options || {}
    };

    return this.makeRequest('/api/v1/smart-selection', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  }

  /**
   * Get cheapest carrier (optimized for price)
   */
  async getCheapestCarrier(
    origin: string,
    destination: string,
    weight: number,
    options?: any
  ): Promise<ApiResponse<SmartSelectionResponse>> {
    return this.selectBestCarrier(origin, destination, weight, {
      prioritize: 'cheapest'
    }, options);
  }

  /**
   * Get best rated carrier (optimized for quality)
   */
  async getBestRatedCarrier(
    origin: string,
    destination: string,
    weight: number,
    options?: any
  ): Promise<ApiResponse<SmartSelectionResponse>> {
    return this.selectBestCarrier(origin, destination, weight, {
      prioritize: 'best_rated'
    }, options);
  }

  /**
   * Get carrier optimized for destination country
   */
  async getDestinationOptimizedCarrier(
    origin: string,
    destination: string,
    weight: number,
    destinationCountry: string,
    options?: any
  ): Promise<ApiResponse<SmartSelectionResponse>> {
    return this.selectBestCarrier(origin, destination, weight, {
      prioritize: 'destination_focused',
      destination_country: destinationCountry
    }, options);
  }

  /**
   * Calculate shipping cost estimate (legacy method - now uses smart selection)
   */
  async calculateCost(
    origin: string, 
    destination: string, 
    weight: number, 
    carrierId?: string
  ): Promise<ApiResponse<{ estimated_cost: number; currency: string }>> {
    if (carrierId) {
      // If specific carrier requested, use original logic
      const ratesResponse = await this.getRates({ origin, destination, weight });
      
      if (!ratesResponse.success || !ratesResponse.data) {
        return {
          success: false,
          error: ratesResponse.error || 'Failed to get rates',
          data: undefined
        };
      }

      const selectedCarrier = ratesResponse.data.carriers.find(c => c.id === carrierId) || ratesResponse.data.carriers[0];

      return {
        success: true,
        data: {
          estimated_cost: selectedCarrier?.total_cost || 0,
          currency: selectedCarrier?.currency || 'USD'
        }
      };
    } else {
      // Use smart selection for best carrier
      const smartResponse = await this.selectBestCarrier(origin, destination, weight);
      
      if (!smartResponse.success || !smartResponse.data) {
        return {
          success: false,
          error: smartResponse.error || 'Failed to get smart selection',
          data: undefined
        };
      }

      return {
        success: true,
        data: {
          estimated_cost: smartResponse.data.selected_carrier.total_cost,
          currency: smartResponse.data.selected_carrier.currency
        }
      };
    }
  }

  /**
   * Validate an address (basic validation)
   */
  validateAddress(address: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!address || address.trim().length < 10) {
      errors.push('Address must be at least 10 characters long');
    }
    
    if (!address.includes(',')) {
      errors.push('Address should include city and country (e.g., "Lagos, Nigeria")');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Format tracking number for display
   */
  formatTrackingNumber(trackingNumber: string): string {
    if (!trackingNumber) return '';
    
    // Format as BGS-123456-ABC
    if (trackingNumber.length === 12 && trackingNumber.startsWith('BGS')) {
      return `${trackingNumber.slice(0, 3)}-${trackingNumber.slice(3, 9)}-${trackingNumber.slice(9)}`;
    }
    
    return trackingNumber;
  }

  /**
   * Get estimated delivery date
   */
  getEstimatedDelivery(deliveryTime: string): Date {
    const days = parseInt(deliveryTime.split('-')[0]) || 3;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate;
  }
}

// Export convenience functions
export const createBagsterClient = (apiKey: string, options?: Partial<BagsterConfig>) => {
  return new BagsterSDK({ apiKey, ...options });
};

// React Hook for easy integration
export const useBagster = (apiKey: string) => {
  const client = new BagsterSDK({ apiKey });
  
  return {
    getRates: client.getRates.bind(client),
    createShipment: client.createShipment.bind(client),
    trackShipment: client.trackShipment.bind(client),
    getCarriers: client.getCarriers.bind(client),
    calculateCost: client.calculateCost.bind(client),
    validateAddress: client.validateAddress.bind(client),
    formatTrackingNumber: client.formatTrackingNumber.bind(client)
  };
};

export default BagsterSDK;
