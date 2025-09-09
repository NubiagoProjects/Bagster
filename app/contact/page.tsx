'use client'

import { useState } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  HelpCircle,
  ArrowRight
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle contact form submission
    console.log('Contact form submitted:', formData)
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Tesla-style Hero Section */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Have questions about Bagster? We're here to help. Get in touch with our team 
              and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-6">Send us a Message</h2>
              <p className="text-gray-600 mb-8 font-light">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-light text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-light text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-light text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <button type="submit" className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors font-light group">
                  Send Message
                  <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <p className="text-slate-600 mb-8">
                We're here to help with any questions you might have about our services.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Email</h3>
                    <p className="text-slate-600 mb-1">hello@bagster.com</p>
                    <p className="text-slate-600 mb-1">support@bagster.com</p>
                    <p className="text-sm text-slate-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Phone</h3>
                    <p className="text-slate-600 mb-1">+234 123 456 7890</p>
                    <p className="text-slate-600 mb-1">+234 987 654 3210</p>
                    <p className="text-sm text-slate-500">Mon-Fri 9AM-6PM WAT</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Office</h3>
                    <p className="text-slate-600 mb-1">123 Victoria Island</p>
                    <p className="text-slate-600 mb-1">Lagos, Nigeria</p>
                    <p className="text-sm text-slate-500">West Africa</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Business Hours</h3>
                    <p className="text-slate-600 mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-slate-600 mb-1">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-sm text-slate-500">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Quick Help
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Find answers to common questions or get help with specific issues
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card group">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Help Center</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Browse our comprehensive help articles and tutorials to find answers to common questions.
              </p>
              <a href="/help" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group">
                Visit Help Center
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>

            <div className="card group">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Live Chat</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Chat with our support team in real-time for immediate assistance with your questions.
              </p>
              <button className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group">
                Start Chat
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            <div className="card group">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Email Support</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Send us a detailed email and we'll get back to you with a comprehensive response.
              </p>
              <a href="mailto:support@bagster.com" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group">
                Send Email
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Quick answers to the most common questions
            </p>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                How does Bagster work?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Bagster connects businesses with verified carriers across Africa. Simply enter your shipment details, 
                get instant quotes from multiple carriers, choose the best option, and track your shipment in real-time.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                How do I become a carrier on Bagster?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                To become a carrier, register your business on our platform, provide required documentation, 
                and complete our verification process. Once approved, you can start receiving shipment requests.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                What countries does Bagster operate in?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We currently operate in 50+ African countries, with plans to expand to more regions. 
                Check our carriers page to see available services in your area.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                How is my shipment tracked?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                All shipments are tracked in real-time through our platform. You'll receive updates via email 
                and SMS, and can view the current status on our tracking page.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                What payment methods are accepted?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We accept various payment methods including bank transfers, mobile money, and major credit cards. 
                Payment is processed securely through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 