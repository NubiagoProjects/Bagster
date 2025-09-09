'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from './Button'
import { Logo } from '../Logo'
import Image from 'next/image'

export default function HomepageHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center group">
              <div className="h-8 sm:h-10 group-hover:scale-105 transition-transform duration-200">
                <Logo width="200" height="50" className="w-40 sm:w-50 h-10 sm:h-12" />
              </div>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/shipments" className="text-gray-900 hover:text-gray-600 font-medium transition-colors">Ship</Link>
              <Link href="/carriers" className="text-gray-900 hover:text-gray-600 font-medium transition-colors">Carriers</Link>
              <Link href="/tracking" className="text-gray-900 hover:text-gray-600 font-medium transition-colors">Track</Link>
              <Link href="/help" className="text-gray-900 hover:text-gray-600 font-medium transition-colors">Support</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-brand-primary text-white hover:bg-blue-700 px-6">
                Get Started
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="/shipments" 
                className="block text-gray-900 hover:text-gray-600 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ship
              </Link>
              <Link 
                href="/carriers" 
                className="block text-gray-900 hover:text-gray-600 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Carriers
              </Link>
              <Link 
                href="/tracking" 
                className="block text-gray-900 hover:text-gray-600 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track
              </Link>
              <Link 
                href="/help" 
                className="block text-gray-900 hover:text-gray-600 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-brand-primary text-white hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
