import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { carrierCreateSchema, carrierUpdateSchema, carrierRouteSchema } from '../validation/schemas';
import { carrierService } from '../services/carrierService';
import { ApiResponse, Carrier, CarrierRoute } from '../types';

const router = Router();

// Create new carrier (Admin only)
router.post('/', authenticateToken, requireRole(['admin']), validateRequest(carrierCreateSchema), async (req, res) => {
  try {
    const carrierData = req.body;
    const carrier = await carrierService.createCarrier(carrierData);

    const response: ApiResponse<Carrier> = {
      success: true,
      data: {
        id: carrier.id,
        userId: carrier.userId,
        name: carrier.name,
        email: carrier.email,
        phone: carrier.phone,
        address: carrier.address,
        companyName: carrier.companyName,
        businessLicense: carrier.businessLicense,
        insuranceNumber: carrier.insuranceNumber,
        transportModes: carrier.transportModes,
        serviceAreas: carrier.serviceAreas,
        basePricePerKg: carrier.basePricePerKg,
        maxWeightCapacity: carrier.maxWeightCapacity,
        rating: carrier.rating,
        totalReviews: carrier.totalReviews,
        totalDeliveries: carrier.totalDeliveries,
        verificationStatus: carrier.verificationStatus,
        isVerified: carrier.isVerified,
        isActive: carrier.isActive,
        isAvailable: carrier.isAvailable,
        createdAt: carrier.createdAt,
        updatedAt: carrier.updatedAt,
      },
      message: 'Carrier created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create carrier',
    };
    res.status(500).json(response);
  }
});

// Get carrier profile (Carrier only)
router.get('/profile', authenticateToken, requireRole(['carrier']), async (req, res): Promise<void> => {
  try {
    const carrier = await carrierService.getCarrierById(req.user.uid);

    if (!carrier) {
      const response: ApiResponse = {
        success: false,
        error: 'Carrier not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Carrier> = {
      success: true,
      data: {
        id: carrier.id,
        userId: carrier.userId,
        name: carrier.name,
        email: carrier.email,
        phone: carrier.phone,
        address: carrier.address,
        companyName: carrier.companyName,
        businessLicense: carrier.businessLicense,
        insuranceNumber: carrier.insuranceNumber,
        transportModes: carrier.transportModes,
        serviceAreas: carrier.serviceAreas,
        basePricePerKg: carrier.basePricePerKg,
        maxWeightCapacity: carrier.maxWeightCapacity,
        rating: carrier.rating,
        totalReviews: carrier.totalReviews,
        totalDeliveries: carrier.totalDeliveries,
        verificationStatus: carrier.verificationStatus,
        isVerified: carrier.isVerified,
        isActive: carrier.isActive,
        isAvailable: carrier.isAvailable,
        createdAt: carrier.createdAt,
        updatedAt: carrier.updatedAt,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch carrier profile',
    };
    res.status(500).json(response);
  }
});

// Update carrier profile (Carrier only)
router.put('/profile', authenticateToken, requireRole(['carrier']), validateRequest(carrierUpdateSchema), async (req, res) => {
  try {
    const updateData = req.body;
    const updatedCarrier = await carrierService.updateCarrier(req.user.uid, updateData);

    const response: ApiResponse<Carrier> = {
      success: true,
      data: {
        id: updatedCarrier.id,
        userId: updatedCarrier.userId,
        name: updatedCarrier.name,
        email: updatedCarrier.email,
        phone: updatedCarrier.phone,
        address: updatedCarrier.address,
        companyName: updatedCarrier.companyName,
        businessLicense: updatedCarrier.businessLicense,
        insuranceNumber: updatedCarrier.insuranceNumber,
        transportModes: updatedCarrier.transportModes,
        serviceAreas: updatedCarrier.serviceAreas,
        basePricePerKg: updatedCarrier.basePricePerKg,
        maxWeightCapacity: updatedCarrier.maxWeightCapacity,
        rating: updatedCarrier.rating,
        totalReviews: updatedCarrier.totalReviews,
        totalDeliveries: updatedCarrier.totalDeliveries,
        verificationStatus: updatedCarrier.verificationStatus,
        isVerified: updatedCarrier.isVerified,
        isActive: updatedCarrier.isActive,
        isAvailable: updatedCarrier.isAvailable,
        createdAt: updatedCarrier.createdAt,
        updatedAt: updatedCarrier.updatedAt,
      },
      message: 'Carrier profile updated successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update carrier profile',
    };
    res.status(500).json(response);
  }
});

// Get all carriers (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const carriers = await carrierService.listCarriers();

    const response: ApiResponse<Carrier[]> = {
      success: true,
      data: carriers.map(carrier => ({
        id: carrier.id,
        userId: carrier.userId,
        name: carrier.name,
        email: carrier.email,
        phone: carrier.phone,
        address: carrier.address,
        companyName: carrier.companyName,
        businessLicense: carrier.businessLicense,
        insuranceNumber: carrier.insuranceNumber,
        transportModes: carrier.transportModes,
        serviceAreas: carrier.serviceAreas,
        basePricePerKg: carrier.basePricePerKg,
        maxWeightCapacity: carrier.maxWeightCapacity,
        rating: carrier.rating,
        totalReviews: carrier.totalReviews,
        totalDeliveries: carrier.totalDeliveries,
        verificationStatus: carrier.verificationStatus,
        isVerified: carrier.isVerified,
        isActive: carrier.isActive,
        isAvailable: carrier.isAvailable,
        createdAt: carrier.createdAt,
        updatedAt: carrier.updatedAt,
      })),
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch carriers',
    };
    res.status(500).json(response);
  }
});

