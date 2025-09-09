/**
 * Bagster SDK - Node.js Integration Example
 * This example shows how to use Bagster API in Node.js/Express applications
 */

const BagsterSDK = require('../bagster-js-sdk');
const express = require('express');
const app = express();

// Initialize Bagster client
const bagster = new BagsterSDK({
  apiKey: process.env.BAGSTER_API_KEY || 'your_api_key_here',
  baseUrl: process.env.BAGSTER_BASE_URL || 'https://api.bagster.com'
});

app.use(express.json());

/**
 * Example 1: Express middleware for shipping calculations
 */
app.post('/api/shipping/calculate', async (req, res) => {
  try {
    const { origin, destination, weight, items } = req.body;

    // Validate input
    if (!origin || !destination || !weight) {
      return res.status(400).json({
        error: 'Missing required fields: origin, destination, weight'
      });
    }

    // Calculate shipping rates
    const response = await bagster.getRates({
      origin,
      destination,
      weight: parseFloat(weight),
      transport_mode: req.body.transport_mode || 'road',
      package_type: req.body.package_type || 'standard',
      insurance_required: items && items.some(item => item.value > 1000)
    });

    if (response.success) {
      // Format response for frontend
      const shippingOptions = response.data.carriers.map(carrier => ({
        carrier_id: carrier.id,
        name: carrier.name,
        price: carrier.total_cost,
        currency: carrier.currency,
        delivery_time: carrier.delivery_time,
        rating: carrier.rating,
        services: carrier.services
      }));

      res.json({
        success: true,
        shipping_options: shippingOptions,
        total_carriers: response.data.total_carriers
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.error
      });
    }
  } catch (error) {
    console.error('Shipping calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * Example 2: Create shipment endpoint
 */
app.post('/api/shipments/create', async (req, res) => {
  try {
    const {
      order_id,
      carrier_id,
      customer_info,
      shipping_address,
      items
    } = req.body;

    // Validate required fields
    if (!carrier_id || !customer_info || !shipping_address || !items) {
      return res.status(400).json({
        error: 'Missing required shipment information'
      });
    }

    // Calculate total weight and dimensions
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create shipment request
    const shipmentRequest = {
      carrier_id,
      origin: process.env.WAREHOUSE_ADDRESS || 'Lagos, Nigeria',
      destination: formatShippingAddress(shipping_address),
      weight: totalWeight,
      dimensions: calculatePackageDimensions(items),
      description: `Order #${order_id} - ${items.length} items`,
      pickup_address: process.env.WAREHOUSE_ADDRESS || 'Your Warehouse, Lagos, Nigeria',
      delivery_address: formatShippingAddress(shipping_address),
      contact_info: {
        name: customer_info.name,
        phone: customer_info.phone,
        email: customer_info.email
      },
      declared_value: totalValue,
      special_instructions: shipping_address.delivery_notes,
      insurance_required: totalValue > 1000
    };

    const response = await bagster.createShipment(shipmentRequest);

    if (response.success) {
      // Save to database
      await saveShipmentToDatabase(order_id, response.data);

      // Send confirmation email
      await sendShipmentConfirmation(customer_info.email, {
        order_id,
        tracking_number: response.data.tracking_number,
        estimated_delivery: response.data.estimated_delivery
      });

      res.json({
        success: true,
        shipment: response.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.error
      });
    }
  } catch (error) {
    console.error('Shipment creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create shipment'
    });
  }
});

/**
 * Example 3: Tracking endpoint
 */
app.get('/api/tracking/:tracking_number', async (req, res) => {
  try {
    const { tracking_number } = req.params;

    if (!tracking_number) {
      return res.status(400).json({
        error: 'Tracking number is required'
      });
    }

    const response = await bagster.trackShipment(tracking_number);

    if (response.success) {
      // Update local database with latest tracking info
      await updateTrackingInDatabase(tracking_number, response.data);

      res.json({
        success: true,
        tracking: response.data
      });
    } else {
      res.status(404).json({
        success: false,
        error: response.error || 'Tracking information not found'
      });
    }
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tracking information'
    });
  }
});

/**
 * Example 4: Webhook endpoint for shipment updates
 */
app.post('/api/webhooks/bagster/shipment-update', async (req, res) => {
  try {
    const {
      tracking_number,
      status,
      location,
      timestamp,
      estimated_delivery
    } = req.body;

    // Verify webhook signature (implement this for security)
    if (!verifyBagsterWebhook(req)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    // Update order status in database
    const order = await updateOrderStatus(tracking_number, {
      status,
      current_location: location,
      last_update: timestamp,
      estimated_delivery
    });

    if (order) {
      // Notify customer of important status changes
      if (['picked_up', 'out_for_delivery', 'delivered', 'exception'].includes(status)) {
        await notifyCustomer(order.customer_email, {
          order_id: order.id,
          tracking_number,
          status,
          location,
          estimated_delivery
        });
      }

      // Trigger internal notifications for exceptions
      if (status === 'exception') {
        await notifyCustomerService({
          order_id: order.id,
          tracking_number,
          issue: req.body.exception_reason
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Example 5: Bulk shipment processing
 */
app.post('/api/shipments/bulk-create', async (req, res) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        error: 'Orders array is required'
      });
    }

    const results = [];
    const errors = [];

    // Process orders in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (order) => {
        try {
          const shipmentRequest = buildShipmentRequest(order);
          const response = await bagster.createShipment(shipmentRequest);
          
          if (response.success) {
            await saveShipmentToDatabase(order.id, response.data);
            return { order_id: order.id, success: true, shipment: response.data };
          } else {
            return { order_id: order.id, success: false, error: response.error };
          }
        } catch (error) {
          return { order_id: order.id, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(r => r.success));
      errors.push(...batchResults.filter(r => !r.success));

      // Add delay between batches to respect rate limits
      if (i + batchSize < orders.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.json({
      success: true,
      processed: results.length,
      failed: errors.length,
      results,
      errors
    });
  } catch (error) {
    console.error('Bulk shipment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process bulk shipments'
    });
  }
});

/**
 * Example 6: Scheduled tracking updates
 */
async function scheduledTrackingUpdate() {
  try {
    console.log('Running scheduled tracking update...');
    
    // Get all active shipments from database
    const activeShipments = await getActiveShipments();
    
    for (const shipment of activeShipments) {
      try {
        const response = await bagster.trackShipment(shipment.tracking_number);
        
        if (response.success) {
          const tracking = response.data;
          
          // Update database
          await updateTrackingInDatabase(shipment.tracking_number, tracking);
          
          // Check if status changed
          if (tracking.status !== shipment.last_known_status) {
            await handleStatusChange(shipment, tracking);
          }
        }
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to update tracking for ${shipment.tracking_number}:`, error);
      }
    }
    
    console.log(`Updated tracking for ${activeShipments.length} shipments`);
  } catch (error) {
    console.error('Scheduled tracking update error:', error);
  }
}

// Run tracking updates every 30 minutes
setInterval(scheduledTrackingUpdate, 30 * 60 * 1000);

/**
 * Helper Functions
 */

function formatShippingAddress(address) {
  return `${address.street}, ${address.city}, ${address.state || ''} ${address.postal_code}, ${address.country}`.replace(/,\s*,/g, ',');
}

function calculatePackageDimensions(items) {
  // Simple calculation - in production, use proper bin packing
  const totalVolume = items.reduce((sum, item) => {
    const volume = (item.length || 10) * (item.width || 10) * (item.height || 10);
    return sum + (volume * item.quantity);
  }, 0);
  
  const side = Math.cbrt(totalVolume);
  return `${Math.ceil(side)}x${Math.ceil(side)}x${Math.ceil(side)}`;
}

function buildShipmentRequest(order) {
  return {
    carrier_id: order.selected_carrier_id,
    origin: process.env.WAREHOUSE_ADDRESS || 'Lagos, Nigeria',
    destination: formatShippingAddress(order.shipping_address),
    weight: order.total_weight,
    dimensions: calculatePackageDimensions(order.items),
    description: `Order #${order.id}`,
    pickup_address: process.env.WAREHOUSE_ADDRESS,
    delivery_address: formatShippingAddress(order.shipping_address),
    contact_info: order.customer_info,
    declared_value: order.total_value,
    insurance_required: order.total_value > 1000
  };
}

function verifyBagsterWebhook(req) {
  // Implement webhook signature verification
  // This is crucial for security in production
  const signature = req.headers['x-bagster-signature'];
  const payload = JSON.stringify(req.body);
  
  // Verify signature using your webhook secret
  // const expectedSignature = crypto.createHmac('sha256', process.env.BAGSTER_WEBHOOK_SECRET)
  //   .update(payload)
  //   .digest('hex');
  
  // return signature === expectedSignature;
  return true; // Placeholder
}

// Mock database functions (replace with your actual implementations)
async function saveShipmentToDatabase(orderId, shipmentData) {
  console.log(`Saving shipment for order ${orderId}:`, shipmentData.tracking_number);
  // Your database logic here
}

async function updateTrackingInDatabase(trackingNumber, trackingData) {
  console.log(`Updating tracking ${trackingNumber}:`, trackingData.status);
  // Your database logic here
}

async function updateOrderStatus(trackingNumber, statusData) {
  console.log(`Updating order status for ${trackingNumber}:`, statusData);
  // Your database logic here
  return { id: 'order123', customer_email: 'customer@example.com' };
}

async function getActiveShipments() {
  // Return shipments that are not yet delivered
  return [];
}

async function handleStatusChange(shipment, tracking) {
  console.log(`Status changed for ${shipment.tracking_number}: ${tracking.status}`);
  // Handle status change logic
}

async function sendShipmentConfirmation(email, data) {
  console.log(`Sending confirmation to ${email}:`, data);
  // Your email service logic
}

async function notifyCustomer(email, data) {
  console.log(`Notifying customer ${email}:`, data);
  // Your notification logic
}

async function notifyCustomerService(data) {
  console.log('Notifying customer service:', data);
  // Your internal notification logic
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bagster integration server running on port ${PORT}`);
});

module.exports = app;
