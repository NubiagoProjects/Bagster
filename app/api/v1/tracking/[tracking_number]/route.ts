import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { 
  collection, 
  doc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore'
import { loggingService } from '@/lib/services/loggingService'
import { rateLimitingService } from '@/lib/services/rateLimitingService'

// Mock shipment data for demonstration
const mockShipments: { [key: string]: any } = {
  'BGS123456ABC': {
    tracking_number: 'BGS123456ABC',
    status: 'in_transit',
    carrier: 'Express Logistics Nigeria',
    origin: 'Lagos, Nigeria',
    destination: 'Abuja, Nigeria',
    estimated_delivery: '2024-01-25',
    current_location: 'Ibadan, Nigeria',
    package_info: {
      weight: 25,
      dimensions: '50x30x20',
      description: 'Electronics package'
    },
    timeline: [
      {
        status: 'Package Delivered',
        location: 'Abuja, Nigeria',
        timestamp: '2024-01-24T14:30:00Z',
        description: 'Package successfully delivered to recipient'
      },
      {
        status: 'Out for Delivery',
        location: 'Abuja, Nigeria',
        timestamp: '2024-01-24T08:15:00Z',
        description: 'Package is out for delivery'
      },
      {
        status: 'In Transit',
        location: 'Ibadan, Nigeria',
        timestamp: '2024-01-23T16:45:00Z',
        description: 'Package in transit to destination'
      },
      {
        status: 'Picked Up',
        location: 'Lagos, Nigeria',
        timestamp: '2024-01-23T09:15:00Z',
        description: 'Package picked up by carrier'
      },
      {
        status: 'Shipment Created',
        location: 'Lagos, Nigeria',
        timestamp: '2024-01-22T14:20:00Z',
        description: 'Shipment request created and confirmed'
      }
    ]
  },
  'BGS789012DEF': {
    tracking_number: 'BGS789012DEF',
    status: 'pending_pickup',
    carrier: 'Swift Cargo Services',
    origin: 'Lagos, Nigeria',
    destination: 'Port Harcourt, Nigeria',
    estimated_delivery: '2024-01-26',
    current_location: 'Lagos, Nigeria',
    package_info: {
      weight: 15,
      dimensions: '40x25x15',
      description: 'Documents and samples'
    },
    timeline: [
      {
        status: 'Shipment Created',
        location: 'Lagos, Nigeria',
        timestamp: '2024-01-24T10:30:00Z',
        description: 'Shipment request created and confirmed'
      }
    ]
  }
};

// Generate mock tracking data for any tracking number
function generateMockTrackingData(trackingNumber: string) {
  const statuses = ['pending_pickup', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
  const locations = ['Lagos, Nigeria', 'Ibadan, Nigeria', 'Abuja, Nigeria', 'Port Harcourt, Nigeria', 'Kano, Nigeria'];
  
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomOrigin = locations[Math.floor(Math.random() * locations.length)];
  const randomDestination = locations.filter(l => l !== randomOrigin)[Math.floor(Math.random() * 4)];
  
  const carriers = ['Express Logistics Nigeria', 'Swift Cargo Services', 'Pan-African Freight'];
  const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)];
  
  // Generate estimated delivery (2-5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 4) + 2);
  
  return {
    tracking_number: trackingNumber,
    status: randomStatus,
    carrier: randomCarrier,
    origin: randomOrigin,
    destination: randomDestination,
    estimated_delivery: deliveryDate.toISOString().split('T')[0],
    current_location: randomStatus === 'delivered' ? randomDestination : randomOrigin,
    package_info: {
      weight: Math.floor(Math.random() * 50) + 5,
      dimensions: `${Math.floor(Math.random() * 50) + 20}x${Math.floor(Math.random() * 30) + 15}x${Math.floor(Math.random() * 20) + 10}`,
      description: 'Package contents'
    },
    timeline: generateMockTimeline(randomStatus, randomOrigin, randomDestination)
  };
}

