'use client'

import { useState } from 'react'
import HomepageHeader from '@/components/ui/HomepageHeader'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import { 
  Code, 
  Copy, 
  Check, 
  ExternalLink,
  Key,
  Globe,
  Database,
  Shield,
  Zap
} from 'lucide-react'

const apiEndpoints = [
  {
    method: 'GET',
    endpoint: '/api/v1/rates',
    description: 'Get available carriers and rates for a shipment',
    parameters: [
      { name: 'origin', type: 'string', required: true, description: 'Origin location (city, country)' },
      { name: 'destination', type: 'string', required: true, description: 'Destination location (city, country)' },
      { name: 'weight', type: 'number', required: true, description: 'Package weight in kg' },
      { name: 'dimensions', type: 'string', required: false, description: 'Package dimensions (LxWxH in cm)' },
      { name: 'transport_mode', type: 'string', required: false, description: 'Preferred transport mode (air, sea, road)' }
    ],
    example: {
      request: `curl -X GET "https://api.bagster.com/v1/rates?origin=Lagos,Nigeria&destination=Abuja,Nigeria&weight=25&transport_mode=air" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      response: `{
  "success": true,
  "data": {
    "carriers": [
      {
        "id": "carrier_123",
        "name": "Express Logistics Nigeria",
        "rating": 4.8,
        "price_per_kg": 2.50,
        "delivery_time": "2-3 days",
        "transport_modes": ["air", "road"],
        "services": ["pickup", "packaging", "customs_clearance"]
      }
    ],
    "total_carriers": 1
  }
}`
    }
  },
  {
    method: 'POST',
    endpoint: '/api/v1/shipments',
    description: 'Create a new shipment request',
    parameters: [
      { name: 'carrier_id', type: 'string', required: true, description: 'Selected carrier ID' },
      { name: 'origin', type: 'string', required: true, description: 'Origin location' },
      { name: 'destination', type: 'string', required: true, description: 'Destination location' },
      { name: 'weight', type: 'number', required: true, description: 'Package weight in kg' },
      { name: 'dimensions', type: 'string', required: false, description: 'Package dimensions' },
      { name: 'description', type: 'string', required: false, description: 'Package description' },
      { name: 'pickup_address', type: 'string', required: true, description: 'Pickup address' },
      { name: 'delivery_address', type: 'string', required: true, description: 'Delivery address' },
      { name: 'contact_info', type: 'object', required: true, description: 'Contact information' }
    ],
    example: {
      request: `curl -X POST "https://api.bagster.com/v1/shipments" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "carrier_id": "carrier_123",
    "origin": "Lagos, Nigeria",
    "destination": "Abuja, Nigeria",
    "weight": 25,
    "dimensions": "50x30x20",
    "description": "Electronics package",
    "pickup_address": "123 Victoria Island, Lagos",
    "delivery_address": "456 Central Business District, Abuja",
    "contact_info": {
      "name": "John Doe",
      "phone": "+2341234567890",
      "email": "john@example.com"
    }
  }'`,
      response: `{
  "success": true,
  "data": {
    "shipment_id": "BGS123456789",
    "tracking_number": "BGS123456789",
    "status": "pending_confirmation",
    "carrier": {
      "id": "carrier_123",
      "name": "Express Logistics Nigeria"
    },
    "estimated_delivery": "2024-01-25",
    "total_cost": 62.50
  }
}`
    }
  },
  {
    method: 'GET',
    endpoint: '/api/v1/tracking/{tracking_number}',
    description: 'Get shipment tracking information',
    parameters: [
      { name: 'tracking_number', type: 'string', required: true, description: 'Shipment tracking number' }
    ],
    example: {
      request: `curl -X GET "https://api.bagster.com/v1/tracking/BGS123456789" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      response: `{
  "success": true,
  "data": {
    "tracking_number": "BGS123456789",
    "status": "in_transit",
    "carrier": "Express Logistics Nigeria",
    "origin": "Lagos, Nigeria",
    "destination": "Abuja, Nigeria",
    "estimated_delivery": "2024-01-25",
    "timeline": [
      {
        "status": "Picked Up",
        "location": "Lagos, Nigeria",
        "timestamp": "2024-01-23T09:15:00Z",
        "description": "Package picked up by carrier"
      }
    ]
  }
}`
    }
  },
  {
    method: 'POST',
    endpoint: '/api/v1/carriers/{carrier_id}/confirm',
    description: 'Confirm or decline a shipment request (Carrier API)',
    parameters: [
      { name: 'carrier_id', type: 'string', required: true, description: 'Carrier ID' },
      { name: 'shipment_id', type: 'string', required: true, description: 'Shipment ID to confirm/decline' },
      { name: 'action', type: 'string', required: true, description: 'Action: confirm or decline' },
      { name: 'reason', type: 'string', required: false, description: 'Reason for declining (if applicable)' }
    ],
    example: {
      request: `curl -X POST "https://api.bagster.com/v1/carriers/carrier_123/confirm" \\
  -H "Authorization: Bearer CARRIER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "shipment_id": "BGS123456789",
    "action": "confirm"
  }'`,
      response: `{
  "success": true,
  "data": {
    "shipment_id": "BGS123456789",
    "status": "confirmed",
    "pickup_address": "123 Victoria Island, Lagos",
    "pickup_instructions": "Please deliver to our warehouse between 9 AM - 5 PM"
  }
}`
    }
  }
]

