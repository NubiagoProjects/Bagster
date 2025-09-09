# Bagster - Smart Cargo Logistics Platform

A comprehensive full-stack logistics platform connecting carriers, suppliers, and clients across Africa with intelligent matching, real-time tracking, and seamless e-commerce integration.

## 🌟 Overview

Bagster is a revolutionary logistics platform designed specifically for the African market, providing:
- **Smart Carrier Matching**: AI-powered algorithm to match shipments with optimal carriers
- **Real-time Tracking**: Complete visibility throughout the shipping journey
- **Multi-role Platform**: Support for clients, carriers, suppliers, and administrators
- **E-commerce Integration**: Seamless integration with platforms like NubiaGo
- **Mobile-first Design**: Responsive design optimized for African mobile usage patterns

## 🚀 Features

### Core Functionality
- **User Management**: Registration, authentication, and role-based access control
- **Carrier Management**: Profile creation, verification, route management, and analytics
- **Shipment Management**: Creation, tracking, status updates, and smart carrier matching
- **Real-time Tracking**: Comprehensive tracking system with status updates
- **NubiaGo Integration**: API endpoints for seamless e-commerce platform integration
- **Analytics Dashboard**: Comprehensive analytics for platform performance

### Technical Features
- **Firebase Firestore**: NoSQL database for real-time data
- **Firebase Authentication**: Secure user authentication and authorization
- **Firebase Functions**: Serverless backend with TypeScript
- **Firebase Storage**: File upload and management
- **Smart Matching Algorithm**: AI-powered carrier selection
- **Rate Limiting**: API protection and abuse prevention
- **Validation**: Comprehensive request validation with Joi
- **Error Handling**: Robust error handling and logging

## 🏗️ Architecture

### Database Structure
```
users/
├── {userId}/
    ├── profile
    ├── preferences
    └── verification

carriers/
├── {carrierId}/
    ├── routes/
    └── analytics

shipments/
├── {shipmentId}/
    └── tracking/
```

### API Endpoints

#### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Carriers
- `GET /api/carriers/search` - Search carriers (public)
- `POST /api/carriers` - Create carrier profile
- `GET /api/carriers/profile` - Get carrier profile
- `PUT /api/carriers/profile` - Update carrier profile
- `PUT /api/carriers/:carrierId/verify` - Verify carrier (admin)
- `GET /api/carriers/:carrierId/analytics` - Get carrier analytics

#### Shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments` - Get user shipments
- `GET /api/shipments/:shipmentId` - Get shipment details
- `PUT /api/shipments/:shipmentId` - Update shipment status
- `POST /api/shipments/matching` - Find matching carriers
- `POST /api/shipments/:shipmentId/tracking` - Add tracking event

#### Tracking
- `GET /api/tracking/:trackingNumber` - Get tracking by number (public)
- `GET /api/tracking/shipment/:shipmentId` - Get tracking for authenticated user

#### NubiaGo Integration
- `POST /api/nubiago/quote` - Get shipping quotes
- `POST /api/nubiago/shipment` - Create shipment from NubiaGo
- `GET /api/nubiago/tracking/:trackingNumber` - Get tracking for NubiaGo
- `POST /api/nubiago/webhook` - Handle NubiaGo webhooks

#### Analytics
- `GET /api/analytics/overview` - Platform overview (admin)
- `GET /api/analytics/users` - User analytics (admin)
- `GET /api/analytics/carriers` - Carrier analytics (admin)
- `GET /api/analytics/shipments` - Shipment analytics (admin)
- `GET /api/analytics/revenue` - Revenue analytics (admin)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- Firebase CLI
- Firebase project with Firestore, Authentication, and Functions enabled

### 1. Firebase Project Setup

1. **Create Firebase Project**
   ```bash
   firebase login
   firebase projects:create bagster-d51eb
   ```

2. **Enable Firebase Services**
   - Go to Firebase Console
   - Enable Firestore Database
   - Enable Authentication
   - Enable Functions
   - Enable Storage

3. **Get Service Account Key**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Replace `functions/serviceAccountKey.json` with your actual key

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 3. Environment Configuration

1. **Update Firebase Config**
   - Update `lib/firebase.ts` with your Firebase config
   - Update `functions/src/config/firebase.ts` with your project settings

