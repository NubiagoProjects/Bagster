import Link from 'next/link'
import { Truck, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
                  Bagster
                </div>
                <div className="text-sm text-slate-300 font-medium">Marketplace</div>
              </div>
            </Link>
            <p className="text-slate-300 leading-relaxed mb-6">
              Revolutionizing African logistics through intelligent carrier matching, 
              real-time tracking, and competitive pricing across the continent.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/bagster" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition-all duration-200 border border-slate-700">
                <Twitter className="w-5 h-5 text-slate-300 hover:text-blue-400 transition-colors duration-200" />
              </a>
              <a href="https://facebook.com/bagster" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition-all duration-200 border border-slate-700">
                <Facebook className="w-5 h-5 text-slate-300 hover:text-blue-400 transition-colors duration-200" />
              </a>
              <a href="https://instagram.com/bagster" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition-all duration-200 border border-slate-700">
                <Instagram className="w-5 h-5 text-slate-300 hover:text-blue-400 transition-colors duration-200" />
              </a>
              <a href="https://linkedin.com/company/bagster" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition-all duration-200 border border-slate-700">
                <Linkedin className="w-5 h-5 text-slate-300 hover:text-blue-400 transition-colors duration-200" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/carriers" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  Find Carriers
                </Link>
              </li>
              <li>
                <Link href="/shipments" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  Shipments
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  Track Package
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  Become a Carrier
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/help" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-slate-300 hover:text-blue-300 transition-colors duration-200 group flex items-center">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                  Send Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200 border border-slate-700">
                  <Mail className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors duration-200" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Email</div>
                  <a href="mailto:hello@bagster.com" className="text-slate-300 hover:text-blue-300 transition-colors duration-200">
                    hello@bagster.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200 border border-slate-700">
                  <Phone className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors duration-200" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Phone</div>
                  <a href="tel:+2341234567890" className="text-slate-300 hover:text-blue-300 transition-colors duration-200">
                    +234 123 456 7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200 border border-slate-700">
                  <MapPin className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors duration-200" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Address</div>
                  <div className="text-slate-300">
                    Lagos, Nigeria<br />
                    West Africa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © 2024 Bagster Marketplace. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-blue-300 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-blue-300 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-slate-400 hover:text-blue-300 transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 