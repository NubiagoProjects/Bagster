'use client'

import { useState } from 'react'
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation,
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Calendar,
  Route
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTracking, setActiveTracking] = useState('BAG123456789')
  const { addToast } = useToast()
  const userType = 'carrier'

  const trackingData = [
    {
      id: 'BAG123456789',
      status: 'in-transit',
      currentLocation: 'Kano, Nigeria',
      progress: 65,
      estimatedArrival: '2024-01-22 14:30',
      origin: 'Lagos, Nigeria',
      destination: 'Nairobi, Kenya',
      customer: 'TechCorp Ltd',
      carrier: 'FastTrack Logistics',
      lastUpdate: '2 hours ago'
    },
    {
      id: 'BAG987654321',
      status: 'picked-up',
      currentLocation: 'Accra, Ghana',
      progress: 25,
      estimatedArrival: '2024-01-20 16:00',
      origin: 'Accra, Ghana',
      destination: 'Lagos, Nigeria',
      customer: 'Global Imports',
      carrier: 'Express Delivery',
      lastUpdate: '4 hours ago'
    },
    {
      id: 'BAG456789123',
      status: 'delivered',
      currentLocation: 'Kampala, Uganda',
      progress: 100,
      estimatedArrival: '2024-01-17 11:15',
      origin: 'Nairobi, Kenya',
      destination: 'Kampala, Uganda',
      customer: 'East Africa Logistics',
      carrier: 'Speed Cargo',
      lastUpdate: '1 day ago'
    }
  ]

  const trackingHistory = [
    {
      timestamp: '2024-01-18 09:30',
      location: 'Lagos, Nigeria',
      status: 'Package picked up',
      description: 'Package collected from sender'
    },
    {
      timestamp: '2024-01-18 14:45',
      location: 'Lagos Port, Nigeria',
      status: 'In transit',
      description: 'Package departed Lagos facility'
    },
    {
      timestamp: '2024-01-19 08:20',
      location: 'Kano, Nigeria',
      status: 'In transit',
      description: 'Package arrived at Kano hub'
    },
    {
      timestamp: '2024-01-19 16:10',
      location: 'Kano, Nigeria',
      status: 'In transit',
      description: 'Package departed Kano hub'
    },
    {
      timestamp: '2024-01-20 11:30',
      location: 'N\'Djamena, Chad',
      status: 'In transit',
      description: 'Package in transit through Chad'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50'
      case 'in-transit': return 'text-blue-600 bg-blue-50'
      case 'picked-up': return 'text-yellow-600 bg-yellow-50'
      case 'delayed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in-transit': return <Truck className="w-4 h-4 text-blue-600" />
      case 'picked-up': return <Package className="w-4 h-4 text-yellow-600" />
      case 'delayed': return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const selectedShipment = trackingData.find(item => item.id === activeTracking)

  const filteredTracking = trackingData.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.currentLocation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userType={userType} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Tracking</h1>
              <p className="text-sm text-gray-600 mt-1">Real-time shipment tracking and monitoring</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tracking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Shipments List */}
            <div className="lg:col-span-1 bg-white border-r border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Active Shipments</h2>
                <p className="text-sm text-gray-500">{filteredTracking.length} shipments</p>
              </div>
              <div className="overflow-y-auto h-full">
                {filteredTracking.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setActiveTracking(item.id)}
                    className={`p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      activeTracking === item.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-gray-900">{item.id}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">{item.customer}</div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{item.currentLocation}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">Updated {item.lastUpdate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Details */}
            <div className="lg:col-span-2 bg-gray-50">
              {selectedShipment ? (
                <div className="h-full flex flex-col">
                  {/* Shipment Header */}
                  <div className="bg-white p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{selectedShipment.id}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedShipment.status)}`}>
                        {getStatusIcon(selectedShipment.status)}
                        <span className="ml-2">{selectedShipment.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Customer</div>
                        <div className="text-lg text-gray-900">{selectedShipment.customer}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Current Location</div>
                        <div className="text-lg text-gray-900">{selectedShipment.currentLocation}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">ETA</div>
                        <div className="text-lg text-gray-900">{selectedShipment.estimatedArrival}</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Progress</span>
                        <span className="text-sm text-gray-900">{selectedShipment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${selectedShipment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-white mx-6 mt-6 rounded-lg border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Route Map</h4>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Interactive map would be displayed here</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {selectedShipment.origin} → {selectedShipment.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking History */}
                  <div className="bg-white mx-6 mt-6 mb-6 rounded-lg border border-gray-200 flex-1">
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900">Tracking History</h4>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {trackingHistory.map((event, index) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{event.status}</p>
                                <p className="text-sm text-gray-500">{event.timestamp}</p>
                              </div>
                              <p className="text-sm text-gray-600">{event.location}</p>
                              <p className="text-sm text-gray-500">{event.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a shipment to view tracking details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
