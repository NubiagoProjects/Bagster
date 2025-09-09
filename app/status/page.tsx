import Header from '@/components/ui/Header'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  Server,
  Database,
  Globe,
  Shield,
  Activity
} from 'lucide-react'

export default function StatusPage() {
  // Mock system status data
  const systemStatus = {
    overall: 'operational',
    lastUpdated: '2024-01-15 14:30 UTC',
    incidents: []
  }

  const services = [
    {
      name: 'API Services',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '45ms',
      icon: Server
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '12ms',
      icon: Database
    },
    {
      name: 'Web Platform',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '180ms',
      icon: Globe
    },
    {
      name: 'Payment Processing',
      status: 'operational',
      uptime: '99.7%',
      responseTime: '320ms',
      icon: Shield
    },
    {
      name: 'Tracking System',
      status: 'operational',
      uptime: '99.6%',
      responseTime: '95ms',
      icon: Activity
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-emerald-600 bg-emerald-100'
      case 'degraded':
        return 'text-amber-600 bg-amber-100'
      case 'outage':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-slate-600 bg-slate-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4" />
      case 'degraded':
        return <AlertCircle className="w-4 h-4" />
      case 'outage':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              System
              <span className="text-gradient"> Status</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Real-time status of Bagster's platform services and infrastructure.
            </p>
          </div>

          {/* Overall Status */}
          <div className="max-w-2xl mx-auto">
            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(systemStatus.overall)}`}>
                  {getStatusIcon(systemStatus.overall)}
                  <span className="capitalize">{systemStatus.overall}</span>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">All Systems Operational</h2>
              <p className="text-slate-600 mb-4">
                All Bagster services are running normally. No incidents reported.
              </p>
              <p className="text-sm text-slate-500">
                Last updated: {systemStatus.lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Service Status</h2>
            <p className="text-xl text-slate-600">
              Detailed status of each platform component
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{service.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                          <span className="capitalize">{service.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Uptime (30 days)</span>
                      <span className="font-medium text-slate-900">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Response Time</span>
                      <span className="font-medium text-slate-900">{service.responseTime}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Performance Metrics</h2>
            <p className="text-xl text-slate-600">
              Key performance indicators for our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">99.9%</h3>
              <p className="text-slate-600">Overall Uptime</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">180ms</h3>
              <p className="text-slate-600">Average Response Time</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">50+</h3>
              <p className="text-slate-600">Countries Served</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">100%</h3>
              <p className="text-slate-600">Security Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Incident History</h2>
            <p className="text-xl text-slate-600">
              Recent incidents and their resolutions
            </p>
          </div>

          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Recent Incidents</h3>
            <p className="text-slate-600">
              No incidents have been reported in the last 30 days. All systems are running smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Stay Updated</h2>
          <p className="text-xl text-slate-600 mb-8">
            Get notified about system status updates and incidents
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="input-field flex-1"
              />
              <button className="btn-primary">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              We'll only send you updates about system status and incidents.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 