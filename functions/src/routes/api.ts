import express from 'express';
// import { requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { carrierService } from '../services/carrierService';
import { shipmentService } from '../services/shipmentService';
import { ApiResponse } from '../types';
import Joi from 'joi';

const router = express.Router();

// Rate calculation schema
const rateCalculationSchema = Joi.object({
  origin: Joi.string().required().description('Origin location (city, country)'),
  destination: Joi.string().required().description('Destination location (city, country)'),
  weight: Joi.number().positive().required().description('Package weight in kg'),
  dimensions: Joi.string().optional().description('Package dimensions (LxWxH in cm)'),
  transport_mode: Joi.string().valid('air', 'sea', 'road').optional().description('Preferred transport mode'),
  package_type: Joi.string().valid('standard', 'fragile', 'hazardous', 'perishable').default('standard'),
  insurance_required: Joi.boolean().default(false),
  pickup_required: Joi.boolean().default(true)
});

// Shipment creation schema
const shipmentCreationSchema = Joi.object({
  carrier_id: Joi.string().required().description('Selected carrier ID'),
  origin: Joi.string().required().description('Origin location'),
  destination: Joi.string().required().description('Destination location'),
  weight: Joi.number().positive().required().description('Package weight in kg'),
  dimensions: Joi.string().optional().description('Package dimensions'),
  description: Joi.string().optional().description('Package description'),
  pickup_address: Joi.string().required().description('Pickup address'),
  delivery_address: Joi.string().required().description('Delivery address'),
  contact_info: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required()
  }).required().description('Contact information'),
  declared_value: Joi.number().positive().optional().description('Declared package value'),
  special_instructions: Joi.string().optional().description('Special handling instructions'),
  preferred_pickup_time: Joi.string().optional().description('Preferred pickup time'),
  insurance_required: Joi.boolean().default(false)
});

// API Key authentication middleware
const authenticateApiKey = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Missing or invalid API key. Please provide a valid Bearer token.'
      });
      return;
    }

    const apiKey = authHeader.substring(7);
    
    // In production, validate against stored API keys in database
    // For now, we'll use a simple validation
    if (!apiKey || apiKey.length < 32) {
      res.status(401).json({
        success: false,
        error: 'Invalid API key format'
      });
      return;
    }

    // Store API key info for later use
    req.apiKey = apiKey;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * GET /api/v1/rates
 * Get available carriers and rates for a shipment
 */
router.get('/v1/rates', 
  authenticateApiKey,
  validateRequest({ query: rateCalculationSchema }),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { origin, destination, weight, dimensions, transport_mode, package_type, insurance_required, pickup_required } = req.query;

      // Calculate distance and base rates
      const distance = calculateDistance(origin as string, destination as string);
      const availableCarriers = await carrierService.findAvailableCarriers({
        origin: origin as string,
        destination: destination as string,
        transportMode: transport_mode as string,
        weight: Number(weight)
      });

      const carriersWithRates = availableCarriers.map(carrier => {
        const baseRate = calculateShippingRate({
          carrier,
          distance,
          weight: Number(weight),
          dimensions: dimensions as string,
          packageType: package_type as string,
          insuranceRequired: Boolean(insurance_required),
          pickupRequired: Boolean(pickup_required)
        });

        return {
          id: carrier.id,
          name: carrier.companyName,
          rating: carrier.rating || 4.5,
          price_per_kg: baseRate.pricePerKg,
          total_cost: baseRate.totalCost,
          delivery_time: baseRate.estimatedDeliveryTime,
          transport_modes: carrier.transportModes || ['road'],
          services: ['pickup', 'delivery'],
          insurance_available: !!carrier.insuranceNumber,
          tracking_available: true,
          currency: 'USD'
        };
      });

      const response: ApiResponse = {
        success: true,
        data: {
          carriers: carriersWithRates,
          total_carriers: carriersWithRates.length,
          origin,
          destination,
          weight: Number(weight),
          estimated_distance_km: distance
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Rate calculation error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to calculate shipping rates'
      };
      res.status(500).json(response);
    }
  }
);

/**
 * POST /api/v1/shipments
 * Create a new shipment request
 */
router.post('/v1/shipments',
  authenticateApiKey,
  validateRequest({ body: shipmentCreationSchema }),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const shipmentData = req.body;

      // Verify carrier exists and is available
      const carrier = await carrierService.getCarrierById(shipmentData.carrier_id);
      if (!carrier) {
        const response: ApiResponse = {
          success: false,
          error: 'Selected carrier not found or unavailable'
        };
        res.status(400).json(response);
        return;
      }

      // Calculate final pricing
      const distance = calculateDistance(shipmentData.origin, shipmentData.destination);
      const pricing = calculateShippingRate({
        carrier,
        distance,
        weight: shipmentData.weight,
        dimensions: shipmentData.dimensions,
        packageType: 'standard',
        insuranceRequired: shipmentData.insurance_required,
        pickupRequired: true
      });

      // Create shipment
      const shipment = await shipmentService.createShipment({
        userId: 'api_user', // For API users, we'll use a special identifier
        carrierId: shipmentData.carrier_id,
        originAddress: shipmentData.pickup_address,
        destinationAddress: shipmentData.delivery_address,
        packageWeight: shipmentData.weight,
        packageDimensions: shipmentData.dimensions,
        packageDescription: shipmentData.description,
        declaredValue: shipmentData.declared_value || pricing.totalCost,
        totalCost: pricing.totalCost,
        currency: 'USD',
        // Note: contactInfo and other fields removed as they don't exist in Shipment interface
      });

      const response: ApiResponse = {
        success: true,
        data: {
          shipment_id: shipment.id,
          tracking_number: shipment.trackingNumber,
          status: shipment.status,
          carrier: {
            id: carrier.id,
            name: carrier.companyName,
            contact: carrier.phone
          },
          estimated_delivery: calculateEstimatedDelivery(pricing.estimatedDeliveryTime),
          total_cost: pricing.totalCost,
          currency: 'USD',
          pickup_address: shipmentData.pickup_address,
          delivery_address: shipmentData.delivery_address,
          created_at: shipment.createdAt
        }
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Shipment creation error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create shipment'
      };
      res.status(500).json(response);
    }
  }
);