function generateMockTimeline(status: string, origin: string, destination: string) {
  const timeline = [];
  const now = new Date();
  
  // Always start with shipment creation
  const createdTime = new Date(now.getTime() - (Math.random() * 5 + 1) * 24 * 60 * 60 * 1000);
  timeline.push({
    status: 'Shipment Created',
    location: origin,
    timestamp: createdTime.toISOString(),
    description: 'Shipment request created and confirmed'
  });
  
  if (['picked_up', 'in_transit', 'out_for_delivery', 'delivered'].includes(status)) {
    const pickupTime = new Date(createdTime.getTime() + Math.random() * 12 * 60 * 60 * 1000);
    timeline.push({
      status: 'Picked Up',
      location: origin,
      timestamp: pickupTime.toISOString(),
      description: 'Package picked up by carrier'
    });
  }
  
  if (['in_transit', 'out_for_delivery', 'delivered'].includes(status)) {
    const transitTime = new Date(timeline[timeline.length - 1].timestamp);
    transitTime.setHours(transitTime.getHours() + Math.random() * 24 + 6);
    timeline.push({
      status: 'In Transit',
      location: 'En route',
      timestamp: transitTime.toISOString(),
      description: 'Package in transit to destination'
    });
  }
  
  if (['out_for_delivery', 'delivered'].includes(status)) {
    const outForDeliveryTime = new Date(timeline[timeline.length - 1].timestamp);
    outForDeliveryTime.setHours(outForDeliveryTime.getHours() + Math.random() * 12 + 6);
    timeline.push({
      status: 'Out for Delivery',
      location: destination,
      timestamp: outForDeliveryTime.toISOString(),
      description: 'Package is out for delivery'
    });
  }
  
  if (status === 'delivered') {
    const deliveredTime = new Date(timeline[timeline.length - 1].timestamp);
    deliveredTime.setHours(deliveredTime.getHours() + Math.random() * 8 + 1);
    timeline.push({
      status: 'Package Delivered',
      location: destination,
      timestamp: deliveredTime.toISOString(),
      description: 'Package successfully delivered to recipient'
    });
  }
  
  return timeline.reverse(); // Show most recent first
}

