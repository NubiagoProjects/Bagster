import { NextRequest, NextResponse } from 'next/server';

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
    
    if (!trackingNumber) {
      return NextResponse.json({
        success: false,
        error: 'Tracking number is required'
      }, { status: 400 });
    }
    
    // Validate tracking number format (BGS + 9 characters)
    if (!/^BGS[A-Z0-9]{9}$/i.test(trackingNumber)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid tracking number format. Expected format: BGS followed by 9 alphanumeric characters'
      }, { status: 400 });
    }
    
    // Check if we have mock data for this tracking number
    let shipmentData = mockShipments[trackingNumber.toUpperCase()];
    
    // If no mock data exists, generate some for demonstration
    if (!shipmentData) {
      shipmentData = generateMockTrackingData(trackingNumber.toUpperCase());
    }
    
    // Add additional tracking information
    const trackingInfo = {
      ...shipmentData,
      tracking_url: `https://bagster.com/track/${trackingNumber}`,
      estimated_delivery_window: {
        earliest: shipmentData.estimated_delivery,
        latest: new Date(new Date(shipmentData.estimated_delivery).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      delivery_instructions: 'Please ensure someone is available to receive the package',
      contact_support: {
        phone: '+234-800-BAGSTER',
        email: 'support@bagster.com',
        hours: 'Monday-Friday 8AM-6PM WAT'
      }
    };
    
    return NextResponse.json({
      success: true,
      data: trackingInfo
    });
    
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tracking information'
    }, { status: 500 });
  }
}