/**
 * GET /api/v1/tracking/{tracking_number}
 * Get shipment tracking information
 */
router.get('/v1/tracking/:tracking_number',
  authenticateApiKey,
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { tracking_number } = req.params;

      const shipment = await shipmentService.getShipmentByTrackingNumber(tracking_number);
      if (!shipment) {
        const response: ApiResponse = {
          success: false,
          error: 'Shipment not found'
        };
        res.status(404).json(response);
        return;
      }

      // Get carrier information
      const carrier = await carrierService.getCarrierById(shipment.carrierId || '');

      // Get tracking timeline
      const timeline = await shipmentService.getShipmentTimeline(shipment.id || '');

      const response: ApiResponse = {
        success: true,
        data: {
          tracking_number: shipment.trackingNumber,
          status: shipment.status,
          carrier: carrier?.companyName || 'Unknown Carrier',
          origin: shipment.originAddress,
          destination: shipment.destinationAddress,
          estimated_delivery: shipment.estimatedDelivery,
          current_location: timeline[0]?.location || shipment.originAddress,
          timeline: timeline.map(event => ({
            status: event.status,
            location: event.location,
            timestamp: event.createdAt,
            description: event.notes
          })),
          package_info: {
            weight: shipment.packageWeight,
            dimensions: shipment.packageDimensions,
            description: shipment.packageDescription
          }
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Tracking error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch tracking information'
      };
      res.status(500).json(response);
    }
  }
);

/**
 * GET /api/v1/carriers
 * Get list of available carriers with their capabilities
 */
router.get('/v1/carriers',
  authenticateApiKey,
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { country, transport_mode, service_area } = req.query;

      const filters: any = {};
      if (country) filters.country = country;
      if (transport_mode) filters.transportMode = transport_mode;
      if (service_area) filters.serviceArea = service_area;

      const carriers = await carrierService.getCarriers(filters);

      const carriersData = carriers.map(carrier => ({
        id: carrier.id,
        name: carrier.companyName,
        rating: carrier.rating || 4.5,
        service_areas: carrier.serviceAreas || [],
        transport_modes: carrier.transportModes || ['road'],
        services: ['pickup', 'delivery'],
        insurance_available: !!carrier.insuranceNumber,
        verified: carrier.verificationStatus === 'verified',
        contact: {
          phone: carrier.phone,
          email: carrier.email
        }
      }));

      const response: ApiResponse = {
        success: true,
        data: {
          carriers: carriersData,
          total_count: carriersData.length
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Carriers fetch error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch carriers'
      };
      res.status(500).json(response);
    }
  }
);

/**
 * POST /api/v1/webhooks/shipment-status
 * Webhook for receiving shipment status updates from carriers
 */
router.post('/v1/webhooks/shipment-status',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { tracking_number, status } = req.body;

      if (!tracking_number || !status) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: tracking_number, status'
        });
        return;
      }

      // Update shipment status
      await shipmentService.updateShipmentStatus(tracking_number, status);

      res.json({
        success: true,
        message: 'Status updated successfully'
      });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process webhook'
      });
    }
  }
);

// Helper functions
function calculateDistance(origin: string, destination: string): number {
  // Simplified distance calculation - in production, use proper geolocation API
  const cityDistances: { [key: string]: number } = {
    'Lagos-Abuja': 750,
    'Lagos-Kano': 1050,
    'Abuja-Kano': 350,
    'Lagos-Port Harcourt': 500,
    'Abuja-Port Harcourt': 600
  };

  const key = `${origin.split(',')[0]}-${destination.split(',')[0]}`;
  return cityDistances[key] || cityDistances[key.split('-').reverse().join('-')] || 500;
}

function calculateShippingRate(params: {
  carrier: any;
  distance: number;
  weight: number;
  dimensions?: string;
  packageType: string;
  insuranceRequired: boolean;
  pickupRequired: boolean;
}): {
  pricePerKg: number;
  totalCost: number;
  estimatedDeliveryTime: string;
} {
  const { distance, weight, packageType, insuranceRequired, pickupRequired } = params;

  // Base rate calculation
  let baseRatePerKg = 2.0; // Base rate per kg
  
  // Distance multiplier
  const distanceMultiplier = Math.max(1, distance / 500);
  
  // Package type multiplier
  const packageMultipliers: { [key: string]: number } = {
    standard: 1.0,
    fragile: 1.3,
    hazardous: 1.8,
    perishable: 1.5
  };

  const pricePerKg = baseRatePerKg * distanceMultiplier * (packageMultipliers[packageType] || 1.0);
  let totalCost = pricePerKg * weight;

  // Additional services
  if (insuranceRequired) totalCost += totalCost * 0.02; // 2% insurance fee
  if (pickupRequired) totalCost += 10; // Fixed pickup fee

  // Delivery time estimation
  const baseDeliveryDays = Math.ceil(distance / 300); // Assume 300km per day
  const estimatedDeliveryTime = `${baseDeliveryDays}-${baseDeliveryDays + 1} days`;

  return {
    pricePerKg: Math.round(pricePerKg * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    estimatedDeliveryTime
  };
}

function calculateEstimatedDelivery(deliveryTime: string): string {
  const days = parseInt(deliveryTime.split('-')[0]);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate.toISOString().split('T')[0];
}

export default router;
