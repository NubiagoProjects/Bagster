"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = exports.userIdSchema = exports.carrierIdSchema = exports.shipmentIdSchema = exports.trackingNumberSchema = exports.idParamSchema = exports.validateParams = exports.validateQuery = exports.validateRequest = void 0;
const Joi = __importStar(require("joi"));
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            const response = {
                success: false,
                error: 'Validation failed',
                message: errorMessage,
            };
            res.status(400).json(response);
            return;
        }
        // Replace req.body with validated data
        req.body = value;
        next();
    };
};
exports.validateRequest = validateRequest;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            const response = {
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
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        const paramSchema = Joi.object(schema);
        const { error, value } = paramSchema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            const response = {
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
exports.validateParams = validateParams;
// Common parameter schemas
exports.idParamSchema = Joi.object({
    id: Joi.string().required(),
});
exports.trackingNumberSchema = Joi.object({
    trackingNumber: Joi.string().required(),
});
exports.shipmentIdSchema = Joi.object({
    shipmentId: Joi.string().required(),
});
exports.carrierIdSchema = Joi.object({
    carrierId: Joi.string().required(),
});
exports.userIdSchema = Joi.object({
    userId: Joi.string().required(),
});
// Error handler middleware
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    const response = {
        success: false,
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred',
    };
    res.status(500).json(response);
};
exports.errorHandler = errorHandler;
// Not found middleware
const notFound = (req, res) => {
    const response = {
        success: false,
        error: 'Not found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
    };
    res.status(404).json(response);
};
exports.notFound = notFound;
//# sourceMappingURL=validation.js.map