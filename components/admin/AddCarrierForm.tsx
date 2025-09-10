'use client'

import { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'

interface AddCarrierFormProps {
  isOpen: boolean
  onClose: () => void
  onCarrierAdded: () => void
}

export default function AddCarrierForm({ isOpen, onClose, onCarrierAdded }: AddCarrierFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    country: '',
    deliveryCountries: [''],
    serviceAreas: [''],
    pricePerKg: '',
    minimumCharge: '',
    pickupFee: '',
    maxWeight: '',
    maxDimensions: '',
    transportModes: [] as string[],
    services: [] as string[],
    specialHandling: [] as string[],
    insuranceAvailable: false,
    trackingAvailable: true,
    realTimeUpdates: false,
    domesticCoverage: true,
    internationalCoverage: false,
    sameDayCoverage: false,
    nextDayCoverage: true
  })
  
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const transportModeOptions = ['road', 'air', 'sea', 'rail']
  const serviceOptions = ['pickup', 'delivery', 'packaging', 'customs_clearance', 'insurance', 'warehousing', 'white_glove', 'container_shipping']
  const specialHandlingOptions = ['fragile', 'hazardous', 'perishable', 'oversized', 'high_value', 'container']

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_: any, i: number) => i !== index)
    }))
  }

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter((item: string) => item !== value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/v1/carriers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pricePerKg: parseFloat(formData.pricePerKg),
          minimumCharge: parseFloat(formData.minimumCharge || '10'),
          pickupFee: parseFloat(formData.pickupFee || '5'),
          maxWeight: parseInt(formData.maxWeight || '1000'),
          deliveryCountries: formData.deliveryCountries.filter(c => c.trim()),
          serviceAreas: formData.serviceAreas.filter(a => a.trim())
        })
      })

      const data = await response.json()

      if (data.success) {
        addToast('success', 'Carrier added successfully')
        onCarrierAdded()
        onClose()
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          website: '',
          country: '',
          deliveryCountries: [''],
          serviceAreas: [''],
          pricePerKg: '',
          minimumCharge: '',
          pickupFee: '',
          maxWeight: '',
          maxDimensions: '',
          transportModes: [],
          services: [],
          specialHandling: [],
          insuranceAvailable: false,
          trackingAvailable: true,
          realTimeUpdates: false,
          domesticCoverage: true,
          internationalCoverage: false,
          sameDayCoverage: false,
          nextDayCoverage: true
        })
      } else {
        addToast('error', 'Failed to add carrier')
      }
    } catch (error) {
      console.error('Error adding carrier:', error)
      addToast('error', 'Error adding carrier')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Add New Carrier</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carrier Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Location & Coverage</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Countries *
                </label>
                {formData.deliveryCountries.map((country, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => handleArrayChange('deliveryCountries', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter country name"
                    />
                    {formData.deliveryCountries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('deliveryCountries', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('deliveryCountries')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Country
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Areas *
                </label>
                {formData.serviceAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => handleArrayChange('serviceAreas', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter city or region"
                    />
                    {formData.serviceAreas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('serviceAreas', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('serviceAreas')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Service Area
                </button>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per kg (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.pricePerKg}
                  onChange={(e) => handleInputChange('pricePerKg', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Charge (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minimumCharge}
                  onChange={(e) => handleInputChange('minimumCharge', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Fee (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pickupFee}
                  onChange={(e) => handleInputChange('pickupFee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Capabilities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.maxWeight}
                  onChange={(e) => handleInputChange('maxWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Dimensions (cm)
                </label>
                <input
                  type="text"
                  value={formData.maxDimensions}
                  onChange={(e) => handleInputChange('maxDimensions', e.target.value)}
                  placeholder="e.g., 200x150x100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Transport Modes */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Transport Modes</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {transportModeOptions.map((mode) => (
                <label key={mode} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.transportModes.includes(mode)}
                    onChange={(e) => handleCheckboxChange('transportModes', mode, e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Services</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceOptions.map((service) => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={(e) => handleCheckboxChange('services', service, e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {service.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Handling */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Special Handling</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {specialHandlingOptions.map((handling) => (
                <label key={handling} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.specialHandling.includes(handling)}
                    onChange={(e) => handleCheckboxChange('specialHandling', handling, e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {handling.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Features & Coverage</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.insuranceAvailable}
                    onChange={(e) => handleInputChange('insuranceAvailable', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Insurance Available</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.trackingAvailable}
                    onChange={(e) => handleInputChange('trackingAvailable', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Tracking Available</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.realTimeUpdates}
                    onChange={(e) => handleInputChange('realTimeUpdates', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Real-time Updates</span>
                </label>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.domesticCoverage}
                    onChange={(e) => handleInputChange('domesticCoverage', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Domestic Coverage</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.internationalCoverage}
                    onChange={(e) => handleInputChange('internationalCoverage', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">International Coverage</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sameDayCoverage}
                    onChange={(e) => handleInputChange('sameDayCoverage', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Same Day Delivery</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.nextDayCoverage}
                    onChange={(e) => handleInputChange('nextDayCoverage', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Next Day Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Carrier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
