/**
 * Bagster SDK - E-commerce Integration Example
 * This example shows how to integrate Bagster logistics API into an e-commerce platform
 */

import BagsterSDK from '../bagster-js-sdk';

// Initialize Bagster client
const bagster = new BagsterSDK({
  apiKey: 'your_api_key_here', // Get from https://bagster.com/dashboard/api-keys
  baseUrl: 'https://api.bagster.com' // Optional: defaults to production
});

/**
 * Example 1: Get shipping rates during checkout
 */
async function getShippingOptions(customerAddress, items) {
  try {
    // Calculate total weight from cart items
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    
    // Get shipping rates
    const response = await bagster.getRates({
      origin: 'Lagos, Nigeria', // Your warehouse location
      destination: customerAddress.city + ', ' + customerAddress.country,
      weight: totalWeight,
      transport_mode: 'road', // or let customer choose
      insurance_required: items.some(item => item.value > 1000) // Auto-insure high-value items
    });

    if (response.success) {
      // Format for your checkout UI
      return response.data.carriers.map(carrier => ({
        id: carrier.id,
        name: carrier.name,
        price: carrier.total_cost,
        deliveryTime: carrier.delivery_time,
        rating: carrier.rating
      }));
    } else {
      console.error('Failed to get shipping rates:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Shipping calculation error:', error);
    return [];
  }
}

/**
 * Example 2: Create shipment when order is placed
 */
async function createShipmentForOrder(order, selectedCarrier) {
  try {
    const shipmentRequest = {
      carrier_id: selectedCarrier.id,
      origin: 'Lagos, Nigeria',
      destination: `${order.shipping_address.city}, ${order.shipping_address.country}`,
      weight: order.total_weight,
      dimensions: calculateDimensions(order.items),
      description: `Order #${order.id} - ${order.items.length} items`,
      pickup_address: 'Your Warehouse Address, Lagos, Nigeria',
      delivery_address: formatAddress(order.shipping_address),
      contact_info: {
        name: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email
      },
      declared_value: order.total_value,
      special_instructions: order.delivery_notes,
      insurance_required: order.total_value > 1000
    };

    const response = await bagster.createShipment(shipmentRequest);

    if (response.success) {
      // Save tracking info to your database
      await saveTrackingInfo(order.id, {
        tracking_number: response.data.tracking_number,
        carrier_name: response.data.carrier.name,
        estimated_delivery: response.data.estimated_delivery,
        shipping_cost: response.data.total_cost
      });

      // Send confirmation email to customer
      await sendShippingConfirmation(order.customer.email, {
        tracking_number: response.data.tracking_number,
        estimated_delivery: response.data.estimated_delivery
      });

      return response.data;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error('Shipment creation failed:', error);
    throw error;
  }
}

/**
 * Example 3: Track shipment and update customer
 */
async function updateShipmentStatus(trackingNumber) {
  try {
    const response = await bagster.trackShipment(trackingNumber);

    if (response.success) {
      const tracking = response.data;
      
      // Update your database
      await updateOrderStatus(trackingNumber, {
        status: tracking.status,
        current_location: tracking.current_location,
        last_update: new Date()
      });

      // Notify customer of important status changes
      if (['picked_up', 'out_for_delivery', 'delivered'].includes(tracking.status)) {
        await sendStatusUpdate(trackingNumber, tracking);
      }

      return tracking;
    } else {
      console.error('Tracking failed:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Tracking error:', error);
    return null;
  }
}

/**
 * Example 4: Bulk rate calculation for product pages
 */
async function calculateShippingForProduct(productId, customerLocation) {
  try {
    const product = await getProduct(productId);
    
    const response = await bagster.calculateCost(
      'Lagos, Nigeria', // Your warehouse
      customerLocation,
      product.weight
    );

    if (response.success) {
      return {
        estimated_cost: response.data.estimated_cost,
        currency: response.data.currency
      };
    }
    
    return null;
  } catch (error) {
    console.error('Product shipping calculation error:', error);
    return null;
  }
}

/**
 * Example 5: Webhook handler for shipment updates
 */
function handleBagsterWebhook(req, res) {
  try {
    const { tracking_number, status, location, timestamp } = req.body;
    
    // Verify webhook authenticity (implement signature verification)
    if (!verifyWebhookSignature(req)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Update order status
    updateOrderByTrackingNumber(tracking_number, {
      status,
      current_location: location,
      last_update: timestamp
    });

    // Notify customer
    notifyCustomerOfUpdate(tracking_number, status, location);

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Helper Functions
 */

function calculateDimensions(items) {
  // Simple box calculation - in practice, use a bin packing algorithm
  const totalVolume = items.reduce((sum, item) => {
    const volume = (item.length || 10) * (item.width || 10) * (item.height || 10);
    return sum + (volume * item.quantity);
  }, 0);
  
  const side = Math.cbrt(totalVolume);
  return `${Math.ceil(side)}x${Math.ceil(side)}x${Math.ceil(side)}`;
}

function formatAddress(address) {
  return `${address.street}, ${address.city}, ${address.state || ''} ${address.postal_code}, ${address.country}`.replace(/,\s*,/g, ',');
}

// Mock database functions (replace with your actual implementations)
async function saveTrackingInfo(orderId, trackingData) {
  console.log(`Saving tracking info for order ${orderId}:`, trackingData);
  // Your database save logic here
}

async function updateOrderStatus(trackingNumber, statusData) {
  console.log(`Updating status for ${trackingNumber}:`, statusData);
  // Your database update logic here
}

async function sendShippingConfirmation(email, shipmentData) {
  console.log(`Sending confirmation to ${email}:`, shipmentData);
  // Your email service logic here
}

async function sendStatusUpdate(trackingNumber, tracking) {
  console.log(`Sending status update for ${trackingNumber}:`, tracking.status);
  // Your notification logic here
}

async function getProduct(productId) {
  // Your product lookup logic here
  return {
    id: productId,
    weight: 2.5, // kg
    length: 30,  // cm
    width: 20,   // cm
    height: 15   // cm
  };
}

function verifyWebhookSignature(req) {
  // Implement webhook signature verification
  // This is crucial for security
  return true; // Placeholder
}

async function updateOrderByTrackingNumber(trackingNumber, update) {
  console.log(`Updating order with tracking ${trackingNumber}:`, update);
  // Your database update logic here
}

async function notifyCustomerOfUpdate(trackingNumber, status, location) {
  console.log(`Notifying customer: ${trackingNumber} is ${status} at ${location}`);
  // Your customer notification logic here
}

// Export for use in your application
export {
  getShippingOptions,
  createShipmentForOrder,
  updateShipmentStatus,
  calculateShippingForProduct,
  handleBagsterWebhook
};
