import HomepageHeader from '@/components/ui/HomepageHeader'
import Footer from '@/components/ui/Footer'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { 
  Globe, 
  Users, 
  Target, 
  Award, 
  Heart, 
  Shield, 
  Zap, 
  TrendingUp,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <HomepageHeader />
      
      {/* Tesla-style Hero Section */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
              About Bagster
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Revolutionizing African logistics through intelligent technology, 
              connecting carriers and clients for seamless shipping across the continent.
            </p>
          </div>
        </div>
      </section>

      {/* Tesla-style Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed font-light">
                To democratize logistics across Africa by creating a transparent, 
                efficient, and reliable marketplace that connects businesses with 
                the best carriers for their shipping needs.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
                We believe that every business in Africa should have access to 
                affordable, reliable, and fast shipping services, regardless of 
                their location or size.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">50+</div>
                  <div className="text-gray-600 font-light">Countries Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">500+</div>
                  <div className="text-gray-600 font-light">Verified Carriers</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 text-center">
                  <Globe className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-light text-gray-700">Pan-African</div>
                </div>
                <div className="bg-gray-50 p-4 text-center">
                  <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-light text-gray-700">Community</div>
                </div>
                <div className="bg-gray-50 p-4 text-center">
                  <Target className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-light text-gray-700">Focused</div>
                </div>
                <div className="bg-gray-50 p-4 text-center">
                  <Award className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-light text-gray-700">Quality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tesla-style Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              The principles that guide everything we do at Bagster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mx-auto mb-6">
                <Heart className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer First</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Every decision we make is centered around providing the best 
                experience for our customers and carriers.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mx-auto mb-6">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trust & Security</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We build trust through transparency, security, and reliable 
                service delivery across all our operations.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mx-auto mb-6">
                <Zap className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We continuously innovate to solve complex logistics challenges 
                and improve the shipping experience.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Growth</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We foster growth for our partners, carriers, and the entire 
                African logistics ecosystem.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mx-auto mb-6">
                <Globe className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Inclusivity</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We serve businesses of all sizes across Africa, ensuring 
                equal access to quality logistics services.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mx-auto mb-6">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We build strong partnerships and communities that drive 
                sustainable growth across Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Our Team
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Meet the passionate team behind Bagster's mission to revolutionize 
              African logistics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sarah Johnson</h3>
              <p className="text-blue-600 font-medium mb-4">CEO & Founder</p>
              <p className="text-slate-600 text-sm">
                Former logistics executive with 15+ years experience in African markets.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 bg-emerald-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Michael Chen</h3>
              <p className="text-blue-600 font-medium mb-4">CTO</p>
              <p className="text-slate-600 text-sm">
                Tech leader with expertise in building scalable logistics platforms.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Amina Hassan</h3>
              <p className="text-blue-600 font-medium mb-4">Head of Operations</p>
              <p className="text-slate-600 text-sm">
                Operations expert with deep knowledge of African supply chains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              API Integration
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Integrate Bagster's logistics platform into your applications with our powerful API
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Powerful API for Seamless Integration
              </h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Our RESTful API allows developers to integrate Bagster's logistics services directly into their applications. 
                Get real-time shipping rates, create shipments, track deliveries, and manage your logistics operations programmatically.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Whether you're building an e-commerce platform, a logistics management system, or a custom shipping solution, 
                our API provides all the tools you need to deliver exceptional shipping experiences to your customers.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-slate-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50ms</div>
                  <div className="text-slate-600">Average Response</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">GET</span>
                    </div>
                    <span className="text-sm font-mono text-slate-600">/api/rates</span>
                  </div>
                  <p className="text-sm text-slate-600">Get real-time shipping rates</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">POST</span>
                    </div>
                    <span className="text-sm font-mono text-slate-600">/api/shipments</span>
                  </div>
                  <p className="text-sm text-slate-600">Create new shipments</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">GET</span>
                    </div>
                    <span className="text-sm font-mono text-slate-600">/api/tracking/:id</span>
                  </div>
                  <p className="text-sm text-slate-600">Track shipment status</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="/api" className="btn-primary">
              View API Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Have questions about Bagster? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Email</h3>
              <p className="text-slate-600 mb-4">hello@bagster.com</p>
              <p className="text-sm text-slate-500">We'll respond within 24 hours</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Phone</h3>
              <p className="text-slate-600 mb-4">+234 123 456 7890</p>
              <p className="text-sm text-slate-500">Mon-Fri 9AM-6PM WAT</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Office</h3>
              <p className="text-slate-600 mb-4">Lagos, Nigeria</p>
              <p className="text-sm text-slate-500">West Africa</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 