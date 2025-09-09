'use client'

import { useState } from 'react'
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { addToast } = useToast()
  const userType = 'carrier'

  const shipments = [
    {
      id: 'BAG123456789',
      status: 'in-transit',
      origin: 'Lagos, Nigeria',
      destination: 'Nairobi, Kenya',
      weight: '25kg',
      value: '$1,200',
      customer: 'TechCorp Ltd',
      carrier: 'FastTrack Logistics',
      pickupDate: '2024-01-15',
      estimatedDelivery: '2024-01-22',
      progress: 65
    },
    {
      id: 'BAG987654321',
      status: 'picked-up',
      origin: 'Accra, Ghana',
      destination: 'Lagos, Nigeria',
      weight: '15kg',
      value: '$800',
      customer: 'Global Imports',
      carrier: 'Express Delivery',
      pickupDate: '2024-01-14',
      estimatedDelivery: '2024-01-20',
      progress: 25
    },
    {
      id: 'BAG456789123',
      status: 'delivered',
      origin: 'Nairobi, Kenya',
      destination: 'Kampala, Uganda',
      weight: '30kg',
      value: '$1,500',
      customer: 'East Africa Logistics',
      carrier: 'Speed Cargo',
      pickupDate: '2024-01-10',
      estimatedDelivery: '2024-01-17',
      progress: 100
    },
    {
      id: 'BAG789123456',
      status: 'pending',
      origin: 'Cairo, Egypt',
      destination: 'Lagos, Nigeria',
      weight: '20kg',
      value: '$950',
      customer: 'North Africa Trading',
      carrier: 'Continental Express',
      pickupDate: '2024-01-16',
      estimatedDelivery: '2024-01-24',
      progress: 0
    }
  ]

  const stats = [
    { label: 'Total Shipments', value: '156', change: '+12%', trend: 'up' },
    { label: 'In Transit', value: '23', change: '+5%', trend: 'up' },
    { label: 'Delivered', value: '128', change: '+18%', trend: 'up' },
    { label: 'Pending', value: '5', change: '-2%', trend: 'down' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50'
      case 'in-transit': return 'text-blue-600 bg-blue-50'
      case 'picked-up': return 'text-yellow-600 bg-yellow-50'
      case 'pending': return 'text-gray-600 bg-gray-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500'
      case 'in-transit': return 'bg-blue-500'
      case 'picked-up': return 'bg-yellow-500'
      case 'pending': return 'bg-gray-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || shipment.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const handleViewShipment = (shipmentId: string) => {
    addToast('info', `Viewing shipment details for ${shipmentId}`)
    // In a real app, this would navigate to shipment details page
    console.log('View shipment:', shipmentId)
  }

  const handleEditShipment = (shipmentId: string) => {
    addToast('info', `Opening edit form for shipment ${shipmentId}`)
    // In a real app, this would open an edit modal or navigate to edit page
    console.log('Edit shipment:', shipmentId)
  }

  const handleDeleteShipment = async (shipmentId: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      try {
        const response = await fetch(`/api/dashboard/shipments?id=${shipmentId}`, {
          method: 'DELETE'
        })
        
        const data = await response.json()
        
        if (data.success) {
          addToast('success', 'Shipment deleted successfully')
          // In a real app, you would refresh the data
        } else {
          addToast('error', data.error || 'Failed to delete shipment')
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
              <h1 className="text-2xl font-semibold text-gray-900">Shipments</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and track all your shipments</p>
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
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="picked-up">Picked Up</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
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
                    <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipments Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">All Shipments</h2>
                <span className="text-sm text-gray-500">{filteredShipments.length} shipments</span>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => (
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
                        {shipment.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shipment.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{shipment.progress}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewShipment(shipment.id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditShipment(shipment.id)}
                            className="text-green-600 hover:text-green-700"
                            title="Edit Shipment"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteShipment(shipment.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Shipment"
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
