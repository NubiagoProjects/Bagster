/**
 * Bagster SDK - React Integration Example
 * This example shows how to use Bagster API in React applications
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useBagster } from '../bagster-js-sdk';

// Example 1: Shipping Calculator Component
export const ShippingCalculator: React.FC = () => {
  const bagster = useBagster('your_api_key_here');
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    origin: 'Lagos, Nigeria',
    destination: '',
    weight: '',
    transportMode: 'road'
  });

  const calculateRates = useCallback(async () => {
    if (!formData.destination || !formData.weight) return;

    setLoading(true);
    setError('');

    try {
      const response = await bagster.getRates({
        origin: formData.origin,
        destination: formData.destination,
        weight: parseFloat(formData.weight),
        transport_mode: formData.transportMode as any
      });

      if (response.success && response.data) {
        setRates(response.data.carriers);
      } else {
        setError(response.error || 'Failed to calculate rates');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [bagster, formData]);

  return (
    <div className="shipping-calculator">
      <h3>Calculate Shipping Rates</h3>
      
      <div className="form-group">
        <label>From:</label>
        <input
          type="text"
          value={formData.origin}
          onChange={(e) => setFormData({...formData, origin: e.target.value})}
          placeholder="Origin city, country"
        />
      </div>

      <div className="form-group">
        <label>To:</label>
        <input
          type="text"
          value={formData.destination}
          onChange={(e) => setFormData({...formData, destination: e.target.value})}
          placeholder="Destination city, country"
        />
      </div>

      <div className="form-group">
        <label>Weight (kg):</label>
        <input
          type="number"
          value={formData.weight}
          onChange={(e) => setFormData({...formData, weight: e.target.value})}
          placeholder="Package weight"
        />
      </div>

      <div className="form-group">
        <label>Transport Mode:</label>
        <select
          value={formData.transportMode}
          onChange={(e) => setFormData({...formData, transportMode: e.target.value})}
        >
          <option value="road">Road</option>
          <option value="air">Air</option>
          <option value="sea">Sea</option>
        </select>
      </div>

      <button onClick={calculateRates} disabled={loading}>
        {loading ? 'Calculating...' : 'Get Rates'}
      </button>

      {error && <div className="error">{error}</div>}

      {rates.length > 0 && (
        <div className="rates-results">
          <h4>Available Carriers:</h4>
          {rates.map((rate: any) => (
            <div key={rate.id} className="rate-card">
              <div className="carrier-name">{rate.name}</div>
              <div className="carrier-rating">Rating: {rate.rating}/5</div>
              <div className="carrier-price">${rate.total_cost}</div>
              <div className="carrier-time">{rate.delivery_time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Example 2: Shipment Tracking Component
export const ShipmentTracker: React.FC<{ trackingNumber: string }> = ({ trackingNumber }) => {
  const bagster = useBagster('your_api_key_here');
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trackingNumber) return;

    const fetchTracking = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await bagster.trackShipment(trackingNumber);
        
        if (response.success) {
          setTracking(response.data);
        } else {
          setError(response.error || 'Tracking information not found');
        }
      } catch (err) {
        setError('Failed to fetch tracking information');
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [bagster, trackingNumber]);

  if (loading) return <div>Loading tracking information...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tracking) return <div>No tracking information available</div>;

  return (
    <div className="shipment-tracker">
      <h3>Tracking: {bagster.formatTrackingNumber(trackingNumber)}</h3>
      
      <div className="tracking-summary">
        <div className="status">Status: {tracking.status}</div>
        <div className="carrier">Carrier: {tracking.carrier}</div>
        <div className="location">Current Location: {tracking.current_location}</div>
        <div className="delivery">Estimated Delivery: {tracking.estimated_delivery}</div>
      </div>

      <div className="tracking-timeline">
        <h4>Shipment Timeline:</h4>
        {tracking.timeline.map((event: any, index: number) => (
          <div key={index} className="timeline-event">
            <div className="event-date">{new Date(event.timestamp).toLocaleDateString()}</div>
            <div className="event-status">{event.status}</div>
            <div className="event-location">{event.location}</div>
            <div className="event-description">{event.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 3: Carrier Selection Component
export const CarrierSelector: React.FC<{ onCarrierSelect: (carrier: any) => void }> = ({ onCarrierSelect }) => {
  const bagster = useBagster('your_api_key_here');
  const [carriers, setCarriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    country: 'nigeria',
    transportMode: '',
    minRating: 4.0,
    verifiedOnly: true
  });

  useEffect(() => {
    const fetchCarriers = async () => {
      setLoading(true);

      try {
        const response = await bagster.getCarriers({
          country: filters.country,
          transport_mode: filters.transportMode || undefined,
          min_rating: filters.minRating,
          verified_only: filters.verifiedOnly
        });

        if (response.success && response.data) {
          setCarriers(response.data.carriers);
        }
      } catch (err) {
        console.error('Failed to fetch carriers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarriers();
  }, [bagster, filters]);

  return (
    <div className="carrier-selector">
      <h3>Select a Carrier</h3>
      
      <div className="filters">
        <select
          value={filters.transportMode}
          onChange={(e) => setFilters({...filters, transportMode: e.target.value})}
        >
          <option value="">All Transport Modes</option>
          <option value="road">Road</option>
          <option value="air">Air</option>
          <option value="sea">Sea</option>
        </select>

        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={filters.minRating}
          onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
          placeholder="Minimum Rating"
        />

        <label>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
          />
          Verified Only
        </label>
      </div>

      {loading ? (
        <div>Loading carriers...</div>
      ) : (
        <div className="carriers-grid">
          {carriers.map((carrier: any) => (
            <div key={carrier.id} className="carrier-card">
              <div className="carrier-header">
                <h4>{carrier.name}</h4>
                {carrier.verified && <span className="verified-badge">✓ Verified</span>}
              </div>
              
              <div className="carrier-rating">
                Rating: {carrier.rating}/5 ⭐
              </div>
              
              <div className="carrier-services">
                Services: {carrier.services.join(', ')}
              </div>
              
              <div className="carrier-areas">
                Areas: {carrier.service_areas.slice(0, 3).join(', ')}
                {carrier.service_areas.length > 3 && '...'}
              </div>
              
              <button onClick={() => onCarrierSelect(carrier)}>
                Select Carrier
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Example 4: Custom Hook for Shipping Integration
export const useShipping = (apiKey: string) => {
  const bagster = useBagster(apiKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateShipping = useCallback(async (origin: string, destination: string, weight: number) => {
    setLoading(true);
    setError('');

    try {
      const response = await bagster.calculateCost(origin, destination, weight);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to calculate shipping');
        return null;
      }
    } catch (err) {
      setError('Network error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [bagster]);

  const createShipment = useCallback(async (shipmentData: any) => {
    setLoading(true);
    setError('');

    try {
      const response = await bagster.createShipment(shipmentData);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to create shipment');
        return null;
      }
    } catch (err) {
      setError('Network error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [bagster]);

  return {
    calculateShipping,
    createShipment,
    trackShipment: bagster.trackShipment,
    validateAddress: bagster.validateAddress,
    formatTrackingNumber: bagster.formatTrackingNumber,
    loading,
    error
  };
};

// Example 5: Complete Checkout Integration
export const CheckoutShipping: React.FC<{ 
  cartItems: any[], 
  customerAddress: any,
  onShippingSelect: (shipping: any) => void 
}> = ({ cartItems, customerAddress, onShippingSelect }) => {
  const { calculateShipping, loading, error } = useShipping('your_api_key_here');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);

  useEffect(() => {
    const getShippingOptions = async () => {
      if (!customerAddress.city || !cartItems.length) return;

      const totalWeight = cartItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
      
      const result = await calculateShipping(
        'Lagos, Nigeria', // Your warehouse
        `${customerAddress.city}, ${customerAddress.country}`,
        totalWeight
      );

      if (result) {
        // In a real app, you'd get multiple options from getRates
        setShippingOptions([{
          id: 'standard',
          name: 'Standard Shipping',
          cost: result.estimated_cost,
          currency: result.currency,
          deliveryTime: '3-5 days'
        }]);
      }
    };

    getShippingOptions();
  }, [customerAddress, cartItems, calculateShipping]);

  const handleOptionSelect = (option: any) => {
    setSelectedCarrier(option);
    onShippingSelect(option);
  };

  if (loading) return <div>Calculating shipping options...</div>;
  if (error) return <div className="error">Shipping Error: {error}</div>;

  return (
    <div className="checkout-shipping">
      <h3>Shipping Options</h3>
      
      {shippingOptions.map((option: any) => (
        <div 
          key={option.id} 
          className={`shipping-option ${selectedCarrier?.id === option.id ? 'selected' : ''}`}
          onClick={() => handleOptionSelect(option)}
        >
          <div className="option-name">{option.name}</div>
          <div className="option-cost">{option.currency} {option.cost}</div>
          <div className="option-time">{option.deliveryTime}</div>
        </div>
      ))}
    </div>
  );
};

// CSS Styles (add to your stylesheet)
const styles = `
.shipping-calculator, .shipment-tracker, .carrier-selector, .checkout-shipping {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.rate-card, .carrier-card, .shipping-option {
  border: 1px solid #eee;
  padding: 15px;
  margin: 10px 0;
  border-radius: 6px;
  cursor: pointer;
}

.rate-card:hover, .carrier-card:hover, .shipping-option:hover {
  background-color: #f9f9f9;
}

.shipping-option.selected {
  border-color: #007bff;
  background-color: #e7f3ff;
}

.error {
  color: #dc3545;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 10px 0;
}

.verified-badge {
  background-color: #28a745;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.timeline-event {
  border-left: 3px solid #007bff;
  padding-left: 15px;
  margin: 10px 0;
}
`;

export { styles };
