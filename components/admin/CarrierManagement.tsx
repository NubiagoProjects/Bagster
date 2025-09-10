'use client'

import { useState, useEffect } from 'react'
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin,
  Star,
  DollarSign,
  Package,
  Globe,
  Phone,
  Mail,
  Calendar,
  Activity,
  AlertTriangle
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import { Carrier } from '@/lib/types/carrier'

interface CarrierManagementProps {
  onAddCarrier?: () => void
}

export default function CarrierManagement({ onAddCarrier }: CarrierManagementProps) {
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetchCarriers()
  }, [])

  const fetchCarriers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/carriers')
      const data = await response.json()
      
      if (data.success) {
        setCarriers(data.data.carriers)
      } else {
        addToast('error', 'Failed to fetch carriers')
      }
    } catch (error) {
      console.error('Error fetching carriers:', error)
      addToast('error', 'Error loading carriers')
    } finally {
      setLoading(false)
    }
  }

  const updateCarrierStatus = async (carrierId: string, status: 'approved' | 'rejected' | 'suspended') => {
    try {
      const response = await fetch('/api/v1/carriers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: carrierId,
          status: status
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCarriers(prev => prev.map(carrier => 
          carrier.id === carrierId ? { ...carrier, status } : carrier
        ))
        addToast('success', `Carrier ${status} successfully`)
      } else {
        addToast('error', 'Failed to update carrier status')
      }
    } catch (error) {
      console.error('Error updating carrier:', error)
      addToast('error', 'Error updating carrier')
    }
  }

  const deleteCarrier = async (carrierId: string) => {
    if (!confirm('Are you sure you want to delete this carrier?')) return

    try {
      const response = await fetch(`/api/v1/carriers?id=${carrierId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        setCarriers(prev => prev.filter(carrier => carrier.id !== carrierId))
        addToast('success', 'Carrier deleted successfully')
      } else {
        addToast('error', 'Failed to delete carrier')
      }
    } catch (error) {
      console.error('Error deleting carrier:', error)
      addToast('error', 'Error deleting carrier')
    }
  }

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         carrier.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         carrier.country?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || carrier.status === statusFilter
    const matchesCountry = countryFilter === 'all' || carrier.country === countryFilter

    return matchesSearch && matchesStatus && matchesCountry
  })

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200'
      case 'pending': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200'
      case 'suspended': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'suspended': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const countries = Array.from(new Set(carriers.map(c => c.country).filter(Boolean)))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Carrier Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage carriers, their delivery countries, and pricing</p>
        </div>
        <button 
          onClick={onAddCarrier}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Carrier</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search carriers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-full"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Carriers</p>
              <p className="text-xl font-semibold text-gray-900">{carriers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-xl font-semibold text-gray-900">
                {carriers.filter(c => c.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-gray-900">
                {carriers.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Price/kg</p>
              <p className="text-xl font-semibold text-gray-900">
                ${(carriers.reduce((sum, c) => sum + c.pricing.base_rate_per_kg, 0) / carriers.length || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carriers Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Countries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/kg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
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
                        <div className="text-sm text-gray-500">{carrier.contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      {carrier.country || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(carrier.deliveryCountries || []).slice(0, 3).map((country, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {country}
                        </span>
                      ))}
                      {(carrier.deliveryCountries || []).length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{(carrier.deliveryCountries || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                      {carrier.pricing.base_rate_per_kg.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(carrier.status)}`}>
                      {getStatusIcon(carrier.status)}
                      <span className="ml-1 capitalize">{carrier.status || 'pending'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{carrier.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCarrier(carrier)
                          setShowDetails(true)
                        }}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {carrier.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateCarrierStatus(carrier.id, 'approved')}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateCarrierStatus(carrier.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {carrier.status === 'approved' && (
                        <button
                          onClick={() => updateCarrierStatus(carrier.id, 'suspended')}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded"
                          title="Suspend"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteCarrier(carrier.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
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
        
        {filteredCarriers.length === 0 && (
          <div className="text-center py-12">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No carriers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' || countryFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by adding a new carrier.'}
            </p>
          </div>
        )}
      </div>

      {/* Carrier Details Modal */}
      {showDetails && selectedCarrier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Carrier Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Name</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCarrier.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCarrier.contact.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCarrier.contact.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Website</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCarrier.contact.website || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Rating</label>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{selectedCarrier.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Total Deliveries</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCarrier.totalDeliveries || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Joined</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCarrier.joinedAt || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Last Active</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCarrier.lastActive || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm text-gray-500">Price per kg</label>
                    <p className="text-lg font-semibold text-gray-900">${selectedCarrier.pricing.base_rate_per_kg.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm text-gray-500">Minimum Charge</label>
                    <p className="text-lg font-semibold text-gray-900">${selectedCarrier.pricing.minimum_charge.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm text-gray-500">Pickup Fee</label>
                    <p className="text-lg font-semibold text-gray-900">${selectedCarrier.pricing.pickup_fee.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Service Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCarrier.service_areas.map((area, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Delivery Countries */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Countries</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedCarrier.deliveryCountries || []).map((country, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Capabilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Max Weight</label>
                    <p className="text-sm font-medium text-gray-900">{selectedCarrier.capabilities.max_weight_kg} kg</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Max Dimensions</label>
                    <p className="text-sm font-medium text-gray-900">{selectedCarrier.capabilities.max_dimensions_cm} cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
