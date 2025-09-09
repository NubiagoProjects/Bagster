import { NextRequest, NextResponse } from 'next/server';

// Mock tracking data
const mockTrackingData = [
  {
    tracking_number: 'BGS001234567',
    status: 'in_transit',
    carrier: 'Express Logistics Nigeria',
    origin: 'Lagos, Nigeria',
    destination: 'Nairobi, Kenya',
    estimated_delivery: '2024-01-25',
    current_location: 'Abuja, Nigeria',
    progress: 45,
    events: [
      {
        timestamp: '2024-01-20T08:00:00Z',
        location: 'Lagos, Nigeria',
        status: 'picked_up',
        description: 'Package picked up from sender'
      },
      {
        timestamp: '2024-01-20T14:30:00Z',
        location: 'Lagos, Nigeria',
        status: 'in_transit',
        description: 'Package departed Lagos facility'
      },
      {
        timestamp: '2024-01-21T10:15:00Z',
        location: 'Abuja, Nigeria',
        status: 'in_transit',
        description: 'Package arrived at Abuja sorting facility'
      }
    ]
  },
  {
    tracking_number: 'BGS001234568',
    status: 'delivered',
    carrier: 'Pan-African Freight',
    origin: 'Cairo, Egypt',
    destination: 'Cape Town, South Africa',
    estimated_delivery: '2024-01-18',
    current_location: 'Cape Town, South Africa',
    progress: 100,
    events: [
      {
        timestamp: '2024-01-15T09:00:00Z',
        location: 'Cairo, Egypt',
        status: 'picked_up',
        description: 'Package picked up from sender'
      },
      {
        timestamp: '2024-01-16T16:45:00Z',
        location: 'Johannesburg, South Africa',
        status: 'in_transit',
        description: 'Package arrived at Johannesburg hub'
      },
      {
        timestamp: '2024-01-18T11:30:00Z',
        location: 'Cape Town, South Africa',
        status: 'delivered',
        description: 'Package delivered to recipient'
      }
    ]
  },
  {
    tracking_number: 'BGS001234569',
    status: 'pending',
    carrier: 'Swift Cargo Services',
    origin: 'Accra, Ghana',
    destination: 'Addis Ababa, Ethiopia',
    estimated_delivery: '2024-01-28',
    current_location: 'Accra, Ghana',
    progress: 10,
    events: [
      {
        timestamp: '2024-01-22T07:30:00Z',
        location: 'Accra, Ghana',
        status: 'pending',
        description: 'Package received at warehouse, awaiting pickup'
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('tracking_number');

    if (trackingNumber) {
      // Find specific tracking number
      const trackingInfo = mockTrackingData.find(
        item => item.tracking_number.toLowerCase() === trackingNumber.toLowerCase()
      );

      if (!trackingInfo) {
        return NextResponse.json({
          success: false,
          error: 'Tracking number not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: trackingInfo
      });
    }

    // Return all tracking data (for dashboard)
    return NextResponse.json({
      success: true,
      data: {
        shipments: mockTrackingData,
        total_count: mockTrackingData.length
      }
    });

  } catch (error) {
    console.error('Tracking API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tracking information'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tracking_number } = body;

    if (!tracking_number) {
      return NextResponse.json({
        success: false,
        error: 'Tracking number is required'
      }, { status: 400 });
    }

    // Find tracking info
    const trackingInfo = mockTrackingData.find(
      item => item.tracking_number.toLowerCase() === tracking_number.toLowerCase()
    );

    if (!trackingInfo) {
      return NextResponse.json({
        success: false,
        error: 'Tracking number not found. Please check the number and try again.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: trackingInfo
    });

  } catch (error) {
    console.error('Tracking search error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to search tracking information'
    }, { status: 500 });
  }
}
