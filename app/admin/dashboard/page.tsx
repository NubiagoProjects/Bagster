'use client'

import { useState } from 'react'
import Image from 'next/image'
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
  Target
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { addToast } = useToast()

  // Mock data for admin dashboard
  const platformStats = {
    totalUsers: 1247,
    totalCarriers: 89,
    totalShipments: 3456,
    totalRevenue: 234500,
    activeShipments: 234,
    pendingApprovals: 12,
    systemHealth: 99.8,
    averageRating: 4.6
  }

  const recentShipments = [
    {
      id: 'BAG123456789',
      status: 'in_transit',
      carrier: 'FastTrack Logistics',
      customer: 'TechCorp Ltd',
      origin: 'Lagos, Nigeria',
      destination: 'Nairobi, Kenya',
      value: 1200,
      createdAt: '2024-01-15'
    },
    {
      id: 'BAG987654321',
      status: 'pending',
      carrier: 'Global Express',
      customer: 'East Africa Imports',
      origin: 'Accra, Ghana',
      destination: 'Kampala, Uganda',
      value: 800,
      createdAt: '2024-01-14'
    },
    {
      id: 'BAG456789123',
      status: 'delivered',
      carrier: 'Speed Cargo',
      customer: 'West Africa Trading',
      origin: 'Nairobi, Kenya',
      destination: 'Lagos, Nigeria',
      value: 1500,
      createdAt: '2024-01-10'
    }
  ]

  const pendingApprovals = [
    {
      id: 'CAR001',
      type: 'carrier',
      name: 'New Logistics Co.',
      email: 'info@newlogistics.com',
      phone: '+234 801 234 5678',
      location: 'Lagos, Nigeria',
      submittedAt: '2024-01-15'
    },
    {
      id: 'CAR002',
      type: 'carrier',
      name: 'Express Delivery Ltd',
      email: 'contact@expressdelivery.com',
      phone: '+254 700 123 456',
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
    },
    {
      id: '4',
      type: 'system_update',
      description: 'System maintenance completed',
      timestamp: '1 day ago'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return <User className="w-4 h-4 text-green-600" />
      case 'carrier_approved':
        return <Truck className="w-4 h-4 text-blue-600" />
      case 'shipment_completed':
        return <Package className="w-4 h-4 text-purple-600" />
      case 'system_update':
        return <Settings className="w-4 h-4 text-orange-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'in_transit':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
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
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Tesla-style Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <Breadcrumb />
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-gray-900">Admin Dashboard</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
              <div className="flex items-center space-x-3">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
                  alt="Admin avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tesla-style Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-light">Total Users</p>
                <p className="text-3xl font-light text-gray-900">{platformStats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-gray-600 font-light">+15% from last month</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-light">Active Carriers</p>
                <p className="text-3xl font-light text-gray-900">{platformStats.totalCarriers}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <Truck className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-gray-600 font-light">+8% from last month</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-light">Total Revenue</p>
                <p className="text-3xl font-light text-gray-900">${platformStats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-gray-600 font-light">+22% from last month</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-light">System Health</p>
                <p className="text-3xl font-light text-gray-900">{platformStats.systemHealth}%</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <Activity className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-gray-600 font-light">All systems operational</span>
            </div>
          </div>
        </div>

        {/* Tesla-style Tabs */}
        <div className="bg-white border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'carriers', label: 'Carriers', icon: Truck },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-light text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Tesla-style Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button className="flex items-center justify-center p-4 border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <Plus className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700 font-light">Add Carrier</span>
                  </button>
                  <button className="flex items-center justify-center p-4 border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <Users className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700 font-light">Manage Users</span>
                  </button>
                  <button className="flex items-center justify-center p-4 border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <Shield className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700 font-light">Review Approvals</span>
                  </button>
                  <button className="flex items-center justify-center p-4 border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <Download className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700 font-light">Export Data</span>
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="flex items-center space-x-3 text-lg font-light text-gray-900">
                      <Activity className="w-5 h-5 text-gray-600" />
                      <span>Recent Activity</span>
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${
                            activity.type === 'user_signup' ? 'bg-green-100' :
                            activity.type === 'carrier_approved' ? 'bg-blue-100' :
                            activity.type === 'shipment_completed' ? 'bg-purple-100' :
                            'bg-orange-100'
                          }`}>
                            {getActivityIcon(activity.type)}
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
                <div className="bg-white border border-gray-200">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center space-x-3 text-lg font-light text-gray-900">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span>Pending Approvals</span>
                      </h3>
                      <div className="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded">
                        {pendingApprovals.length} pending
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {pendingApprovals.map((approval, index) => (
                      <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{approval.name}</p>
                              <p className="text-sm text-gray-500">{approval.type} • {approval.submittedAt}</p>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                              Reject
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors">
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                      <p className="text-slate-500">Chart placeholder</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">User Growth</h4>
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
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Platform Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="Bagster"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label>
                      <input
                        type="email"
                        defaultValue="admin@bagster.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Support Phone</label>
                      <input
                        type="tel"
                        defaultValue="+234 801 234 5678"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
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