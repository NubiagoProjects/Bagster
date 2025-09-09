'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Truck, Package, MapPin, Users, Star, ArrowRight, CheckCircle, Globe, Shield, Clock, BarChart3, Zap, Award, Heart, Search, ShoppingCart, Menu, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import HomepageHeader from '../components/ui/HomepageHeader'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HomepageHeader />

      {/* Professional Hero Section */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#004aac" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-32 pb-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-sm font-medium">
                    <Globe className="w-4 h-4 mr-2" />
                    Trusted by 10,000+ Businesses Across Africa
                  </div>
                  
                  <h1 className="text-4xl lg:text-6xl font-light text-gray-900 leading-tight">
                    Africa's Most
                    <span className="block font-medium text-brand-primary">Reliable Logistics</span>
                    <span className="block font-light">Marketplace</span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 font-light leading-relaxed max-w-xl">
                    Connect with verified carriers across 25+ African countries. Ship faster, track smarter, and grow your business with confidence.
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Real-time tracking & updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Full insurance coverage included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Verified carriers & competitive rates</span>
                  </div>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/shipments">
                    <Button size="lg" className="bg-brand-primary text-white hover:bg-blue-700 px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 group">
                      Ship Your Cargo
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-8 py-4 text-lg font-medium transition-all duration-300">
                      Become a Carrier
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="pt-8 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-4">Trusted by leading companies across Africa</p>
                  <div className="flex items-center space-x-8 opacity-60">
                    <div className="text-lg font-semibold text-gray-400">TechCorp</div>
                    <div className="text-lg font-semibold text-gray-400">AfriTrade</div>
                    <div className="text-lg font-semibold text-gray-400">LogiFlow</div>
                    <div className="text-lg font-semibold text-gray-400">CargoMax</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Visual */}
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-primary mb-2">10,000+</div>
                      <div className="text-gray-600 font-medium">Successful Shipments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-primary mb-2">500+</div>
                      <div className="text-gray-600 font-medium">Verified Carriers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-primary mb-2">25+</div>
                      <div className="text-gray-600 font-medium">African Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-primary mb-2">99.8%</div>
                      <div className="text-gray-600 font-medium">On-time Delivery</div>
                    </div>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Secure & Insured</h3>
                        <p className="text-gray-600 text-sm">Full cargo protection with comprehensive insurance coverage</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
                        <p className="text-gray-600 text-sm">Monitor your shipments with live GPS tracking and updates</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Smart Analytics</h3>
                        <p className="text-gray-600 text-sm">Data-driven insights to optimize your logistics operations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amazon-style Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              Why Choose Bagster
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Built for African logistics with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-brand-primary rounded-sm flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Pan-African Network</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Access to carriers across 25+ African countries with local expertise and regional knowledge.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-brand-primary rounded-sm flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Secure & Insured</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Full insurance coverage and secure handling protocols ensure your cargo arrives safely.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-brand-primary rounded-sm flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Real-time Tracking</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Advanced GPS tracking and automated updates keep you informed throughout the journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full border border-purple-200 mb-6">
              <Heart className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-purple-700 text-sm font-medium">Customer Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust Bagster for their logistics needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card group">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                "Bagster helped us find reliable carriers for our electronics shipments across West Africa. 
                The pricing was competitive and delivery was on time."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full mr-4"></div>
                <div>
                  <div className="font-bold text-slate-900">Sarah Johnson</div>
                  <div className="text-sm text-slate-500">Tech Imports Ltd</div>
                </div>
              </div>
            </div>

            <div className="card group">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                "As a carrier, Bagster has given us access to new markets and customers. 
                The platform is easy to use and payments are processed quickly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full mr-4"></div>
                <div>
                  <div className="font-bold text-slate-900">Michael Chen</div>
                  <div className="text-sm text-slate-500">Express Logistics</div>
                </div>
              </div>
            </div>

            <div className="card group">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                "The real-time tracking feature is amazing. I always know where my shipments are 
                and when they'll arrive. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full mr-4"></div>
                <div>
                  <div className="font-bold text-slate-900">Amina Hassan</div>
                  <div className="text-sm text-slate-500">Fashion Retailer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Ship Smarter?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses already using Bagster for their logistics needs across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button size="xl" className="group">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Link href="/carriers">
              <Button variant="secondary" size="xl" className="group">
                Browse Carriers
                <Truck className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-2xl font-brand font-bold text-brand-primary">Bagster</span>
              </div>
              <p className="text-slate-400 max-w-xs">
                Africa's leading cargo marketplace connecting shippers with trusted carriers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/shipments" className="hover:text-white transition-colors">Ship Cargo</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Become Carrier</Link></li>
                <li><Link href="/tracking" className="hover:text-white transition-colors">Track Shipment</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Insurance</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2024 Bagster. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 