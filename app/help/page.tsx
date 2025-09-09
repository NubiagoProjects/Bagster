import HomepageHeader from '@/components/ui/HomepageHeader'
import Footer from '@/components/ui/Footer'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  Truck,
  CreditCard,
  Shield
} from 'lucide-react'

export default function HelpPage() {
  const categories = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      articles: [
        'How to create your first shipment',
        'Understanding the Bagster platform',
        'Account setup and verification',
        'Finding the right carrier'
      ]
    },
    {
      title: 'Shipping & Tracking',
      icon: Truck,
      articles: [
        'How to track your shipments',
        'Understanding delivery times',
        'Package preparation guidelines',
        'What to do if your package is delayed'
      ]
    },
    {
      title: 'Payments & Billing',
      icon: CreditCard,
      articles: [
        'Accepted payment methods',
        'Understanding shipping costs',
        'Billing and invoicing',
        'Refund policies'
      ]
    },
    {
      title: 'Account & Security',
      icon: Shield,
      articles: [
        'Managing your account settings',
        'Two-factor authentication',
        'Password security',
        'Data privacy and protection'
      ]
    }
  ]

  const faqs = [
    {
      question: 'How does Bagster work?',
      answer: 'Bagster connects businesses with verified carriers across Africa. Simply enter your shipment details, get instant quotes from multiple carriers, choose the best option, and track your shipment in real-time.'
    },
    {
      question: 'How do I become a carrier on Bagster?',
      answer: 'To become a carrier, register your business on our platform, provide required documentation, and complete our verification process. Once approved, you can start receiving shipment requests.'
    },
    {
      question: 'What countries does Bagster operate in?',
      answer: 'We currently operate in 50+ African countries, with plans to expand to more regions. Check our carriers page to see available services in your area.'
    },
    {
      question: 'How is my shipment tracked?',
      answer: 'All shipments are tracked in real-time through our platform. You\'ll receive updates via email and SMS, and can view the current status on our tracking page.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including bank transfers, mobile money, and major credit cards. Payment is processed securely through our platform.'
    },
    {
      question: 'What if my shipment is lost or damaged?',
      answer: 'All shipments are insured. If your shipment is lost or damaged, contact our support team immediately and we\'ll help you file a claim.'
    }
  ]

  return (
    <div className="min-h-screen">
      <HomepageHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-brand-primary rounded flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions, learn how to use Bagster, and get support 
              when you need it.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full px-12 py-4 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
              Find the information you need organized by topic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index} className="bg-white border border-gray-200 p-6 group">
                  <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                    <Icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-4">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <a href="/faq" className="text-gray-600 hover:text-brand-primary text-sm font-light transition-colors duration-200">
                          {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Quick answers to the most common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-light text-gray-900 group-open:text-brand-primary">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600 font-light leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
              Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-light text-gray-900 mb-6">Send us a Message</h3>
              <p className="text-gray-600 font-light mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-light text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-light text-gray-700 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors" required>
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
                    className="w-full px-4 py-3 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <button type="submit" className="bg-black text-white px-6 py-3 font-light hover:bg-gray-800 transition-colors">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-light text-gray-900 mb-6">Get in Touch</h3>
              <p className="text-gray-600 font-light mb-8">
                We're here to help with any questions you might have about our services.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-light text-gray-900 mb-2">Email</h4>
                    <p className="text-gray-600 font-light mb-1">hello@bagster.com</p>
                    <p className="text-gray-600 font-light mb-1">support@bagster.com</p>
                    <p className="text-sm text-gray-500 font-light">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-light text-gray-900 mb-2">Phone</h4>
                    <p className="text-gray-600 font-light mb-1">+234 123 456 7890</p>
                    <p className="text-gray-600 font-light mb-1">+234 987 654 3210</p>
                    <p className="text-sm text-gray-500 font-light">Mon-Fri 9AM-6PM WAT</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-light text-gray-900 mb-2">Office</h4>
                    <p className="text-gray-600 font-light mb-1">123 Victoria Island</p>
                    <p className="text-gray-600 font-light mb-1">Lagos, Nigeria</p>
                    <p className="text-sm text-gray-500 font-light">West Africa</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-light text-gray-900 mb-2">Live Chat</h4>
                    <p className="text-gray-600 font-light mb-1">Available 24/7</p>
                    <p className="text-gray-600 font-light mb-1">Instant support</p>
                    <p className="text-sm text-gray-500 font-light">Click the chat button below</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Contact Information
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Get in touch with our support team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-lg font-light text-gray-900 mb-4">Support Hours</h3>
              <div className="space-y-2 text-gray-600 font-light">
                <p>Monday - Friday: 9:00 AM - 6:00 PM WAT</p>
                <p>Saturday: 10:00 AM - 2:00 PM WAT</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-lg font-light text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-2 text-gray-600 font-light">
                <p>Email: support@bagster.com</p>
                <p>Phone: +234 123 456 7890</p>
                <p>Address: Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}