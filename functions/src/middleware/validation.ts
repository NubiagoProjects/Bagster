import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const validateRequest = (schemas: { query?: Joi.ObjectSchema; body?: Joi.ObjectSchema; params?: Joi.ObjectSchema } | Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    let error: Joi.ValidationError | undefined;
    
    // Handle both old format (direct schema for body) and new format (object with query/body/params)
    if (schemas && 'validate' in schemas && typeof schemas.validate === 'function') {
      // Old format - direct schema for body validation
      const result = (schemas as Joi.ObjectSchema).validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      error = result.error;
      if (result.value) {
        req.body = result.value;
      }
    } else {
      // New format - object with query/body/params schemas
      const schemaObj = schemas as { query?: Joi.ObjectSchema; body?: Joi.ObjectSchema; params?: Joi.ObjectSchema };
      
      if (schemaObj.query) {
        const result = schemaObj.query.validate(req.query, { abortEarly: false, stripUnknown: true });
        if (result.error) error = result.error;
        else if (result.value) req.query = result.value;
      }
      
      if (schemaObj.body && !error) {
        const result = schemaObj.body.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (result.error) error = result.error;
        else if (result.value) req.body = result.value;
      }
      
      if (schemaObj.params && !error) {
        const result = schemaObj.params.validate(req.params, { abortEarly: false, stripUnknown: true });
        if (result.error) error = result.error;
        else if (result.value) req.params = result.value;
      }
    }

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: errorMessage,
      };

      res.status(400).json(response);
      return;
    }

    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: errorMessage,
      };

      res.status(400).json(response);
      return;
    }

    // Replace req.query with validated data
    req.query = value;
    next();
  };
};

export const validateParams = (schema: Record<string, string>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const paramSchema = Joi.object(schema);
    const { error, value } = paramSchema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: errorMessage,
      };

      res.status(400).json(response);
      return;
    }

    // Replace req.params with validated data
    req.params = value;
    next();
  };
};

// Common parameter schemas
export const idParamSchema = Joi.object({
  id: Joi.string().required(),
});

export const trackingNumberSchema = Joi.object({
  trackingNumber: Joi.string().required(),
});

export const shipmentIdSchema = Joi.object({
  shipmentId: Joi.string().required(),
});

export const carrierIdSchema = Joi.object({
  carrierId: Joi.string().required(),
});

export const userIdSchema = Joi.object({
  userId: Joi.string().required(),
});

// Error handler middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  const response: ApiResponse = {
    success: false,
    error: 'Internal server error',
    message: error.message || 'An unexpected error occurred',
  };

  res.status(500).json(response);
};

// Not found middleware
export const notFound = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  };

  res.status(404).json(response);
};