# Bagster Backend Functions

This directory contains the Firebase Functions backend for the Bagster logistics platform - a smart cargo logistics solution for Africa.

## 🚀 Overview

The Bagster backend provides a comprehensive REST API for managing:
- User authentication and management
- Carrier registration and verification
- Shipment creation and tracking
- Payment processing
- Real-time notifications
- Analytics and reporting

## 📁 Project Structure

```
functions/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Firebase configuration
│   ├── middleware/
│   │   ├── auth.ts              # Authentication middleware
│   │   └── validation.ts        # Request validation
│   ├── routes/
│   │   ├── users.ts             # User management routes
│   │   ├── carriers.ts          # Carrier routes
│   │   ├── shipments.ts         # Shipment routes
│   │   ├── tracking.ts          # Tracking routes
│   │   ├── payments.ts          # Payment routes
│   │   ├── notifications.ts     # Notification routes
│   │   └── analytics.ts         # Analytics routes
│   ├── services/
│   │   ├── userService.ts       # User business logic
│   │   ├── carrierService.ts    # Carrier business logic
│   │   ├── shipmentService.ts   # Shipment business logic
│   │   ├── paymentService.ts    # Payment business logic
│   │   ├── notificationService.ts # Notification logic
│   │   └── analyticsService.ts  # Analytics logic
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── index.ts                 # Main entry point
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── serviceAccountKey.json      # Firebase service account (template)
```

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js 18 or higher
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project created with Firestore enabled

### 2. Installation
```bash
cd functions
npm install
```

### 3. Firebase Configuration
1. Replace `serviceAccountKey.json` with your actual Firebase service account key
2. Update the project ID in `firebase.ts` if different from "bagster-d51eb"
3. Ensure Firestore is enabled in your Firebase project

### 4. Environment Setup
The backend uses Firebase Admin SDK with service account authentication. Make sure:
- Your service account has proper permissions
- Firestore security rules allow server-side access
- Storage bucket is configured if using file uploads

## 🚀 Development

### Build the project
```bash
npm run build
```

### Start local emulator
```bash
npm run serve
```

### Deploy to Firebase
```bash
npm run deploy
```

### Run linting
```bash
npm run lint
```

## 📡 API Endpoints

### Authentication
All protected routes require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Core Endpoints

#### Users
- `POST /api/users/register` - Register new user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - List users (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

#### Carriers
- `POST /api/carriers/register` - Register as carrier
- `GET /api/carriers` - Search carriers
- `GET /api/carriers/:id` - Get carrier details
- `PUT /api/carriers/:id/verify` - Verify carrier (Admin only)
- `POST /api/carriers/:id/routes` - Add carrier route
- `GET /api/carriers/:id/analytics` - Get carrier analytics

#### Shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments` - List user shipments
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id` - Update shipment
- `PUT /api/shipments/:id/status` - Update shipment status
- `DELETE /api/shipments/:id` - Cancel shipment

#### Tracking
- `GET /api/tracking/:trackingNumber` - Get tracking info
- `POST /api/tracking/:shipmentId/events` - Add tracking event
- `GET /track/:trackingNumber` - Public tracking (no auth required)

#### Payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/:id/refund` - Process refund
- `GET /api/payments/costs` - Calculate shipping costs

#### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/system-alert` - Send system alert (Admin)
- `POST /api/notifications/broadcast` - Broadcast to all users (Admin)

#### Analytics
- `GET /api/analytics/platform` - Platform analytics (Admin)
- `GET /api/analytics/carriers/:id` - Carrier analytics
- `GET /api/analytics/trends` - Shipment trends

### Public Endpoints
- `GET /health` - Health check
- `GET /api` - API documentation
- `GET /track/:trackingNumber` - Public shipment tracking

## 🔒 Security Features

- JWT-based authentication using Firebase Auth
- Role-based access control (client, carrier, admin)
- Request validation using Joi schemas
- Rate limiting middleware
- CORS configuration
- Security headers
- Input sanitization

## 📊 Business Logic Features

### User Management
- Multi-role user system (client, carrier, supplier, admin)
- User preferences and settings
- Profile management with verification status

### Carrier System
- Carrier registration and verification
- Route management
- Performance analytics
- Rating and review system

### Shipment Management
- Complete shipment lifecycle
- Real-time tracking with events
- Status updates and notifications
- Cost calculations

### Payment Processing
- Multiple payment methods (card, mobile money, bank transfer)
- Payment intent creation and processing
- Refund handling
- Cost calculations for shipping and insurance

### Notification System
- Multi-channel notifications (email, SMS, push)
- System alerts and broadcasts
- User preference management
- Delivery simulation

### Analytics
- Platform-wide metrics
- Carrier performance tracking
- Revenue and shipment trends
- Caching for performance

## 🗄️ Database Schema

The backend uses Firestore with the following collections:
- `users` - User profiles and authentication data
- `carriers` - Carrier information and verification status
- `shipments` - Shipment details and status
- `tracking` - Tracking events and history
- `notifications` - User notifications
- `analytics` - Cached analytics data

## 🔧 Configuration

### Firebase Configuration
Update `src/config/firebase.ts` with your project settings:
- Project ID
- Storage bucket
- Service account path

### Environment Variables
The following can be configured via environment variables:
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `STORAGE_BUCKET` - Firebase storage bucket
- `NODE_ENV` - Environment (development/production)

## 🚀 Deployment

### Prerequisites for Deployment
1. Firebase project with billing enabled
2. Firestore database created
3. Firebase Functions enabled
4. Service account key configured

### Deploy Steps
```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:api
```

### Production Considerations
- Enable Firebase App Check for security
- Configure Firestore security rules
- Set up monitoring and logging
- Configure backup strategies
- Implement proper error tracking

## 🧪 Testing

The backend includes comprehensive business logic for:
- ✅ User CRUD operations
- ✅ Carrier management and verification
- ✅ Shipment lifecycle management
- ✅ Payment processing simulation
- ✅ Notification delivery
- ✅ Analytics calculation
- ✅ Authentication and authorization

## 📝 API Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Email is required"
}
```

## 🔍 Monitoring and Logging

The backend includes:
- Request logging middleware
- Error tracking and reporting
- Performance monitoring
- Rate limiting logs
- Firebase Functions logs

Access logs via:
```bash
firebase functions:log
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Write comprehensive tests
5. Update documentation

## 📄 License

This project is part of the Bagster logistics platform.

---

For more information about the Bagster platform, visit our documentation or contact the development team.
