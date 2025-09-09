import { NextRequest, NextResponse } from 'next/server';

// Mock carrier data for demonstration
const mockCarriers = [
  {
    id: 'carrier_001',
    name: 'Express Logistics Nigeria',
    rating: 4.8,
    baseRatePerKg: 2.50,
    transportModes: ['air', 'road'],
    services: ['pickup', 'packaging', 'customs_clearance'],
    serviceAreas: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'],
    insuranceAvailable: true
  },
  {
    id: 'carrier_002',
    name: 'Swift Cargo Services',
    rating: 4.6,
    baseRatePerKg: 2.20,
    transportModes: ['road', 'sea'],
    services: ['pickup', 'delivery', 'warehousing'],
    serviceAreas: ['Lagos', 'Ibadan', 'Benin City'],
    insuranceAvailable: true
  },
  {
    id: 'carrier_003',
    name: 'Pan-African Freight',
    rating: 4.9,
    baseRatePerKg: 3.00,
    transportModes: ['air', 'sea', 'road'],
    services: ['pickup', 'packaging', 'customs_clearance', 'insurance'],
    serviceAreas: ['All Nigeria', 'Ghana', 'Kenya', 'South Africa'],
    insuranceAvailable: true
  }
];

function calculateDistance(origin: string, destination: string): number {
  // Simplified distance calculation for demo
  const distances: { [key: string]: number } = {
    'Lagos-Abuja': 750,
    'Lagos-Kano': 1050,
    'Abuja-Kano': 350,
    'Lagos-Port Harcourt': 500,
    'Abuja-Port Harcourt': 600,
    'Lagos-Ibadan': 130,
    'Lagos-Benin City': 320
  };

  const originCity = origin.split(',')[0].trim();
  const destCity = destination.split(',')[0].trim();
  const key = `${originCity}-${destCity}`;
  
  return distances[key] || distances[`${destCity}-${originCity}`] || 500;
}

function calculateShippingRate(carrier: any, distance: number, weight: number, options: any = {}) {
  let baseRate = carrier.baseRatePerKg;
  
  // Distance multiplier
  const distanceMultiplier = Math.max(1, distance / 500);
  
  // Weight breaks
  let weightMultiplier = 1;
  if (weight > 100) weightMultiplier = 0.9; // Bulk discount
  if (weight > 500) weightMultiplier = 0.8;
  
  // Transport mode multiplier
  const transportMultipliers: { [key: string]: number } = {
    road: 1.0,
    sea: 0.8,
    air: 1.5
  };
  
  const transportMode = options.transport_mode || 'road';
  const transportMultiplier = transportMultipliers[transportMode] || 1.0;
  
  const pricePerKg = baseRate * distanceMultiplier * weightMultiplier * transportMultiplier;
  let totalCost = pricePerKg * weight;
  
  // Additional services
  if (options.insurance_required) totalCost += totalCost * 0.02;
  if (options.pickup_required !== false) totalCost += 15; // Pickup fee
  
  // Delivery time estimation
  const baseDeliveryDays = Math.ceil(distance / (transportMode === 'air' ? 1000 : 300));
  const deliveryTime = `${baseDeliveryDays}-${baseDeliveryDays + 1} days`;
  
  return {
    pricePerKg: Math.round(pricePerKg * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    deliveryTime
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate required parameters
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const weight = searchParams.get('weight');
    
    if (!origin || !destination || !weight) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: origin, destination, weight'
      }, { status: 400 });
    }
    
    // Optional parameters
    const dimensions = searchParams.get('dimensions');
    const transportMode = searchParams.get('transport_mode');
    const packageType = searchParams.get('package_type') || 'standard';
    const insuranceRequired = searchParams.get('insurance_required') === 'true';
    const pickupRequired = searchParams.get('pickup_required') !== 'false';
    
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Weight must be a positive number'
      }, { status: 400 });
    }
    
    // Calculate distance
    const distance = calculateDistance(origin, destination);
    
    // Filter carriers based on criteria
    let availableCarriers = mockCarriers.filter(carrier => {
      // Check if carrier serves the route
      const originCity = origin.split(',')[0].trim();
      const destCity = destination.split(',')[0].trim();
      
      const servesOrigin = carrier.serviceAreas.some(area => 
        area.includes(originCity) || area === 'All Nigeria'
      );
      const servesDest = carrier.serviceAreas.some(area => 
        area.includes(destCity) || area === 'All Nigeria'
      );
      
      if (!servesOrigin || !servesDest) return false;
      
      // Check transport mode
      if (transportMode && !carrier.transportModes.includes(transportMode)) {
        return false;
      }
      
      return true;
    });
    
    // Calculate rates for each carrier
    const carriersWithRates = availableCarriers.map(carrier => {
      const rates = calculateShippingRate(carrier, distance, weightNum, {
        transport_mode: transportMode,
        insurance_required: insuranceRequired,
        pickup_required: pickupRequired,
        package_type: packageType
      });
      
      return {
        id: carrier.id,
        name: carrier.name,
        rating: carrier.rating,
        price_per_kg: rates.pricePerKg,
        total_cost: rates.totalCost,
        delivery_time: rates.deliveryTime,
        transport_modes: carrier.transportModes,
        services: carrier.services,
        insurance_available: carrier.insuranceAvailable,
        tracking_available: true,
        currency: 'USD'
      };
    });
    
    // Sort by total cost
    carriersWithRates.sort((a, b) => a.total_cost - b.total_cost);
    
    return NextResponse.json({
      success: true,
      data: {
        carriers: carriersWithRates,
        total_carriers: carriersWithRates.length,
        origin,
        destination,
        weight: weightNum,
        estimated_distance_km: distance,
        search_criteria: {
          transport_mode: transportMode,
          package_type: packageType,
          insurance_required: insuranceRequired,
          pickup_required: pickupRequired
        }
      }
    });
    
  } catch (error) {
    console.error('Rate calculation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
