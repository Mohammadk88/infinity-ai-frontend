import api from '@/app/lib/axios';

export interface CheckoutSessionResponse {
  sessionUrl: string;
  sessionId: string;
}

export interface PaymentIntent {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentVerificationResult {
  success: boolean;
  subscriptionId?: string;
  paymentIntentId?: string;
  error?: string;
}

/**
 * Create a checkout session for a subscription plan
 */
export const createCheckoutSession = async (payload: PaymentIntent): Promise<CheckoutSessionResponse> => {
  try {
    const response = await api.post('/payments/checkout-session', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create checkout session:', error);
    throw new Error(error.response?.data?.message || 'Failed to create checkout session');
  }
};

/**
 * Verify payment success after checkout
 */
export const verifyPayment = async (sessionId: string): Promise<PaymentVerificationResult> => {
  try {
    const response = await api.post('/payments/verify', { sessionId });
    return response.data;
  } catch (error: any) {
    console.error('Failed to verify payment:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Payment verification failed'
    };
  }
};

/**
 * Get payment methods for user
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await api.get('/payments/methods');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch payment methods:', error);
    return [];
  }
};

/**
 * Add a new payment method
 */
export const addPaymentMethod = async (setupIntentId: string): Promise<PaymentMethod> => {
  const response = await api.post('/payments/methods', { setupIntentId });
  return response.data;
};

/**
 * Delete a payment method
 */
export const deletePaymentMethod = async (paymentMethodId: string): Promise<void> => {
  await api.delete(`/payments/methods/${paymentMethodId}`);
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<void> => {
  await api.patch(`/payments/methods/${paymentMethodId}/default`);
};