export async function GET(
  request: NextRequest,
  { params }: { params: { tracking_number: string } }
) {
  try {
    const trackingNumber = params.tracking_number;
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Rate limiting for tracking requests
    const rateLimitResult = await rateLimitingService.checkIpRateLimit(
      clientIp,
      'general',
      '/tracking'
    );
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Too many tracking requests. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      }, { status: 429 });
    }
    
    // Validate tracking number format
    if (!trackingNumber || trackingNumber.length < 8) {
      await loggingService.warn('Invalid tracking number format', {
        service: 'TrackingAPI',
        metadata: { trackingNumber, clientIp }
      });
      
      return NextResponse.json({
        success: false,
        error: 'Invalid tracking number format'
      }, { status: 400 });
    }
    
    // Find shipment by tracking number
    const shipmentsQuery = query(
      collection(db, 'shipments'),
      where('tracking_number', '==', trackingNumber)
    );
    
    const shipmentSnapshot = await getDocs(shipmentsQuery);
    
    if (shipmentSnapshot.empty) {
      await loggingService.info('Tracking number not found', {
        service: 'TrackingAPI',
        metadata: { trackingNumber, clientIp }
      });
      
      return NextResponse.json({
        success: false,
        error: 'Tracking number not found. Please verify the tracking number and try again.'
      }, { status: 404 });
    }
    
    const shipmentDoc = shipmentSnapshot.docs[0];
    const shipmentData = shipmentDoc.data();
    
    // Get tracking timeline from shipment status updates
    const timelineQuery = query(
      collection(db, 'shipment_status_updates'),
      where('shipmentId', '==', shipmentDoc.id),
      orderBy('timestamp', 'asc')
    );
    
    const timelineSnapshot = await getDocs(timelineQuery);
    const timeline = timelineSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        status: data.status,
        description: data.description || getStatusDescription(data.status),
        location: data.location || shipmentData.route?.origin || 'Unknown',
        timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp
      };
    });
    
    // If no timeline exists, create basic timeline from shipment data
    if (timeline.length === 0) {
      timeline.push({
        status: 'shipment_created',
        description: 'Shipment created and carrier assigned',
        location: shipmentData.route?.origin || 'Origin',
        timestamp: shipmentData.timeline?.created_at?.toDate?.()?.toISOString() || 
                  shipmentData.timeline?.created_at || 
                  new Date().toISOString()
      });
    }
    
    const trackingData = {
      tracking_number: trackingNumber,
      status: shipmentData.status,
      carrier: shipmentData.carrier,
      route: shipmentData.route,
      package: shipmentData.package,
      timeline,
      estimated_delivery: shipmentData.timeline?.estimated_delivery?.toDate?.()?.toISOString() || 
                         shipmentData.timeline?.estimated_delivery,
      current_location: timeline[timeline.length - 1]?.location || 'Unknown'
    };
    
    // Check if we have mock data for this tracking number
    let shipmentDataMock = mockShipments[trackingNumber.toUpperCase()];
    
    // If no mock data exists, generate some for demonstration
    if (!shipmentDataMock) {
      shipmentDataMock = generateMockTrackingData(trackingNumber.toUpperCase());
    }
    
    // Add additional tracking information
    const trackingInfo = {
      ...shipmentDataMock,
      tracking_url: `https://bagster.com/track/${trackingNumber}`,
      estimated_delivery_window: {
        earliest: shipmentDataMock.estimated_delivery,
        latest: new Date(new Date(shipmentDataMock.estimated_delivery).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      delivery_instructions: 'Please ensure someone is available to receive the package',
      contact_support: {
        phone: '+234-800-BAGSTER',
        email: 'support@bagster.com',
        hours: 'Monday-Friday 8AM-6PM WAT'
      }
    };
    
    // Calculate delivery progress and next update
    const lastUpdate = timeline[timeline.length - 1];
    const timeSinceLastUpdate = lastUpdate ? 
      Date.now() - new Date(lastUpdate.timestamp).getTime() : 0;
    const hoursAgo = Math.floor(timeSinceLastUpdate / (1000 * 60 * 60));
    
    // Log successful tracking request
    await loggingService.info('Tracking request successful', {
      service: 'TrackingAPI',
      metadata: { 
        trackingNumber, 
        clientIp, 
        status: shipmentData.status,
        carrierId: shipmentData.carrier?.id
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ...trackingData,
        last_updated: hoursAgo > 0 ? `${hoursAgo} hours ago` : 'Just now',
        delivery_progress: calculateDeliveryProgress(trackingData.status),
        next_update_expected: calculateNextUpdate(trackingData.status)
      }
    });
    
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tracking information'
    }, { status: 500 });
  }
}

function getStatusDescription(status: string) {
  switch (status) {
    case 'shipment_created':
      return 'Shipment created and carrier assigned';
    case 'picked_up':
      return 'Package picked up by carrier';
    case 'in_transit':
      return 'Package in transit to destination';
    case 'out_for_delivery':
      return 'Package is out for delivery';
    case 'delivered':
      return 'Package successfully delivered to recipient';
    default:
      return 'Unknown status';
  }
}

function calculateDeliveryProgress(status: string) {
  switch (status) {
    case 'shipment_created':
      return 0;
    case 'picked_up':
      return 20;
    case 'in_transit':
      return 50;
    case 'out_for_delivery':
      return 80;
    case 'delivered':
      return 100;
    default:
      return 0;
  }
}

function calculateNextUpdate(status: string) {
  switch (status) {
    case 'shipment_created':
      return 'Pickup expected within 24 hours';
    case 'picked_up':
      return 'In transit to destination';
    case 'in_transit':
      return 'Out for delivery expected within 24 hours';
    case 'out_for_delivery':
      return 'Delivery expected today';
    case 'delivered':
      return 'Package delivered';
    default:
      return 'Unknown status';
  }
}
