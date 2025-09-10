import { db } from '../config/firebase';
import { PaymentIntent, Shipment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
  private paymentCollection = db.collection('payments');
  private shipmentCollection = db.collection('shipments');

  async createPaymentIntent(shipmentId: string, amount: number, currency: string = 'USD'): Promise<PaymentIntent> {
    try {
      // Verify shipment exists
      const shipmentDoc = await this.shipmentCollection.doc(shipmentId).get();
      if (!shipmentDoc.exists) {
        throw new Error('Shipment not found');
      }

      const paymentIntent: PaymentIntent = {
        id: uuidv4(),
        shipmentId,
        amount,
        currency,
        status: 'pending',
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };

      await this.paymentCollection.doc(paymentIntent.id).set(paymentIntent);
      return paymentIntent;
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPaymentIntent(paymentId: string): Promise<PaymentIntent | null> {
    try {
      const doc = await this.paymentCollection.doc(paymentId).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() } as PaymentIntent;
    } catch (error) {
      throw new Error(`Failed to get payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePaymentStatus(paymentId: string, status: PaymentIntent['status'], paymentMethod?: string): Promise<PaymentIntent> {
    try {
      const updateData: Partial<PaymentIntent> = {
        status,
        updatedAt: new Date() as any,
      };

      if (paymentMethod) {
        updateData.paymentMethod = paymentMethod;
      }

      await this.paymentCollection.doc(paymentId).update(updateData);

      const updatedPayment = await this.getPaymentIntent(paymentId);
      if (!updatedPayment) {
        throw new Error('Payment not found after update');
      }

      // If payment is completed, update shipment status
      if (status === 'completed') {
        await this.shipmentCollection.doc(updatedPayment.shipmentId).update({
          status: 'confirmed',
          updatedAt: new Date(),
        });
      }

      return updatedPayment;
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processPayment(paymentId: string, paymentMethod: string, paymentData: any): Promise<PaymentIntent> {
    try {
      const payment = await this.getPaymentIntent(paymentId);
      if (!payment) {
        throw new Error('Payment intent not found');
      }

      if (payment.status !== 'pending') {
        throw new Error('Payment already processed');
      }

      // Simulate payment processing based on method
      let success = false;
      
      switch (paymentMethod) {
        case 'card':
          success = await this.processCardPayment(paymentData);
          break;
        case 'mobile_money':
          success = await this.processMobileMoneyPayment(paymentData);
          break;
        case 'bank_transfer':
          success = await this.processBankTransfer(paymentData);
          break;
        default:
          throw new Error('Unsupported payment method');
      }

      const newStatus = success ? 'completed' : 'failed';
      return await this.updatePaymentStatus(paymentId, newStatus, paymentMethod);
    } catch (error) {
      await this.updatePaymentStatus(paymentId, 'failed');
      throw new Error(`Failed to process payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async processCardPayment(paymentData: any): Promise<boolean> {
    try {
      // Real Stripe integration
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      const { cardNumber, expiryMonth, expiryYear, cvv, amount, currency = 'usd' } = paymentData;
      
      // Create payment method
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardNumber,
          exp_month: expiryMonth,
          exp_year: expiryYear,
          cvc: cvv,
        },
      });

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        payment_method: paymentMethod.id,
        confirm: true,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      });

      return paymentIntent.status === 'succeeded';
    } catch (error) {
      console.error('Stripe payment error:', error);
      return false;
    }
  }

  private async processMobileMoneyPayment(paymentData: any): Promise<boolean> {
    try {
      // Real mobile money integration (example with Flutterwave)
      const flw = require('flutterwave-node-v3');
      
      const { phoneNumber, provider, amount, currency = 'NGN' } = paymentData;
      
      if (!phoneNumber || !provider || !amount) {
        return false;
      }

      const payload = {
        phone_number: phoneNumber,
        amount: amount,
        currency: currency,
        email: 'customer@bagster.com',
        tx_ref: `bagster_${Date.now()}`,
        network: provider.toUpperCase(), // MTN, AIRTEL, etc.
      };

      const response = await flw.MobileMoney.ng(payload);
      
      if (response.status === 'success') {
        // Poll for payment status
        const txRef = response.data.tx_ref;
        return await this.pollMobileMoneyStatus(txRef);
      }
      
      return false;
    } catch (error) {
      console.error('Mobile money payment error:', error);
      return false;
    }
  }

  private async pollMobileMoneyStatus(txRef: string, maxAttempts: number = 10): Promise<boolean> {
    const flw = require('flutterwave-node-v3');
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await flw.Transaction.verify({ id: txRef });
        
        if (response.data.status === 'successful') {
          return true;
        } else if (response.data.status === 'failed') {
          return false;
        }
        
        // Wait 3 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error('Error polling mobile money status:', error);
      }
    }
    
    return false; // Timeout
  }

  private async processBankTransfer(paymentData: any): Promise<boolean> {
    // Simulate bank transfer processing
    // In production, integrate with banking APIs
    const { accountNumber, bankCode, amount } = paymentData;
    
    if (!accountNumber || !bankCode || !amount) {
      return false;
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Simulate 98% success rate for bank transfers
    return Math.random() > 0.02;
  }

  async refundPayment(paymentId: string, reason?: string): Promise<PaymentIntent> {
    try {
      const payment = await this.getPaymentIntent(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'completed') {
        throw new Error('Can only refund completed payments');
      }

      // Process refund based on original payment method
      const refundSuccess = await this.processRefund(payment, reason);
      
      if (refundSuccess) {
        return await this.updatePaymentStatus(paymentId, 'refunded');
      } else {
        throw new Error('Refund processing failed');
      }
    } catch (error) {
      throw new Error(`Failed to refund payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async processRefund(payment: PaymentIntent, reason?: string): Promise<boolean> {
    // Simulate refund processing
    // In production, call appropriate refund APIs
    
    // Log refund attempt
    console.log(`Processing refund for payment ${payment.id}, amount: ${payment.amount}, reason: ${reason || 'No reason provided'}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 95% success rate for refunds
    return Math.random() > 0.05;
  }

  async getPaymentsByShipment(shipmentId: string): Promise<PaymentIntent[]> {
    try {
      const snapshot = await this.paymentCollection.where('shipmentId', '==', shipmentId).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PaymentIntent);
    } catch (error) {
      throw new Error(`Failed to get payments by shipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async calculateShippingCost(weight: number, distance: number, transportMode: string, priority: string = 'standard'): Promise<number> {
    try {
      // Base rates per kg per km
      const baseRates = {
        road: 0.05,
        air: 0.15,
        sea: 0.02,
      };

      // Priority multipliers
      const priorityMultipliers = {
        economy: 0.8,
        standard: 1.0,
        express: 1.5,
      };

      const baseRate = baseRates[transportMode as keyof typeof baseRates] || baseRates.road;
      const priorityMultiplier = priorityMultipliers[priority as keyof typeof priorityMultipliers] || 1.0;

      // Calculate base cost
      let cost = weight * distance * baseRate * priorityMultiplier;

      // Add minimum charge
      const minimumCharge = 10;
      cost = Math.max(cost, minimumCharge);

      // Add fuel surcharge (5%)
      cost *= 1.05;

      // Round to 2 decimal places
      return Math.round(cost * 100) / 100;
    } catch (error) {
      throw new Error(`Failed to calculate shipping cost: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async calculateInsuranceCost(declaredValue: number, transportMode: string): Promise<number> {
    try {
      // Insurance rates as percentage of declared value
      const insuranceRates = {
        road: 0.02, // 2%
        air: 0.015, // 1.5%
        sea: 0.025, // 2.5%
      };

      const rate = insuranceRates[transportMode as keyof typeof insuranceRates] || insuranceRates.road;
      const cost = declaredValue * rate;

      // Minimum insurance cost
      const minimumCost = 5;
      return Math.max(cost, minimumCost);
    } catch (error) {
      throw new Error(`Failed to calculate insurance cost: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const paymentService = new PaymentService();
