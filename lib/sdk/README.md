# Bagster SDK Documentation

Official SDK for integrating Bagster logistics API into your applications.

## Installation

### NPM/Yarn
```bash
npm install bagster-sdk
# or
yarn add bagster-sdk
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/bagster-sdk@latest/dist/bagster-sdk.min.js"></script>
```

## Quick Start

### 1. Get API Key
Visit [Bagster Dashboard](https://bagster.com/dashboard/api-keys) to generate your API key.

### 2. Initialize SDK
```javascript
import BagsterSDK from 'bagster-sdk';

const bagster = new BagsterSDK({
  apiKey: 'your_api_key_here',
  baseUrl: 'https://api.bagster.com' // Optional
});
```

### 3. Calculate Shipping Rates
```javascript
const rates = await bagster.getRates({
  origin: 'Lagos, Nigeria',
  destination: 'Abuja, Nigeria',
  weight: 5.0, // kg
  transport_mode: 'road'
});

if (rates.success) {
  console.log('Available carriers:', rates.data.carriers);
}
```

## API Reference

### Configuration
```typescript
interface BagsterConfig {
  apiKey: string;        // Required: Your API key
  baseUrl?: string;      // Optional: API base URL
  timeout?: number;      // Optional: Request timeout (ms)
}
```

### Methods

#### `getRates(request: RateRequest)`
Calculate shipping rates from available carriers.

```javascript
const request = {
  origin: 'Lagos, Nigeria',
  destination: 'Kano, Nigeria',
  weight: 2.5,
  dimensions: '30x20x15', // Optional: LxWxH in cm
  transport_mode: 'road', // 'air' | 'sea' | 'road'
  package_type: 'standard', // 'standard' | 'fragile' | 'hazardous'
  insurance_required: true,
  pickup_required: false
};

const response = await bagster.getRates(request);
```

#### `createShipment(request: ShipmentRequest)`
Create a new shipment booking.

```javascript
const shipment = {
  carrier_id: 'carrier_123',
  origin: 'Lagos, Nigeria',
  destination: 'Abuja, Nigeria',
  weight: 5.0,
  description: 'Electronics package',
  pickup_address: 'Your warehouse address',
  delivery_address: 'Customer delivery address',
  contact_info: {
    name: 'John Doe',
    phone: '+234123456789',
    email: 'john@example.com'
  },
  declared_value: 50000,
  insurance_required: true
};

const response = await bagster.createShipment(shipment);
```

#### `trackShipment(trackingNumber: string)`
Track a shipment by tracking number.

```javascript
const tracking = await bagster.trackShipment('BGS123456ABC');

if (tracking.success) {
  console.log('Status:', tracking.data.status);
  console.log('Location:', tracking.data.current_location);
  console.log('Timeline:', tracking.data.timeline);
}
```

#### `getCarriers(filters?)`
Get list of available carriers with optional filters.

```javascript
const carriers = await bagster.getCarriers({
  country: 'nigeria',
  transport_mode: 'road',
  min_rating: 4.0,
  verified_only: true
});
```

#### `calculateCost(origin, destination, weight, carrierId?)`
Quick cost estimation for shipping.

```javascript
const cost = await bagster.calculateCost(
  'Lagos, Nigeria',
  'Abuja, Nigeria',
  3.0
);

console.log(`Estimated cost: ${cost.data.currency} ${cost.data.estimated_cost}`);
```

## Framework Integration Examples

### React Integration
```jsx
import { useBagster } from 'bagster-sdk';

function ShippingCalculator() {
  const bagster = useBagster('your_api_key');
  const [rates, setRates] = useState([]);

  const calculateRates = async () => {
    const response = await bagster.getRates({
      origin: 'Lagos, Nigeria',
      destination: destination,
      weight: weight
    });
    
    if (response.success) {
      setRates(response.data.carriers);
    }
  };

  return (
    <div>
      {/* Your shipping calculator UI */}
    </div>
  );
}
```

### Node.js/Express Integration
```javascript
const BagsterSDK = require('bagster-sdk');
const bagster = new BagsterSDK({ apiKey: process.env.BAGSTER_API_KEY });

app.post('/api/shipping/calculate', async (req, res) => {
  const { origin, destination, weight } = req.body;
  
  const response = await bagster.getRates({
    origin,
    destination,
    weight: parseFloat(weight)
  });
  
  res.json(response);
});
```

### E-commerce Platform Integration
```javascript
// During checkout - get shipping options
async function getShippingOptions(cart, customerAddress) {
  const totalWeight = cart.items.reduce((sum, item) => 
    sum + (item.weight * item.quantity), 0
  );
  
  const rates = await bagster.getRates({
    origin: 'Your Warehouse, Lagos, Nigeria',
    destination: `${customerAddress.city}, ${customerAddress.country}`,
    weight: totalWeight
  });
  
  return rates.data.carriers.map(carrier => ({
    id: carrier.id,
    name: carrier.name,
    price: carrier.total_cost,
    deliveryTime: carrier.delivery_time
  }));
}

// After order placement - create shipment
async function fulfillOrder(order, selectedCarrier) {
  const shipment = await bagster.createShipment({
    carrier_id: selectedCarrier.id,
    origin: 'Your Warehouse, Lagos, Nigeria',
    destination: order.shipping_address,
    weight: order.total_weight,
    contact_info: order.customer,
    // ... other details
  });
  
  // Save tracking number to order
  await updateOrder(order.id, {
    tracking_number: shipment.data.tracking_number,
    carrier: shipment.data.carrier.name
  });
  
  return shipment.data;
}
```

## Error Handling

All SDK methods return a consistent response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Example Error Handling
```javascript
const response = await bagster.getRates(request);

if (response.success) {
  // Handle success
  console.log('Rates:', response.data.carriers);
} else {
  // Handle error
  console.error('Error:', response.error);
  
  // Common error types:
  // - "Invalid API key"
  // - "Rate limit exceeded"
  // - "Invalid request parameters"
  // - "Service temporarily unavailable"
}
```

## Webhooks

Set up webhooks to receive real-time shipment updates:

### 1. Configure Webhook URL
In your Bagster dashboard, set your webhook endpoint:
```
https://your-domain.com/api/webhooks/bagster/shipment-update
```

### 2. Handle Webhook Events
```javascript
app.post('/api/webhooks/bagster/shipment-update', (req, res) => {
  const { tracking_number, status, location, timestamp } = req.body;
  
  // Verify webhook signature (recommended)
  if (!verifyWebhookSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Update your database
  updateOrderStatus(tracking_number, { status, location, timestamp });
  
  // Notify customer
  if (['delivered', 'out_for_delivery'].includes(status)) {
    notifyCustomer(tracking_number, status);
  }
  
  res.json({ success: true });
});
```

## Rate Limiting

The Bagster API implements rate limiting:
- **Standard Plan**: 100 requests/minute, 10,000 requests/day
- **Premium Plan**: 500 requests/minute, 50,000 requests/day
- **Enterprise Plan**: Custom limits

### Handling Rate Limits
```javascript
const response = await bagster.getRates(request);

if (!response.success && response.error.includes('rate limit')) {
  // Implement exponential backoff
  await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
  // Retry request
}
```

## Testing

### Test API Keys
Use test API keys for development:
```javascript
const bagster = new BagsterSDK({
  apiKey: 'test_sk_1234567890abcdef', // Test key prefix: test_
  baseUrl: 'https://api-sandbox.bagster.com'
});
```

### Mock Responses
For unit testing, you can mock SDK responses:
```javascript
// Jest example
jest.mock('bagster-sdk', () => ({
  BagsterSDK: jest.fn().mockImplementation(() => ({
    getRates: jest.fn().mockResolvedValue({
      success: true,
      data: { carriers: [/* mock carriers */] }
    })
  }))
}));
```

## Best Practices

### 1. API Key Security
- Never expose API keys in client-side code
- Use environment variables for API keys
- Rotate API keys regularly

### 2. Error Handling
- Always check `response.success` before using data
- Implement retry logic for network errors
- Log errors for debugging

### 3. Performance
- Cache carrier lists when possible
- Batch multiple rate requests
- Use webhooks instead of polling for status updates

### 4. User Experience
- Show loading states during API calls
- Provide fallback shipping options
- Display clear error messages to users

## Support

- **Documentation**: [https://docs.bagster.com](https://docs.bagster.com)
- **API Reference**: [https://api.bagster.com/docs](https://api.bagster.com/docs)
- **Support Email**: [support@bagster.com](mailto:support@bagster.com)
- **GitHub Issues**: [https://github.com/bagster/sdk-js/issues](https://github.com/bagster/sdk-js/issues)

## Changelog

### v1.0.0
- Initial release
- Core API methods: rates, shipments, tracking, carriers
- React hooks support
- TypeScript definitions
- Comprehensive error handling

## License

MIT License - see [LICENSE](LICENSE) file for details.
