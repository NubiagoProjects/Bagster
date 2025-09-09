'use client'

import { useState } from 'react'
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Download,
  Calendar,
  User,
  Package,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { addToast } = useToast()
  const userType = 'carrier'

  const orders = [
    {
      id: 'ORD-2024-001',
      customer: 'TechCorp Ltd',
      customerEmail: 'orders@techcorp.com',
      items: 3,
      totalWeight: '25kg',
      totalValue: '$1,200',
      origin: 'Lagos, Nigeria',
      destination: 'Nairobi, Kenya',
      status: 'confirmed',
      priority: 'high',
      orderDate: '2024-01-15',
      requestedDelivery: '2024-01-22',
      notes: 'Fragile electronics - handle with care'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Global Imports',
      customerEmail: 'shipping@globalimports.com',
      items: 2,
      totalWeight: '15kg',
      totalValue: '$800',
      origin: 'Accra, Ghana',
      destination: 'Lagos, Nigeria',
      status: 'pending',
      priority: 'medium',
      orderDate: '2024-01-14',
      requestedDelivery: '2024-01-20',
      notes: 'Standard delivery'
    },
    {
      id: 'ORD-2024-003',
      customer: 'East Africa Logistics',
      customerEmail: 'ops@eastafrica.com',
      items: 5,
      totalWeight: '30kg',
      totalValue: '$1,500',
      origin: 'Nairobi, Kenya',
      destination: 'Kampala, Uganda',
      status: 'processing',
      priority: 'high',
      orderDate: '2024-01-10',
      requestedDelivery: '2024-01-17',
      notes: 'Express delivery required'
    },
    {
      id: 'ORD-2024-004',
      customer: 'West Africa Trading',
      customerEmail: 'contact@westtrading.com',
      items: 1,
      totalWeight: '8kg',
      totalValue: '$450',
      origin: 'Lagos, Nigeria',
      destination: 'Abidjan, Ivory Coast',
      status: 'cancelled',
      priority: 'low',
      orderDate: '2024-01-12',
      requestedDelivery: '2024-01-19',
      notes: 'Customer requested cancellation'
    }
  ]

  const stats = [
    { label: 'Total Orders', value: '234', change: '+18%', trend: 'up' },
    { label: 'Pending Orders', value: '12', change: '+3', trend: 'up' },
    { label: 'Processing', value: '8', change: '-2', trend: 'down' },
    { label: 'Order Value', value: '$45,600', change: '+22%', trend: 'up' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'processing': return 'text-blue-600 bg-blue-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.destination.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userType={userType} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
              <p className="text-sm text-gray-600 mt-1">Manage customer orders and requests</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>New Order</span>
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
                    <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
                <span className="text-sm text-gray-500">{filteredOrders.length} orders</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.orderDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{order.origin}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-gray-400">→</span>
                            <span>{order.destination}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.items} items</div>
                        <div className="text-sm text-gray-500">{order.totalWeight}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.totalValue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <Edit className="w-4 h-4" />
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
