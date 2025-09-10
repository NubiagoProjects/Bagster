import { NextRequest, NextResponse } from 'next/server'
import { shipmentAssignmentService } from '@/lib/services/shipmentAssignmentService'

// PUT /api/v1/carrier/assignments/[assignmentId] - Accept or decline assignment
export async function PUT(
  request: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const { assignmentId } = params
    const body = await request.json()
    const { action, carrierId, reason } = body

    if (!carrierId) {
      return NextResponse.json(
        { success: false, error: 'Carrier ID is required' },
        { status: 400 }
      )
    }

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action must be either "accept" or "decline"' },
        { status: 400 }
      )
    }

    if (action === 'accept') {
      const success = await shipmentAssignmentService.acceptAssignment(assignmentId, carrierId)
      
      return NextResponse.json({
        success: true,
        data: { accepted: success },
        message: 'Assignment accepted successfully'
      })
    } else {
      await shipmentAssignmentService.declineAssignment(assignmentId, carrierId, reason)
      
      return NextResponse.json({
        success: true,
        message: 'Assignment declined successfully'
      })
    }

  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update assignment' },
      { status: 400 }
    )
  }
}

// GET /api/v1/carrier/assignments/[assignmentId] - Get assignment details with countdown
export async function GET(
  request: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const { assignmentId } = params
    
    const countdown = shipmentAssignmentService.getCountdownTimer(assignmentId)
    
    if (!countdown) {
      return NextResponse.json(
        { success: false, error: 'Assignment not found or not pending' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: countdown
    })

  } catch (error) {
    console.error('Error fetching assignment countdown:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assignment details' },
      { status: 500 }
    )
  }
}
