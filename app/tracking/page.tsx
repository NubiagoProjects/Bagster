'use client'

import { useState } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  Loader2
} from 'lucide-react'

// Mock tracking data
const mockTrackingData = {
  trackingNumber: "BGS123456789",
  status: "In Transit",
  estimatedDelivery: "2024-01-25",
  carrier: "Express Logistics Nigeria",
  origin: "Lagos, Nigeria",
  destination: "Abuja, Nigeria",
  weight: "25 kg",
  dimensions: "50cm x 30cm x 20cm",
  timeline: [
    {
      id: 1,
      status: "Delivered",
      location: "Abuja, Nigeria",
      timestamp: "2024-01-25 14:30",
      description: "Package delivered to recipient",
      icon: "delivered"
    },
    {
      id: 2,
      status: "Out for Delivery",
      location: "Abuja, Nigeria",
      timestamp: "2024-01-25 08:15",
      description: "Package out for delivery",
      icon: "out-for-delivery"
    },
    {
      id: 3,
      status: "Arrived at Destination",
      location: "Abuja, Nigeria",
      timestamp: "2024-01-24 16:45",
      description: "Package arrived at destination facility",
      icon: "arrived"
    },
    {
      id: 4,
      status: "In Transit",
      location: "Kaduna, Nigeria",
      timestamp: "2024-01-24 10:20",
      description: "Package in transit to destination",
      icon: "in-transit"
    },
    {
      id: 5,
      status: "Departed Origin",
      location: "Lagos, Nigeria",
      timestamp: "2024-01-23 14:30",
      description: "Package departed from origin facility",
      icon: "departed"
    },
    {
      id: 6,
      status: "Picked Up",
      location: "Lagos, Nigeria",
      timestamp: "2024-01-23 09:15",
      description: "Package picked up by carrier",
      icon: "picked-up"
    },
    {
      id: 7,
      status: "Shipment Created",
      location: "Lagos, Nigeria",
      timestamp: "2024-01-22 16:00",
      description: "Shipment created and label generated",
      icon: "created"
    }
  ]
}

// Skeleton Loading Component
const SkeletonTimeline = () => (
  <div className="space-y-6">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="flex items-start space-x-4 animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
)

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number')
      return
    }

    setError('')
    setIsLoading(true)
    setTrackingData(null)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock validation - only accept specific tracking numbers
    if (trackingNumber === 'BGS123456789' || trackingNumber === 'BGS987654321') {
      setTrackingData(mockTrackingData)
    } else {
      setError('Tracking number not found. Please check and try again.')
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrack()
    }
  }

  const getStatusIcon = (icon: string) => {
    switch (icon) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />
      case 'out-for-delivery':
        return <Truck className="w-6 h-6 text-blue-600" />
      case 'arrived':
        return <MapPin className="w-6 h-6 text-purple-600" />
      case 'in-transit':
        return <Truck className="w-6 h-6 text-blue-600" />
      case 'departed':
        return <Package className="w-6 h-6 text-orange-600" />
      case 'picked-up':
        return <Package className="w-6 h-6 text-green-600" />
      case 'created':
        return <Package className="w-6 h-6 text-slate-600" />
      default:
        return <Package className="w-6 h-6 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-600 bg-emerald-100'
      case 'Out for Delivery':
        return 'text-blue-600 bg-blue-100'
      case 'In Transit':
        return 'text-orange-600 bg-orange-100'
      case 'Picked Up':
        return 'text-green-600 bg-green-100'
      case 'Shipment Created':
        return 'text-slate-600 bg-slate-100'
      default:
        return 'text-slate-600 bg-slate-100'
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
              Track Your
              <span className="text-black"> Shipment</span>
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Get real-time updates on your shipment status. Enter your tracking number 
              to see detailed information about your package.
            </p>
          </div>

          {/* Tracking Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-black rounded flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">Track Your Package</h2>
                <p className="text-gray-600 font-light">Enter your tracking number to get started</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter tracking number (e.g., BGS123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-light text-gray-900 placeholder-gray-500 text-lg"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleTrack}
                  disabled={isLoading || !trackingNumber.trim()}
                  className="bg-black text-white px-6 py-4 w-full font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      Track Package
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500 font-light">
                    Try tracking number: <span className="font-mono text-black">BGS123456789</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Results */}
          {isLoading && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-8">
                  <Loader2 className="w-8 h-8 animate-spin text-black mx-auto mb-4" />
                  <h3 className="text-lg font-light text-gray-900 mb-2">Tracking Your Package</h3>
                  <p className="text-gray-600 font-light">Please wait while we fetch your tracking information...</p>
                </div>
                <SkeletonTimeline />
              </div>
            </div>
          )}

          {trackingData && !isLoading && (
            <div className="max-w-4xl mx-auto">
              {/* Shipment Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm font-light text-gray-600 mb-1">Tracking Number</h4>
                    <p className="text-lg font-light text-gray-900 font-mono">{trackingData.trackingNumber}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm font-light text-gray-600 mb-1">Status</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-light ${getStatusColor(trackingData.status)}`}>
                      {trackingData.status}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm font-light text-gray-600 mb-1">Estimated Delivery</h4>
                    <p className="text-lg font-light text-gray-900">{trackingData.estimatedDelivery}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center mx-auto mb-3">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm font-light text-gray-600 mb-1">Carrier</h4>
                    <p className="text-lg font-light text-gray-900">{trackingData.carrier}</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-light text-gray-900 mb-4">Shipment Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-light">Origin:</span>
                          <span className="font-light">{trackingData.origin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-light">Destination:</span>
                          <span className="font-light">{trackingData.destination}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-light">Weight:</span>
                          <span className="font-light">{trackingData.weight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-light">Dimensions:</span>
                          <span className="font-light">{trackingData.dimensions}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-light text-gray-900 mb-4">Need Help?</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600 font-light">+234 123 456 7890</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600 font-light">support@bagster.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-light text-gray-900 mb-6">Tracking Timeline</h3>
                <div className="space-y-6">
                  {trackingData.timeline.map((event: any, index: number) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(event.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-light text-gray-900">{event.status}</h4>
                          <span className="text-sm text-gray-500 font-light">{event.timestamp}</span>
                        </div>
                        <p className="text-gray-600 font-light mb-1">{event.description}</p>
                        <p className="text-sm text-gray-500 font-light">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
} 