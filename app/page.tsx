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

      {/* Modern Asymmetric Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0">
          {/* Geometric Background Elements */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-100/30 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-screen flex items-center">
            <div className="grid lg:grid-cols-12 gap-8 items-center w-full">
              
              {/* Left Column - Content (7 columns) */}
              <div className="lg:col-span-7 space-y-10">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-brand-primary/20 text-brand-primary text-sm font-semibold shadow-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                      Live: 2,847 shipments in transit across Africa
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[0.9]">
                      Ship Smarter
                      <span className="block text-brand-primary">Across Africa</span>
                    </h1>
                    
                    <p className="text-2xl text-gray-600 font-light leading-relaxed max-w-2xl">
                      The continent's most trusted logistics marketplace. Connect with verified carriers, track in real-time, and scale your business across 25+ countries.
                    </p>
                  </div>

                  {/* Quick Stats Bar */}
                  <div className="flex items-center space-x-8 py-6 px-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-primary">10K+</div>
                      <div className="text-sm text-gray-600 font-medium">Shipments</div>
                    </div>
                    <div className="w-px h-12 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-primary">500+</div>
                      <div className="text-sm text-gray-600 font-medium">Carriers</div>
                    </div>
                    <div className="w-px h-12 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-primary">25+</div>
                      <div className="text-sm text-gray-600 font-medium">Countries</div>
                    </div>
                    <div className="w-px h-12 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">99.8%</div>
                      <div className="text-sm text-gray-600 font-medium">On-time</div>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link href="/shipments">
                      <Button size="lg" className="bg-brand-primary text-white hover:bg-blue-700 px-10 py-5 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 group rounded-2xl">
                        Start Shipping Now
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/tracking">
                      <Button variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white px-10 py-5 text-xl font-semibold transition-all duration-300 rounded-2xl">
                        Track Shipment
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center space-x-6 pt-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Fully Insured</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Real-time Tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Verified Carriers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual (5 columns) */}
              <div className="lg:col-span-5 relative">
                <div className="relative">
                  {/* Main Image Container */}
                  <div className="relative bg-gradient-to-br from-brand-primary to-blue-700 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-1 transition-transform duration-500">
                    <div className="bg-white rounded-2xl p-6 space-y-6">
                      {/* Mock Dashboard */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Live Shipment Tracking</h3>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Map Visualization */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 h-48 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <path d="M50,150 Q150,50 250,100 T350,80" stroke="#004aac" strokeWidth="3" fill="none" strokeDasharray="5,5">
                              <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite"/>
                            </path>
                          </svg>
                        </div>
                        <div className="relative z-10 space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">Lagos → Nairobi</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium">Cairo → Cape Town</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-medium">Accra → Addis Ababa</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-brand-primary">847</div>
                          <div className="text-xs text-gray-600">Active Routes</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">98%</div>
                          <div className="text-xs text-gray-600">Success Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 transform -rotate-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Delivered</div>
                        <div className="text-xs text-gray-500">2 mins ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 transform rotate-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">In Transit</div>
                        <div className="text-xs text-gray-500">ETA: 2 hours</div>
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