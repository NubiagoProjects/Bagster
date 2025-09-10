import { NextRequest, NextResponse } from 'next/server'
import { shipmentAssignmentService } from '@/lib/services/shipmentAssignmentService'

// GET /api/v1/carrier/shipments - Get carrier's shipments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const carrierId = searchParams.get('carrierId')
    const view = searchParams.get('view') as 'all' | 'pending' | 'accepted' | 'active' || 'all'

    if (!carrierId) {
      return NextResponse.json(
        { success: false, error: 'Carrier ID is required' },
        { status: 400 }
      )
    }

    const shipments = await shipmentAssignmentService.getCarrierShipments(carrierId, view)

    // Get dashboard stats
    const allShipments = await shipmentAssignmentService.getCarrierShipments(carrierId, 'all')
    const pendingShipments = await shipmentAssignmentService.getCarrierShipments(carrierId, 'pending')
    const activeShipments = await shipmentAssignmentService.getCarrierShipments(carrierId, 'active')
    
    const stats = {
      totalAssigned: allShipments.length,
      pendingAcceptance: pendingShipments.length,
      activeShipments: activeShipments.length,
      completedToday: allShipments.filter(s => 
        s.currentStatus.status === 'delivered' &&
        new Date(s.currentStatus.timestamp).toDateString() === new Date().toDateString()
      ).length,
      totalEarnings: allShipments.reduce((sum, s) => sum + s.earnings.total, 0),
      averageRating: 4.7, // Mock data
      onTimeDeliveryRate: 95.2 // Mock data
    }

    return NextResponse.json({
      success: true,
      data: {
        shipments,
        stats,
        view,
        total: shipments.length
      }
    })

  } catch (error) {
    console.error('Error fetching carrier shipments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipments' },
      { status: 500 }
    )
  }
}

// POST /api/v1/carrier/shipments - Create new shipment assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shipmentId, carrierId, priority } = body

    if (!shipmentId || !carrierId) {
      return NextResponse.json(
        { success: false, error: 'Shipment ID and Carrier ID are required' },
        { status: 400 }
      )
    }

    const assignment = await shipmentAssignmentService.createAssignment(
      shipmentId,
      carrierId,
      priority
    )

    return NextResponse.json({
      success: true,
      data: assignment,
      message: 'Shipment assigned successfully'
    })

  } catch (error) {
    console.error('Error creating shipment assignment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}
