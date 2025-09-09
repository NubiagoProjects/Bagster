'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Shield, Clock, Globe, Star, CheckCircle, Truck, Package, MapPin, Users, TrendingUp, Award, Zap, Heart } from 'lucide-react'
import HomepageHeader from '@/components/ui/HomepageHeader'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HomepageHeader />

      {/* Modern Asymmetric Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0">
          {/* Geometric Background Elements */}
          <div className="absolute top-10 sm:top-20 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-brand-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-4 sm:left-20 w-32 sm:w-80 h-32 sm:h-80 bg-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-24 sm:w-64 h-24 sm:h-64 bg-indigo-100/30 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-screen flex items-center pt-20 sm:pt-16">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full">
              
              {/* Left Column - Content (7 columns) */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8 lg:space-y-10">
                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 backdrop-blur-sm border border-brand-primary/20 text-brand-primary text-xs sm:text-sm font-semibold shadow-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                      <span className="hidden sm:inline">Live: 2,847 shipments in transit across Africa</span>
                      <span className="sm:hidden">2,847 live shipments</span>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight sm:leading-[0.9]">
                      <span className="block">Ship Smarter</span>
                      <span className="block text-brand-primary">Across Africa</span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl">
                      The continent's most trusted logistics marketplace. Connect with verified carriers, track in real-time, and scale your business across 25+ countries.
                    </p>
                  </div>

                  {/* Quick Stats Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 py-4 sm:py-6 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
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
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link href="/register">
                      <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group w-full sm:w-auto">
                        <span>Get Started Free</span>
                        <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    
                    <button 
                      onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                      className="border-2 border-gray-300 hover:border-brand-primary text-gray-700 hover:text-brand-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-200 group bg-white/80 backdrop-blur-sm w-full sm:w-auto"
                    >
                      <span>Watch Demo</span>
                      <div className="ml-2 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary/20 flex items-center justify-center transition-colors">
                        <div className="w-0 h-0 border-l-[5px] sm:border-l-[6px] border-l-brand-primary border-y-[3px] sm:border-y-[4px] border-y-transparent ml-0.5"></div>
                      </div>
                    </button>
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
              <div className="lg:col-span-5 relative mt-8 lg:mt-0">
                <div className="relative">
                  {/* Main Image Container */}
                  <div className="relative bg-gradient-to-br from-brand-primary to-blue-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl transform rotate-1 sm:rotate-3 hover:rotate-0 sm:hover:rotate-1 transition-transform duration-500">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                      {/* Mock Dashboard */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">Live Shipment Tracking</h3>
                        <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Map Visualization */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg sm:rounded-xl p-3 sm:p-6 h-32 sm:h-48 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <path d="M50,150 Q150,50 250,100 T350,80" stroke="#004aac" strokeWidth="3" fill="none" strokeDasharray="5,5">
                              <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite"/>
                            </path>
                          </svg>
                        </div>
                        <div className="relative z-10 space-y-2 sm:space-y-3">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs sm:text-sm font-medium">Lagos → Nairobi</span>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-xs sm:text-sm font-medium">Cairo → Cape Town</span>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-xs sm:text-sm font-medium">Accra → Addis Ababa</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                          <div className="text-lg sm:text-2xl font-bold text-brand-primary">847</div>
                          <div className="text-xs text-gray-600">Active Routes</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                          <div className="text-lg sm:text-2xl font-bold text-green-600">98%</div>
                          <div className="text-xs text-gray-600">Success Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements - Hidden on mobile for cleaner layout */}
                  <div className="hidden sm:block absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 transform -rotate-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">25+</div>
                        <div className="text-xs sm:text-sm text-gray-600 font-light">Countries</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">5,000+</div>
                        <div className="text-xs sm:text-sm text-gray-600 font-light">Carriers</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">98%</div>
                        <div className="text-xs sm:text-sm text-gray-600 font-light">Success Rate</div>
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
                <div className="h-6 sm:h-8">
                  <Logo width="160" height="40" className="w-32 sm:w-40 h-8 sm:h-10 brightness-0 invert" />
                </div>
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