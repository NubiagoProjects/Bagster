'use client'

import { z } from 'zod'
import { useState } from 'react'

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address')

export const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')

export const trackingNumberSchema = z.string()
  .min(6, 'Tracking number must be at least 6 characters')
  .max(50, 'Tracking number cannot exceed 50 characters')
  .regex(/^[A-Z0-9\-]+$/, 'Tracking number can only contain uppercase letters, numbers, and hyphens')

// User validation schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: phoneSchema.optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
})

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  avatar: z.string().url('Please enter a valid URL').optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean()
  }).optional()
})

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters').max(200, 'Street address cannot exceed 200 characters'),
  city: z.string().min(2, 'City must be at least 2 characters').max(100, 'City cannot exceed 100 characters'),
  state: z.string().min(2, 'State must be at least 2 characters').max(100, 'State cannot exceed 100 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters').max(20, 'Postal code cannot exceed 20 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters').max(100, 'Country cannot exceed 100 characters')
})

// Shipment validation schemas
export const shipmentCreationSchema = z.object({
  originAddress: addressSchema,
  destinationAddress: addressSchema,
  packageDetails: z.object({
    weight: z.number().positive('Weight must be positive').max(1000, 'Weight cannot exceed 1000 kg'),
    dimensions: z.object({
      length: z.number().positive('Length must be positive').max(300, 'Length cannot exceed 300 cm'),
      width: z.number().positive('Width must be positive').max(300, 'Width cannot exceed 300 cm'),
      height: z.number().positive('Height must be positive').max(300, 'Height cannot exceed 300 cm')
    }),
    description: z.string().min(5, 'Package description must be at least 5 characters').max(500, 'Description cannot exceed 500 characters'),
    value: z.number().positive('Package value must be positive').max(100000, 'Package value cannot exceed $100,000'),
    fragile: z.boolean().optional(),
    hazardous: z.boolean().optional()
  }),
  serviceType: z.enum(['standard', 'express', 'overnight', 'economy'], {
    message: 'Please select a valid service type'
  }),
  insuranceValue: z.number().min(0, 'Insurance value cannot be negative').max(100000, 'Insurance value cannot exceed $100,000').optional(),
  specialInstructions: z.string().max(1000, 'Special instructions cannot exceed 1000 characters').optional(),
  pickupDate: z.date().min(new Date(), 'Pickup date cannot be in the past'),
  deliveryDate: z.date().optional()
}).refine(data => {
  if (data.deliveryDate && data.pickupDate) {
    return data.deliveryDate >= data.pickupDate
  }
  return true
}, {
  message: 'Delivery date must be after pickup date',
  path: ['deliveryDate']
})

export const shipmentUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'cancelled'], {
    message: 'Please select a valid status'
  }),
  location: z.string().min(2, 'Location must be at least 2 characters').max(200, 'Location cannot exceed 200 characters').optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  estimatedDelivery: z.date().optional(),
  actualDelivery: z.date().optional()
})

// Carrier validation schemas
export const carrierRegistrationSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(200, 'Company name cannot exceed 200 characters'),
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema,
  businessLicense: z.string().min(5, 'Business license number must be at least 5 characters').max(50, 'Business license cannot exceed 50 characters'),
  insurancePolicy: z.string().min(5, 'Insurance policy number must be at least 5 characters').max(50, 'Insurance policy cannot exceed 50 characters'),
  vehicleTypes: z.array(z.string()).min(1, 'Please select at least one vehicle type'),
  serviceAreas: z.array(z.string()).min(1, 'Please select at least one service area'),
  specializations: z.array(z.string()).optional(),
  operatingHours: z.object({
    monday: z.object({ open: z.string(), close: z.string() }),
    tuesday: z.object({ open: z.string(), close: z.string() }),
    wednesday: z.object({ open: z.string(), close: z.string() }),
    thursday: z.object({ open: z.string(), close: z.string() }),
    friday: z.object({ open: z.string(), close: z.string() }),
    saturday: z.object({ open: z.string(), close: z.string() }),
    sunday: z.object({ open: z.string(), close: z.string() })
  }).optional()
})

// Payment validation schemas
export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive').max(100000, 'Amount cannot exceed $100,000'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe'], {
    message: 'Please select a valid payment method'
  }),
  cardDetails: z.object({
    number: z.string().regex(/^\d{13,19}$/, 'Please enter a valid card number'),
    expiryMonth: z.number().min(1, 'Invalid month').max(12, 'Invalid month'),
    expiryYear: z.number().min(new Date().getFullYear(), 'Card has expired'),
    cvv: z.string().regex(/^\d{3,4}$/, 'Please enter a valid CVV'),
    holderName: z.string().min(2, 'Cardholder name must be at least 2 characters').max(100, 'Cardholder name cannot exceed 100 characters')
  }).optional(),
  billingAddress: addressSchema.optional()
})

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.enum(['general', 'support', 'billing', 'partnership', 'feedback'], {
    message: 'Please select a valid subject'
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters'),
  priority: z.enum(['low', 'medium', 'high']).optional()
})

