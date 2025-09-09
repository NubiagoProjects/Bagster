'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface BreadcrumbItem {
  label: string
  href: string
}

const pathMap: Record<string, string> = {
  '/': 'Homepage',
  '/about': 'About',
  '/careers': 'Careers',
  '/contact': 'Contact',
  '/help': 'Help',
  '/faq': 'FAQ',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/cookies': 'Cookie Policy',
  '/login': 'Login',
  '/register': 'Register',
  '/forgot-password': 'Forgot Password',
  '/dashboard': 'Dashboard',
  '/profile': 'Profile',
  '/shipments': 'Shipments',
  '/tracking': 'Tracking',
  '/carriers': 'Carriers',
  '/carrier/dashboard': 'Carrier Dashboard',
  '/admin/dashboard': 'Admin Dashboard',
  '/api': 'API Documentation',
  '/feedback': 'Feedback',
  '/status': 'Status'
}

export default function Breadcrumb() {
  const pathname = usePathname()
  
  // Don't show breadcrumb on homepage
  if (pathname === '/') {
    return null
  }

  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  const breadcrumbItems: BreadcrumbItem[] = []

  // Always start with homepage
  breadcrumbItems.push({ label: 'Homepage', href: '/' })

  // Build breadcrumb path
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = pathMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbItems.push({ label, href: currentPath })
  })

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6 px-4 py-2 bg-gray-50 rounded-lg">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index === 0 && (
            <HomeIcon className="h-4 w-4 mr-1" />
          )}
          
          {index < breadcrumbItems.length - 1 ? (
            <Link 
              href={item.href}
              className="hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold">
              {item.label}
            </span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
          )}
        </div>
      ))}
    </nav>
  )
}
