'use client'

import { useState, useEffect } from 'react'
import { 
  Truck, 
  Package, 
  MapPin, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Search,
  Download,
  Settings,
  Bell,
  User,
  Route,
  Award,
  Target,
  ArrowRight,
  Eye,
  MoreHorizontal,
  QrCode,
  Timer,
  Zap
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default function CarrierDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'active'>('all')
  const [shipments, setShipments] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()
  const userType = 'carrier'
  const carrierId = 'carrier_1' // Mock carrier ID - get from auth in production

  // Fetch carrier shipments
  useEffect(() => {
    fetchShipments(activeTab)
  }, [activeTab])

  const fetchShipments = async (view: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/v1/carrier/shipments?carrierId=${carrierId}&view=${view}`)
      const data = await response.json()
      
      if (data.success) {
        setShipments(data.data.shipments)
        setStats(data.data.stats)
      } else {
        addToast('error', 'Failed to fetch shipments')
      }
    } catch (error) {
      addToast('error', 'Error loading shipments')
    } finally {
      setLoading(false)
    }
  }

  // Handle assignment actions
  const handleAcceptAssignment = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/v1/carrier/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept', carrierId })
      })
      
      const data = await response.json()
      if (data.success) {
        addToast('success', 'Assignment accepted successfully!')
        fetchShipments(activeTab)
      } else {
        addToast('error', data.error || 'Failed to accept assignment')
      }
    } catch (error) {
      addToast('error', 'Error accepting assignment')
    }
  }

  const handleDeclineAssignment = async (assignmentId: string, reason?: string) => {
    try {
      const response = await fetch(`/api/v1/carrier/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline', carrierId, reason })
      })
      
      const data = await response.json()
      if (data.success) {
        addToast('info', 'Assignment declined')
        fetchShipments(activeTab)
      } else {
        addToast('error', data.error || 'Failed to decline assignment')
      }
    } catch (error) {
      addToast('error', 'Error declining assignment')
    }
  }

  // QR Code scanning
  const handleQRScan = async (qrCodeData: string) => {
    try {
      const response = await fetch('/api/v1/carrier/qr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodeData, carrierId })
      })
      
      const data = await response.json()
      if (data.success) {
        addToast('success', `Status updated to ${data.data.status}`)
        fetchShipments(activeTab)
      } else {
        addToast('error', data.error || 'QR scan failed')
      }
    } catch (error) {
      addToast('error', 'Error processing QR scan')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50'
      case 'in_transit': return 'text-blue-600 bg-blue-50'
      case 'picked_up': return 'text-yellow-600 bg-yellow-50'
      case 'accepted': return 'text-purple-600 bg-purple-50'
      case 'assigned': return 'text-orange-600 bg-orange-50'
      case 'pending': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500'
      case 'in_transit': return 'bg-blue-500'
      case 'picked_up': return 'bg-yellow-500'
      case 'accepted': return 'bg-purple-500'
      case 'assigned': return 'bg-orange-500'
      case 'pending': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Countdown timer component
  const CountdownTimer = ({ expiresAt }: { expiresAt: string }) => {
    const [timeLeft, setTimeLeft] = useState('')
    
    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const expiry = new Date(expiresAt).getTime()
        const distance = expiry - now
        
        if (distance > 0) {
          const hours = Math.floor(distance / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          setTimeLeft(`${hours}h ${minutes}m`)
        } else {
          setTimeLeft('EXPIRED')
        }
      }, 1000)
      
      return () => clearInterval(timer)
    }, [expiresAt])
    
    return (
      <div className={`flex items-center space-x-1 text-xs font-medium ${
        timeLeft === 'EXPIRED' ? 'text-red-600' : 'text-orange-600'
      }`}>
        <Timer className="w-3 h-3" />
        <span>{timeLeft}</span>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userType={userType} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, FastTrack Logistics</h1>
              <p className="text-gray-600 mt-1">Manage your shipments and grow your business</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Online</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                {stats.pendingAcceptance > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingAcceptance}
                  </span>
                )}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAssigned || 0}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-semibold">+12%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Acceptance</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pendingAcceptance || 0}</p>
                  </div>
                </div>
                {stats.pendingAcceptance > 0 && (
                  <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    Urgent
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeShipments || 0}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-semibold">+8%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₦{stats.totalEarnings?.toLocaleString() || 0}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-semibold">+23%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-2">
              <nav className="flex space-x-2" aria-label="Tabs">
                {[
                  { key: 'all', label: 'All Shipments', icon: Package },
                  { key: 'pending', label: 'Pending Acceptance', icon: Clock, badge: stats.pendingAcceptance },
                  { key: 'accepted', label: 'Accepted', icon: CheckCircle },
                  { key: 'active', label: 'Active Deliveries', icon: Truck }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`${
                        activeTab === tab.key
                          ? 'bg-orange-50 text-orange-600 border-orange-200'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
                      } relative flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm border transition-all duration-200`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.badge && tab.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Shipments Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'all' && 'All Shipments'}
                  {activeTab === 'pending' && 'Pending Acceptance'}
                  {activeTab === 'accepted' && 'Accepted Shipments'}
                  {activeTab === 'active' && 'Active Deliveries'}
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm">
                    <QrCode className="w-4 h-4" />
                    <span>Scan QR</span>
                  </button>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : shipments.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No shipments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                      {activeTab === 'pending' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipments.map((shipmentView) => (
                      <tr key={shipmentView.shipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{shipmentView.shipment.trackingNumber}</div>
                            <div className="text-xs text-gray-500">{shipmentView.shipment.weight}kg • {shipmentView.shipment.priority}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{shipmentView.customer.name}</div>
                          <div className="text-xs text-gray-500">{shipmentView.customer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              <span className="truncate max-w-20">{shipmentView.shipment.origin}</span>
                              <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-20">{shipmentView.shipment.destination}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipmentView.currentStatus.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(shipmentView.currentStatus.status)}`}></span>
                            {shipmentView.currentStatus.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₦{shipmentView.earnings.total.toLocaleString()}
                        </td>
                        {activeTab === 'pending' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <CountdownTimer expiresAt={shipmentView.assignment.expiresAt} />
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            {activeTab === 'pending' && shipmentView.assignment.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleAcceptAssignment(shipmentView.assignment.id)}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => handleDeclineAssignment(shipmentView.assignment.id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {(activeTab === 'accepted' || activeTab === 'active') && (
                              <button className="text-blue-600 hover:text-blue-700">
                                <QrCode className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-gray-600 hover:text-gray-700">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}