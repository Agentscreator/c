// lib/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil', // Updated to the latest API version
});

// Client-side Stripe
export const getStripePublishableKey = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};

// Helper functions for common Stripe operations
export const stripeHelpers = {
  // Create a customer
  async createCustomer(email: string, name: string, phone?: string) {
    return await stripe.customers.create({
      email,
      name,
      phone,
    });
  },

  // Create a setup intent for saving payment method
  async createSetupIntent(customerId: string) {
    return await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
    });
  },

  // Create a payment intent for immediate payment
  async createPaymentIntent(amount: number, customerId: string, paymentMethodId?: string) {
    const params: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'usd',
      customer: customerId,
      payment_method_types: ['card'],
    };

    if (paymentMethodId) {
      params.payment_method = paymentMethodId;
      params.confirm = true;
      params.return_url = `${process.env.NEXT_PUBLIC_BASE_URL}/wallet`;
    }

    return await stripe.paymentIntents.create(params);
  },

  // Retrieve payment methods for a customer
  async getPaymentMethods(customerId: string) {
    return await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  },

  // Detach a payment method
  async detachPaymentMethod(paymentMethodId: string) {
    return await stripe.paymentMethods.detach(paymentMethodId);
  },

  // Get payment method details
  async getPaymentMethod(paymentMethodId: string) {
    return await stripe.paymentMethods.retrieve(paymentMethodId);
  },

  // Create a payment method
  async createPaymentMethod(type: 'card', card: any) {
    return await stripe.paymentMethods.create({
      type,
      card,
    });
  },

  // Attach payment method to customer
  async attachPaymentMethod(paymentMethodId: string, customerId: string) {
    return await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  },
};