'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
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
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1)
          break
      }

      // Build queries based on user role
      let shipmentsQuery = query(
        collection(db, 'shipments'),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      )

      if (userRole === 'carrier' && userId) {
        shipmentsQuery = query(
          collection(db, 'shipments'),
          where('carrierId', '==', userId),
          where('createdAt', '>=', startDate),
          where('createdAt', '<=', endDate),
          orderBy('createdAt', 'desc')
        )
      } else if (userRole === 'user' && userId) {
        shipmentsQuery = query(
          collection(db, 'shipments'),
          where('userId', '==', userId),
          where('createdAt', '>=', startDate),
          where('createdAt', '<=', endDate),
          orderBy('createdAt', 'desc')
        )
      }

      // Load shipments data
      const shipmentsSnapshot = await getDocs(shipmentsQuery)
      const shipments = shipmentsSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          cost: data.cost || 0,
          status: data.status || 'pending',
          trackingNumber: data.trackingNumber || '',
          userId: data.userId || '',
          carrierId: data.carrierId || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          ...data
        }
      })

      // Calculate metrics
      const totalShipments = shipments.length
      const totalRevenue = shipments.reduce((sum, s) => sum + (s.cost || 0), 0)

      // Load carriers data (admin only)
      let totalCarriers = 0
      let topCarriers: any[] = []
      if (userRole === 'admin') {
        const carriersSnapshot = await getDocs(collection(db, 'carriers'))
        totalCarriers = carriersSnapshot.size
        
        topCarriers = carriersSnapshot.docs
          .map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              name: data.name || 'Unknown Carrier',
              totalShipments: data.totalShipments || 0,
              rating: data.rating || 0,
              totalRevenue: data.totalRevenue || 0,
              ...data
            }
          })
          .sort((a, b) => (b.totalShipments || 0) - (a.totalShipments || 0))
          .slice(0, 5)
          .map(carrier => ({
            name: carrier.name,
            shipments: carrier.totalShipments || 0,
            rating: carrier.rating || 0,
            revenue: carrier.totalRevenue || 0
          }))
      }

      // Load users data (admin only)
      let totalUsers = 0
      if (userRole === 'admin') {
        const usersSnapshot = await getDocs(collection(db, 'users'))
        totalUsers = usersSnapshot.size
      }

      // Calculate shipments by status
      const statusCounts = shipments.reduce((acc, shipment) => {
        const status = shipment.status || 'pending'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const shipmentsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.replace('_', ' ').toUpperCase(),
        value: count,
        color: statusColors[status as keyof typeof statusColors] || '#6b7280'
      }))

      // Calculate monthly data
      const monthlyData = shipments.reduce((acc, shipment) => {
        const month = shipment.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        if (!acc[month]) {
          acc[month] = { shipments: 0, revenue: 0 }
        }
        acc[month].shipments += 1
        acc[month].revenue += (shipment.cost || 0)
        return acc
      }, {} as Record<string, { shipments: number; revenue: number }>)

      const shipmentsByMonth = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        shipments: data.shipments,
        revenue: data.revenue
      }))

      // Recent activity
      const recentActivity = shipments.slice(0, 10).map(shipment => ({
        id: shipment.id,
        type: 'shipment',
        description: `Shipment ${shipment.trackingNumber || 'N/A'} ${(shipment.status || 'pending').replace('_', ' ')}`,
        timestamp: shipment.createdAt
      }))

      // Calculate growth (mock data for demo)
      const shipmentsGrowth = Math.floor(Math.random() * 30) - 10
      const revenueGrowth = Math.floor(Math.random() * 25) - 5
      const carriersGrowth = Math.floor(Math.random() * 15) - 5
      const usersGrowth = Math.floor(Math.random() * 20) - 5

      setData({
        totalShipments,
        totalRevenue,
        totalCarriers,
        totalUsers,
        shipmentsGrowth,
        revenueGrowth,
        carriersGrowth,
        usersGrowth,
        shipmentsByStatus,
        shipmentsByMonth,
        topCarriers,
        recentActivity
      })
    } catch (error) {
      console.error('Failed to load analytics data:', error)
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
