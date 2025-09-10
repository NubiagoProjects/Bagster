import { NextRequest, NextResponse } from 'next/server'
import { shipmentAssignmentService } from '@/lib/services/shipmentAssignmentService'

// POST /api/v1/carrier/qr-scan - Update shipment status via QR code scan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrCodeData, carrierId, location, notes, photoProof, signature } = body

    if (!qrCodeData || !carrierId) {
      return NextResponse.json(
        { success: false, error: 'QR code data and carrier ID are required' },
        { status: 400 }
      )
    }

    // Update status via QR code
    const statusUpdate = await shipmentAssignmentService.updateStatusByQRCode(qrCodeData, carrierId)

    // Add additional data if provided
    if (location) statusUpdate.location = location
    if (notes) statusUpdate.notes = notes
    if (photoProof) statusUpdate.photoProof = photoProof
    if (signature) statusUpdate.signature = signature

    return NextResponse.json({
      success: true,
      data: statusUpdate,
      message: `Shipment status updated to ${statusUpdate.status}`
    })

  } catch (error) {
    console.error('Error processing QR code scan:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'QR code scan failed' },
      { status: 400 }
    )
  }
}

// GET /api/v1/carrier/qr-scan/generate - Generate QR code for shipment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shipmentId = searchParams.get('shipmentId')
    const carrierId = searchParams.get('carrierId')

    if (!shipmentId || !carrierId) {
      return NextResponse.json(
        { success: false, error: 'Shipment ID and Carrier ID are required' },
        { status: 400 }
      )
    }

    const qrCodeData = shipmentAssignmentService.generateQRCode(shipmentId, carrierId)

    return NextResponse.json({
      success: true,
      data: {
        qrCodeData,
        shipmentId,
        carrierId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
