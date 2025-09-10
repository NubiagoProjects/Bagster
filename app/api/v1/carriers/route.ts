import { NextRequest, NextResponse } from 'next/server';
import { Carrier, CreateCarrierRequest, UpdateCarrierRequest } from '@/lib/types/carrier';

// Mock carrier data for admin management
const mockCarriers: Carrier[] = [
  {
    id: 'carrier_001',
    name: 'Express Logistics Nigeria',
    rating: 4.8,
    service_areas: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan'],
    transport_modes: ['air', 'road'],
    services: ['pickup', 'packaging', 'customs_clearance', 'insurance', 'warehousing'],
    insurance_available: true,
    verified: true,
    contact: {
      phone: '+234-800-123-4567',
      email: 'dispatch@expresslogistics.ng',
      website: 'https://expresslogistics.ng'
    },
    capabilities: {
      max_weight_kg: 10000,
      max_dimensions_cm: '500x300x250',
      special_handling: ['fragile', 'hazardous', 'perishable'],
      tracking_available: true,
      real_time_updates: true
    },
    pricing: {
      base_rate_per_kg: 2.50,
      minimum_charge: 25.00,
      pickup_fee: 15.00,
      insurance_rate: 0.02
    },
    coverage: {
      domestic: true,
      international: true,
      same_day: true,
      next_day: true
    },
    status: 'approved',
    country: 'Nigeria',
    deliveryCountries: ['Nigeria', 'Ghana', 'Benin'],
    totalDeliveries: 1247,
    joinedAt: '2023-01-15',
    lastActive: '2024-01-20'
  },
  {
    id: 'carrier_002',
    name: 'Swift Cargo Services',
    rating: 4.6,
    service_areas: ['Lagos', 'Ibadan', 'Benin City', 'Warri', 'Asaba'],
    transport_modes: ['road', 'sea'],
    services: ['pickup', 'delivery', 'warehousing', 'customs_clearance'],
    insurance_available: true,
    verified: true,
    contact: {
      phone: '+234-800-765-4321',
      email: 'bookings@swiftcargo.ng',
      website: 'https://swiftcargo.ng'
    },
    capabilities: {
      max_weight_kg: 5000,
      max_dimensions_cm: '400x250x200',
      special_handling: ['fragile', 'perishable'],
      tracking_available: true,
      real_time_updates: false
    },
    pricing: {
      base_rate_per_kg: 2.20,
      minimum_charge: 20.00,
      pickup_fee: 12.00,
      insurance_rate: 0.015
    },
    coverage: {
      domestic: true,
      international: false,
      same_day: false,
      next_day: true
    },
    status: 'approved',
    country: 'Nigeria',
    deliveryCountries: ['Nigeria'],
    totalDeliveries: 892,
    joinedAt: '2023-03-20',
    lastActive: '2024-01-19'
  },
  {
    id: 'carrier_003',
    name: 'Pan-African Freight',
    rating: 4.9,
    service_areas: ['All Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt'],
    transport_modes: ['air', 'sea', 'road'],
    services: ['pickup', 'packaging', 'customs_clearance', 'insurance', 'warehousing', 'white_glove'],
    insurance_available: true,
    verified: true,
    contact: {
      phone: '+234-800-999-8888',
      email: 'operations@panafricanfreight.com',
      website: 'https://panafricanfreight.com'
    },
    capabilities: {
      max_weight_kg: 50000,
      max_dimensions_cm: '1000x500x400',
      special_handling: ['fragile', 'hazardous', 'perishable', 'oversized', 'high_value'],
      tracking_available: true,
      real_time_updates: true
    },
    pricing: {
      base_rate_per_kg: 3.00,
      minimum_charge: 50.00,
      pickup_fee: 25.00,
      insurance_rate: 0.025
    },
    coverage: {
      domestic: true,
      international: true,
      same_day: true,
      next_day: true
    }
  },
  {
    id: 'carrier_004',
    name: 'Northern Express',
    rating: 4.4,
    service_areas: ['Kano', 'Kaduna', 'Jos', 'Maiduguri', 'Abuja'],
    transport_modes: ['road'],
    services: ['pickup', 'delivery', 'customs_clearance'],
    insurance_available: false,
    verified: true,
    contact: {
      phone: '+234-800-444-5555',
      email: 'info@northernexpress.ng',
      website: 'https://northernexpress.ng'
    },
    capabilities: {
      max_weight_kg: 2000,
      max_dimensions_cm: '300x200x150',
      special_handling: ['fragile'],
      tracking_available: true,
      real_time_updates: false
    },
    pricing: {
      base_rate_per_kg: 1.80,
      minimum_charge: 15.00,
      pickup_fee: 10.00,
      insurance_rate: 0.0
    },
    coverage: {
      domestic: true,
      international: false,
      same_day: false,
      next_day: false
    },
    status: 'approved',
    country: 'Nigeria',
    deliveryCountries: ['Nigeria'],
    totalDeliveries: 634,
    joinedAt: '2023-05-12',
    lastActive: '2024-01-18'
  },
  {
    id: 'carrier_005',
    name: 'Coastal Logistics',
    rating: 4.7,
    service_areas: ['Lagos', 'Port Harcourt', 'Calabar', 'Warri', 'Uyo'],
    transport_modes: ['sea', 'road'],
    services: ['pickup', 'delivery', 'warehousing', 'customs_clearance', 'container_shipping'],
    insurance_available: true,
    verified: true,
    contact: {
      phone: '+234-800-777-6666',
      email: 'shipping@coastallogistics.ng',
      website: 'https://coastallogistics.ng'
    },
    capabilities: {
      max_weight_kg: 25000,
      max_dimensions_cm: '800x400x300',
      special_handling: ['hazardous', 'oversized', 'container'],
      tracking_available: true,
      real_time_updates: true
    },
    pricing: {
      base_rate_per_kg: 2.80,
      minimum_charge: 40.00,
      pickup_fee: 20.00,
      insurance_rate: 0.02
    },
    coverage: {
      domestic: true,
      international: true,
      same_day: false,
      next_day: false
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const country = searchParams.get('country');
    const transportMode = searchParams.get('transport_mode');
    const serviceArea = searchParams.get('service_area');
    const minRating = searchParams.get('min_rating');
    const insuranceRequired = searchParams.get('insurance_required') === 'true';
    const verifiedOnly = searchParams.get('verified_only') === 'true';
    const maxWeight = searchParams.get('max_weight');
    const specialHandling = searchParams.get('special_handling');
    const coverage = searchParams.get('coverage'); // domestic, international, same_day, next_day
    
    // Filter carriers based on criteria
    let filteredCarriers = mockCarriers.filter(carrier => {
      // Country filter (assuming Nigeria for now)
      if (country && country.toLowerCase() !== 'nigeria') {
        return false;
      }
      
      // Transport mode filter
      if (transportMode && !carrier.transport_modes.includes(transportMode)) {
        return false;
      }
      
      // Service area filter
      if (serviceArea) {
        const hasServiceArea = carrier.service_areas.some(area => 
          area.toLowerCase().includes(serviceArea.toLowerCase()) || 
          area === 'All Nigeria'
        );
        if (!hasServiceArea) return false;
      }
      
      // Rating filter
      if (minRating && carrier.rating < parseFloat(minRating)) {
        return false;
      }
      
      // Insurance filter
      if (insuranceRequired && !carrier.insurance_available) {
        return false;
      }
      
      // Verified only filter
      if (verifiedOnly && !carrier.verified) {
        return false;
      }
      
      // Max weight filter
      if (maxWeight && carrier.capabilities.max_weight_kg < parseFloat(maxWeight)) {
        return false;
      }
      
      // Special handling filter
      if (specialHandling && !carrier.capabilities.special_handling.includes(specialHandling)) {
        return false;
      }
      
      // Coverage filter
      if (coverage) {
        const coverageType = coverage as keyof typeof carrier.coverage;
        if (!carrier.coverage[coverageType]) {
          return false;
        }
      }
      
      return true;
    });
    
    // Sort carriers by rating (highest first)
    filteredCarriers.sort((a, b) => b.rating - a.rating);
    
    // Format response data
    const carriersData = filteredCarriers.map(carrier => ({
      id: carrier.id,
      name: carrier.name,
      rating: carrier.rating,
      service_areas: carrier.service_areas,
      transport_modes: carrier.transport_modes,
      services: carrier.services,
      insurance_available: carrier.insurance_available,
      verified: carrier.verified,
      contact: carrier.contact,
      capabilities: {
        max_weight_kg: carrier.capabilities.max_weight_kg,
        max_dimensions_cm: carrier.capabilities.max_dimensions_cm,
        special_handling: carrier.capabilities.special_handling,
        tracking_available: carrier.capabilities.tracking_available,
        real_time_updates: carrier.capabilities.real_time_updates
      },
      pricing: {
        base_rate_per_kg: carrier.pricing.base_rate_per_kg,
        minimum_charge: carrier.pricing.minimum_charge,
        pickup_fee: carrier.pricing.pickup_fee,
        currency: 'USD'
      },
      coverage: carrier.coverage
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        carriers: carriersData,
        total_count: carriersData.length,
        filters_applied: {
          country,
          transport_mode: transportMode,
          service_area: serviceArea,
          min_rating: minRating,
          insurance_required: insuranceRequired,
          verified_only: verifiedOnly,
          max_weight: maxWeight,
          special_handling: specialHandling,
          coverage
        }
      }
    });
    
  } catch (error) {
    console.error('Carriers fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch carriers'
    }, { status: 500 });
  }
}

