# 🛒 Bagster Ecommerce Integration Guide

Complete guide for integrating Bagster logistics API into your ecommerce platform.

## 🚀 Quick Start

### 1. Generate API Key

1. **Access Admin Dashboard**: Go to `http://localhost:3000/admin/dashboard`
2. **Navigate to API Keys**: Click on the "API Keys" tab
3. **Create New Key**: Click "Create API Key" button
4. **Configure Permissions**: Select required permissions:
   - `rates:read` - Get shipping rates
   - `shipments:create` - Create shipments
   - `tracking:read` - Track shipments
   - `smart-selection:read` - Use intelligent carrier selection
5. **Set Rate Limits**: Configure based on your traffic
6. **Copy API Key**: **Important**: Copy the key immediately - you won't see it again!

### 2. Install SDK

```bash
npm install @bagster/js-sdk
# or
yarn add @bagster/js-sdk
```

### 3. Initialize SDK

```javascript
import { BagsterSDK } from '@bagster/js-sdk';

const bagster = new BagsterSDK({
  apiKey: 'bgs_your_api_key_here', // From admin dashboard
  baseUrl: 'http://localhost:3000' // Your Bagster instance URL
});
```

## 📋 Integration Scenarios

### Scenario 1: Checkout Page - Show Shipping Options

```javascript
async function getShippingOptions(customerAddress, cartItems) {
  // Calculate total weight
  const totalWeight = cartItems.reduce((sum, item) => 
    sum + (item.weight * item.quantity), 0
  );
  
  // Get smart recommendations
  const response = await bagster.selectBestCarrier(
    'Lagos, Nigeria', // Your warehouse location
    `${customerAddress.city}, ${customerAddress.country}`,
    totalWeight,
    { prioritize: 'balanced' } // or 'cheapest', 'best_rated'
  );

  if (response.success) {
    return response.data.recommendations.map(carrier => ({
      id: carrier.id,
      name: carrier.name,
      price: carrier.total_cost,
      deliveryTime: carrier.delivery_time,
      rating: carrier.rating,
      reason: carrier.selectionReason
    }));
  }
  
  return [];
}

// Usage in your checkout component
const shippingOptions = await getShippingOptions(
  { city: 'Abuja', country: 'Nigeria' },
  [
    { weight: 2.5, quantity: 1, name: 'Product A' },
    { weight: 1.0, quantity: 2, name: 'Product B' }
  ]
);
```

### Scenario 2: Order Confirmation - Create Shipment

```javascript
async function createShipmentForOrder(order, selectedCarrier) {
  const shipmentRequest = {
    carrier_id: selectedCarrier.id,
    origin: 'Lagos, Nigeria',
    destination: `${order.shipping_address.city}, ${order.shipping_address.country}`,
    weight: order.total_weight,
    description: `Order #${order.id}`,
    pickup_address: 'Your Warehouse, Lagos, Nigeria',
    delivery_address: formatAddress(order.shipping_address),
    contact_info: {
      name: order.customer.name,
      phone: order.customer.phone,
      email: order.customer.email
    },
    declared_value: order.total_value,
    insurance_required: order.total_value > 1000
  };

  const response = await bagster.createShipment(shipmentRequest);
  
  if (response.success) {
    // Save tracking info to your database
    await saveOrderTracking(order.id, {
      tracking_number: response.data.tracking_number,
      carrier_name: response.data.carrier.name,
      estimated_delivery: response.data.estimated_delivery
    });
    
    // Send confirmation email
    await sendTrackingEmail(order.customer.email, response.data);
    
    return response.data;
  }
  
  throw new Error(response.error);
}
```

### Scenario 3: Order Tracking Page

```javascript
async function getOrderTracking(trackingNumber) {
  const response = await bagster.trackShipment(trackingNumber);
  
  if (response.success) {
    return {
      status: response.data.status,
      location: response.data.current_location,
      estimatedDelivery: response.data.estimated_delivery,
      history: response.data.tracking_history
    };
  }
  
  return null;
}

