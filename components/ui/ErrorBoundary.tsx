'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Log to audit service if available
    this.logError(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    if (hasError && prevProps.resetKeys !== resetKeys && resetOnPropsChange) {
      if (resetKeys?.some((key, idx) => prevProps.resetKeys?.[idx] !== key)) {
        this.resetErrorBoundary()
      }
    }
  }

  private async logError(error: Error, errorInfo: React.ErrorInfo) {
    try {
      // Try to import audit logging service
      const { auditLoggingService } = await import('@/lib/services/auditLoggingService')
      
      await auditLoggingService.logAction(
        'system',
        'system@bagster.com',
        'component_error',
        'ui_component',
        error.name,
        {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        },
        'high',
        'system_error',
        false,
        error.message
      )
    } catch (logError) {
      console.error('Failed to log error to audit service:', logError)
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      })
    }, 100)
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  handleGoHome = () => {
    // Use Next.js router for navigation
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback, showDetails = false } = this.props

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              
              <h1 className="text-lg font-semibold text-gray-900 mb-2">
                Something went wrong
              </h1>
              
              <p className="text-sm text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
              </p>

              {showDetails && error && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Error Details
                  </h3>
                  <div className="text-xs text-gray-600 space-y-2">
                    <div>
                      <strong>Error:</strong> {error.name}
                    </div>
                    <div>
                      <strong>Message:</strong> {error.message}
                    </div>
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                          Stack Trace
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                    {errorInfo?.componentStack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                          Component Stack
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                          {errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={this.resetErrorBoundary}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={this.handleReload}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </button>
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-500">
                Error ID: {Date.now().toString(36)}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return children
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for error boundary in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Manual error reported:', error, errorInfo)
    throw error
  }
}

// Async error boundary for handling promise rejections
export class AsyncErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AsyncErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    
    this.setState({
      hasError: true,
      error,
      errorInfo: null
    })

    this.props.onError?.(error, { componentStack: 'Promise rejection' } as React.ErrorInfo)
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundary {...this.props}>
          <div>Async Error Occurred</div>
        </ErrorBoundary>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
