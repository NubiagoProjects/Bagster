'use client'

import { useEffect, useRef, useCallback, useMemo, useState } from 'react'

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Measure function execution time
  measureFunction<T extends (...args: any[]) => any>(
    name: string,
    fn: T
  ): T {
    return ((...args: Parameters<T>) => {
      const start = performance.now()
      const result = fn(...args)
      const end = performance.now()
      
      this.recordMetric(name, end - start)
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const asyncEnd = performance.now()
          this.recordMetric(`${name}_async`, asyncEnd - start)
        })
      }
      
      return result
    }) as T
  }

  // Record custom metric
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)!
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  // Get metric statistics
  getMetricStats(name: string): {
    count: number
    avg: number
    min: number
    max: number
    p95: number
  } | null {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return null
    
    const sorted = [...values].sort((a, b) => a - b)
    const count = values.length
    const sum = values.reduce((a, b) => a + b, 0)
    
    return {
      count,
      avg: sum / count,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[Math.floor(count * 0.95)]
    }
  }

  // Start observing web vitals
  observeWebVitals(): void {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.recordMetric('LCP', lastEntry.startTime)
      })
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.set('lcp', lcpObserver)
      } catch (error) {
        console.warn('LCP observation not supported')
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime)
        })
      })
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.set('fid', fidObserver)
      } catch (error) {
        console.warn('FID observation not supported')
      }

      // Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.recordMetric('CLS', clsValue)
          }
        })
      })
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.set('cls', clsObserver)
      } catch (error) {
        console.warn('CLS observation not supported')
      }
    }
  }

  // Get all metrics
  getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {}
    
    for (const [name] of Array.from(this.metrics)) {
      result[name] = this.getMetricStats(name)
    }
    
    return result
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear()
  }

  // Disconnect all observers
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
  }
}

// Caching utilities
export class CacheManager {
  private static instance: CacheManager
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  // Set cache entry
  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
  }

  // Get cache entry
  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    return this.get(key) !== null
  }

  // Delete cache entry
  delete(key: string): void {
    this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }

  // Get cache size
  size(): number {
    return this.cache.size
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now()
    
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): T {
  let timeout: NodeJS.Timeout | null = null
  
  return ((...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }) as T
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean = false
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map()
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    
    return result
  }) as T
}

// React hooks for performance optimization

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps)
}

export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps)
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [React.RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      options
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return [ref, isIntersecting]
}

// Virtual scrolling hook
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
): {
  visibleItems: Array<{ index: number; item: T }>
  scrollTop: number
  setScrollTop: (scrollTop: number) => void
  totalHeight: number
} {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, index) => ({
      index: startIndex + index,
      item
    }))
  }, [items, startIndex, endIndex])

  const totalHeight = items.length * itemHeight

  return {
    visibleItems,
    scrollTop,
    setScrollTop,
    totalHeight
  }
}

// Image lazy loading hook
export function useLazyImage(src: string): {
  imageSrc: string | null
  isLoading: boolean
  error: string | null
} {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }
    
    img.onerror = () => {
      setError('Failed to load image')
      setIsLoading(false)
    }
    
    img.src = src
    
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { imageSrc, isLoading, error }
}

// Performance measurement hook
export function usePerformanceMeasure(name: string, enabled: boolean = true) {
  const startTime = useRef<number>()
  const monitor = PerformanceMonitor.getInstance()

  const start = useCallback(() => {
    if (enabled) {
      startTime.current = performance.now()
    }
  }, [enabled])

  const end = useCallback(() => {
    if (enabled && startTime.current !== undefined) {
      const duration = performance.now() - startTime.current
      monitor.recordMetric(name, duration)
      startTime.current = undefined
    }
  }, [enabled, name, monitor])

  const measure = useCallback((fn: () => void) => {
    start()
    fn()
    end()
  }, [start, end])

  return { start, end, measure }
}

// Bundle size analyzer
export function analyzeBundleSize(): Promise<{
  totalSize: number
  gzippedSize: number
  chunks: Array<{ name: string; size: number }>
}> {
  return new Promise((resolve) => {
    // This would integrate with webpack-bundle-analyzer or similar
    // For now, return mock data
    resolve({
      totalSize: 1024 * 1024, // 1MB
      gzippedSize: 300 * 1024, // 300KB
      chunks: [
        { name: 'main', size: 500 * 1024 },
        { name: 'vendor', size: 400 * 1024 },
        { name: 'runtime', size: 124 * 1024 }
      ]
    })
  })
}

// Resource hints utilities
export function preloadResource(href: string, as: string): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

export function prefetchResource(href: string): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

// Service worker utilities
export function registerServiceWorker(swUrl: string): Promise<ServiceWorkerRegistration> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.reject(new Error('Service workers not supported'))
  }

  return navigator.serviceWorker.register(swUrl)
}

// Performance optimization helpers
export const performanceOptimizations = {
  // Enable React concurrent features
  enableConcurrentFeatures: () => {
    if (typeof window !== 'undefined') {
      // Enable scheduler profiling
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.onScheduleFiberRoot?.(1, {}, {})
    }
  },

  // Optimize images
  optimizeImages: () => {
    if (typeof document === 'undefined') return

    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  },

  // Preconnect to external domains
  preconnectDomains: (domains: string[]) => {
    if (typeof document === 'undefined') return

    domains.forEach((domain) => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      document.head.appendChild(link)
    })
  }
}

export default {
  PerformanceMonitor,
  CacheManager,
  debounce,
  throttle,
  memoize,
  useDebounce,
  useThrottle,
  useMemoizedCallback,
  useMemoizedValue,
  useIntersectionObserver,
  useVirtualScrolling,
  useLazyImage,
  usePerformanceMeasure,
  analyzeBundleSize,
  preloadResource,
  prefetchResource,
  registerServiceWorker,
  performanceOptimizations
}
