'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  Package,
  Truck,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Plus,
  FileText,
  MapPin,
  CreditCard,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { Logo } from '@/components/Logo'

interface SidebarProps {
  userType: 'carrier' | 'admin'
}

export default function DashboardSidebar({ userType }: SidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['main'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const mainNavItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard'
    },
    {
      label: 'Shipments',
      href: '/dashboard/shipments',
      icon: Package,
      active: pathname.startsWith('/dashboard/shipments'),
      badge: '12'
    },
    {
      label: 'Carriers',
      href: '/dashboard/carriers',
      icon: Truck,
      active: pathname.startsWith('/dashboard/carriers'),
      hidden: userType === 'carrier'
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      active: pathname.startsWith('/dashboard/analytics')
    }
  ]

  const managementItems = [
    {
      label: 'Orders',
      href: '/dashboard/orders',
      icon: FileText,
      active: pathname.startsWith('/dashboard/orders')
    },
    {
      label: 'Tracking',
      href: '/dashboard/tracking',
      icon: MapPin,
      active: pathname.startsWith('/dashboard/tracking')
    },
    {
      label: 'Billing',
      href: '/dashboard/billing',
      icon: CreditCard,
      active: pathname.startsWith('/dashboard/billing')
    }
  ]

  const settingsItems = [
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      active: pathname.startsWith('/dashboard/settings')
    },
    {
      label: 'Help',
      href: '/help',
      icon: HelpCircle,
      active: pathname.startsWith('/help')
    }
  ]

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center">
          <div className="h-8">
            <Logo width="140" height="32" className="w-35 h-8 brightness-0 invert" />
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
            {userType === 'admin' ? 'A' : 'C'}
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {userType === 'admin' ? 'Admin User' : 'Carrier User'}
            </div>
            <div className="text-xs text-gray-400">
              {userType === 'admin' ? 'Administrator' : 'Logistics Partner'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        {/* Main Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main
            </h3>
          </div>
          <ul className="space-y-1">
            {mainNavItems.filter(item => !item.hidden).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    item.active
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Management Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Management
            </h3>
          </div>
          <ul className="space-y-1">
            {managementItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    item.active
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Settings Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Support
            </h3>
          </div>
          <ul className="space-y-1">
            {settingsItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    item.active
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
