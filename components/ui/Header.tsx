'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, ChevronDown, Bell, Search, Settings, LogOut, Package, Zap, Shield, Globe } from 'lucide-react'
import { Logo } from '../Logo'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock login state
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserDropdownOpen) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserDropdownOpen])

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const navigation = [
    { href: '/carriers', label: 'Carriers', icon: Package, description: 'Find trusted carriers' },
    { href: '/tracking', label: 'Track', icon: Search, description: 'Real-time tracking' },
    { href: '/about', label: 'About Us', icon: Globe, description: 'Our story' },
    { href: '/help', label: 'Help Center', icon: Shield, description: 'Get support' }
  ]

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsUserDropdownOpen(false)
    // Add toast notification here
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/95 via-white/98 to-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-lg shadow-slate-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-22 relative">
          {/* Subtle animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-green-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          {/* Logo */}
          <Link href="/" className="flex items-center group relative z-10">
            <div className="h-10 sm:h-12 group-hover:scale-105 transition-all duration-300 group-hover:drop-shadow-lg">
              <Logo width="220" height="55" className="w-44 sm:w-55 h-11 sm:h-14" />
            </div>
            {/* Logo glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {item.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Desktop Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center space-x-4 relative z-10">
            {/* Quick Actions */}
            <div className="flex items-center space-x-2 mr-2">
              <button className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-110 group relative">
                <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </span>
              </button>
              <button className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-110 group">
                <Search className="w-5 h-5 text-slate-600 group-hover:text-green-600" />
              </button>
            </div>
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>John Doe</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    isUserDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Link>
                    <div className="border-t border-slate-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 hover:scale-105">
                  Sign In
                </Link>
                <Link href="/register" className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-blue-200/50">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Get Started</span>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-110 group relative z-10"
          >
            <div className="relative">
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600 group-hover:text-red-600 transition-colors duration-200" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
              )}
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden animate-in slide-in-from-top-2 duration-300">
            <div className="px-3 pt-3 pb-4 space-y-2 bg-gradient-to-br from-white via-white to-slate-50/50 rounded-2xl mt-4 shadow-xl border border-slate-200/60 backdrop-blur-sm">
              {navigation.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center space-x-3 px-4 py-4 text-base font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:shadow-md'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                    </div>
                  </Link>
                )
              })}
              
              <div className="border-t border-gradient-to-r from-transparent via-slate-200 to-transparent my-3"></div>
              
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center space-x-2 px-4 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg shadow-blue-200/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Zap className="w-5 h-5" />
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 