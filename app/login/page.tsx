'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Truck, Shield } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'admin' | 'carrier'>('carrier')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Basic validation
    if (!email || !password) {
      addToast('error', 'Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      addToast('error', 'Please enter a valid email address')
      setIsLoading(false)
      return
    }

    // Simulate login process
    setTimeout(() => {
      addToast('success', `Welcome back! Logged in as ${userType}`)
      setIsLoading(false)
      // Redirect to appropriate dashboard
      window.location.href = userType === 'admin' ? '/admin/dashboard' : '/carrier/dashboard'
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-light text-gray-900 tracking-tight">
            Welcome to Bagster
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-light">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-8">
                <div className="text-center pb-2">
                  <div className="flex justify-center space-x-1 mb-6">
                    <button
                      type="button"
                      onClick={() => setUserType('carrier')}
                      className={`px-6 py-3 font-light transition-all duration-200 ${
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
                      className={`px-6 py-3 font-light transition-all duration-200 ${
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

                <div className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors"
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
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-light">
                          Remember me
                        </label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-gray-600 hover:text-black font-light"
                      >
                        Forgot password?
                      </Link>
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

                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-light">
                      Don't have an account?{' '}
                      <Link
                        href="/register"
                        className="font-light text-gray-900 hover:text-black"
                      >
                        Sign up here
                      </Link>
                    </p>
                  </div>
          </div>
        </div>
      </div>
    </div>
  )
}