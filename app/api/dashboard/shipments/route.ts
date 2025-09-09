import { NextRequest, NextResponse } from 'next/server';

// Mock shipment data for dashboard
const mockShipments = [
  {
    id: 'ship_001',
    tracking_number: 'BGS001234567',
    status: 'in_transit',
    origin: 'Lagos, Nigeria',
    destination: 'Nairobi, Kenya',
    customer: 'TechCorp Ltd',
    carrier: 'Express Logistics Nigeria',
    weight: '25 kg',
    value: '$1,250',
    created_date: '2024-01-20',
    estimated_delivery: '2024-01-25',
    progress: 65
  },
  {
    id: 'ship_002',
    tracking_number: 'BGS001234568',
    status: 'delivered',
    origin: 'Cairo, Egypt',
    destination: 'Cape Town, South Africa',
    customer: 'Global Imports',
    carrier: 'Pan-African Freight',
    weight: '15 kg',
    value: '$890',
    created_date: '2024-01-15',
    estimated_delivery: '2024-01-18',
    progress: 100
  },
  {
    id: 'ship_003',
    tracking_number: 'BGS001234569',
    status: 'pending',
    origin: 'Accra, Ghana',
    destination: 'Addis Ababa, Ethiopia',
    customer: 'East Africa Logistics',
    carrier: 'Swift Cargo Services',
    weight: '40 kg',
    value: '$2,100',
    created_date: '2024-01-22',
    estimated_delivery: '2024-01-28',
    progress: 10
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredShipments = mockShipments;

    // Filter by status
    if (status && status !== 'all') {
      filteredShipments = filteredShipments.filter(s => s.status === status);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredShipments = filteredShipments.filter(s => 
        s.tracking_number.toLowerCase().includes(searchLower) ||
        s.customer.toLowerCase().includes(searchLower) ||
        s.origin.toLowerCase().includes(searchLower) ||
        s.destination.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedShipments = filteredShipments.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        shipments: paginatedShipments,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(filteredShipments.length / limit),
          total_count: filteredShipments.length,
          per_page: limit
        }
      }
    });

  } catch (error) {
    console.error('Dashboard shipments error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch shipments'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipment_id, status, notes } = body;

    if (!shipment_id || !status) {
      return NextResponse.json({
        success: false,
        error: 'Shipment ID and status are required'
      }, { status: 400 });
    }

    // Find shipment
    const shipmentIndex = mockShipments.findIndex(s => s.id === shipment_id);
    if (shipmentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Shipment not found'
      }, { status: 404 });
    }

    // Update shipment status
    mockShipments[shipmentIndex].status = status;
    
    // Update progress based on status
    switch (status) {
      case 'pending':
        mockShipments[shipmentIndex].progress = 10;
        break;
      case 'in_transit':
        mockShipments[shipmentIndex].progress = 65;
        break;
      case 'delivered':
        mockShipments[shipmentIndex].progress = 100;
        break;
      case 'cancelled':
        mockShipments[shipmentIndex].progress = 0;
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        shipment: mockShipments[shipmentIndex],
        message: 'Shipment status updated successfully'
      }
    });

  } catch (error) {
    console.error('Shipment update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update shipment'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shipmentId = searchParams.get('id');

    if (!shipmentId) {
      return NextResponse.json({
        success: false,
        error: 'Shipment ID is required'
      }, { status: 400 });
    }

    const shipmentIndex = mockShipments.findIndex(s => s.id === shipmentId);
    if (shipmentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Shipment not found'
      }, { status: 404 });
    }

    // Remove shipment
    const deletedShipment = mockShipments.splice(shipmentIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: {
        deleted_shipment: deletedShipment,
        message: 'Shipment deleted successfully'
      }
    });

  } catch (error) {
    console.error('Shipment deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete shipment'
    }, { status: 500 });
  }
}
