'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Truck,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const { addToast } = useToast()
  const userType = 'carrier'

  const metrics = [
    {
      label: 'Total Revenue',
      value: '$234,500',
      change: '+22.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Total Shipments',
      value: '1,247',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      label: 'Active Users',
      value: '892',
      change: '+8.7%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      label: 'Carrier Partners',
      value: '89',
      change: '+12.1%',
      trend: 'up',
      icon: Truck,
      color: 'text-orange-600'
    }
  ]

  const revenueData = [
    { month: 'Jan', revenue: 18500, shipments: 145 },
    { month: 'Feb', revenue: 22300, shipments: 178 },
    { month: 'Mar', revenue: 19800, shipments: 156 },
    { month: 'Apr', revenue: 25600, shipments: 203 },
    { month: 'May', revenue: 28900, shipments: 234 },
    { month: 'Jun', revenue: 31200, shipments: 267 }
  ]

  const topRoutes = [
    { route: 'Lagos → Nairobi', shipments: 89, revenue: '$45,600', growth: '+15%' },
    { route: 'Accra → Lagos', shipments: 67, revenue: '$32,400', growth: '+8%' },
    { route: 'Nairobi → Kampala', shipments: 54, revenue: '$28,900', growth: '+22%' },
    { route: 'Cairo → Lagos', shipments: 43, revenue: '$21,700', growth: '+5%' },
    { route: 'Lagos → Accra', shipments: 38, revenue: '$19,200', growth: '+12%' }
  ]

  const carrierPerformance = [
    { name: 'FastTrack Logistics', rating: 4.8, shipments: 156, onTime: 95, revenue: '$45,600' },
    { name: 'Global Express', rating: 4.6, shipments: 89, onTime: 92, revenue: '$28,900' },
    { name: 'Speed Cargo', rating: 4.4, shipments: 67, onTime: 88, revenue: '$22,100' },
    { name: 'Continental Express', rating: 4.2, shipments: 45, onTime: 85, revenue: '$15,200' }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userType={userType} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">Track performance metrics and business insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${metric.color}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-1 text-sm">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                  <span className="text-gray-500">vs last period</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Revenue</span>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Revenue chart visualization</p>
                  <p className="text-xs text-gray-400 mt-1">Chart component would be integrated here</p>
                </div>
              </div>
            </div>

            {/* Shipments Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Shipment Volume</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Shipments</span>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Shipment volume chart</p>
                  <p className="text-xs text-gray-400 mt-1">Chart component would be integrated here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Routes */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Top Routes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topRoutes.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{route.route}</div>
                        <div className="text-sm text-gray-500">{route.shipments} shipments</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{route.revenue}</div>
                        <div className="text-sm text-green-600">{route.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Carrier Performance */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Carrier Performance</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {carrierPerformance.map((carrier, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{carrier.name}</div>
                        <div className="text-sm text-gray-500">
                          ⭐ {carrier.rating} • {carrier.onTime}% on-time
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{carrier.revenue}</div>
                        <div className="text-sm text-gray-500">{carrier.shipments} shipments</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
