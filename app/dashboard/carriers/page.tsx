'use client'

import { useState } from 'react'
import { 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Star,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  DollarSign,
  Trash2
} from 'lucide-react'
import DashboardSidebar from '@/components/ui/DashboardSidebar'

// Mock toast function for now
const useToast = () => ({
  addToast: (type: string, message: string) => {
    console.log(`${type}: ${message}`)
    alert(`${type}: ${message}`)
  }
})

export default function CarriersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { addToast } = useToast()
  const userType = 'admin'

  const carriers = [
    {
      id: 'CAR001',
      name: 'FastTrack Logistics',
      email: 'contact@fasttrack.com',
      phone: '+234 801 234 5678',
      location: 'Lagos, Nigeria',
      status: 'active',
      rating: 4.8,
      totalShipments: 156,
      completedShipments: 148,
      onTimeDelivery: 95,
      joinedDate: '2023-06-15',
      revenue: 45600
    },
    {
      id: 'CAR002',
      name: 'Global Express',
      email: 'info@globalexpress.com',
      phone: '+254 700 123 456',
      location: 'Nairobi, Kenya',
      status: 'active',
      rating: 4.6,
      totalShipments: 89,
      completedShipments: 84,
      onTimeDelivery: 92,
      joinedDate: '2023-08-22',
      revenue: 28900
    },
    {
      id: 'CAR003',
      name: 'Speed Cargo',
      email: 'support@speedcargo.com',
      phone: '+233 244 567 890',
      location: 'Accra, Ghana',
      status: 'pending',
      rating: 4.2,
      totalShipments: 45,
      completedShipments: 42,
      onTimeDelivery: 88,
      joinedDate: '2024-01-10',
      revenue: 15200
    },
    {
      id: 'CAR004',
      name: 'Continental Express',
      email: 'hello@continental.com',
      phone: '+20 100 123 4567',
      location: 'Cairo, Egypt',
      status: 'suspended',
      rating: 3.9,
      totalShipments: 67,
      completedShipments: 58,
      onTimeDelivery: 78,
      joinedDate: '2023-11-05',
      revenue: 22100
    }
  ]

  const stats = [
    { label: 'Total Carriers', value: '89', change: '+8%', trend: 'up' },
    { label: 'Active Carriers', value: '76', change: '+12%', trend: 'up' },
    { label: 'Pending Approval', value: '8', change: '+3', trend: 'up' },
    { label: 'Avg Rating', value: '4.6', change: '+0.2', trend: 'up' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'suspended': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'suspended': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         carrier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         carrier.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || carrier.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const handleViewCarrier = (carrierId: string) => {
    addToast('info', `Viewing carrier details for ${carrierId}`)
    console.log('View carrier:', carrierId)
  }

  const handleEditCarrier = (carrierId: string) => {
    addToast('info', `Opening edit form for carrier ${carrierId}`)
    console.log('Edit carrier:', carrierId)
  }

  const handleDeleteCarrier = async (carrierId: string) => {
    if (confirm('Are you sure you want to remove this carrier?')) {
      try {
        const response = await fetch(`/api/dashboard/carriers?id=${carrierId}`, {
          method: 'DELETE'
        })
        
        const data = await response.json()
        
        if (data.success) {
          addToast('success', 'Carrier removed successfully')
        } else {
          addToast('error', data.error || 'Failed to remove carrier')
        }
      } catch (error) {
        addToast('error', 'Network error. Please try again.')
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userType={userType} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Carriers</h1>
              <p className="text-sm text-gray-600 mt-1">Manage carrier partners and their performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search carriers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-64"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>Add Carrier</span>
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

          {/* Carriers Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">All Carriers</h2>
                <span className="text-sm text-gray-500">{filteredCarriers.length} carriers</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCarriers.map((carrier) => (
                    <tr key={carrier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Truck className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{carrier.name}</div>
                            <div className="text-sm text-gray-500">ID: {carrier.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{carrier.email}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{carrier.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{carrier.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(carrier.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(carrier.status)}`}></span>
                          {carrier.status.charAt(0).toUpperCase() + carrier.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{carrier.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{carrier.completedShipments}/{carrier.totalShipments}</div>
                        <div className="text-xs text-gray-500">{carrier.onTimeDelivery}% on-time</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${carrier.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewCarrier(carrier.id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditCarrier(carrier.id)}
                            className="text-green-600 hover:text-green-700"
                            title="Edit Carrier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCarrier(carrier.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Remove Carrier"
                          >
                            <Trash2 className="w-4 h-4" />
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
