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
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
              <p className="text-gray-600 mt-1">Manage platform operations and monitor system health</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">All Systems Operational</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingApprovals.length}
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-6">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('carriers')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === 'carriers'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Truck className="w-4 h-4 inline mr-2" />
                Carriers
              </button>
              <button
                onClick={() => setActiveTab('api-keys')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === 'api-keys'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                API Keys
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {adminStats.map((stat, index) => {
                  const getStatIcon = () => {
                    switch (stat.label) {
                      case 'Total Users': return <Users className="w-6 h-6 text-blue-500" />
                      case 'Active Carriers': return <Truck className="w-6 h-6 text-orange-500" />
                      case 'Platform Revenue': return <DollarSign className="w-6 h-6 text-green-500" />
                      case 'System Health': return <Shield className="w-6 h-6 text-purple-500" />
                      default: return <Activity className="w-6 h-6 text-gray-500" />
                    }
                  }
                  
                  const getStatBgColor = () => {
                    switch (stat.label) {
                      case 'Total Users': return 'bg-blue-50'
                      case 'Active Carriers': return 'bg-orange-50'
                      case 'Platform Revenue': return 'bg-green-50'
                      case 'System Health': return 'bg-purple-50'
                      default: return 'bg-gray-50'
                    }
                  }

                  return (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg ${getStatBgColor()} flex items-center justify-center`}>
                            {getStatIcon()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-sm">
                            {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                            <span className={stat.trend === 'up' ? 'text-green-600 font-semibold' : 'text-gray-600 font-semibold'}>
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Recent Activity & Pending Approvals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                      <Activity className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {activity.type === 'user_signup' && <User className="w-5 h-5 text-purple-600" />}
                            {activity.type === 'carrier_approved' && <Truck className="w-5 h-5 text-purple-600" />}
                            {activity.type === 'shipment_completed' && <Package className="w-5 h-5 text-purple-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {pendingApprovals.length} urgent
                        </span>
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {pendingApprovals.map((approval) => (
                        <div key={approval.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Truck className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{approval.name}</p>
                              <p className="text-sm text-gray-500">{approval.location}</p>
                              <p className="text-xs text-gray-400">Submitted {approval.submittedAt}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1.5 text-sm text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                              Reject
                            </button>
                            <button className="px-3 py-1.5 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* System Metrics */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">All systems operational</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">99.9%</p>
                    <p className="text-sm text-gray-600">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">1.2s</p>
                    <p className="text-sm text-gray-600">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                    <p className="text-sm text-gray-600">User Rating</p>
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