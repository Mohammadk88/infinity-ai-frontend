import api from '@/app/lib/axios';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  priceMonthly?: number;
  priceYearly?: number;
  price?: number;
  billing_cycle?: 'monthly' | 'yearly';
  features: {
    ai_generation?: number;
    ai_generations?: number;
    scheduled_posts?: number;
    social_accounts?: number;
    ai_agents?: number;
  };
  is_popular?: boolean;
  is_recommended?: boolean;
}

export interface UserSubscription {
  id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  current_period_start: string;
  current_period_end: string;
  plan: SubscriptionPlan;
}

export interface ActivateSubscriptionPayload {
  planId: string;
  billingCycle?: 'monthly' | 'yearly';
  paymentIntentId?: string;
  sessionId?: string;
}

/**
 * Get all available subscription plans
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await api.get('/subscription-plans');
  return response.data;
};

/**
 * Get current user subscription
 */
export const getCurrentSubscription = async (): Promise<UserSubscription | null> => {
  try {
    const response = await api.get('/subscriptions/me');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Activate a subscription plan
 */
export const activateSubscription = async (payload: ActivateSubscriptionPayload): Promise<UserSubscription> => {
  const response = await api.post('/subscriptions/activate', payload);
  return response.data;
};

/**
 * Cancel current subscription
 */
export const cancelSubscription = async (): Promise<void> => {
  await api.post('/subscriptions/cancel');
};

/**
 * Resume a cancelled subscription
 */
export const resumeSubscription = async (): Promise<UserSubscription> => {
  const response = await api.post('/subscriptions/resume');
  return response.data;
};

/**
 * Update subscription billing cycle
 */
export const updateBillingCycle = async (billingCycle: 'monthly' | 'yearly'): Promise<UserSubscription> => {
  const response = await api.patch('/subscriptions/billing-cycle', { billingCycle });
  return response.data;
};

/**
 * Get subscription usage statistics
 */
export const getSubscriptionUsage = async () => {
  const response = await api.get('/subscriptions/usage');
  return response.data;
};
