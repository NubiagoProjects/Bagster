'use client'

import { useState, useEffect } from 'react'
// Firebase disabled - using mock data
// import { db } from '@/lib/firebase'
// import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Package, Users, Truck, DollarSign, Activity, Calendar, Filter, Download } from 'lucide-react'

interface AnalyticsData {
  totalShipments: number
  totalRevenue: number
  totalCarriers: number
  totalUsers: number
  shipmentsGrowth: number
  revenueGrowth: number
  carriersGrowth: number
  usersGrowth: number
  shipmentsByStatus: Array<{ name: string; value: number; color: string }>
  shipmentsByMonth: Array<{ month: string; shipments: number; revenue: number }>
  topCarriers: Array<{ name: string; shipments: number; rating: number; revenue: number }>
  recentActivity: Array<{ id: string; type: string; description: string; timestamp: Date }>
}

interface AnalyticsDashboardProps {
  userRole?: 'admin' | 'carrier' | 'user'
  userId?: string
  className?: string
}

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  picked_up: '#8b5cf6',
  in_transit: '#6366f1',
  customs: '#f97316',
  out_for_delivery: '#10b981',
  delivered: '#059669',
  cancelled: '#ef4444'
}

export default function AnalyticsDashboard({ userRole = 'admin', userId, className = '' }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange, userId, userRole])

  const loadAnalyticsData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Mock analytics data for testing (Firebase disabled)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate loading
      
      const mockData: AnalyticsData = {
        totalShipments: userRole === 'carrier' ? 156 : 1247,
        totalRevenue: userRole === 'carrier' ? 45000 : 234500,
        totalCarriers: userRole === 'admin' ? 89 : 0,
        totalUsers: userRole === 'admin' ? 1247 : 0,
        shipmentsGrowth: 12,
        revenueGrowth: 18,
        carriersGrowth: 5,
        usersGrowth: 8,
        shipmentsByStatus: [
          { name: 'DELIVERED', value: 45, color: statusColors.delivered },
          { name: 'IN TRANSIT', value: 23, color: statusColors.in_transit },
          { name: 'PENDING', value: 12, color: statusColors.pending },
          { name: 'OUT FOR DELIVERY', value: 8, color: statusColors.out_for_delivery },
          { name: 'CANCELLED', value: 3, color: statusColors.cancelled }
        ],
        shipmentsByMonth: [
          { month: 'Jan 2024', shipments: 45, revenue: 12000 },
          { month: 'Feb 2024', shipments: 52, revenue: 14500 },
          { month: 'Mar 2024', shipments: 48, revenue: 13200 },
          { month: 'Apr 2024', shipments: 61, revenue: 16800 },
          { month: 'May 2024', shipments: 58, revenue: 15900 },
          { month: 'Jun 2024', shipments: 67, revenue: 18400 }
        ],
        topCarriers: userRole === 'admin' ? [
          { name: 'FastTrack Logistics', shipments: 234, rating: 4.8, revenue: 45000 },
          { name: 'Express Delivery Co', shipments: 189, rating: 4.6, revenue: 38000 },
          { name: 'Swift Transport', shipments: 156, rating: 4.7, revenue: 32000 },
          { name: 'Global Shipping Ltd', shipments: 134, rating: 4.5, revenue: 28000 },
          { name: 'Quick Move Express', shipments: 98, rating: 4.4, revenue: 21000 }
        ] : [],
        recentActivity: [
          {
            id: '1',
            type: 'shipment_delivered',
            description: 'Shipment BAG123456789 delivered successfully',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          },
          {
            id: '2',
            type: 'shipment_pickup',
            description: 'Shipment BAG987654321 picked up by carrier',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
          },
          {
            id: '3',
            type: 'shipment_created',
            description: 'New shipment BAG456789123 created',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
          }
        ]
      }

      setData(mockData)

    } catch (error) {
      console.error('Error loading analytics data:', error)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (loading) {
    return (
      <div className={`animate-pulse space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border h-80"></div>
          <div className="bg-white p-6 rounded-lg border h-80"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="text-red-800 font-medium">Error Loading Analytics</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
        <button
          onClick={loadAnalyticsData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">
            {userRole === 'admin' ? 'Platform Overview' : 
             userRole === 'carrier' ? 'Carrier Performance' : 'Your Shipments'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.totalShipments)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {data.shipmentsGrowth >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${data.shipmentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(data.shipmentsGrowth)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {data.revenueGrowth >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${data.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(data.revenueGrowth)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        {userRole === 'admin' && (
          <>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Carriers</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(data.totalCarriers)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {data.carriersGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${data.carriersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(data.carriersGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(data.totalUsers)}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {data.usersGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${data.usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(data.usersGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipments Over Time */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipments Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.shipmentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="shipments" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Shipments by Status */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipments by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.shipmentsByStatus}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
              >
                {data.shipmentsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.shipmentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Carriers (Admin only) */}
        {userRole === 'admin' && data.topCarriers.length > 0 && (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Carriers</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topCarriers} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="shipments" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="p-6">
          {data.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
