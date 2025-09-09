'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { Package, MapPin, Clock, CheckCircle, AlertCircle, Truck } from 'lucide-react'

interface TrackingEvent {
  id: string
  status: string
  location: string
  timestamp: Date
  description: string
  carrierName?: string
}

interface ShipmentData {
  id: string
  trackingNumber: string
  status: string
  originAddress: any
  destinationAddress: any
  estimatedDelivery?: Date
  actualDelivery?: Date
  carrierName: string
  events: TrackingEvent[]
}

interface RealTimeTrackerProps {
  trackingNumber: string
  className?: string
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  picked_up: Package,
  in_transit: Truck,
  customs: AlertCircle,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  cancelled: AlertCircle
}

const statusColors = {
  pending: 'text-yellow-600 bg-yellow-100',
  confirmed: 'text-blue-600 bg-blue-100',
  picked_up: 'text-purple-600 bg-purple-100',
  in_transit: 'text-indigo-600 bg-indigo-100',
  customs: 'text-orange-600 bg-orange-100',
  out_for_delivery: 'text-green-600 bg-green-100',
  delivered: 'text-emerald-600 bg-emerald-100',
  cancelled: 'text-red-600 bg-red-100'
}

export default function RealTimeTracker({ trackingNumber, className = '' }: RealTimeTrackerProps) {
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!trackingNumber) return

    setLoading(true)
    setError(null)

    // Real-time listener for shipment updates
    const unsubscribe = onSnapshot(
      doc(db, 'shipments', trackingNumber),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          setShipmentData({
            id: doc.id,
            trackingNumber: data.trackingNumber,
            status: data.status,
            originAddress: data.originAddress,
            destinationAddress: data.destinationAddress,
            estimatedDelivery: data.estimatedDelivery?.toDate(),
            actualDelivery: data.actualDelivery?.toDate(),
            carrierName: data.carrierName || 'Unknown Carrier',
            events: data.events?.map((event: any) => ({
              ...event,
              timestamp: event.timestamp?.toDate() || new Date()
            })) || []
          })
          setIsConnected(true)
        } else {
          setError('Shipment not found')
        }
        setLoading(false)
      },
      (error) => {
        console.error('Real-time tracking error:', error)
        setError('Failed to connect to tracking service')
        setIsConnected(false)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [trackingNumber])

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Tracking Error</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!shipmentData) return null

  const StatusIcon = statusIcons[shipmentData.status as keyof typeof statusIcons] || Package
  const statusColor = statusColors[shipmentData.status as keyof typeof statusColors] || 'text-gray-600 bg-gray-100'

  return (
    <div className={`${className}`}>
      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live tracking active' : 'Connection lost'}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Shipment Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Tracking: {shipmentData.trackingNumber}
            </h2>
            <p className="text-gray-600">Carrier: {shipmentData.carrierName}</p>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            <StatusIcon className="w-4 h-4 mr-2" />
            {shipmentData.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">From</h4>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
              <div className="text-sm text-gray-600">
                <p>{shipmentData.originAddress?.street}</p>
                <p>{shipmentData.originAddress?.city}, {shipmentData.originAddress?.country}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">To</h4>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
              <div className="text-sm text-gray-600">
                <p>{shipmentData.destinationAddress?.street}</p>
                <p>{shipmentData.destinationAddress?.city}, {shipmentData.destinationAddress?.country}</p>
              </div>
            </div>
          </div>
        </div>

        {shipmentData.estimatedDelivery && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Estimated delivery: {shipmentData.estimatedDelivery.toLocaleDateString()} at {shipmentData.estimatedDelivery.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking History</h3>
        
        {shipmentData.events.length > 0 ? (
          <div className="space-y-4">
            {shipmentData.events.map((event, index) => {
              const EventIcon = statusIcons[event.status as keyof typeof statusIcons] || Package
              const eventColor = statusColors[event.status as keyof typeof statusColors] || 'text-gray-600 bg-gray-100'
              
              return (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${eventColor}`}>
                    <EventIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {event.description || event.status.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {event.location && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </p>
                    )}
                  </div>
                  {index < shipmentData.events.length - 1 && (
                    <div className="absolute left-4 mt-8 w-px h-4 bg-gray-200"></div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tracking events yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
