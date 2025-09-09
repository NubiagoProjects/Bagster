'use client'

import Header from '@/components/ui/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight,
  Heart,
  Globe,
  Zap,
  Award,
  Coffee,
  Wifi,
  Car
} from 'lucide-react'

export default function CareersPage() {
  const openPositions = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      description: 'Join our engineering team to build the future of African logistics technology.',
      requirements: ['5+ years experience', 'React/Node.js', 'Cloud platforms']
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead product strategy and development for our carrier marketplace platform.',
      requirements: ['3+ years PM experience', 'B2B marketplace', 'Data-driven mindset']
    },
    {
      id: 3,
      title: 'Business Development Manager',
      department: 'Sales',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      description: 'Expand our carrier network and build strategic partnerships across East Africa.',
      requirements: ['Sales experience', 'Logistics industry', 'Relationship building']
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Cape Town, South Africa',
      type: 'Full-time',
      description: 'Design intuitive user experiences for shippers and carriers across our platform.',
      requirements: ['Portfolio required', 'Figma/Sketch', 'Mobile-first design']
    }
  ]

  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Remote Work',
      description: 'Flexible remote work options with co-working allowances'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Learning & Development',
      description: 'Annual learning budget and conference attendance'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Equity Package',
      description: 'Competitive equity participation for all team members'
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Office Perks',
      description: 'Free meals, snacks, and beverages in all offices'
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: 'Transportation',
      description: 'Transportation allowance or company shuttle service'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
              Join Our <span className="text-black">Mission</span>
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Help us revolutionize African logistics and connect the continent through innovative technology and passionate teamwork.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">50+</div>
              <div className="text-gray-600 font-light">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">5</div>
              <div className="text-gray-600 font-light">Office Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">25+</div>
              <div className="text-gray-600 font-light">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">$10M+</div>
              <div className="text-gray-600 font-light">Funding Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Find your next opportunity with us
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position) => (
              <div key={position.id} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-sm transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 font-light">
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {position.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {position.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <button className="bg-black text-white px-6 py-3 font-light hover:bg-gray-800 transition-colors mt-4 md:mt-0">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </button>
                </div>
                
                <p className="text-gray-600 font-light mb-4 leading-relaxed">
                  {position.description}
                </p>
                
                <div>
                  <h4 className="text-sm font-light text-gray-900 mb-2">Key Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {position.requirements.map((req, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-light rounded-full">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Why Work With Us
            </h2>
            <p className="text-lg text-gray-600 font-light">
              We believe in taking care of our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-black rounded flex items-center justify-center mx-auto mb-4 text-white">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-light text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                Our Culture
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-light text-gray-900 mb-2">Innovation First</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    We encourage creative thinking and bold ideas that push the boundaries of what's possible in logistics.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-900 mb-2">Collaborative Spirit</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Our diverse team works together across continents, bringing unique perspectives to solve complex challenges.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-900 mb-2">Impact Driven</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Every team member contributes to connecting Africa and improving lives through better logistics solutions.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-black mr-3" />
                <h3 className="text-xl font-light text-gray-900">Join Our Team</h3>
              </div>
              <p className="text-gray-600 font-light mb-6 leading-relaxed">
                Don't see a position that fits? We're always looking for talented individuals who share our passion for transforming African logistics.
              </p>
              <button className="bg-black text-white px-6 py-3 font-light hover:bg-gray-800 transition-colors w-full">
                Send Us Your Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
