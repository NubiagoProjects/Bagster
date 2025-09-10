'use client'

import { useState } from 'react'
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
  Activity,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  Settings,
  User,
  Zap,
  Target,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const { addToast } = useToast()
  const userType = 'user' // This would come from auth context

  const stats = [
    {
      label: 'Total Shipments',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'blue'
    },
    {
      label: 'In Transit',
      value: '8',
      change: '+8%',
      trend: 'up',
      icon: Truck,
      color: 'orange'
    },
    {
      label: 'Delivered',
      value: '16',
      change: '+15%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Total Spent',
      value: '$4,250',
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50'
      case 'in-transit': return 'text-blue-600 bg-blue-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500'
      case 'in-transit': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const recentShipments = [
    {
      id: 'SH-001',
      customer: 'Acme Corp',
      origin: 'New York, NY',
      destination: 'Los Angeles, CA',
      status: 'in-transit',
      date: '2024-01-15',
      value: '$2,450'
    },
    {
      id: 'SH-002',
      customer: 'Tech Solutions',
      origin: 'Chicago, IL',
      destination: 'Miami, FL',
      status: 'delivered',
      date: '2024-01-14',
      value: '$1,890'
    },
    {
      id: 'SH-003',
      customer: 'Global Industries',
      origin: 'Seattle, WA',
      destination: 'Boston, MA',
      status: 'pending',
      date: '2024-01-16',
      value: '$3,200'
    }
  ]

  const allShipments = [
    ...recentShipments,
    {
      id: 'SH-004',
      customer: 'East Coast Logistics',
      origin: 'New York, NY',
      destination: 'Chicago, IL',
      status: 'in-transit',
      date: '2024-01-17',
      value: '$2,100'
    },
    {
      id: 'SH-005',
      customer: 'West Coast Express',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      status: 'delivered',
      date: '2024-01-18',
      value: '$1,800'
    }
  ]

  const analyticsData = {
    totalShipments: 24,
    totalSpent: '$4,250.00',
    averageDeliveryTime: '3.2 days',
    onTimeDelivery: '94%',
    popularRoutes: [
      { route: 'New York → Los Angeles', count: 8 },
      { route: 'Chicago → Miami', count: 6 },
      { route: 'Seattle → Boston', count: 5 },
      { route: 'Los Angeles → Chicago', count: 3 }
    ],
    monthlyTrends: [
      { month: 'Jan', shipments: 24, spending: 4250 },
      { month: 'Dec', shipments: 18, spending: 3200 },
      { month: 'Nov', shipments: 22, spending: 3800 },
      { month: 'Oct', shipments: 15, spending: 2600 }
    ]
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
    // setSelectedShipment(shipment)
    // setShowModal(true)
  }

  const handleDownloadLabel = async (shipmentId: string) => {
    // setIsLoading(true)
    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1500))
    // setIsLoading(false)
    // addToast('success', `Shipping label for ${shipmentId} downloaded successfully`)
  }

  const handleNewShipment = () => {
    addToast('info', 'New shipment feature coming soon!')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'shipments', label: 'All Shipments', icon: <Package className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
  ]

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500'
      case 'orange': return 'bg-orange-500'
      case 'green': return 'bg-green-500'
      case 'purple': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatBgColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50'
      case 'orange': return 'bg-orange-50'
      case 'green': return 'bg-green-50'
      case 'purple': return 'bg-purple-50'
      default: return 'bg-gray-50'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userType={userType} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Good morning, John</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your shipments today</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${getStatBgColor(stat.color)} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${getStatColor(stat.color).replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-semibold">{stat.change}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions & Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleNewShipment}
                  className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">Create Shipment</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <Search className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="font-medium text-gray-900">Track Package</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="font-medium text-gray-900">View Analytics</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Recent Shipments */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Shipments</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                    <span>View All</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentShipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{shipment.id}</p>
                          <p className="text-sm text-gray-500">{shipment.origin} → {shipment.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(shipment.status)}`}></span>
                          {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1).replace('-', ' ')}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delivery Performance</h3>
                <Target className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">On-time delivery</span>
                  <span className="text-sm font-semibold text-gray-900">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average delivery time</span>
                  <span className="text-sm font-semibold text-gray-900">3.2 days</span>
                </div>
              </div>
            </div>

            {/* Popular Routes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Popular Routes</h3>
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {analyticsData.popularRoutes.map((route, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{route.route}</span>
                    <span className="text-sm font-semibold text-gray-900">{route.count} shipments</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 