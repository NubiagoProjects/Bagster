'use client'

import { useState, useEffect } from 'react'
import HomepageHeader from '@/components/ui/HomepageHeader'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Truck, 
  Package, 
  Shield, 
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const carriers = [
  {
    id: 1,
    name: 'Express Logistics Ltd',
    rating: 4.8,
    reviews: 127,
    location: 'Lagos, Nigeria',
    price: '$2.50',
    deliveryTime: '2-3 days',
    transportModes: ['Road', 'Air'],
    services: ['Express', 'Standard', 'Bulk'],
    routes: ['Lagos → Accra', 'Lagos → Nairobi'],
    verified: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'African Cargo Solutions',
    rating: 4.6,
    reviews: 89,
    location: 'Nairobi, Kenya',
    price: '$3.20',
    deliveryTime: '3-4 days',
    transportModes: ['Road', 'Sea'],
    services: ['Standard', 'Bulk', 'Refrigerated'],
    routes: ['Nairobi → Dar es Salaam', 'Nairobi → Kampala'],
    verified: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'West Africa Transport',
    rating: 4.7,
    reviews: 156,
    location: 'Accra, Ghana',
    price: '$2.80',
    deliveryTime: '2-3 days',
    transportModes: ['Road', 'Air'],
    services: ['Express', 'Standard'],
    routes: ['Accra → Lagos', 'Accra → Abidjan'],
    verified: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: 'East Africa Express',
    rating: 4.5,
    reviews: 73,
    location: 'Dar es Salaam, Tanzania',
    price: '$3.50',
    deliveryTime: '4-5 days',
    transportModes: ['Road', 'Sea'],
    services: ['Standard', 'Bulk'],
    routes: ['Dar es Salaam → Nairobi', 'Dar es Salaam → Mombasa'],
    verified: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    name: 'Central Africa Logistics',
    rating: 4.9,
    reviews: 203,
    location: 'Kinshasa, DRC',
    price: '$4.20',
    deliveryTime: '5-6 days',
    transportModes: ['Road', 'Air', 'Sea'],
    services: ['Express', 'Standard', 'Bulk', 'Refrigerated'],
    routes: ['Kinshasa → Brazzaville', 'Kinshasa → Luanda'],
    verified: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop'
  },
  {
    id: 6,
    name: 'Southern Africa Cargo',
    rating: 4.4,
    reviews: 94,
    location: 'Johannesburg, South Africa',
    price: '$2.90',
    deliveryTime: '3-4 days',
    transportModes: ['Road', 'Air'],
    services: ['Express', 'Standard', 'Bulk'],
    routes: ['Johannesburg → Cape Town', 'Johannesburg → Durban'],
    verified: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
  }
]

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-slate-600">Loading carriers...</span>
  </div>
)

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="flex items-start space-x-4">
      <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-slate-200 rounded w-16"></div>
          <div className="h-6 bg-slate-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
)

export default function CarriersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [filteredCarriers, setFilteredCarriers] = useState(carriers)

  // Simulate loading on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Filter carriers based on search and filter
  useEffect(() => {
    let filtered = carriers

    if (searchTerm) {
      filtered = filtered.filter(carrier =>
        carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carrier.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedFilter === 'verified') {
      filtered = filtered.filter(carrier => carrier.verified)
    } else if (selectedFilter === 'featured') {
      filtered = filtered.filter(carrier => carrier.featured)
    }

    setFilteredCarriers(filtered)
  }, [searchTerm, selectedFilter])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <HomepageHeader />
        
        <div className="pt-32 pb-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
            {/* Hero Section Skeleton */}
            <div className="text-center mb-16">
              <div className="h-12 bg-slate-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="h-12 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <HomepageHeader />
      <Breadcrumbs items={[{ label: 'Carriers' }]} />
      
      {/* Hero Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
              <Truck className="w-4 h-4 mr-2" />
              Verified Network
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Find Your Perfect Carrier
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Browse through our network of verified carriers across Africa with real-time availability and competitive rates
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search carriers by name or location..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 focus:border-black focus:outline-none transition-colors font-light"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors font-light min-w-[200px]"
              >
                <option value="all">All Carriers</option>
                <option value="verified">Verified Only</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600 font-light">
              {filteredCarriers.length} carrier{filteredCarriers.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Carriers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredCarriers.map((carrier) => (
              <div key={carrier.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-36 sm:h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    {carrier.verified && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                    {carrier.featured && (
                      <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium mt-2">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{carrier.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2 sm:mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{carrier.location}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{carrier.rating}</span>
                        <span className="text-sm text-gray-600">({carrier.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-2">Transport modes</div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {carrier.transportModes.map((mode) => (
                        <span key={mode} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {mode}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button className="flex-1 bg-brand-primary text-white py-2 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-brand-primary/90 transition-colors duration-200 min-h-[44px]">
                      Get Quote
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors duration-200 min-h-[44px]">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCarriers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-light text-gray-900 mb-2">No carriers found</h3>
              <p className="text-gray-600 font-light">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
} 