import Header from '@/components/ui/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import { 
  Cookie, 
  Shield, 
  Settings, 
  Eye,
  Lock,
  AlertTriangle
} from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Cookie
              <span className="text-gradient"> Policy</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Learn how we use cookies and similar technologies to enhance your experience on Bagster.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Last Updated: January 15, 2024</h2>
              <p className="text-slate-600 mb-6">
                This Cookie Policy explains how Bagster ("we," "our," or "us") uses cookies and similar technologies when you visit our website and use our services.
              </p>
            </div>

            <div className="space-y-12">
              {/* What Are Cookies */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Cookie className="w-6 h-6 text-blue-600 mr-3" />
                  What Are Cookies?
                </h3>
                <p className="text-slate-600 mb-4">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings.
                </p>
                <p className="text-slate-600">
                  Cookies can make your next visit easier and the site more useful to you. They play an important role in helping us provide you with a better experience.
                </p>
              </div>

              {/* Types of Cookies */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Settings className="w-6 h-6 text-emerald-600 mr-3" />
                  Types of Cookies We Use
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Essential Cookies</h4>
                    <p className="text-slate-600 mb-2">
                      These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and form submissions.
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Authentication and security cookies</li>
                      <li>Session management cookies</li>
                      <li>Load balancing cookies</li>
                      <li>User interface customization cookies</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Analytics Cookies</h4>
                    <p className="text-slate-600 mb-2">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Google Analytics cookies</li>
                      <li>Page view and navigation tracking</li>
                      <li>User behavior analysis</li>
                      <li>Performance monitoring</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Preference Cookies</h4>
                    <p className="text-slate-600 mb-2">
                      These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Language and region preferences</li>
                      <li>Display settings and themes</li>
                      <li>Search history and filters</li>
                      <li>User interface preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Marketing Cookies</h4>
                    <p className="text-slate-600 mb-2">
                      These cookies are used to track visitors across websites to display relevant and engaging advertisements.
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Advertising and retargeting cookies</li>
                      <li>Social media integration cookies</li>
                      <li>Campaign tracking cookies</li>
                      <li>Conversion tracking cookies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Cookies */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Eye className="w-6 h-6 text-purple-600 mr-3" />
                  How We Use Cookies
                </h3>
                <p className="text-slate-600 mb-4">
                  We use cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li><strong>Authentication:</strong> To identify you when you log in and keep you logged in</li>
                  <li><strong>Security:</strong> To protect against fraud and ensure secure transactions</li>
                  <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                  <li><strong>Analytics:</strong> To understand how our website is used and improve our services</li>
                  <li><strong>Performance:</strong> To optimize website speed and functionality</li>
                  <li><strong>Marketing:</strong> To provide relevant content and advertisements</li>
                </ul>
              </div>

              {/* Third-Party Cookies */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
                  Third-Party Cookies
                </h3>
                <p className="text-slate-600 mb-4">
                  Some cookies are placed by third-party services that appear on our pages. These include:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing</li>
                  <li><strong>Social Media:</strong> For social media integration and sharing</li>
                  <li><strong>Advertising Networks:</strong> For relevant advertising content</li>
                </ul>
                <p className="text-slate-600 mt-4">
                  We do not control these third-party cookies and they are subject to the privacy policies of the respective third-party providers.
                </p>
              </div>

              {/* Cookie Management */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-red-600 mr-3" />
                  Managing Your Cookie Preferences
                </h3>
                <p className="text-slate-600 mb-4">
                  You have several options for managing cookies:
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Browser Settings</h4>
                    <p className="text-slate-600 mb-2">
                      Most web browsers allow you to control cookies through their settings preferences. You can:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Delete existing cookies</li>
                      <li>Block cookies from being set</li>
                      <li>Set your browser to ask for permission before setting cookies</li>
                      <li>Set your browser to automatically reject all cookies</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Cookie Consent</h4>
                    <p className="text-slate-600 mb-2">
                      When you first visit our website, you'll see a cookie consent banner that allows you to:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Accept all cookies</li>
                      <li>Reject non-essential cookies</li>
                      <li>Customize your cookie preferences</li>
                      <li>Learn more about our cookie usage</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Opt-Out Tools</h4>
                    <p className="text-slate-600 mb-2">
                      You can also use third-party tools to manage cookies:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Google Analytics Opt-out Browser Add-on</li>
                      <li>Digital Advertising Alliance (DAA) opt-out tools</li>
                      <li>Network Advertising Initiative (NAI) opt-out tools</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Impact of Disabling Cookies */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Impact of Disabling Cookies</h3>
                <p className="text-slate-600 mb-4">
                  If you choose to disable cookies, some features of our website may not function properly:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>You may need to log in repeatedly</li>
                  <li>Some website features may not work as expected</li>
                  <li>Personalized content may not be available</li>
                  <li>Website performance may be affected</li>
                </ul>
              </div>

              {/* Updates to Policy */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Updates to This Policy</h3>
                <p className="text-slate-600 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on our website.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Us</h3>
                <p className="text-slate-600 mb-4">
                  If you have questions about our use of cookies, please contact us:
                </p>
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="space-y-2">
                    <p className="text-slate-600"><strong>Email:</strong> privacy@bagster.com</p>
                    <p className="text-slate-600"><strong>Phone:</strong> +234 123 456 7890</p>
                    <p className="text-slate-600"><strong>Address:</strong> 123 Victoria Island, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 