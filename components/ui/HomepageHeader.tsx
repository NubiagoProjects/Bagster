'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from './Button'
import Image from 'next/image'

export default function HomepageHeader() {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 64 64" className="w-8 h-8 text-brand-primary">
                  <rect x="16" y="28" width="20" height="28" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="20" y="22" width="12" height="8" rx="1" ry="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="20" y1="36" x2="32" y2="36" stroke="currentColor" strokeWidth="1"/>
                  <line x1="20" y1="44" x2="32" y2="44" stroke="currentColor" strokeWidth="1"/>
                  <rect x="32" y="34" width="16" height="22" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="35" y="30" width="10" height="6" rx="1" ry="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="38" y="40" width="4" height="3" rx="0.5" ry="0.5" fill="currentColor"/>
                  <circle cx="39" cy="48" r="0.8" fill="currentColor"/>
                  <circle cx="42" cy="48" r="0.8" fill="currentColor"/>
                  <path d="M8 8 L14 11 L17 8 L20 11 L14 14 L11 17 L8 14 Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M20 11 Q28 8 36 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="2,1"/>
                </svg>
              </div>
              <span className="text-xl font-brand font-bold text-brand-primary">Bagster</span>
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
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
