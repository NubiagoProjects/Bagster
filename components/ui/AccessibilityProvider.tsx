'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  highContrast: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  focusVisible: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void
  resetSettings: () => void
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  focusVisible: true
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('bagster-accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error)
      }
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    
    if (prefersReducedMotion || prefersHighContrast) {
      setSettings(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast
      }))
    }
  }, [])

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement
    
    // Font size
    root.setAttribute('data-font-size', settings.fontSize)
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }
    
    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible')
    } else {
      root.classList.remove('focus-visible')
    }

    // Save to localStorage
    localStorage.setItem('bagster-accessibility-settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('bagster-accessibility-settings')
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Accessibility helper components
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
    >
      {children}
    </a>
  )
}

export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

export function LiveRegion({ 
  children, 
  politeness = 'polite' 
}: { 
  children: React.ReactNode
  politeness?: 'off' | 'polite' | 'assertive'
}) {
  return (
    <div aria-live={politeness} aria-atomic="true" className="sr-only">
      {children}
    </div>
  )
}

// Accessibility hooks
export function useKeyboardNavigation() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true)
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardUser(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return isKeyboardUser
}

export function useFocusTrap(isActive: boolean) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Allow parent to handle escape
        const escapeEvent = new CustomEvent('focustrap:escape')
        container.dispatchEvent(escapeEvent)
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive])

  return containerRef
}

export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState('')

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement('')
    setTimeout(() => {
      setAnnouncement(message)
    }, 100)
  }

  return {
    announce,
    AnnouncementRegion: () => (
      <LiveRegion politeness="assertive">
        {announcement}
      </LiveRegion>
    )
  }
}

// Accessibility validation helpers
export const a11yValidators = {
  hasAltText: (img: HTMLImageElement): boolean => {
    return img.hasAttribute('alt')
  },

  hasLabel: (input: HTMLInputElement): boolean => {
    return !!(
      input.getAttribute('aria-label') ||
      input.getAttribute('aria-labelledby') ||
      document.querySelector(`label[for="${input.id}"]`)
    )
  },

  hasHeadingStructure: (container: HTMLElement): boolean => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    if (headings.length === 0) return true

    let currentLevel = 0
    for (const heading of Array.from(headings)) {
      const level = parseInt(heading.tagName.charAt(1))
      if (currentLevel === 0) {
        currentLevel = level
      } else if (level > currentLevel + 1) {
        return false // Skipped heading level
      }
      currentLevel = level
    }
    return true
  },

  hasProperContrast: async (element: HTMLElement): Promise<boolean> => {
    // This would require a color contrast calculation
    // For now, return true as a placeholder
    return true
  }
}

// Higher-order component for accessibility
export function withAccessibility<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    skipLink?: string
    heading?: string
    landmark?: string
  }
) {
  return function AccessibleComponent(props: P) {
    const { settings } = useAccessibility()
    
    return (
      <div
        role={options?.landmark}
        aria-label={options?.heading}
        data-accessibility-enhanced="true"
      >
        {options?.skipLink && (
          <SkipLink href={options.skipLink}>
            Skip to {options.heading || 'main content'}
          </SkipLink>
        )}
        <Component {...props} />
      </div>
    )
  }
}

export default AccessibilityProvider