// POST - Create new carrier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newCarrier: Carrier = {
      id: `carrier_${Date.now()}`,
      name: body.name,
      rating: 0,
      service_areas: body.serviceAreas || [],
      transport_modes: body.transportModes || ['road'],
      services: body.services || ['pickup', 'delivery'],
      insurance_available: body.insuranceAvailable || false,
      verified: false,
      contact: {
        phone: body.phone,
        email: body.email,
        website: body.website || ''
      },
      capabilities: {
        max_weight_kg: body.maxWeight || 1000,
        max_dimensions_cm: body.maxDimensions || '200x150x100',
        special_handling: body.specialHandling || [],
        tracking_available: body.trackingAvailable || true,
        real_time_updates: body.realTimeUpdates || false
      },
      pricing: {
        base_rate_per_kg: body.pricePerKg,
        minimum_charge: body.minimumCharge || 10.00,
        pickup_fee: body.pickupFee || 5.00,
        insurance_rate: body.insuranceRate || 0.01
      },
      coverage: {
        domestic: body.domesticCoverage || true,
        international: body.internationalCoverage || false,
        same_day: body.sameDayCoverage || false,
        next_day: body.nextDayCoverage || true
      },
      status: 'pending',
      country: body.country,
      deliveryCountries: body.deliveryCountries || [body.country],
      totalDeliveries: 0,
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    };

    mockCarriers.push(newCarrier);

    return NextResponse.json({
      success: true,
      data: newCarrier,
      message: 'Carrier created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Carrier creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create carrier'
    }, { status: 500 });
  }
}

// PUT - Update carrier
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const carrierId = body.id;

    const carrierIndex = mockCarriers.findIndex(c => c.id === carrierId);
    if (carrierIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Carrier not found'
      }, { status: 404 });
    }

    // Update carrier data
    const updatedCarrier = {
      ...mockCarriers[carrierIndex],
      ...body,
      lastActive: new Date().toISOString().split('T')[0]
    };

    mockCarriers[carrierIndex] = updatedCarrier;

    return NextResponse.json({
      success: true,
      data: updatedCarrier,
      message: 'Carrier updated successfully'
    });

  } catch (error) {
    console.error('Carrier update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update carrier'
    }, { status: 500 });
  }
}

// DELETE - Delete carrier
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const carrierId = searchParams.get('id');

    if (!carrierId) {
      return NextResponse.json({
        success: false,
        error: 'Carrier ID is required'
      }, { status: 400 });
    }

    const carrierIndex = mockCarriers.findIndex(c => c.id === carrierId);
    if (carrierIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Carrier not found'
      }, { status: 404 });
    }

    mockCarriers.splice(carrierIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Carrier deleted successfully'
    });

  } catch (error) {
    console.error('Carrier deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete carrier'
    }, { status: 500 });
  }
}
