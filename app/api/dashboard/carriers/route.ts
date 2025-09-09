import { NextRequest, NextResponse } from 'next/server';

// Mock carrier data for dashboard
const mockCarriers = [
  {
    id: 'carrier_001',
    name: 'Express Logistics Nigeria',
    email: 'contact@expresslogistics.ng',
    phone: '+234-800-123-4567',
    status: 'active',
    rating: 4.8,
    total_shipments: 1247,
    on_time_delivery: 98.5,
    service_areas: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'],
    transport_modes: ['air', 'road'],
    verified: true,
    joined_date: '2023-03-15',
    last_active: '2024-01-22'
  },
  {
    id: 'carrier_002',
    name: 'Swift Cargo Services',
    email: 'info@swiftcargo.ng',
    phone: '+234-800-765-4321',
    status: 'active',
    rating: 4.6,
    total_shipments: 892,
    on_time_delivery: 96.2,
    service_areas: ['Lagos', 'Ibadan', 'Benin City'],
    transport_modes: ['road', 'sea'],
    verified: true,
    joined_date: '2023-06-20',
    last_active: '2024-01-21'
  },
  {
    id: 'carrier_003',
    name: 'Pan-African Freight',
    email: 'ops@panafricanfreight.com',
    phone: '+234-800-999-8888',
    status: 'active',
    rating: 4.9,
    total_shipments: 2156,
    on_time_delivery: 99.1,
    service_areas: ['All Nigeria', 'Ghana', 'Kenya', 'South Africa'],
    transport_modes: ['air', 'sea', 'road'],
    verified: true,
    joined_date: '2022-11-10',
    last_active: '2024-01-22'
  },
  {
    id: 'carrier_004',
    name: 'Northern Express',
    email: 'dispatch@northernexpress.ng',
    phone: '+234-800-444-5555',
    status: 'pending',
    rating: 4.4,
    total_shipments: 156,
    on_time_delivery: 94.8,
    service_areas: ['Kano', 'Kaduna', 'Jos'],
    transport_modes: ['road'],
    verified: false,
    joined_date: '2024-01-10',
    last_active: '2024-01-20'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredCarriers = mockCarriers;

    // Filter by status
    if (status && status !== 'all') {
      filteredCarriers = filteredCarriers.filter(c => c.status === status);
    }

    // Filter by verified status
    if (verified === 'true') {
      filteredCarriers = filteredCarriers.filter(c => c.verified === true);
    } else if (verified === 'false') {
      filteredCarriers = filteredCarriers.filter(c => c.verified === false);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCarriers = filteredCarriers.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.service_areas.some(area => area.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCarriers = filteredCarriers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        carriers: paginatedCarriers,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(filteredCarriers.length / limit),
          total_count: filteredCarriers.length,
          per_page: limit
        }
      }
    });

  } catch (error) {
    console.error('Dashboard carriers error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch carriers'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { carrier_id, status, verified, notes } = body;

    if (!carrier_id) {
      return NextResponse.json({
        success: false,
        error: 'Carrier ID is required'
      }, { status: 400 });
    }

    // Find carrier
    const carrierIndex = mockCarriers.findIndex(c => c.id === carrier_id);
    if (carrierIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Carrier not found'
      }, { status: 404 });
    }

    // Update carrier
    if (status) mockCarriers[carrierIndex].status = status;
    if (typeof verified === 'boolean') mockCarriers[carrierIndex].verified = verified;

    return NextResponse.json({
      success: true,
      data: {
        carrier: mockCarriers[carrierIndex],
        message: 'Carrier updated successfully'
      }
    });

  } catch (error) {
    console.error('Carrier update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update carrier'
    }, { status: 500 });
  }
}

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

    // Remove carrier
    const deletedCarrier = mockCarriers.splice(carrierIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: {
        deleted_carrier: deletedCarrier,
        message: 'Carrier removed successfully'
      }
    });

  } catch (error) {
    console.error('Carrier deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove carrier'
    }, { status: 500 });
  }
}
