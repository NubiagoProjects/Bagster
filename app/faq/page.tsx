import HomepageHeader from '@/components/ui/HomepageHeader'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Search,
  Package,
  Truck,
  CreditCard,
  Shield,
  Users,
  Globe
} from 'lucide-react'

export default function FAQPage() {
  const categories = [
    {
      title: 'Getting Started',
      icon: Package,
      faqs: [
        {
          question: 'How do I create my first shipment?',
          answer: 'To create your first shipment, log into your account, click "New Shipment", fill in the pickup and delivery details, select your preferred carrier, and confirm the booking. You\'ll receive a tracking number immediately.'
        },
        {
          question: 'What information do I need to provide for a shipment?',
          answer: 'You\'ll need to provide pickup and delivery addresses, package dimensions and weight, package contents, and your contact information. For international shipments, you may also need customs documentation.'
        },
        {
          question: 'How do I find the right carrier for my shipment?',
          answer: 'Our platform automatically matches you with the best carriers based on your shipment details, route, and requirements. You can compare rates and services from multiple carriers before making your selection.'
        },
        {
          question: 'What types of packages can I ship?',
          answer: 'We handle most types of packages including documents, electronics, clothing, and small to medium-sized items. However, we do not ship hazardous materials, perishable goods, or items requiring special permits.'
        }
      ]
    },
    {
      title: 'Shipping & Tracking',
      icon: Truck,
      faqs: [
        {
          question: 'How do I track my shipment?',
          answer: 'You can track your shipment by entering the tracking number on our tracking page, or by accessing your shipment history in your account dashboard. You\'ll receive real-time updates via email and SMS.'
        },
        {
          question: 'What happens if my package is delayed?',
          answer: 'If your package is delayed, you\'ll receive notifications with the updated delivery timeline. You can contact our support team for assistance, and we\'ll work with the carrier to resolve any issues.'
        },
        {
          question: 'How accurate are the delivery estimates?',
          answer: 'Our delivery estimates are based on historical data and carrier performance. While we strive for accuracy, actual delivery times may vary due to weather, traffic, or other unforeseen circumstances.'
        },
        {
          question: 'Can I change the delivery address after booking?',
          answer: 'Address changes are possible but subject to carrier policies and may incur additional fees. Contact our support team as soon as possible if you need to change the delivery address.'
        }
      ]
    },
    {
      title: 'Payments & Billing',
      icon: CreditCard,
      faqs: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept major credit cards, bank transfers, and mobile money payments. All payments are processed securely through our trusted payment partners.'
        },
        {
          question: 'When do I pay for my shipment?',
          answer: 'Payment is due at the time of booking. You\'ll see the total cost including shipping fees and any additional services before confirming your shipment.'
        },
        {
          question: 'What is your refund policy?',
          answer: 'Refunds are available if your shipment is cancelled before pickup or if there are service failures. Refund processing typically takes 5-10 business days depending on your payment method.'
        },
        {
          question: 'Are there any hidden fees?',
          answer: 'No hidden fees. All costs including shipping, insurance, and any additional services are clearly displayed before you confirm your booking.'
        }
      ]
    },
    {
      title: 'Account & Security',
      icon: Shield,
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a secure link to reset your password. The link expires after 1 hour.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we use industry-standard encryption and security measures to protect your personal and payment information. We never share your data with unauthorized third parties.'
        },
        {
          question: 'Can I have multiple users on one account?',
          answer: 'Yes, business accounts can have multiple users with different permission levels. Contact our support team to set up team access for your organization.'
        },
        {
          question: 'How do I update my account information?',
          answer: 'You can update your account information in the Profile section of your dashboard. Changes to contact information take effect immediately.'
        }
      ]
    },
    {
      title: 'Carrier Services',
      icon: Users,
      faqs: [
        {
          question: 'How do I become a carrier on Bagster?',
          answer: 'To become a carrier, register your business on our platform, provide required documentation including business license and insurance, and complete our verification process. Once approved, you can start receiving shipment requests.'
        },
        {
          question: 'What are the requirements for carriers?',
          answer: 'Carriers must have a valid business license, appropriate insurance coverage, reliable vehicles, and a good track record. We also require background checks and regular performance reviews.'
        },
        {
          question: 'How do carriers get paid?',
          answer: 'Carriers are paid within 7-14 days after successful delivery, minus our platform fees. Payment is processed securely through our payment system.'
        },
        {
          question: 'Can carriers set their own rates?',
          answer: 'Yes, carriers can set their own rates based on routes, services, and market conditions. Our platform helps optimize pricing for competitive advantage.'
        }
      ]
    },
    {
      title: 'International Shipping',
      icon: Globe,
      faqs: [
        {
          question: 'Which countries do you serve?',
          answer: 'We currently operate in 50+ African countries with plans to expand. Check our carriers page for specific coverage in your area.'
        },
        {
          question: 'What documents do I need for international shipping?',
          answer: 'Requirements vary by country and package contents. Generally, you\'ll need a commercial invoice, packing list, and may need permits for certain items. Our platform will guide you through the requirements.'
        },
        {
          question: 'How long does international shipping take?',
          answer: 'International shipping times vary by destination and service level. Express services typically take 3-7 days, while standard services may take 7-21 days depending on the route.'
        },
        {
          question: 'Are there restrictions on international shipments?',
          answer: 'Yes, each country has specific restrictions on items that can be imported. Our platform will check for restrictions based on your shipment details and guide you accordingly.'
        }
      ]
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
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Find quick answers to the most common questions about our logistics marketplace platform.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full px-12 py-4 border border-gray-200 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => {
              const Icon = category.icon
              return (
                <div key={categoryIndex}>
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <h2 className="text-2xl font-light text-gray-900">{category.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <div key={faqIndex} className="bg-white border border-gray-200 p-6">
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
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-gray-700" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-xl text-gray-600 font-light mb-8">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/help" className="bg-black text-white px-6 py-3 font-light hover:bg-gray-800 transition-colors">
              Visit Help Center
            </a>
            <a href="/contact" className="border border-gray-200 text-gray-700 px-6 py-3 font-light hover:bg-gray-50 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 