import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Mock data for demonstration
const mockCarriers = [
  {
    id: 'carrier_001',
    name: 'Express Logistics Nigeria',
    rating: 4.8,
    contact: { phone: '+234-800-123-4567', email: 'dispatch@expresslogistics.ng' }
  },
  {
    id: 'carrier_002', 
    name: 'Swift Cargo Services',
    rating: 4.6,
    contact: { phone: '+234-800-765-4321', email: 'bookings@swiftcargo.ng' }
  },
  {
    id: 'carrier_003',
    name: 'Pan-African Freight',
    rating: 4.9,
    contact: { phone: '+234-800-999-8888', email: 'operations@panafricanfreight.com' }
  }
];

function generateTrackingNumber(): string {
  const prefix = 'BGS';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

function calculateEstimatedDelivery(deliveryTime: string): string {
  const days = parseInt(deliveryTime.split('-')[0]);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate.toISOString().split('T')[0];
}

function calculateShippingCost(origin: string, destination: string, weight: number, carrierId: string): number {
  // Simplified cost calculation
  const distance = calculateDistance(origin, destination);
  const baseRate = 2.5; // Base rate per kg
  const distanceMultiplier = Math.max(1, distance / 500);
  
  let carrierMultiplier = 1.0;
  if (carrierId === 'carrier_003') carrierMultiplier = 1.2; // Premium carrier
  if (carrierId === 'carrier_002') carrierMultiplier = 0.9; // Economy carrier
  
  const totalCost = baseRate * weight * distanceMultiplier * carrierMultiplier + 15; // +15 pickup fee
  return Math.round(totalCost * 100) / 100;
}

function calculateDistance(origin: string, destination: string): number {
  const distances: { [key: string]: number } = {
    'Lagos-Abuja': 750,
    'Lagos-Kano': 1050,
    'Abuja-Kano': 350,
    'Lagos-Port Harcourt': 500,
    'Abuja-Port Harcourt': 600,
    'Lagos-Ibadan': 130
  };

  const originCity = origin.split(',')[0].trim();
  const destCity = destination.split(',')[0].trim();
  const key = `${originCity}-${destCity}`;
  
  return distances[key] || distances[`${destCity}-${originCity}`] || 500;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'carrier_id', 'origin', 'destination', 'weight', 
      'pickup_address', 'delivery_address', 'contact_info'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }
    
    // Validate contact info
    if (!body.contact_info.name || !body.contact_info.phone || !body.contact_info.email) {
      return NextResponse.json({
        success: false,
        error: 'Contact info must include name, phone, and email'
      }, { status: 400 });
    }
    
    // Validate weight
    const weight = parseFloat(body.weight);
    if (isNaN(weight) || weight <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Weight must be a positive number'
      }, { status: 400 });
    }
    
    // Validate carrier exists
    const carrier = mockCarriers.find(c => c.id === body.carrier_id);
    if (!carrier) {
      return NextResponse.json({
        success: false,
        error: 'Selected carrier not found or unavailable'
      }, { status: 400 });
    }
    
    // Generate shipment data
    const shipmentId = uuidv4();
    const trackingNumber = generateTrackingNumber();
    const totalCost = calculateShippingCost(body.origin, body.destination, weight, body.carrier_id);
    const estimatedDelivery = calculateEstimatedDelivery('2-3 days');
    
    // Create shipment record (in real app, save to database)
    const shipment = {
      shipment_id: shipmentId,
      tracking_number: trackingNumber,
      status: 'pending_confirmation',
      carrier: {
        id: carrier.id,
        name: carrier.name,
        contact: carrier.contact.phone
      },
      route: {
        origin: body.origin,
        destination: body.destination,
        pickup_address: body.pickup_address,
        delivery_address: body.delivery_address
      },
      package: {
        weight: weight,
        dimensions: body.dimensions,
        description: body.description,
        declared_value: body.declared_value || totalCost
      },
      contact_info: body.contact_info,
      pricing: {
        total_cost: totalCost,
        currency: 'USD'
      },
      timeline: {
        created_at: new Date().toISOString(),
        estimated_delivery: estimatedDelivery
      },
      special_instructions: body.special_instructions,
      preferred_pickup_time: body.preferred_pickup_time,
      insurance_required: body.insurance_required || false
    };
    
    // In a real application, you would:
    // 1. Save shipment to database
    // 2. Send notification to carrier
    // 3. Send confirmation email to customer
    // 4. Create audit log entry
    
    console.log('Shipment created:', shipment);
    
    return NextResponse.json({
      success: true,
      data: {
        shipment_id: shipment.shipment_id,
        tracking_number: shipment.tracking_number,
        status: shipment.status,
        carrier: shipment.carrier,
        estimated_delivery: shipment.timeline.estimated_delivery,
        total_cost: shipment.pricing.total_cost,
        currency: shipment.pricing.currency,
        pickup_address: shipment.route.pickup_address,
        delivery_address: shipment.route.delivery_address,
        created_at: shipment.timeline.created_at,
        next_steps: [
          'Carrier will be notified of your shipment request',
          'You will receive confirmation within 2 hours',
          'Package pickup will be scheduled once confirmed',
          'Track your shipment using the tracking number provided'
        ]
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Shipment creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create shipment. Please try again.'
    }, { status: 500 });
  }
}
