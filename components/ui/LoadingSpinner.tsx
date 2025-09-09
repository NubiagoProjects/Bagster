'use client'

import React from 'react'
import { Loader2, Package, Truck, Clock } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'bounce' | 'shipment'
  text?: string
  className?: string
  color?: 'blue' | 'gray' | 'green' | 'red' | 'yellow'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  blue: 'text-blue-600',
  gray: 'text-gray-600',
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600'
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'default',
  text,
  className = '',
  color = 'blue'
}: LoadingSpinnerProps) {
  const sizeClass = sizeClasses[size]
  const colorClass = colorClasses[color]

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={`${sizeClass} bg-current rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${sizeClass} bg-current rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${sizeClass} bg-current rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        )

      case 'pulse':
        return (
          <div className={`${sizeClass} bg-current rounded-full animate-pulse`}></div>
        )

      case 'bounce':
        return (
          <div className={`${sizeClass} bg-current rounded animate-bounce`}></div>
        )

      case 'shipment':
        return (
          <div className="relative">
            <Package className={`${sizeClass} ${colorClass} animate-pulse`} />
            <div className="absolute -top-1 -right-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
        )

      default:
        return <Loader2 className={`${sizeClass} ${colorClass} animate-spin`} />
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={colorClass}>
        {renderSpinner()}
      </div>
      {text && (
        <p className={`mt-2 text-sm ${colorClass} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  )
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  children: React.ReactNode
  className?: string
}

export function LoadingOverlay({ isLoading, text, children, className = '' }: LoadingOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <LoadingSpinner text={text} size="lg" />
        </div>
      )}
    </div>
  )
}

// Skeleton loader component
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClass = 'animate-pulse bg-gray-200 rounded'
  
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full'
      case 'rectangular':
        return 'rounded'
      default:
        return 'rounded'
    }
  }

  const style = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : '4rem')
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClass} ${getVariantClass()} ${index < lines - 1 ? 'mb-2' : ''}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseClass} ${getVariantClass()} ${className}`}
      style={style}
    />
  )
}

// Loading states for different components
export const LoadingStates = {
  // Card loading state
  Card: ({ className = '' }: { className?: string }) => (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <Skeleton variant="rectangular" height="1.5rem" className="mb-4" />
      <Skeleton lines={3} className="mb-4" />
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" width="4rem" height="2rem" />
        <Skeleton variant="rectangular" width="4rem" height="2rem" />
      </div>
    </div>
  ),

  // Table loading state
  Table: ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b">
        <Skeleton height="1.5rem" width="50%" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} height="1rem" className="flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  ),

  // List loading state
  List: ({ items = 5 }: { items?: number }) => (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
          <Skeleton variant="circular" width="3rem" height="3rem" />
          <div className="flex-1">
            <Skeleton height="1.25rem" width="75%" className="mb-2" />
            <Skeleton height="1rem" width="50%" />
          </div>
          <Skeleton variant="rectangular" width="4rem" height="2rem" />
        </div>
      ))}
    </div>
  ),

  // Dashboard loading state
  Dashboard: () => (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton height="1rem" width="60%" className="mb-2" />
                <Skeleton height="2rem" width="80%" />
              </div>
              <Skeleton variant="circular" width="3rem" height="3rem" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <Skeleton height="1.5rem" width="40%" className="mb-4" />
          <Skeleton variant="rectangular" height="20rem" />
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <Skeleton height="1.5rem" width="40%" className="mb-4" />
          <Skeleton variant="rectangular" height="20rem" />
        </div>
      </div>
    </div>
  ),

  // Form loading state
  Form: () => (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <Skeleton height="2rem" width="50%" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <Skeleton height="1rem" width="30%" className="mb-2" />
            <Skeleton variant="rectangular" height="2.5rem" />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Skeleton variant="rectangular" width="6rem" height="2.5rem" />
        <Skeleton variant="rectangular" width="6rem" height="2.5rem" />
      </div>
    </div>
  )
}

// Hook for managing loading states
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState)
  
  const startLoading = React.useCallback(() => setIsLoading(true), [])
  const stopLoading = React.useCallback(() => setIsLoading(false), [])
  const toggleLoading = React.useCallback(() => setIsLoading(prev => !prev), [])

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading
  }
}

// Higher-order component for adding loading states
export function withLoadingState<P extends object>(
  Component: React.ComponentType<P>,
  loadingComponent?: React.ComponentType
) {
  return function WithLoadingStateComponent(props: P & { isLoading?: boolean }) {
    const { isLoading, ...componentProps } = props

    if (isLoading) {
      return loadingComponent ? React.createElement(loadingComponent) : <LoadingSpinner />
    }

    return React.createElement(Component, componentProps as P)
  }
}