// Get specific carrier (Admin only)
router.get('/:carrierId', authenticateToken, requireRole(['admin']), async (req, res): Promise<void> => {
  try {
    const { carrierId } = req.params;
    const carrier = await carrierService.getCarrierById(carrierId);

    if (!carrier) {
      const response: ApiResponse = {
        success: false,
        error: 'Carrier not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Carrier> = {
      success: true,
      data: {
        id: carrier.id,
        userId: carrier.userId,
        name: carrier.name,
        email: carrier.email,
        phone: carrier.phone,
        address: carrier.address,
        companyName: carrier.companyName,
        businessLicense: carrier.businessLicense,
        insuranceNumber: carrier.insuranceNumber,
        transportModes: carrier.transportModes,
        serviceAreas: carrier.serviceAreas,
        basePricePerKg: carrier.basePricePerKg,
        maxWeightCapacity: carrier.maxWeightCapacity,
        rating: carrier.rating,
        totalReviews: carrier.totalReviews,
        totalDeliveries: carrier.totalDeliveries,
        verificationStatus: carrier.verificationStatus,
        isVerified: carrier.isVerified,
        isActive: carrier.isActive,
        isAvailable: carrier.isAvailable,
        createdAt: carrier.createdAt,
        updatedAt: carrier.updatedAt,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch carrier',
    };
    res.status(500).json(response);
  }
});

// Verify carrier (Admin only)
router.post('/:carrierId/verify', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { carrierId } = req.params;
    const verifiedCarrier = await carrierService.verifyCarrier(carrierId);

    const response: ApiResponse<Carrier> = {
      success: true,
      data: {
        id: verifiedCarrier.id,
        userId: verifiedCarrier.userId,
        name: verifiedCarrier.name,
        email: verifiedCarrier.email,
        phone: verifiedCarrier.phone,
        address: verifiedCarrier.address,
        companyName: verifiedCarrier.companyName,
        businessLicense: verifiedCarrier.businessLicense,
        insuranceNumber: verifiedCarrier.insuranceNumber,
        transportModes: verifiedCarrier.transportModes,
        serviceAreas: verifiedCarrier.serviceAreas,
        basePricePerKg: verifiedCarrier.basePricePerKg,
        maxWeightCapacity: verifiedCarrier.maxWeightCapacity,
        rating: verifiedCarrier.rating,
        totalReviews: verifiedCarrier.totalReviews,
        totalDeliveries: verifiedCarrier.totalDeliveries,
        verificationStatus: verifiedCarrier.verificationStatus,
        isVerified: verifiedCarrier.isVerified,
        isActive: verifiedCarrier.isActive,
        isAvailable: verifiedCarrier.isAvailable,
        createdAt: verifiedCarrier.createdAt,
        updatedAt: verifiedCarrier.updatedAt,
      },
      message: 'Carrier verified successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to verify carrier',
    };
    res.status(500).json(response);
  }
});

