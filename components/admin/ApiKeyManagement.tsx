'use client'

import { useState, useEffect } from 'react'
import { 
  Key, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  Edit, 
  Calendar,
  Activity,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'

interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  usage: {
    totalRequests: number;
    requestsToday: number;
    lastResetDate: string;
  };
}

interface NewApiKey {
  name: string;
  permissions: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  expiresAt?: string;
}

export default function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newApiKey, setNewApiKey] = useState<NewApiKey>({
    name: '',
    permissions: ['rates:read', 'shipments:create', 'tracking:read'],
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerDay: 1000
    }
  })
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [showKey, setShowKey] = useState<string | null>(null)
  const { addToast } = useToast()

  const availablePermissions = [
    { id: 'rates:read', label: 'Get Shipping Rates', description: 'Access to rates API' },
    { id: 'shipments:create', label: 'Create Shipments', description: 'Create new shipments' },
    { id: 'tracking:read', label: 'Track Shipments', description: 'Access tracking information' },
    { id: 'carriers:read', label: 'View Carriers', description: 'Access carrier information' },
    { id: 'smart-selection:read', label: 'Smart Selection', description: 'Use intelligent carrier selection' },
    { id: 'analytics:read', label: 'View Analytics', description: 'Access usage analytics' }
  ]

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/v1/api-keys')
      const data = await response.json()
      
      if (data.success) {
        setApiKeys(data.data.apiKeys)
      } else {
        addToast('error', 'Failed to fetch API keys')
      }
    } catch (error) {
      addToast('error', 'Error loading API keys')
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async () => {
    if (!newApiKey.name.trim()) {
      addToast('error', 'API key name is required')
      return
    }

    try {
      const response = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApiKey)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCreatedKey(data.data.apiKey)
        setShowCreateForm(false)
        fetchApiKeys()
        addToast('success', 'API key created successfully')
        
        // Reset form
        setNewApiKey({
          name: '',
          permissions: ['rates:read', 'shipments:create', 'tracking:read'],
          rateLimit: {
            requestsPerMinute: 60,
            requestsPerDay: 1000
          }
        })
      } else {
        addToast('error', data.error || 'Failed to create API key')
      }
    } catch (error) {
      addToast('error', 'Error creating API key')
    }
  }

  const deactivateApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to deactivate this API key? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/v1/api-keys?keyId=${keyId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchApiKeys()
        addToast('success', 'API key deactivated successfully')
      } else {
        addToast('error', data.error || 'Failed to deactivate API key')
      }
    } catch (error) {
      addToast('error', 'Error deactivating API key')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addToast('success', 'Copied to clipboard')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100'
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

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
          <h2 className="text-2xl font-semibold text-gray-900">API Key Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Generate and manage API keys for your ecommerce integrations
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create API Key</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Key className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total API Keys</p>
              <p className="text-2xl font-semibold text-gray-900">{apiKeys.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Keys</p>
              <p className="text-2xl font-semibold text-gray-900">
                {apiKeys.filter(key => key.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests Today</p>
              <p className="text-2xl font-semibold text-gray-900">
                {apiKeys.reduce((sum, key) => sum + key.usage.requestsToday, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your API Keys</h3>
        </div>
        
        {apiKeys.length === 0 ? (
          <div className="p-12 text-center">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
            <p className="text-gray-600 mb-4">Create your first API key to start integrating with your ecommerce platform.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create API Key
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{apiKey.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        apiKey.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {apiKey.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Created {formatDate(apiKey.createdAt)}
                      </div>
                      {apiKey.lastUsedAt && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Last used {formatDate(apiKey.lastUsedAt)}
                        </div>
                      )}
                    </div>

                    {/* API Key Display */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-800">
                          {showKey === apiKey.id ? createdKey || apiKey.keyPreview : apiKey.keyPreview}
                        </code>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(createdKey || apiKey.keyPreview)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Daily Usage</span>
                          <span className="text-sm font-medium">
                            {apiKey.usage.requestsToday} / {apiKey.rateLimit.requestsPerDay}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(apiKey.usage.requestsToday, apiKey.rateLimit.requestsPerDay)).split(' ')[1]}`}
                            style={{ 
                              width: `${getUsagePercentage(apiKey.usage.requestsToday, apiKey.rateLimit.requestsPerDay)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Total Requests</span>
                          <span className="text-sm font-medium">{apiKey.usage.totalRequests}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Rate limit: {apiKey.rateLimit.requestsPerMinute}/min
                        </div>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="mb-4">
                      <span className="text-sm text-gray-600 mb-2 block">Permissions:</span>
                      <div className="flex flex-wrap gap-2">
                        {apiKey.permissions.map((permission) => (
                          <span 
                            key={permission}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => deactivateApiKey(apiKey.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Deactivate API key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create API Key Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key Name
                </label>
                <input
                  type="text"
                  value={newApiKey.name}
                  onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                  placeholder="e.g., My Ecommerce Store"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={newApiKey.permissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewApiKey({
                              ...newApiKey,
                              permissions: [...newApiKey.permissions, permission.id]
                            })
                          } else {
                            setNewApiKey({
                              ...newApiKey,
                              permissions: newApiKey.permissions.filter(p => p !== permission.id)
                            })
                          }
                        }}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{permission.label}</div>
                        <div className="text-xs text-gray-500">{permission.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requests/Minute
                  </label>
                  <input
                    type="number"
                    value={newApiKey.rateLimit.requestsPerMinute}
                    onChange={(e) => setNewApiKey({
                      ...newApiKey,
                      rateLimit: {
                        ...newApiKey.rateLimit,
                        requestsPerMinute: parseInt(e.target.value) || 60
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requests/Day
                  </label>
                  <input
                    type="number"
                    value={newApiKey.rateLimit.requestsPerDay}
                    onChange={(e) => setNewApiKey({
                      ...newApiKey,
                      rateLimit: {
                        ...newApiKey.rateLimit,
                        requestsPerDay: parseInt(e.target.value) || 1000
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createApiKey}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create API Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Created Key Modal */}
      {createdKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Key Created!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Copy your API key now. You won't be able to see it again.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <code className="text-sm font-mono text-gray-800 break-all">{createdKey}</code>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => copyToClipboard(createdKey)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Key</span>
                </button>
                <button
                  onClick={() => setCreatedKey(null)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
