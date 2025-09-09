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
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-brand font-bold text-brand-primary">Bagster</span>
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
