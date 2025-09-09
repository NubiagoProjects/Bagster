import * as Joi from 'joi';

// Basic validation schemas
export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  userType: Joi.string().valid('client', 'carrier', 'supplier').required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional(),
  companyName: Joi.string().when('userType', {
    is: Joi.string().valid('carrier', 'supplier'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  businessLicense: Joi.string().when('userType', {
    is: 'carrier',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional(),
  companyName: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).optional(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const carrierCreateSchema = Joi.object({
  companyName: Joi.string().min(2).max(100).required(),
  businessLicense: Joi.string().required(),
  insuranceNumber: Joi.string().optional(),
  transportModes: Joi.array().items(Joi.string().valid('air', 'sea', 'road')).min(1).required(),
  serviceAreas: Joi.object({
    countries: Joi.array().items(Joi.string()).min(1).required(),
    cities: Joi.array().items(Joi.string()).optional(),
  }).required(),
  basePricePerKg: Joi.number().positive().required(),
  maxWeightCapacity: Joi.number().positive().required(),
});

export const carrierUpdateSchema = Joi.object({
  companyName: Joi.string().min(2).max(100).optional(),
  businessLicense: Joi.string().optional(),
  insuranceNumber: Joi.string().optional(),
  transportModes: Joi.array().items(Joi.string().valid('air', 'sea', 'road')).optional(),
  serviceAreas: Joi.object({
    countries: Joi.array().items(Joi.string()).optional(),
    cities: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  basePricePerKg: Joi.number().positive().optional(),
  maxWeightCapacity: Joi.number().positive().optional(),
  isAvailable: Joi.boolean().optional(),
});

export const carrierSearchSchema = Joi.object({
  countries: Joi.array().items(Joi.string()).optional(),
  cities: Joi.array().items(Joi.string()).optional(),
  transportModes: Joi.array().items(Joi.string().valid('air', 'sea', 'road')).optional(),
  maxPrice: Joi.number().positive().optional(),
  minRating: Joi.number().min(0).max(5).optional(),
  isAvailable: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const carrierRouteSchema = Joi.object({
  origin: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).required(),
  destination: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).required(),
  transportMode: Joi.string().valid('air', 'sea', 'road').required(),
  pricePerKg: Joi.number().positive().required(),
  estimatedDays: Joi.number().integer().positive().required(),
});

export const shipmentCreateSchema = Joi.object({
  carrierId: Joi.string().optional(),
  supplierId: Joi.string().optional(),
  originAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).required(),
  destinationAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).required(),
  packageWeight: Joi.number().positive().required(),
  packageDimensions: Joi.object({
    length: Joi.number().positive().required(),
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    unit: Joi.string().valid('cm', 'in').required(),
  }).optional(),
  packageDescription: Joi.string().max(500).optional(),
  declaredValue: Joi.number().positive().optional(),
  nubiagoOrderId: Joi.string().optional(),
});

export const shipmentUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'cancelled').optional(),
  estimatedDelivery: Joi.date().optional(),
  actualDelivery: Joi.date().optional(),
  notes: Joi.string().max(1000).optional(),
});

export const shipmentFiltersSchema = Joi.object({
  status: Joi.array().items(Joi.string().valid('pending', 'confirmed', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'cancelled')).optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  carrierId: Joi.string().optional(),
  clientId: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const trackingUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'cancelled').required(),
  location: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).optional(),
  notes: Joi.string().max(500).optional(),
});

export const nubiagoQuoteSchema = Joi.object({
  origin: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).required(),
  destination: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).required(),
  weight: Joi.number().positive().required(),
  dimensions: Joi.object({
    length: Joi.number().positive().required(),
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    unit: Joi.string().valid('cm', 'in').required(),
  }).optional(),
  declaredValue: Joi.number().positive().optional(),
  priority: Joi.string().valid('standard', 'express', 'economy').default('standard'),
});

export const nubiagoShipmentSchema = Joi.object({
  orderId: Joi.string().required(),
  carrierId: Joi.string().required(),
  origin: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).required(),
  destination: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional(),
    country: Joi.string().required(),
    postalCode: Joi.string().optional(),
  }).required(),
  weight: Joi.number().positive().required(),
  dimensions: Joi.object({
    length: Joi.number().positive().required(),
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    unit: Joi.string().valid('cm', 'in').required(),
  }).optional(),
  declaredValue: Joi.number().positive().optional(),
  customerInfo: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  }).required(),
  priority: Joi.string().valid('standard', 'express', 'economy').default('standard'),
});

export const paymentIntentSchema = Joi.object({
  shipmentId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().valid('USD', 'EUR', 'NGN', 'KES').default('USD'),
  paymentMethod: Joi.string().optional(),
});

export const notificationSchema = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string().valid('shipment_update', 'carrier_confirmation', 'payment_received', 'system_alert').required(),
  title: Joi.string().max(100).required(),
  message: Joi.string().max(500).required(),
  data: Joi.object().optional(),
});

export const fileUploadSchema = Joi.object({
  fileType: Joi.string().valid('avatar', 'document', 'photo').required(),
  fileName: Joi.string().required(),
  fileSize: Joi.number().positive().max(10 * 1024 * 1024).required(), // 10MB max
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const searchSchema = Joi.object({
  query: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid('users', 'carriers', 'shipments').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const analyticsFiltersSchema = Joi.object({
  period: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').default('monthly'),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  userType: Joi.string().valid('client', 'carrier', 'supplier', 'admin').optional(),
  status: Joi.string().valid('pending', 'confirmed', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'cancelled').optional(),
});