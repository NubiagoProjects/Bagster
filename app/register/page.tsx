'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Phone, MapPin, Building, Truck, Shield, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { useToast } from '@/components/ui/ToastContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Header from '@/components/ui/Header'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    userType: 'carrier' as 'carrier' | 'admin',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      addToast('error', 'Please fill in all required fields')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('error', 'Passwords do not match')
      return false
    }

    if (formData.password.length < 8) {
      addToast('error', 'Password must be at least 8 characters long')
      return false
    }

    if (!formData.email.includes('@')) {
      addToast('error', 'Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          userType: formData.userType,
          companyName: formData.company,
          contactPerson: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          terms: true
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store session token
        localStorage.setItem('sessionToken', data.data.sessionToken)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        
        addToast('success', data.data.message || 'Registration successful!')
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
          window.location.href = data.data.redirectUrl
        }, 1500)
      } else {
        addToast('error', data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      addToast('error', 'Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-32 h-12 flex items-center justify-center">
              <Logo width="180" height="60" className="w-45 h-15" />
            </div>
          </div>
          <h2 className="text-3xl font-light text-gray-900">
            Join Bagster
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-light">
            Create your account to get started
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-8">
          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-light text-gray-700 mb-3">
              Register as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('userType', 'carrier')}
                className={`flex items-center justify-center px-4 py-3 font-light transition-all duration-200 ${
                  formData.userType === 'carrier'
                    ? 'bg-black text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Truck className="w-5 h-5 mr-2" />
                Carrier
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('userType', 'admin')}
                className={`flex items-center justify-center px-4 py-3 font-light transition-all duration-200 ${
                  formData.userType === 'admin'
                    ? 'bg-black text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-5 h-5 mr-2" />
                Admin
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-light text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-light text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                  placeholder="+234 801 234 5678"
                />
              </div>
            </div>

            {formData.userType === 'carrier' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-light text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-light text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 font-light">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 text-sm font-light text-white bg-black hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-light">
              Already have an account?{' '}
              <Link href="/login" className="font-light text-gray-900 hover:text-black">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
} 