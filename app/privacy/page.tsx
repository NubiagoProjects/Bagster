import HomepageHeader from '@/components/ui/HomepageHeader'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import { Shield, Eye, Lock, Users, Calendar } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <HomepageHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Privacy
              <span className="text-gradient"> Policy</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                Bagster ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our logistics marketplace platform.
              </p>
            </div>

            <div className="space-y-12">
              {/* Information We Collect */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  Information We Collect
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Personal Information</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Name, email address, and phone number</li>
                      <li>Company information and business details</li>
                      <li>Shipping addresses and delivery preferences</li>
                      <li>Payment information (processed securely through our partners)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Usage Information</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Shipment tracking data and delivery history</li>
                      <li>Platform usage patterns and preferences</li>
                      <li>Communication records with carriers and support</li>
                      <li>Device information and IP addresses</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Eye className="w-6 h-6 text-emerald-600 mr-3" />
                  How We Use Your Information
                </h3>
                <div className="space-y-4">
                  <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                    <li>Provide and maintain our logistics services</li>
                    <li>Connect you with verified carriers and suppliers</li>
                    <li>Process payments and manage billing</li>
                    <li>Track shipments and provide real-time updates</li>
                    <li>Send notifications and support communications</li>
                    <li>Improve our platform and develop new features</li>
                    <li>Ensure platform security and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>

              {/* Information Sharing */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 text-purple-600 mr-3" />
                  Information Sharing
                </h3>
                <p className="text-slate-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> With carriers and logistics partners to fulfill your shipments</li>
                  <li><strong>Payment Processors:</strong> With secure payment providers to process transactions</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </div>

              {/* Data Security */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Lock className="w-6 h-6 text-amber-600 mr-3" />
                  Data Security
                </h3>
                <p className="text-slate-600 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data centers and infrastructure</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>

              {/* Data Retention */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 text-red-600 mr-3" />
                  Data Retention
                </h3>
                <p className="text-slate-600 mb-4">
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li><strong>Account Data:</strong> Retained while your account is active and for 7 years after deactivation</li>
                  <li><strong>Shipment Records:</strong> Retained for 10 years for legal and business purposes</li>
                  <li><strong>Payment Information:</strong> Retained as required by financial regulations</li>
                  <li><strong>Communication Records:</strong> Retained for 3 years for support and quality purposes</li>
                </ul>
              </div>

              {/* Your Rights */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Your Rights</h3>
                <p className="text-slate-600 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Restriction:</strong> Request limitation of data processing</li>
                </ul>
              </div>

              {/* Cookies */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Cookies and Tracking</h3>
                <p className="text-slate-600 mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Provide relevant content and offers</li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Us</h3>
                <p className="text-slate-600 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
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