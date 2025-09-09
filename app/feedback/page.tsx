'use client'

import { useState } from 'react'
import HomepageHeader from '@/components/ui/HomepageHeader'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Footer from '@/components/ui/Footer'
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Bug,
  Heart
} from 'lucide-react'

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    rating: 0,
    type: 'general'
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    {
      id: 'general',
      title: 'General Feedback',
      description: 'Share your overall experience with Bagster',
      icon: MessageSquare
    },
    {
      id: 'bug',
      title: 'Bug Report',
      description: 'Report technical issues or problems',
      icon: Bug
    },
    {
      id: 'feature',
      title: 'Feature Request',
      description: 'Suggest new features or improvements',
      icon: Lightbulb
    },
    {
      id: 'praise',
      title: 'Praise',
      description: 'Share positive feedback and compliments',
      icon: Heart
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsSubmitted(true)
    console.log('Feedback submitted:', formData)
  }

  const handleRating = (rating: number) => {
    setFormData({ ...formData, rating })
  }

  const handleCategorySelect = (categoryId: string) => {
    setFormData({ ...formData, category: categoryId })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <HomepageHeader />
        
        <div className="pt-32 pb-20 bg-slate-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h1>
            <p className="text-xl text-slate-600 mb-8">
              Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => setIsSubmitted(false)}
                className="btn-primary"
              >
                Submit Another Feedback
              </button>
              <a href="/" className="btn-ghost block">
                Back to Home
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <HomepageHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Send
              <span className="text-gradient"> Feedback</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Help us improve Bagster by sharing your thoughts, suggestions, and experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Share Your Feedback</h2>
              <p className="text-slate-600 mb-8">
                We value your input and use it to make Bagster better for everyone.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    placeholder="Brief description of your feedback"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Overall Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          formData.rating >= star 
                            ? 'text-amber-500 hover:text-amber-600' 
                            : 'text-slate-300 hover:text-slate-400'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {formData.rating === 0 && 'Rate your experience'}
                    {formData.rating === 1 && 'Poor'}
                    {formData.rating === 2 && 'Fair'}
                    {formData.rating === 3 && 'Good'}
                    {formData.rating === 4 && 'Very Good'}
                    {formData.rating === 5 && 'Excellent'}
                  </p>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field"
                    placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Feedback Categories</h3>
              <div className="space-y-4">
                {categories.map((category) => {
                  const Icon = category.icon
                  const isSelected = formData.category === category.id
                  
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-600' : 'bg-slate-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isSelected ? 'text-white' : 'text-slate-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className={`font-semibold ${
                            isSelected ? 'text-blue-600' : 'text-slate-900'
                          }`}>
                            {category.title}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Tips */}
              <div className="mt-8 p-6 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-900 mb-3">Tips for Great Feedback</h4>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Be specific about what you liked or didn't like</li>
                  <li>• Include steps to reproduce any issues</li>
                  <li>• Share your use case or scenario</li>
                  <li>• Mention what you were trying to accomplish</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Feedback Matters */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Your Feedback Matters</h2>
            <p className="text-xl text-slate-600">
              Every piece of feedback helps us improve the Bagster experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ThumbsUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Improve Our Service</h3>
              <p className="text-slate-600">
                Your feedback directly influences our product roadmap and helps us prioritize features that matter most to our users.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bug className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Fix Issues Faster</h3>
              <p className="text-slate-600">
                Bug reports and problem descriptions help our team identify and resolve issues quickly, improving the experience for everyone.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Shape the Future</h3>
              <p className="text-slate-600">
                Feature requests and suggestions help us understand what our users need and want, guiding our development priorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 