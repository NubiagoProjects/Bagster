'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  Truck, 
  Package, 
  MapPin, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Search,
  Download,
  Settings,
  Bell,
  User,
  Route,
  Award,
  Target
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function CarrierDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { addToast } = useToast()

  // Mock data for carrier dashboard
  const carrierStats = {
    totalShipments: 156,
    activeShipments: 23,
    completedShipments: 133,
    totalRevenue: 45600,
    averageRating: 4.8,
    onTimeDelivery: 94.2,
    totalReviews: 89
  }

  const recentShipments = [
    {
      id: 'BAG123456789',
      status: 'in_transit',
      origin: 'Lagos, Nigeria',
      destination: 'Nairobi, Kenya',
      weight: '25kg',
      value: 1200,
      customer: 'TechCorp Ltd',
      pickupDate: '2024-01-15',
      estimatedDelivery: '2024-01-22'
    },
    {
      id: 'BAG987654321',
      status: 'picked_up',
      origin: 'Accra, Ghana',
      destination: 'Lagos, Nigeria',
      weight: '15kg',
      value: 800,
      customer: 'Global Imports',
      pickupDate: '2024-01-14',
      estimatedDelivery: '2024-01-20'
    },
    {
      id: 'BAG456789123',
      status: 'delivered',
      origin: 'Nairobi, Kenya',
      destination: 'Kampala, Uganda',
      weight: '30kg',
      value: 1500,
      customer: 'East Africa Logistics',
      pickupDate: '2024-01-10',
      estimatedDelivery: '2024-01-17'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'in_transit':
        return 'text-blue-600 bg-blue-100'
      case 'picked_up':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-slate-600 bg-slate-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'in_transit':
        return <Truck className="w-4 h-4" />
      case 'picked_up':
        return <Package className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-blue-800 bg-clip-text text-transparent">Carrier Dashboard</h1>
                <p className="text-slate-600 text-lg">Manage your shipments and grow your business</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <Image
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80"
                  alt="Carrier avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-semibold text-slate-700">John Carrier</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Shipments</p>
                  <p className="text-4xl font-bold text-white">{carrierStats.totalShipments}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="mt-6 flex items-center text-sm">
                <TrendingUp className="w-5 h-5 text-green-300 mr-2" />
                <span className="text-blue-100 font-medium">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Active Shipments</p>
                  <p className="text-4xl font-bold text-white">{carrierStats.activeShipments}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Truck className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="mt-6 flex items-center text-sm">
                <Clock className="w-5 h-5 text-yellow-300 mr-2" />
                <span className="text-amber-100 font-medium">In transit</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-4xl font-bold text-white">${carrierStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="mt-6 flex items-center text-sm">
                <TrendingUp className="w-5 h-5 text-green-300 mr-2" />
                <span className="text-emerald-100 font-medium">+8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Rating</p>
                  <div className="flex items-center">
                    <p className="text-4xl font-bold text-white">{carrierStats.averageRating}</p>
                    <Star className="w-6 h-6 text-yellow-300 ml-2" />
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="mt-6 flex items-center text-sm">
                <span className="text-purple-100 font-medium">{carrierStats.totalReviews} reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'shipments', label: 'Shipments', icon: Package },
                { id: 'routes', label: 'Routes', icon: MapPin },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200">
                    <Plus className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="text-slate-600">Add New Route</span>
                  </button>
                  <button className="flex items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200">
                    <Package className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="text-slate-600">Update Shipment</span>
                  </button>
                  <button className="flex items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200">
                    <Download className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="text-slate-600">Export Report</span>
                  </button>
                </div>

                {/* Recent Shipments */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Shipments</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View all
                    </button>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="space-y-4">
                      {recentShipments.map((shipment) => (
                        <div key={shipment.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-full ${getStatusColor(shipment.status)}`}>
                                {getStatusIcon(shipment.status)}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{shipment.id}</p>
                                <p className="text-sm text-slate-600">{shipment.customer}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-slate-900">${shipment.value}</p>
                              <p className="text-sm text-slate-600">{shipment.weight}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                            <div className="flex items-center space-x-4">
                              <span>{shipment.origin}</span>
                              <span>→</span>
                              <span>{shipment.destination}</span>
                            </div>
                            <span>Est. {shipment.estimatedDelivery}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Performance</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">On-time Delivery</span>
                        <span className="font-semibold text-green-600">{carrierStats.onTimeDelivery}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Customer Rating</span>
                        <span className="font-semibold text-yellow-600">{carrierStats.averageRating}/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Completed Shipments</span>
                        <span className="font-semibold text-blue-600">{carrierStats.completedShipments}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Alerts</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Shipment BAG123456789 delayed</p>
                          <p className="text-xs text-yellow-600">Expected delivery: Jan 25</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">New shipment assigned</p>
                          <p className="text-xs text-blue-600">Pickup: Lagos → Nairobi</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search shipments..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    <span>New Shipment</span>
                  </button>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="space-y-4">
                    {recentShipments.map((shipment) => (
                      <div key={shipment.id} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${getStatusColor(shipment.status)}`}>
                              {getStatusIcon(shipment.status)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{shipment.id}</p>
                              <p className="text-sm text-slate-600">{shipment.customer}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-slate-900">${shipment.value}</p>
                            <p className="text-sm text-slate-600">{shipment.weight}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                          <div className="flex items-center space-x-4">
                            <span>{shipment.origin}</span>
                            <span>→</span>
                            <span>{shipment.destination}</span>
                          </div>
                          <span>Est. {shipment.estimatedDelivery}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'routes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">My Routes</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    <span>Add Route</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { origin: 'Lagos', destination: 'Nairobi', price: 25, frequency: 'Daily' },
                    { origin: 'Accra', destination: 'Lagos', price: 20, frequency: '3x/week' },
                    { origin: 'Nairobi', destination: 'Kampala', price: 30, frequency: '2x/week' }
                  ].map((route, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-slate-500">{route.frequency}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">From</span>
                          <span className="font-medium">{route.origin}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">To</span>
                          <span className="font-medium">{route.destination}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Price/kg</span>
                          <span className="font-medium text-green-600">${route.price}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
                          Edit
                        </button>
                        <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Active
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trend</h4>
                    <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                      <p className="text-slate-500">Chart placeholder</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Shipment Volume</h4>
                    <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                      <p className="text-slate-500">Chart placeholder</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Profile Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        defaultValue="FastTrack Logistics"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="john@fasttrack.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+234 801 234 5678"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}