// Usage in tracking component
const tracking = await getOrderTracking('BAG123456789');
```

### Scenario 4: Product Page - Shipping Calculator

```javascript
async function calculateShippingForProduct(productWeight, customerLocation) {
  const response = await bagster.getCheapestCarrier(
    'Lagos, Nigeria',
    customerLocation,
    productWeight
  );
  
  if (response.success) {
    return {
      estimatedCost: response.data.selected_carrier.total_cost,
      currency: response.data.selected_carrier.currency,
      deliveryTime: response.data.selected_carrier.delivery_time
    };
  }
  
  return null;
}
```

## 🎯 Smart Carrier Selection Strategies

### 1. Cheapest Option (Price-Focused)
```javascript
const cheapest = await bagster.getCheapestCarrier(origin, destination, weight);
// 70% price weight, 20% rating, 10% destination coverage
```

### 2. Best Quality (Service-Focused)
```javascript
const bestRated = await bagster.getBestRatedCarrier(origin, destination, weight);
// 20% price weight, 60% rating, 20% destination coverage
```

### 3. Balanced Selection (Recommended)
```javascript
const balanced = await bagster.selectBestCarrier(origin, destination, weight, {
  prioritize: 'balanced'
});
// 40% price weight, 35% rating, 25% destination coverage
```

### 4. Destination-Optimized
```javascript
const optimized = await bagster.getDestinationOptimizedCarrier(
  origin, destination, weight, 'Nigeria'
);
// 30% price weight, 20% rating, 50% destination coverage
```

### 5. Custom Criteria
```javascript
const custom = await bagster.selectBestCarrier(origin, destination, weight, {
  prioritize: 'balanced',
  max_price: 15000,        // Maximum price in NGN
  min_rating: 4.5,         // Minimum carrier rating
  required_services: ['insurance', 'tracking'],
  destination_country: 'Nigeria'
});
```

## 🔧 Platform-Specific Integration

### Shopify Integration

```javascript
// In your Shopify app
const calculateShipping = async (cart) => {
  const rates = await bagster.selectBestCarrier(
    shop.address,
    cart.shipping_address,
    cart.total_weight
  );
  
  return rates.data.recommendations.map(carrier => ({
    service_name: carrier.name,
    service_code: carrier.id,
    total_price: carrier.total_cost * 100, // Convert to cents
    currency: carrier.currency,
    min_delivery_date: carrier.delivery_time
  }));
};
```

### WooCommerce Integration

```php
// In your WooCommerce plugin
function bagster_calculate_shipping($package) {
    $bagster = new BagsterAPI('your_api_key');
    
    $response = $bagster->selectBestCarrier([
        'origin' => get_option('woocommerce_store_address'),
        'destination' => $package['destination']['city'] . ', ' . $package['destination']['country'],
        'weight' => WC()->cart->get_cart_contents_weight()
    ]);
    
    foreach ($response['data']['recommendations'] as $carrier) {
        $this->add_rate([
            'id' => $carrier['id'],
            'label' => $carrier['name'],
            'cost' => $carrier['total_cost'],
            'meta_data' => [
                'delivery_time' => $carrier['delivery_time'],
                'rating' => $carrier['rating']
            ]
        ]);
    }
}
```

### Magento Integration

```javascript
// In your Magento module
define(['jquery'], function($) {
    return {
        getShippingRates: function(address, items) {
            return $.ajax({
                url: '/bagster/shipping/rates',
                method: 'POST',
                data: {
                    destination: address.city + ', ' + address.countryId,
                    weight: this.calculateWeight(items)
                }
            });
        }
    };
});
```

## 📊 API Endpoints Reference

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/rates` | GET | Get shipping rates from all carriers |
| `/api/v1/smart-selection` | POST | Get intelligent carrier recommendations |
| `/api/v1/shipments` | POST | Create a new shipment |
| `/api/v1/tracking/{number}` | GET | Track shipment by tracking number |
| `/api/v1/carriers` | GET | List available carriers |

### Smart Selection Endpoint

**POST** `/api/v1/smart-selection`

```json
{
  "origin": "Lagos, Nigeria",
  "destination": "Abuja, Nigeria", 
  "weight": 5.0,
  "selection_criteria": {
    "prioritize": "balanced",
    "max_price": 15000,
    "min_rating": 4.0,
    "destination_country": "Nigeria"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "selected_carrier": {
      "id": "carrier_001",
      "name": "Express Logistics",
      "total_cost": 12500,
      "rating": 4.7,
      "delivery_time": "2-3 days",
      "selectionReason": "Excellent price. Top-rated carrier.",
      "totalScore": 0.89
    },
    "recommendations": [...],
    "scoring_breakdown": {
      "weights_used": {
        "price": 0.4,
        "rating": 0.35,
        "destination": 0.25
      }
    }
  }
}
```

## 🔐 Authentication & Security

### API Key Usage

```javascript
// Always include API key in headers
const headers = {
  'Authorization': `Bearer ${your_api_key}`,
  'Content-Type': 'application/json'
};

// SDK handles this automatically
const bagster = new BagsterSDK({ apiKey: 'your_key' });
```

### Rate Limits

- **Default**: 60 requests/minute, 1,000 requests/day
- **Premium**: 300 requests/minute, 10,000 requests/day
- Monitor usage in admin dashboard

### Security Best Practices

1. **Store API keys securely** - Use environment variables
2. **Validate webhooks** - Verify signatures
3. **Use HTTPS** - Always encrypt API calls
4. **Rotate keys regularly** - Generate new keys periodically
5. **Monitor usage** - Watch for unusual activity

## 🎣 Webhook Integration

