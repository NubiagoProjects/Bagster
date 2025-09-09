'use client'

import { useState } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  DollarSign,
  MapPin,
  Calendar,
  ArrowRight,
  Eye,
  Download,
  BarChart3,
  Users,
  Globe,
  Activity
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import Modal from '@/components/ui/Modal'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<any>(null)
  const { addToast } = useToast()

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard' }
  ]

  const recentShipments = [
    {
      id: 'SH001',
      status: 'in-transit',
      origin: 'Lagos, Nigeria',
      destination: 'Accra, Ghana',
      carrier: 'Express Logistics Ltd',
      date: '2024-01-15',
      eta: '2024-01-18',
      price: '$245.00',
      weight: '25kg',
      tracking: 'BGS123456789'
    },
    {
      id: 'SH002',
      status: 'delivered',
      origin: 'Nairobi, Kenya',
      destination: 'Dar es Salaam, Tanzania',
      carrier: 'African Cargo Solutions',
      date: '2024-01-10',
      eta: '2024-01-13',
      price: '$180.00',
      weight: '15kg',
      tracking: 'BGS987654321'
    },
    {
      id: 'SH003',
      status: 'pending',
      origin: 'Johannesburg, South Africa',
      destination: 'Cape Town, South Africa',
      carrier: 'Southern Africa Cargo',
      date: '2024-01-20',
      eta: '2024-01-22',
      price: '$95.00',
      weight: '8kg',
      tracking: 'BGS456789123'
    },
    {
      id: 'SH004',
      status: 'in-transit',
      origin: 'Accra, Ghana',
      destination: 'Lagos, Nigeria',
      carrier: 'West Africa Transport',
      date: '2024-01-18',
      eta: '2024-01-21',
      price: '$320.00',
      weight: '30kg',
      tracking: 'BGS789123456'
    }
  ]

  const allShipments = [
    ...recentShipments,
    {
      id: 'SH005',
      status: 'delivered',
      origin: 'Dar es Salaam, Tanzania',
      destination: 'Nairobi, Kenya',
      carrier: 'East Africa Express',
      date: '2024-01-05',
      eta: '2024-01-08',
      price: '$150.00',
      weight: '12kg',
      tracking: 'BGS321654987'
    },
    {
      id: 'SH006',
      status: 'pending',
      origin: 'Cape Town, South Africa',
      destination: 'Johannesburg, South Africa',
      carrier: 'Southern Africa Cargo',
      date: '2024-01-25',
      eta: '2024-01-27',
      price: '$75.00',
      weight: '5kg',
      tracking: 'BGS147258369'
    }
  ]

  const analyticsData = {
    totalShipments: 24,
    totalSpent: '$4,250.00',
    averageDeliveryTime: '3.2 days',
    onTimeDelivery: '94%',
    popularRoutes: [
      { route: 'Lagos → Accra', count: 8 },
      { route: 'Nairobi → Dar es Salaam', count: 6 },
      { route: 'Johannesburg → Cape Town', count: 5 },
      { route: 'Accra → Lagos', count: 3 }
    ],
    monthlyTrends: [
      { month: 'Jan', shipments: 24, spending: 4250 },
      { month: 'Dec', shipments: 18, spending: 3200 },
      { month: 'Nov', shipments: 22, spending: 3800 },
      { month: 'Oct', shipments: 15, spending: 2600 }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-emerald-600 bg-emerald-100'
      case 'in-transit':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-amber-600 bg-amber-100'
      default:
        return 'text-slate-600 bg-slate-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'in-transit':
        return <Truck className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleViewDetails = (shipment: any) => {
    setSelectedShipment(shipment)
    setShowModal(true)
  }

  const handleDownloadLabel = async (shipmentId: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    addToast('success', `Shipping label for ${shipmentId} downloaded successfully`)
  }

  const handleNewShipment = () => {
    addToast('info', 'New shipment feature coming soon!')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'shipments', label: 'All Shipments', icon: <Package className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Dashboard Header */}
      <section className="pt-32 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-black rounded flex items-center justify-center mr-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600 font-light">Welcome back! Here's what's happening with your shipments.</p>
            </div>
            <button 
              onClick={handleNewShipment}
              className="bg-black text-white px-6 py-2 font-light hover:bg-gray-800 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  New Shipment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white border border-gray-200 rounded p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-light transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-light text-gray-600">Total Shipments</p>
                      <p className="text-2xl font-light text-gray-900">{analyticsData.totalShipments}</p>
                    </div>
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-light text-gray-600">Total Spent</p>
                      <p className="text-2xl font-light text-gray-900">{analyticsData.totalSpent}</p>
                    </div>
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-light text-gray-600">Avg Delivery Time</p>
                      <p className="text-2xl font-light text-gray-900">{analyticsData.averageDeliveryTime}</p>
                    </div>
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-light text-gray-600">On-Time Delivery</p>
                      <p className="text-2xl font-light text-gray-900">{analyticsData.onTimeDelivery}</p>
                    </div>
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Shipments */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-light text-gray-900">Recent Shipments</h2>
                  <button 
                    onClick={() => setActiveTab('shipments')}
                    className="text-gray-600 hover:text-gray-900 text-sm font-light"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentShipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-light text-gray-900">{shipment.id}</p>
                          <p className="text-sm text-gray-600 font-light">{shipment.origin} → {shipment.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          <span className="ml-1 capitalize">{shipment.status.replace('-', ' ')}</span>
                        </span>
                        <button
                          onClick={() => handleViewDetails(shipment)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Routes */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-light text-gray-900 mb-6">Popular Routes</h2>
                <div className="space-y-3">
                  {analyticsData.popularRoutes.map((route, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                          <span className="text-sm font-light text-white">{index + 1}</span>
                        </div>
                        <span className="text-gray-900 font-light">{route.route}</span>
                      </div>
                      <span className="text-sm text-gray-600 font-light">{route.count} shipments</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">All Shipments</h2>
                <div className="flex space-x-2">
                  <select className="input-field text-sm">
                    <option>All Status</option>
                    <option>In Transit</option>
                    <option>Delivered</option>
                    <option>Pending</option>
                  </select>
                  <select className="input-field text-sm">
                    <option>All Time</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4">
                {allShipments.map((shipment) => (
                  <div key={shipment.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{shipment.id}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                              {getStatusIcon(shipment.status)}
                              <span className="ml-1 capitalize">{shipment.status.replace('-', ' ')}</span>
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{shipment.origin} → {shipment.destination}</p>
                          <p className="text-sm text-slate-500">Carrier: {shipment.carrier}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{shipment.price}</p>
                          <p className="text-sm text-slate-600">{shipment.weight}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(shipment)}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadLabel(shipment.id)}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                            title="Download Label"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Monthly Trends */}
              <div className="card">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Monthly Trends</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Shipments</h3>
                    <div className="space-y-3">
                      {analyticsData.monthlyTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-slate-600">{trend.month}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(trend.shipments / 30) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-900">{trend.shipments}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending</h3>
                    <div className="space-y-3">
                      {analyticsData.monthlyTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-slate-600">{trend.month}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-emerald-600 h-2 rounded-full" 
                                style={{ width: `${(trend.spending / 5000) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-900">${trend.spending}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Growth Rate</h3>
                  <p className="text-3xl font-bold text-emerald-600">+12.5%</p>
                  <p className="text-sm text-slate-600 mt-1">vs last month</p>
                </div>

                <div className="card text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Active Carriers</h3>
                  <p className="text-3xl font-bold text-purple-600">8</p>
                  <p className="text-sm text-slate-600 mt-1">trusted partners</p>
                </div>

                <div className="card text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Countries</h3>
                  <p className="text-3xl font-bold text-amber-600">12</p>
                  <p className="text-sm text-slate-600 mt-1">served</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Shipment Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Shipment Details"
        message=""
        type="info"
        confirmText="Close"
        cancelText=""
        onConfirm={() => setShowModal(false)}
      >
        {selectedShipment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Shipment ID</p>
                <p className="text-slate-900">{selectedShipment.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Tracking Number</p>
                <p className="text-slate-900 font-mono">{selectedShipment.tracking}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Origin</p>
                <p className="text-slate-900">{selectedShipment.origin}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Destination</p>
                <p className="text-slate-900">{selectedShipment.destination}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Carrier</p>
                <p className="text-slate-900">{selectedShipment.carrier}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Price</p>
                <p className="text-slate-900">{selectedShipment.price}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Weight</p>
                <p className="text-slate-900">{selectedShipment.weight}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">ETA</p>
                <p className="text-slate-900">{selectedShipment.eta}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedShipment.status)}`}>
                {getStatusIcon(selectedShipment.status)}
                <span className="ml-1 capitalize">{selectedShipment.status.replace('-', ' ')}</span>
              </span>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  )
} 