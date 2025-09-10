'use client'

import { useState } from 'react'
import { 
  Shield, 
  Users, 
  Package, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Star,
  Settings,
  Bell,
  User,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Activity,
  Globe,
  Zap,
  Award,
  Target,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import DashboardSidebar from '@/components/ui/DashboardSidebar'
import CarrierManagement from '@/components/admin/CarrierManagement'
import AddCarrierForm from '@/components/admin/AddCarrierForm'
import ApiKeyManagement from '@/components/admin/ApiKeyManagement'

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddCarrierForm, setShowAddCarrierForm] = useState(false)
  const { addToast } = useToast()
  const userType = 'admin'

  // Mock data for admin dashboard
  const adminStats = [
    {
      label: 'Total Users',
      value: '1,247',
      change: '+15%',
      trend: 'up'
    },
    {
      label: 'Active Carriers',
      value: '89',
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'Platform Revenue',
      value: '$234,500',
      change: '+22%',
      trend: 'up'
    },
    {
      label: 'System Health',
      value: '99.8%',
      change: 'All systems operational',
      trend: 'stable'
    }
  ]

  const pendingApprovals = [
    {
      id: 'CAR001',
      type: 'carrier',
      name: 'New Logistics Co.',
      email: 'info@newlogistics.com',
      location: 'Lagos, Nigeria',
      submittedAt: '2024-01-15'
    },
    {
      id: 'CAR002',
      type: 'carrier',
      name: 'Express Delivery Ltd',
      email: 'contact@expressdelivery.com',
      location: 'Nairobi, Kenya',
      submittedAt: '2024-01-14'
    }
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'user_signup',
      description: 'New user registered: John Doe',
      timestamp: '2 hours ago'
    },
    {
      id: '2', 
      type: 'carrier_approved',
      description: 'Carrier approved: FastTrack Logistics',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'shipment_completed',
      description: 'Shipment BAG123456789 delivered successfully',
      timestamp: '6 hours ago'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-purple-600 bg-purple-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500'
      case 'pending': return 'bg-purple-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
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
              <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Manage platform operations and monitor system health</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users, carriers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-64"
                />
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('carriers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'carriers'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Carriers
              </button>
              <button
                onClick={() => setActiveTab('api-keys')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'api-keys'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                API Keys
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {adminStats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        <span className={stat.trend === 'up' ? 'text-green-600 font-medium' : 'text-gray-600 font-medium'}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity & Pending Approvals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            {activity.type === 'user_signup' && <User className="w-4 h-4 text-purple-600" />}
                            {activity.type === 'carrier_approved' && <Truck className="w-4 h-4 text-purple-600" />}
                            {activity.type === 'shipment_completed' && <Package className="w-4 h-4 text-purple-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <p className="text-sm text-gray-500">{activity.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {pendingApprovals.length} pending
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {pendingApprovals.map((approval) => (
                      <div key={approval.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{approval.name}</p>
                              <p className="text-sm text-gray-500">{approval.location}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50">
                              Reject
                            </button>
                            <button className="px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700">
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'carriers' && (
            <CarrierManagement onAddCarrier={() => setShowAddCarrierForm(true)} />
          )}

          {activeTab === 'api-keys' && (
            <ApiKeyManagement />
          )}
        </div>

        {/* Add Carrier Form Modal */}
        <AddCarrierForm
          isOpen={showAddCarrierForm}
          onClose={() => setShowAddCarrierForm(false)}
          onCarrierAdded={() => {
            // Refresh carriers list if needed
            window.location.reload()
          }}
        />
      </div>
    </div>
  )
}