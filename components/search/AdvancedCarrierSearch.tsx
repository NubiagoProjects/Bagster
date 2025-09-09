'use client'

import { useState, useEffect, useMemo } from 'react'
// Firebase disabled - using mock data
// import { db } from '@/lib/firebase'
// import { collection, query, where, orderBy, limit, getDocs, startAfter, DocumentSnapshot } from 'firebase/firestore'
import { Search, Filter, MapPin, Star, Truck, Package, Clock, ChevronDown, X } from 'lucide-react'

interface Carrier {
  id: string
  name: string
  email: string
  phone: string
  rating: number
  totalShipments: number
  activeRoutes: string[]
  serviceAreas: string[]
  vehicleTypes: string[]
  specializations: string[]
  priceRange: 'budget' | 'standard' | 'premium'
  isVerified: boolean
  isActive: boolean
  joinedAt: Date
  lastActive: Date
}

interface SearchFilters {
  query: string
  serviceAreas: string[]
  vehicleTypes: string[]
  specializations: string[]
  priceRange: string[]
  minRating: number
  isVerified: boolean | null
  isActive: boolean | null
  sortBy: 'rating' | 'name' | 'totalShipments' | 'joinedAt'
  sortOrder: 'asc' | 'desc'
}

interface AdvancedCarrierSearchProps {
  onCarrierSelect?: (carrier: Carrier) => void
  className?: string
}

const defaultFilters: SearchFilters = {
  query: '',
  serviceAreas: [],
  vehicleTypes: [],
  specializations: [],
  priceRange: [],
  minRating: 0,
  isVerified: null,
  isActive: null,
  sortBy: 'rating',
  sortOrder: 'desc'
}

const vehicleTypeOptions = [
  'Van', 'Truck', 'Motorcycle', 'Bicycle', 'Car', 'Semi-truck', 'Cargo plane', 'Ship'
]

const specializationOptions = [
  'Electronics', 'Fragile items', 'Perishables', 'Documents', 'Furniture', 'Automotive parts', 
  'Medical supplies', 'Hazardous materials', 'Oversized cargo', 'Express delivery'
]

const serviceAreaOptions = [
  'Local', 'Regional', 'National', 'International', 'Same-day', 'Next-day', 'Standard'
]

