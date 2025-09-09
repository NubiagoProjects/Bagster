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
  MoreHorizontal
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { addToast } = useToast()
  const userType = 'carrier' // This would come from auth context

  const stats = [
    {
      label: 'Total Shipments',
      value: '2,847',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'In Transit',
      value: '1,234',
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'Delivered',
      value: '1,456',
      change: '+15%',
      trend: 'up'
    },
    {
      label: 'Revenue',
      value: '$45,678',
      change: '+23%',
      trend: 'up'
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

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userType={userType} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening with your shipments.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>New Shipment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Shipments */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Shipments</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{shipment.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shipment.customer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <span>{shipment.origin}</span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <span>{shipment.destination}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(shipment.status)}`}></span>
                          {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1).replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shipment.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 