### Setup Webhook Endpoint

```javascript
// Express.js webhook handler
app.post('/webhooks/bagster', (req, res) => {
  const { tracking_number, status, location, timestamp } = req.body;
  
  // Verify webhook signature (implement this)
  if (!verifyBagsterSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Update order status in your database
  updateOrderStatus(tracking_number, {
    status,
    current_location: location,
    last_update: timestamp
  });
  
  // Notify customer
  if (['picked_up', 'out_for_delivery', 'delivered'].includes(status)) {
    sendCustomerNotification(tracking_number, status);
  }
  
  res.json({ success: true });
});
```

### Webhook Events

- `shipment.created` - Shipment created successfully
- `shipment.picked_up` - Package picked up by carrier
- `shipment.in_transit` - Package in transit
- `shipment.out_for_delivery` - Out for delivery
- `shipment.delivered` - Package delivered
- `shipment.exception` - Delivery exception occurred

## 🧪 Testing

### Test API Key Generation

1. Go to admin dashboard: `http://localhost:3000/admin/dashboard`
2. Click "API Keys" tab
3. Create test API key with all permissions
4. Copy the generated key

### Test Integration

```javascript
// Test script
const testIntegration = async () => {
  const bagster = new BagsterSDK({
    apiKey: 'your_test_key',
    baseUrl: 'http://localhost:3000'
  });
  
  // Test 1: Get rates
  console.log('Testing rates...');
  const rates = await bagster.getRates({
    origin: 'Lagos, Nigeria',
    destination: 'Abuja, Nigeria',
    weight: 5.0
  });
  console.log('Rates:', rates);
  
  // Test 2: Smart selection
  console.log('Testing smart selection...');
  const smart = await bagster.selectBestCarrier(
    'Lagos, Nigeria',
    'Abuja, Nigeria', 
    5.0,
    { prioritize: 'balanced' }
  );
  console.log('Smart selection:', smart);
  
  // Test 3: Create shipment
  console.log('Testing shipment creation...');
  const shipment = await bagster.createShipment({
    carrier_id: smart.data.selected_carrier.id,
    origin: 'Lagos, Nigeria',
    destination: 'Abuja, Nigeria',
    weight: 5.0,
    pickup_address: 'Test Warehouse, Lagos',
    delivery_address: 'Test Customer, Abuja',
    contact_info: {
      name: 'Test Customer',
      phone: '+234123456789',
      email: 'test@example.com'
    }
  });
  console.log('Shipment:', shipment);
};

testIntegration().catch(console.error);
```

## 🚨 Error Handling

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 401 | Invalid API key | Check API key in admin dashboard |
| 403 | Insufficient permissions | Update API key permissions |
| 429 | Rate limit exceeded | Implement request throttling |
| 400 | Invalid parameters | Validate request data |
| 500 | Server error | Check server logs, retry request |

### Error Handling Pattern

```javascript
const handleBagsterRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    return response.data;
  } catch (error) {
    console.error('Bagster API Error:', error);
    
    // Handle specific errors
    if (error.message.includes('rate limit')) {
      // Implement backoff strategy
      await new Promise(resolve => setTimeout(resolve, 60000));
      return handleBagsterRequest(requestFn);
    }
    
    throw error;
  }
};
```

## 📈 Performance Optimization

### Caching Strategies

```javascript
// Cache shipping rates for similar requests
const rateCache = new Map();

const getCachedRates = async (origin, destination, weight) => {
  const cacheKey = `${origin}-${destination}-${Math.floor(weight)}`;
  
  if (rateCache.has(cacheKey)) {
    const cached = rateCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 300000) { // 5 minutes
      return cached.data;
    }
  }
  
  const rates = await bagster.getRates({ origin, destination, weight });
  rateCache.set(cacheKey, {
    data: rates,
    timestamp: Date.now()
  });
  
  return rates;
};
```

### Batch Processing

```javascript
// Process multiple shipments in batch
const createBatchShipments = async (orders) => {
  const promises = orders.map(order => 
    createShipmentForOrder(order, order.selectedCarrier)
  );
  
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => ({
    orderId: orders[index].id,
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
};
```

## 🎯 Next Steps

1. **Generate your API key** in the admin dashboard
2. **Install the SDK** in your ecommerce platform
3. **Implement checkout integration** for shipping options
4. **Set up order processing** for automatic shipment creation
5. **Add tracking functionality** for customer visibility
6. **Configure webhooks** for real-time updates
7. **Monitor usage** and optimize performance

## 📞 Support

- **Documentation**: Check this guide and SDK examples
- **API Reference**: Available in admin dashboard
- **Issues**: Report bugs or request features
- **Community**: Join our developer community

---

**🎉 You're now ready to integrate Bagster into your ecommerce platform!**

Start with the checkout integration and gradually add more features as needed.