2. **Set Environment Variables**
   ```bash
   # In Firebase Console > Functions > Configuration
   NODE_ENV=production
   ```

### 4. Deploy to Firebase

```bash
# Build the project
npm run build

# Deploy Firebase Functions
firebase deploy --only functions

# Deploy Firestore Rules
firebase deploy --only firestore:rules

# Deploy Storage Rules
firebase deploy --only storage

# Deploy everything
firebase deploy
```

### 5. Local Development

```bash
# Start Firebase emulators
firebase emulators:start

# In another terminal, start the frontend
npm run dev
```

## 🔧 Configuration

### Firebase Security Rules

The project includes comprehensive security rules for:
- **Firestore**: Role-based access control
- **Storage**: File upload permissions
- **Authentication**: User verification

### API Rate Limiting

- **Default**: 100 requests per minute per user
- **Configurable**: Modify in `functions/src/middleware/auth.ts`

### Validation Schemas

All API endpoints use Joi validation schemas located in:
- `functions/src/validation/schemas.ts`

## 📊 Smart Matching Algorithm

The carrier matching algorithm considers:
- **Rating** (40% weight)
- **Delivery Success Rate** (30% weight)
- **Price** (20% weight)
- **Experience** (10% weight)
- **Priority adjustments** for express/economy shipping

## 🔌 NubiaGo Integration

### API Endpoints
- **Quote Generation**: Real-time carrier matching
- **Shipment Creation**: Automated shipment setup
- **Tracking Updates**: Real-time status updates
- **Webhook Handling**: Event-driven updates

### Integration Flow
1. NubiaGo requests shipping quotes
2. Bagster returns matched carriers
3. NubiaGo selects carrier and creates shipment
4. Bagster manages tracking and updates
5. Real-time updates sent to NubiaGo

## 📈 Analytics & Monitoring

### Available Metrics
- **User Analytics**: Registration, verification, activity
- **Carrier Analytics**: Performance, ratings, delivery success
- **Shipment Analytics**: Volume, revenue, delivery times
- **Revenue Analytics**: Total revenue, trends, projections
- **Performance Metrics**: On-time delivery, success rates

### Dashboard Access
- Admin-only analytics endpoints
- Real-time data aggregation
- Historical trend analysis

## 🚀 Deployment

### Production Deployment
```bash
# Build and deploy
npm run build
firebase deploy

# Set production environment
firebase functions:config:set env.production=true
```

### Environment Variables
```bash
# Required environment variables
NODE_ENV=production
FIREBASE_PROJECT_ID=bagster-d51eb
```

## 🔒 Security

### Authentication
- Firebase Authentication with custom claims
- Role-based access control
- JWT token validation

### Data Protection
- Input validation and sanitization
- Rate limiting and abuse prevention
- Secure file upload handling

### API Security
- CORS configuration
- Security headers
- Request logging and monitoring

## 📝 API Documentation

### Authentication Headers
```http
Authorization: Bearer <firebase-id-token>
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## 🧪 Testing

### API Testing
```bash
# Test endpoints with curl
curl -X POST https://your-region-bagster-d51eb.cloudfunctions.net/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","userType":"client","firstName":"John","lastName":"Doe"}'
```

### Local Testing
```bash
# Start emulators
firebase emulators:start

# Test functions locally
firebase functions:shell
```

## 📞 Support

### Getting Help
- Check Firebase Console logs
- Review function logs: `firebase functions:log`
- Monitor performance in Firebase Console

### Common Issues
1. **Service Account Key**: Ensure correct service account key is configured
2. **Firestore Rules**: Verify security rules are properly deployed
3. **CORS Issues**: Check CORS configuration for frontend integration
4. **Rate Limiting**: Monitor API usage and adjust limits as needed

## 🔄 Updates & Maintenance

### Regular Maintenance
- Monitor function performance
- Review and update security rules
- Backup Firestore data regularly
- Update dependencies periodically

### Scaling Considerations
- Monitor function cold starts
- Optimize database queries
- Implement caching strategies
- Consider regional deployment

## 📄 License

This project is proprietary software for the Bagster cargo marketplace.

---

**Built with ❤️ for Africa's logistics industry** 