// Search validation schemas
export const carrierSearchSchema = z.object({
  query: z.string().max(200, 'Search query cannot exceed 200 characters').optional(),
  serviceAreas: z.array(z.string()).optional(),
  vehicleTypes: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  priceRange: z.array(z.enum(['budget', 'standard', 'premium'])).optional(),
  minRating: z.number().min(0, 'Rating cannot be negative').max(5, 'Rating cannot exceed 5').optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(['rating', 'name', 'totalShipments', 'joinedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

// File upload validation
export const fileUploadSchema = z.object({
  files: z.array(z.object({
    name: z.string().min(1, 'File name is required'),
    size: z.number().max(10 * 1024 * 1024, 'File size cannot exceed 10MB'),
    type: z.string().refine(type => {
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
      return allowedTypes.includes(type)
    }, 'File type not supported')
  })).max(5, 'Cannot upload more than 5 files at once')
})

// Chat message validation
export const chatMessageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(2000, 'Message cannot exceed 2000 characters'),
  type: z.enum(['text', 'image', 'file']).optional(),
  fileUrl: z.string().url('Invalid file URL').optional(),
  fileName: z.string().optional()
})

// Notification validation
export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message cannot exceed 1000 characters'),
  type: z.enum(['shipment_update', 'carrier_confirmation', 'payment_received', 'system_alert']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  channels: z.array(z.enum(['email', 'sms', 'push'])).min(1, 'At least one notification channel is required')
})

// Validation helper functions
export function validateField<T>(schema: z.ZodSchema<T>, value: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const result = schema.parse(value)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Validation failed' }
    }
    return { success: false, error: 'Unknown validation error' }
  }
}

export function getFieldErrors<T>(schema: z.ZodSchema<T>, value: unknown): Record<string, string> {
  try {
    schema.parse(value)
    return {}
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.map((err: any) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return errors
    }
    return {}
  }
}

export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

export function isValidPhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success
}

export function isValidTrackingNumber(trackingNumber: string): boolean {
  return trackingNumberSchema.safeParse(trackingNumber).success
}

// Custom validation rules
export const customValidators = {
  // Check if date is in business hours
  isBusinessHours: (date: Date): boolean => {
    const hour = date.getHours()
    const day = date.getDay()
    return day >= 1 && day <= 5 && hour >= 9 && hour <= 17
  },

  // Check if pickup date is valid (not weekend, not holiday)
  isValidPickupDate: (date: Date): boolean => {
    const day = date.getDay()
    return day !== 0 && day !== 6 // Not Sunday or Saturday
  },

  // Check if password is strong
  isStrongPassword: (password: string): boolean => {
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    return password.length >= 8 && hasUppercase && hasLowercase && hasNumbers && hasSpecialChar
  },

  // Check if file is image
  isImageFile: (file: File): boolean => {
    return file.type.startsWith('image/')
  },

  // Check if file is document
  isDocumentFile: (file: File): boolean => {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    return documentTypes.includes(file.type)
  }
}

// Form validation hook
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (data: unknown): { success: boolean; data?: T; errors: Record<string, string> } => {
    const fieldErrors = getFieldErrors(schema, data)
    setErrors(fieldErrors)
    
    if (Object.keys(fieldErrors).length === 0) {
      return { success: true, data: data as T, errors: {} }
    }
    
    return { success: false, errors: fieldErrors }
  }

  const clearErrors = () => setErrors({})
  
  const clearFieldError = (field: string) => {
    setErrors((prev: Record<string, string>) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  return {
    errors,
    validate,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0
  }
}

export default {
  emailSchema,
  phoneSchema,
  passwordSchema,
  trackingNumberSchema,
  userRegistrationSchema,
  userLoginSchema,
  userProfileSchema,
  addressSchema,
  shipmentCreationSchema,
  shipmentUpdateSchema,
  carrierRegistrationSchema,
  paymentSchema,
  contactFormSchema,
  carrierSearchSchema,
  fileUploadSchema,
  chatMessageSchema,
  notificationSchema,
  validateField,
  getFieldErrors,
  isValidEmail,
  isValidPhone,
  isValidTrackingNumber,
  customValidators,
  useFormValidation
}
