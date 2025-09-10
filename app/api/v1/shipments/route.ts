import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Conditional Firebase imports to prevent build-time initialization
let db: any = null;
let collection: any = null;
let addDoc: any = null;
let doc: any = null;
let getDoc: any = null;
let serverTimestamp: any = null;

// Initialize Firebase only when needed (runtime)
async function initializeFirebase() {
  if (!db) {
    try {
      const firebase = await import('@/lib/firebase');
      const firestore = await import('firebase/firestore');
      
      db = firebase.db;
      collection = firestore.collection;
      addDoc = firestore.addDoc;
      doc = firestore.doc;
      getDoc = firestore.getDoc;
      serverTimestamp = firestore.serverTimestamp;
    } catch (error) {
      console.warn('Firebase not available, using mock data');
    }
  }
}
import { shipmentAssignmentService } from '@/lib/services/shipmentAssignmentService';
import { notificationService } from '@/lib/services/notificationService';
import { webhookService } from '@/lib/services/webhookService';
import { loggingService } from '@/lib/services/loggingService';
import { rateLimitingService } from '@/lib/services/rateLimitingService';
import { authService } from '@/lib/auth';

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
    // Initialize Firebase if available
    await initializeFirebase();
    
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
    
    // Mock carrier validation if Firebase not available
    let carrier = null;
    if (db && doc && getDoc) {
      const carrierRef = doc(db, 'carriers', body.carrier_id);
      const carrierDoc = await getDoc(carrierRef);
      
      if (!carrierDoc.exists() || !carrierDoc.data().isActive) {
        return NextResponse.json({
          success: false,
          error: 'Selected carrier not found or unavailable'
        }, { status: 400 });
      }
      carrier = carrierDoc.data();
    } else {
      // Mock carrier data for demo
      carrier = {
        name: 'Demo Carrier',
        deliveryTime: '2-3 days',
        isActive: true,
        phone: '+234-800-DEMO'
      };
    }
    
    // Generate shipment data
    const shipmentId = uuidv4();
    const trackingNumber = generateTrackingNumber();
    const totalCost = calculateShippingCost(body.origin, body.destination, weight, body.carrier_id);
    const estimatedDelivery = calculateEstimatedDelivery('2-3 days');
    
    // Get user ID from authentication
    const authHeader = request.headers.get('authorization');
    let userId = 'anonymous';
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const user = await authService.verifyJWT(token);
        userId = user.uid;
      } catch (error) {
        // Continue with anonymous user
      }
    }
    
    // Create shipment record in Firebase
    const shipment = {
      shipment_id: shipmentId,
      tracking_number: trackingNumber,
      status: 'pending_confirmation',
      userId,
      carrier: {
        id: body.carrier_id,
        name: carrier.name,
        contact: carrier.contact?.phone || carrier.phone
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
        created_at: new Date(),
        estimated_delivery: new Date(estimatedDelivery)
      },
      special_instructions: body.special_instructions,
      preferred_pickup_time: body.preferred_pickup_time,
      insurance_required: body.insurance_required || false
    };
    
    // Save shipment to database or use mock ID
    let shipmentRef = { id: shipmentId };
    if (db && addDoc && collection && serverTimestamp) {
      shipmentRef = await addDoc(collection(db, 'shipments'), {
        ...shipment,
        timeline: {
          created_at: serverTimestamp(),
          estimated_delivery: new Date(estimatedDelivery)
        }
      });
    }
    
    // Create shipment assignment
    await shipmentAssignmentService.createAssignment(
      shipmentRef.id,
      body.carrier_id,
      'normal'
    );
    
    // Send notifications
    try {
      // Notify carrier
      await notificationService.sendNotification(
        body.carrier_id,
        'assignment_created',
        'carrier_assigned',
        {
          shipmentId: shipmentRef.id,
          trackingNumber,
          pickupAddress: body.pickup_address,
          carrierName: carrier.name,
          expiresAt: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
          phone: carrier.phone,
          email: carrier.email
        }
      );
      
      // Notify customer
      if (body.contact_info.email) {
        await notificationService.sendNotification(
          userId,
          'shipment_update',
          'shipment_created',
          {
            shipmentId: shipmentRef.id,
            trackingNumber,
            customerName: body.contact_info.name,
            status: 'pending_confirmation',
            email: body.contact_info.email
          }
        );
      }
    } catch (notificationError) {
      await loggingService.warn('Failed to send shipment notifications', {
        service: 'ShipmentAPI',
        userId,
        metadata: { shipmentId: shipmentRef.id, trackingNumber }
      }, notificationError as Error);
    }
    
    // Trigger webhooks
    try {
      await webhookService.triggerShipmentCreated({
        ...shipment,
        shipment_id: shipmentRef.id,
        userId
      });
    } catch (webhookError) {
      await loggingService.warn('Failed to trigger shipment webhook', {
        service: 'ShipmentAPI',
        userId,
        metadata: { shipmentId: shipmentRef.id, trackingNumber }
      }, webhookError as Error);
    }
    
    // Log shipment creation
    await loggingService.logShipmentEvent(
      'created',
      shipmentRef.id,
      trackingNumber,
      {
        service: 'ShipmentAPI',
        userId,
        metadata: {
          carrierId: body.carrier_id,
          totalCost,
          weight,
          origin: body.origin,
          destination: body.destination
        }
      }
    );
    
    return NextResponse.json({
      success: true,
      data: {
        shipment_id: shipmentRef.id,
        tracking_number: shipment.tracking_number,
        status: shipment.status,
        carrier: shipment.carrier,
        estimated_delivery: estimatedDelivery,
        total_cost: shipment.pricing.total_cost,
        currency: shipment.pricing.currency,
        pickup_address: shipment.route.pickup_address,
        delivery_address: shipment.route.delivery_address,
        created_at: new Date().toISOString(),
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