// Create carrier route (Carrier only)
router.post('/routes', authenticateToken, requireRole(['carrier']), validateRequest(carrierRouteSchema), async (req, res) => {
  try {
    const routeData = { ...req.body, carrierId: req.user.uid };
    const route = await carrierService.createRoute(routeData);

    const response: ApiResponse<CarrierRoute> = {
      success: true,
      data: {
        id: route.id,
        carrierId: route.carrierId,
        origin: route.origin,
        destination: route.destination,
        transportMode: route.transportMode,
        price: route.price,
        pricePerKg: route.pricePerKg,
        frequency: route.frequency,
        estimatedDays: route.estimatedDays,
        isActive: route.isActive,
        createdAt: route.createdAt,
        updatedAt: route.updatedAt,
      },
      message: 'Route created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create route',
    };
    res.status(500).json(response);
  }
});

// Get carrier routes (Carrier only)
router.get('/routes', authenticateToken, requireRole(['carrier']), async (req, res) => {
  try {
    const routes = await carrierService.getRoutesByCarrier(req.user.uid);

    const response: ApiResponse<CarrierRoute[]> = {
      success: true,
      data: routes.map(route => ({
        id: route.id,
        carrierId: route.carrierId,
        origin: route.origin,
        destination: route.destination,
        transportMode: route.transportMode,
        price: route.price,
        pricePerKg: route.pricePerKg,
        frequency: route.frequency,
        estimatedDays: route.estimatedDays,
        isActive: route.isActive,
        createdAt: route.createdAt,
        updatedAt: route.updatedAt,
      })),
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch routes',
    };
    res.status(500).json(response);
  }
});

// Update carrier route (Carrier only)
router.put('/routes/:routeId', authenticateToken, requireRole(['carrier']), validateRequest(carrierRouteSchema), async (req, res) => {
  try {
    const { routeId } = req.params;
    const updateData = req.body;
    const updatedRoute = await carrierService.updateRoute(routeId, updateData);

    const response: ApiResponse<CarrierRoute> = {
      success: true,
      data: {
        id: updatedRoute.id,
        carrierId: updatedRoute.carrierId,
        origin: updatedRoute.origin,
        destination: updatedRoute.destination,
        transportMode: updatedRoute.transportMode,
        price: updatedRoute.price,
        pricePerKg: updatedRoute.pricePerKg,
        frequency: updatedRoute.frequency,
        estimatedDays: updatedRoute.estimatedDays,
        isActive: updatedRoute.isActive,
        createdAt: updatedRoute.createdAt,
        updatedAt: updatedRoute.updatedAt,
      },
      message: 'Route updated successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update route',
    };
    res.status(500).json(response);
  }
});

// Delete carrier route (Carrier only)
router.delete('/routes/:routeId', authenticateToken, requireRole(['carrier']), async (req, res) => {
  try {
    const { routeId } = req.params;
    await carrierService.deleteRoute(routeId);

    const response: ApiResponse = {
      success: true,
      message: 'Route deleted successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete route',
    };
    res.status(500).json(response);
  }
});

// Get carrier analytics (Carrier only)
router.get('/analytics', authenticateToken, requireRole(['carrier']), async (req, res) => {
  try {
    const analytics = await carrierService.getCarrierAnalytics(req.user.uid);

    const response: ApiResponse = {
      success: true,
      data: analytics,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch analytics',
    };
    res.status(500).json(response);
  }
});

export default router;