'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { useToast } from '@/components/ui/ToastContext'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Header from '@/components/ui/Header'

export default function LoginPage() {
  const [userType, setUserType] = useState<'carrier' | 'admin'>('carrier')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()
  const router = useRouter()

  // Test users
  const testUsers = {
    carrier: {
      email: 'carrier@test.com',
      password: 'carrier123',
      name: 'Test Carrier'
    },
    admin: {
      email: 'admin@test.com', 
      password: 'admin123',
      name: 'Test Admin'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          userType: userType
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store session token (in production, use secure storage)
        localStorage.setItem('sessionToken', data.data.sessionToken)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        
        addToast('success', 'Login successful!')
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
          window.location.href = data.data.redirectUrl
        }, 1000)
      } else {
        addToast('error', data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      addToast('error', 'Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-28 sm:w-32 h-10 sm:h-12 flex items-center justify-center">
              <Logo width="160" height="50" className="w-40 sm:w-45 h-12 sm:h-15" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">
            Welcome to Bagster
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-light">
            Sign in to your account to access the dashboard
          </p>
          
          {/* Test Credentials Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-2">Test Accounts:</p>
            <div className="text-xs text-blue-600 space-y-1">
              <div><strong>Carrier:</strong> carrier@test.com / carrier123</div>
              <div><strong>Admin:</strong> admin@test.com / admin123</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 sm:p-6 lg:p-8">
                <div className="text-center pb-2">
                  <div className="flex justify-center space-x-1 mb-4 sm:mb-6">
                    <button
                      type="button"
                      onClick={() => setUserType('carrier')}
                      className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-light transition-all duration-200 flex-1 sm:flex-none ${
                        userType === 'carrier'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Truck className="w-4 h-4 inline mr-2" />
                      Carrier
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('admin')}
                      className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-light transition-all duration-200 flex-1 sm:flex-none ${
                        userType === 'admin'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Shield className="w-4 h-4 inline mr-2" />
                      Admin
                    </button>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-light text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 sm:pr-10 h-11 sm:h-12 text-sm sm:text-base"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-light">
                          Remember me
                        </label>
                      </div>

                      <div className="text-sm">
                        <Link href="/forgot-password" className="font-light text-brand-primary hover:text-brand-primary/80">
                          Forgot your password?
                        </Link>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-black hover:bg-gray-800 text-white font-light transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        `Sign in as ${userType === 'admin' ? 'Admin' : 'Carrier'}`
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-600 font-light">
                      Don't have an account?{' '}
                      <Link href="/register" className="font-medium text-brand-primary hover:text-brand-primary/80">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>
        </div>
      </div>
      </div>
    </div>
  )
}