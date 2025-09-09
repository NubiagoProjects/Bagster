'use client'

import { useState } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  ArrowRight
} from 'lucide-react'

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  // Mock shipments data
  const mockShipments = [
    {
      id: 'SH001',
      status: 'in-transit',
      origin: 'Lagos, Nigeria',
      destination: 'Accra, Ghana',
      carrier: 'Express Logistics Ltd',
      date: '2024-01-15',
      eta: '2024-01-18',
      price: '$245.00',
      weight: '25kg',
      type: 'Express',
      description: 'Electronics shipment'
    },
    {
      id: 'SH002',
      status: 'delivered',
      origin: 'Nairobi, Kenya',
      destination: 'Dar es Salaam, Tanzania',
      carrier: 'African Cargo Solutions',
      date: '2024-01-10',
      eta: '2024-01-13',
      price: '$180.00',
      weight: '15kg',
      type: 'Standard',
      description: 'Textile products'
    },
    {
      id: 'SH003',
      status: 'pending',
      origin: 'Johannesburg, South Africa',
      destination: 'Cape Town, South Africa',
      carrier: 'Southern Africa Cargo',
      date: '2024-01-20',
      eta: '2024-01-22',
      price: '$95.00',
      weight: '8kg',
      type: 'Express',
      description: 'Documents package'
    },
    {
      id: 'SH004',
      status: 'delivered',
      origin: 'Cairo, Egypt',
      destination: 'Alexandria, Egypt',
      carrier: 'Egyptian Express',
      date: '2024-01-05',
      eta: '2024-01-07',
      price: '$120.00',
      weight: '12kg',
      type: 'Standard',
      description: 'Medical supplies'
    },
    {
      id: 'SH005',
      status: 'in-transit',
      origin: 'Casablanca, Morocco',
      destination: 'Rabat, Morocco',
      carrier: 'Moroccan Logistics',
      date: '2024-01-18',
      eta: '2024-01-21',
      price: '$85.00',
      weight: '5kg',
      type: 'Express',
      description: 'Small electronics'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-emerald-600 bg-emerald-100'
      case 'in-transit':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-amber-600 bg-amber-100'
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
      case 'in-transit':
        return <Truck className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'price':
        return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''))
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">My <span className="text-black">Shipments</span></h1>
              <p className="text-gray-600 font-light">Track and manage all your shipments in one place.</p>
            </div>
            <button className="bg-black text-white px-6 py-3 font-light hover:bg-gray-800 transition-colors">
              New Shipment
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-light mb-1">Total Shipments</p>
                  <p className="text-2xl font-light text-gray-900">{mockShipments.length}</p>
                </div>
                <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-light mb-1">In Transit</p>
                  <p className="text-2xl font-light text-gray-900">
                    {mockShipments.filter(s => s.status === 'in-transit').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-light mb-1">Delivered</p>
                  <p className="text-2xl font-light text-gray-900">
                    {mockShipments.filter(s => s.status === 'delivered').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-light mb-1">Total Spent</p>
                  <p className="text-2xl font-light text-gray-900">
                    ${mockShipments.reduce((sum, s) => sum + parseFloat(s.price.replace('$', '')), 0).toFixed(0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shipments by ID, origin, destination, or carrier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-light text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-light text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-light text-gray-900"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>

          {/* Shipments List */}
          <div className="space-y-4">
            {sortedShipments.map((shipment) => (
              <div key={shipment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-light flex items-center space-x-2 ${getStatusColor(shipment.status)}`}>
                      {getStatusIcon(shipment.status)}
                      <span className="capitalize">{shipment.status}</span>
                    </span>
                    <span className="text-lg font-light text-gray-900">#{shipment.id}</span>
                    <span className="text-sm text-gray-500 font-light">{shipment.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-light text-gray-900">{shipment.price}</div>
                    <div className="text-sm text-gray-500 font-light">{shipment.weight}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-light mb-1">Route</p>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 font-light">{shipment.origin} → {shipment.destination}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-light mb-1">Carrier</p>
                    <span className="text-gray-900 font-light">{shipment.carrier}</span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-light mb-1">ETA</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 font-light">{shipment.eta}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-light mb-1">Description</p>
                      <p className="text-gray-900 font-light">{shipment.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-black hover:text-gray-800 text-sm font-light flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-light flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        Download Label
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedShipments.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-light text-gray-900 mb-2">No shipments found</h3>
              <p className="text-gray-600 font-light">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
} 