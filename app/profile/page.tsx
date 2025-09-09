'use client'

import { useState } from 'react'
import Header from '@/components/ui/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Shield, 
  Key, 
  Bell,
  Save,
  Edit,
  Camera
} from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+234 123 456 7890',
    company: 'Tech Solutions Ltd',
    address: '123 Victoria Island, Lagos, Nigeria',
    country: 'Nigeria',
    city: 'Lagos'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // Handle profile update
    console.log('Profile updated:', formData)
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Profile Header */}
      <section className="pt-32 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-black rounded flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-gray-600 font-light">Manage your account information and preferences.</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="border border-gray-200 text-gray-700 px-4 py-2 font-light hover:bg-gray-50 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
              <Edit className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                  <h2 className="text-xl font-light text-gray-900">{formData.firstName} {formData.lastName}</h2>
                  <p className="text-gray-600 font-light">{formData.email}</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full text-left px-4 py-3 font-light transition-colors duration-200 ${
                      activeTab === 'personal'
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-4 py-3 font-light transition-colors duration-200 ${
                      activeTab === 'security'
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-4 py-3 font-light transition-colors duration-200 ${
                      activeTab === 'notifications'
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Notifications
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'personal' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-light text-gray-900 mb-6">Personal Information</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-light text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                          disabled={!isEditing}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-light text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-light text-gray-700 mb-2">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-light text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="country" className="block text-sm font-light text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          id="country"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                          disabled={!isEditing}
                        >
                          <option value="Nigeria">Nigeria</option>
                          <option value="Kenya">Kenya</option>
                          <option value="South Africa">South Africa</option>
                          <option value="Ghana">Ghana</option>
                          <option value="Egypt">Egypt</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-light text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4">
                        <button type="submit" className="bg-black text-white px-6 py-2 font-light hover:bg-gray-800 transition-colors">
                          Save Changes
                          <Save className="w-4 h-4 ml-2 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="border border-gray-200 text-gray-700 px-6 py-2 font-light hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-light text-gray-900 mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                            <Key className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-light text-gray-900">Change Password</h4>
                            <p className="text-sm text-gray-600 font-light">Update your account password</p>
                          </div>
                        </div>
                        <button className="border border-gray-200 text-gray-700 px-4 py-2 font-light hover:bg-gray-50 transition-colors">Change</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-light text-gray-900">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-600 font-light">Add an extra layer of security</p>
                          </div>
                        </div>
                        <button className="border border-gray-200 text-gray-700 px-4 py-2 font-light hover:bg-gray-50 transition-colors">Enable</button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-light text-gray-900">Active Sessions</h4>
                            <p className="text-sm text-gray-600 font-light">Manage your active login sessions</p>
                          </div>
                        </div>
                        <button className="border border-gray-200 text-gray-700 px-4 py-2 font-light hover:bg-gray-50 transition-colors">View</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-light text-gray-900 mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-light text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-600 font-light">Receive updates via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-light text-gray-900">SMS Notifications</h4>
                            <p className="text-sm text-gray-600 font-light">Receive updates via SMS</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-light text-gray-900">Push Notifications</h4>
                            <p className="text-sm text-gray-600 font-light">Receive updates in your browser</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 