export default function AdvancedCarrierSearch({ onCarrierSelect, className = '' }: AdvancedCarrierSearchProps) {
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [filteredCarriers, setFilteredCarriers] = useState<Carrier[]>([])
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [lastDoc, setLastDoc] = useState<any | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // Load carriers - using mock data (Firebase disabled)
  const loadCarriers = async (isLoadMore = false) => {
    setLoading(true)
    try {
      // Mock carrier data for testing
      const mockCarriers: Carrier[] = [
        {
          id: '1',
          name: 'FastTrack Logistics',
          email: 'contact@fasttrack.com',
          phone: '+1-555-0123',
          rating: 4.8,
          totalShipments: 234,
          activeRoutes: ['Lagos-Abuja', 'Lagos-Port Harcourt'],
          serviceAreas: ['Local', 'Regional'],
          vehicleTypes: ['Van', 'Truck'],
          priceRange: 'standard',
          specializations: ['Express Delivery', 'Fragile Items'],
          isVerified: true,
          isActive: true,
          joinedAt: new Date(),
          lastActive: new Date()
        },
        {
          id: '2',
          name: 'Express Delivery Co',
          email: 'info@expressdelivery.com',
          phone: '+1-555-0456',
          rating: 4.6,
          totalShipments: 189,
          activeRoutes: ['Nairobi-Mombasa', 'Nairobi-Kisumu'],
          serviceAreas: ['Regional', 'National'],
          vehicleTypes: ['Motorcycle', 'Van'],
          priceRange: 'budget',
          specializations: ['Same-day Delivery', 'Local Routes'],
          isVerified: true,
          isActive: true,
          joinedAt: new Date(),
          lastActive: new Date()
        },
        {
          id: '3',
          name: 'Swift Transport',
          email: 'hello@swifttransport.com',
          phone: '+1-555-0789',
          rating: 4.7,
          totalShipments: 156,
          activeRoutes: ['Accra-Kumasi', 'Accra-Tamale'],
          serviceAreas: ['Local', 'National'],
          vehicleTypes: ['Truck', 'Trailer'],
          priceRange: 'premium',
          specializations: ['Heavy Cargo', 'Long Distance'],
          isVerified: true,
          isActive: true,
          joinedAt: new Date(),
          lastActive: new Date()
        }
      ]

      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading

      if (isLoadMore) {
        setCarriers(prev => [...prev, ...mockCarriers])
      } else {
        setCarriers(mockCarriers)
      }

      setHasMore(false) // No more data for mock
      setLastDoc(null)

    } catch (error) {
      console.error('Error loading carriers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter carriers based on search criteria
  const applyFilters = useMemo(() => {
    let filtered = [...carriers]

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(carrier =>
        carrier.name.toLowerCase().includes(query) ||
        carrier.email.toLowerCase().includes(query) ||
        carrier.specializations.some(spec => spec.toLowerCase().includes(query)) ||
        carrier.serviceAreas.some(area => area.toLowerCase().includes(query))
      )
    }

    // Service areas
    if (filters.serviceAreas.length > 0) {
      filtered = filtered.filter(carrier =>
        filters.serviceAreas.some(area => carrier.serviceAreas.includes(area))
      )
    }

    // Vehicle types
    if (filters.vehicleTypes.length > 0) {
      filtered = filtered.filter(carrier =>
        filters.vehicleTypes.some(type => carrier.vehicleTypes.includes(type))
      )
    }

    // Specializations
    if (filters.specializations.length > 0) {
      filtered = filtered.filter(carrier =>
        filters.specializations.some(spec => carrier.specializations.includes(spec))
      )
    }

    // Price range
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(carrier =>
        filters.priceRange.includes(carrier.priceRange)
      )
    }

    // Minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(carrier => carrier.rating >= filters.minRating)
    }

    // Verification status
    if (filters.isVerified !== null) {
      filtered = filtered.filter(carrier => carrier.isVerified === filters.isVerified)
    }

    // Active status
    if (filters.isActive !== null) {
      filtered = filtered.filter(carrier => carrier.isActive === filters.isActive)
    }

    return filtered
  }, [carriers, filters])

  useEffect(() => {
    setFilteredCarriers(applyFilters)
  }, [applyFilters])

  useEffect(() => {
    loadCarriers()
  }, [filters.sortBy, filters.sortOrder])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      return { ...prev, [key]: newArray }
    })
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search carriers by name, specialization, or service area..."
          value={filters.query}
          onChange={(e) => updateFilter('query', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        <div className="flex items-center space-x-4">
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="totalShipments">Sort by Experience</option>
            <option value="joinedAt">Sort by Join Date</option>
          </select>
          
          <button
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Areas</label>
              <div className="space-y-2">
                {serviceAreaOptions.map(area => (
                  <label key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.serviceAreas.includes(area)}
                      onChange={() => toggleArrayFilter('serviceAreas', area)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{area}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vehicle Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Types</label>
              <div className="space-y-2">
                {vehicleTypeOptions.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.vehicleTypes.includes(type)}
                      onChange={() => toggleArrayFilter('vehicleTypes', type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
              <div className="space-y-2">
                {specializationOptions.map(spec => (
                  <label key={spec} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.specializations.includes(spec)}
                      onChange={() => toggleArrayFilter('specializations', spec)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="space-y-2">
                {['budget', 'standard', 'premium'].map(range => (
                  <label key={range} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.priceRange.includes(range)}
                      onChange={() => toggleArrayFilter('priceRange', range)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => updateFilter('minRating', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Any Rating</option>
                <option value={1}>1+ Stars</option>
                <option value={2}>2+ Stars</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>

            {/* Verification Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
              <select
                value={filters.isVerified === null ? '' : filters.isVerified.toString()}
                onChange={(e) => updateFilter('isVerified', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Carriers</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.isActive === null ? '' : filters.isActive.toString()}
                onChange={(e) => updateFilter('isActive', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {filteredCarriers.length} Carriers Found
          </h3>
        </div>

        {loading && filteredCarriers.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg border p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCarriers.map(carrier => (
              <div
                key={carrier.id}
                className="bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer p-6"
                onClick={() => onCarrierSelect?.(carrier)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      {carrier.name}
                      {carrier.isVerified && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Verified
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center mt-1">
                      {renderStars(carrier.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({carrier.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${carrier.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{carrier.totalShipments} shipments</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    <span>{carrier.vehicleTypes.slice(0, 2).join(', ')}</span>
                    {carrier.vehicleTypes.length > 2 && (
                      <span className="ml-1">+{carrier.vehicleTypes.length - 2} more</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{carrier.serviceAreas.slice(0, 2).join(', ')}</span>
                    {carrier.serviceAreas.length > 2 && (
                      <span className="ml-1">+{carrier.serviceAreas.length - 2} more</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Last active: {carrier.lastActive.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {carrier.specializations.slice(0, 3).map(spec => (
                    <span
                      key={spec}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                  {carrier.specializations.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{carrier.specializations.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center">
            <button
              onClick={() => loadCarriers(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Load More Carriers
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
