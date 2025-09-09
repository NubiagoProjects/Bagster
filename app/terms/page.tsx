import HomepageHeader from '@/components/ui/HomepageHeader'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import { FileText, Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <HomepageHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Terms of
              <span className="text-gradient"> Service</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our logistics marketplace platform.
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
                These Terms of Service ("Terms") govern your use of the Bagster logistics marketplace platform and services. By accessing or using our platform, you agree to be bound by these Terms.
              </p>
            </div>

            <div className="space-y-12">
              {/* Acceptance */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                  Acceptance of Terms
                </h3>
                <p className="text-slate-600 mb-4">
                  By creating an account, accessing our platform, or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not use our services.
                </p>
              </div>

              {/* Service Description */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  Service Description
                </h3>
                <p className="text-slate-600 mb-4">
                  Bagster provides a logistics marketplace platform that connects:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li><strong>Clients:</strong> Businesses and individuals seeking shipping services</li>
                  <li><strong>Carriers:</strong> Verified logistics companies and transport providers</li>
                  <li><strong>Suppliers:</strong> Manufacturers and distributors</li>
                </ul>
                <p className="text-slate-600 mt-4">
                  Our platform facilitates shipment booking, tracking, payment processing, and communication between parties.
                </p>
              </div>

              {/* User Accounts */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 text-purple-600 mr-3" />
                  User Accounts
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Account Creation</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>You must provide accurate and complete information</li>
                      <li>You are responsible for maintaining account security</li>
                      <li>You must be at least 18 years old to create an account</li>
                      <li>One account per person/business entity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Account Responsibilities</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Keep your login credentials secure</li>
                      <li>Notify us immediately of any unauthorized access</li>
                      <li>Update your information as needed</li>
                      <li>Comply with all applicable laws and regulations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Acceptable Use */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-amber-600 mr-3" />
                  Acceptable Use
                </h3>
                <p className="text-slate-600 mb-4">
                  You agree to use our platform only for lawful purposes and in accordance with these Terms. You must not:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Use the platform for illegal or unauthorized purposes</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful, offensive, or inappropriate content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with platform functionality or security</li>
                  <li>Use automated systems to access our services</li>
                  <li>Provide false or misleading information</li>
                </ul>
              </div>

              {/* Payment Terms */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Payment Terms</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Payment Processing</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>All payments are processed through secure third-party providers</li>
                      <li>Prices are displayed in local currency where applicable</li>
                      <li>Payment is due at the time of shipment booking</li>
                      <li>Refunds are subject to our refund policy</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Service Fees</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>We charge a service fee for platform usage</li>
                      <li>Fees are clearly displayed before booking</li>
                      <li>Additional fees may apply for special services</li>
                      <li>Fees are non-refundable unless otherwise stated</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Shipment Terms */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Shipment Terms</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Booking and Confirmation</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Shipment bookings are subject to carrier availability</li>
                      <li>Carriers may accept or decline shipment requests</li>
                      <li>Confirmed bookings create a binding agreement</li>
                      <li>Cancellation policies vary by carrier</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Prohibited Items</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Illegal or hazardous materials</li>
                      <li>Perishable goods without proper packaging</li>
                      <li>Items exceeding size or weight limits</li>
                      <li>Items requiring special permits or licenses</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Liability and Disclaimers */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                  Liability and Disclaimers
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Platform Liability</h4>
                    <p className="text-slate-600 mb-2">
                      Bagster acts as a marketplace facilitator. We are not responsible for:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Carrier performance or delivery issues</li>
                      <li>Loss, damage, or delay of shipments</li>
                      <li>Disputes between clients and carriers</li>
                      <li>Third-party service failures</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Limitation of Liability</h4>
                    <p className="text-slate-600">
                      Our liability is limited to the amount of fees paid for the specific service giving rise to the claim. We are not liable for indirect, incidental, or consequential damages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Intellectual Property */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Intellectual Property</h3>
                <p className="text-slate-600 mb-4">
                  The Bagster platform, including its content, design, and functionality, is owned by Bagster and protected by intellectual property laws. You may not:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Copy, modify, or distribute our content without permission</li>
                  <li>Reverse engineer our platform or systems</li>
                  <li>Use our trademarks or branding without authorization</li>
                  <li>Create derivative works based on our platform</li>
                </ul>
              </div>

              {/* Termination */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Termination</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Account Termination</h4>
                    <p className="text-slate-600 mb-2">
                      We may terminate or suspend your account if you:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Violate these Terms or applicable laws</li>
                      <li>Engage in fraudulent or harmful activities</li>
                      <li>Fail to pay fees or charges</li>
                      <li>Provide false or misleading information</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Effect of Termination</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                      <li>Your access to the platform will be revoked</li>
                      <li>Active shipments will be handled according to our policies</li>
                      <li>Outstanding fees must be paid</li>
                      <li>Data retention is subject to our Privacy Policy</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Governing Law */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Governing Law</h3>
                <p className="text-slate-600 mb-4">
                  These Terms are governed by the laws of Nigeria. Any disputes will be resolved in the courts of Lagos, Nigeria, unless otherwise required by law.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Changes to Terms</h3>
                <p className="text-slate-600 mb-4">
                  We may update these Terms from time to time. We will notify you of any material changes by email or through our platform. Your continued use of our services after such changes constitutes acceptance of the new Terms.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h3>
                <p className="text-slate-600 mb-4">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="space-y-2">
                    <p className="text-slate-600"><strong>Email:</strong> legal@bagster.com</p>
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