export default function ApiPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  const copyToClipboard = async (text: string, endpoint: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedEndpoint(endpoint)
      setTimeout(() => setCopiedEndpoint(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedEndpoint(endpoint)
      setTimeout(() => setCopiedEndpoint(null), 2000)
    }
  }

  return (
    <div className="min-h-screen">
      <HomepageHeader />
      
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-brand-primary rounded flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              API Documentation
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Integrate Bagster's smart cargo marketplace into your applications with our comprehensive REST API.
            </p>
          </div>
        </div>
      </section>

      {/* API Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-light mb-2">Authentication</h3>
              <p className="text-gray-600 font-light">
                Secure API access with Bearer token authentication
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-light mb-2">RESTful Design</h3>
              <p className="text-gray-600 font-light">
                Clean, intuitive REST API with JSON responses
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-light mb-2">HTTPS Only</h3>
              <p className="text-gray-600 font-light">
                All endpoints require HTTPS for security
              </p>
            </div>
          </div>

          {/* Base URL */}
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-light mb-4">Base URL</h2>
            <div className="bg-gray-900 text-green-400 p-4 font-mono text-sm">
              https://api.bagster.com/v1
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-light mb-4">Authentication</h2>
            <p className="text-gray-600 font-light mb-4">
              All API requests require authentication using a Bearer token in the Authorization header.
            </p>
            <div className="bg-gray-900 text-green-400 p-4 font-mono text-sm">
              Authorization: Bearer YOUR_API_KEY
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-light text-gray-900 mb-8">API Endpoints</h2>
          
          <div className="space-y-8">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-lg font-mono">{endpoint.endpoint}</code>
                  </div>
                </div>
                
                <p className="text-gray-600 font-light mb-6">{endpoint.description}</p>

                {/* Parameters */}
                {endpoint.parameters && (
                  <div className="mb-6">
                    <h4 className="font-light mb-3">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-light text-gray-900">Parameter</th>
                            <th className="px-4 py-2 text-left text-sm font-light text-gray-900">Type</th>
                            <th className="px-4 py-2 text-left text-sm font-light text-gray-900">Required</th>
                            <th className="px-4 py-2 text-left text-sm font-light text-gray-900">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, paramIndex) => (
                            <tr key={paramIndex} className="border-t border-gray-200">
                              <td className="px-4 py-2 text-sm font-mono">{param.name}</td>
                              <td className="px-4 py-2 text-sm">{param.type}</td>
                              <td className="px-4 py-2 text-sm">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {param.required ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 font-light">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Examples */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-light mb-2">Request Example</h4>
                    <div className="relative">
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{endpoint.example.request}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(endpoint.example.request, `request-${index}`)}
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white"
                      >
                        {copiedEndpoint === `request-${index}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-light mb-2">Response Example</h4>
                    <div className="relative">
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{endpoint.example.response}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(endpoint.example.response, `response-${index}`)}
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white"
                      >
                        {copiedEndpoint === `response-${index}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Guide */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Integration Guide</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-xl font-light mb-4">For E-commerce Platforms</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-light">Get Shipping Rates</h4>
                    <p className="text-gray-600 font-light text-sm">Call the rates endpoint when customer enters shipping address</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-light">Create Shipment</h4>
                    <p className="text-gray-600 font-light text-sm">Create shipment when customer confirms order</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-light">Track Delivery</h4>
                    <p className="text-gray-600 font-light text-sm">Use tracking endpoint to show delivery status</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-xl font-light mb-4">For Carriers</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-light">Receive Notifications</h4>
                    <p className="text-gray-600 font-light text-sm">Get webhook notifications for new shipment requests</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-light">Confirm Shipments</h4>
                    <p className="text-gray-600 font-light text-sm">Confirm or decline shipment requests via API</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-light">Update Status</h4>
                    <p className="text-gray-600 font-light text-sm">Update shipment status as it progresses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs and Libraries */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-light text-gray-900 mb-8">SDKs & Libraries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Code className="w-6 h-6 text-gray-700" />
                <h3 className="font-light">JavaScript/Node.js</h3>
              </div>
              <p className="text-gray-600 font-light mb-4">Official SDK for JavaScript and Node.js applications</p>
              <a href="#" className="text-gray-900 hover:text-brand-primary font-light">
                View Documentation →
              </a>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Code className="w-6 h-6 text-gray-700" />
                <h3 className="font-light">Python</h3>
              </div>
              <p className="text-gray-600 font-light mb-4">Python SDK for easy integration with Python applications</p>
              <a href="#" className="text-gray-900 hover:text-brand-primary font-light">
                View Documentation →
              </a>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Code className="w-6 h-6 text-gray-700" />
                <h3 className="font-light">PHP</h3>
              </div>
              <p className="text-gray-600 font-light mb-4">PHP library for integrating with PHP-based platforms</p>
              <a href="#" className="text-gray-900 hover:text-brand-primary font-light">
                View Documentation →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 font-light mb-8 max-w-2xl mx-auto">
              Our developer support team is here to help you integrate Bagster into your applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:api@bagster.com" className="bg-black text-white px-6 py-3 font-light hover:bg-gray-800 transition-colors">
                Contact API Support
              </a>
              <a href="#" className="border border-gray-200 text-gray-700 px-6 py-3 font-light hover:bg-gray-50 transition-colors">
                View API Status
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 