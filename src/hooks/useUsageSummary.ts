import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/axios';

// Types for subscription data
export interface SubscriptionPlan {
  planId: string;
  planName: string;
  features: {
    [key: string]: number | string | boolean;
  };
}

// Types for usage data
export interface UsageItem {
  type: string;
  used: number;
  limit: number; // -1 for unlimited
}

// Query Keys
export const usageSummaryKeys = {
  all: ['usage-summary'] as const,
  subscription: () => [...usageSummaryKeys.all, 'subscription'] as const,
  usage: () => [...usageSummaryKeys.all, 'usage'] as const,
};

// Hook to fetch current subscription
export function useCurrentSubscription() {
  return useQuery({
    queryKey: usageSummaryKeys.subscription(),
    queryFn: async (): Promise<SubscriptionPlan> => {
      try {
        const response = await api.get('/subscriptions/me', { withCredentials: true });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
        // Return mock data for development
        return {
          planId: 'small-business',
          planName: 'Small Business',
          features: {
            ai_generations: -1,
            scheduled_posts: -1,
            social_accounts: -1,
            ai_agents: 5
          }
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          return false;
        }
      }
      return true;
    },
  });
}

// Hook to fetch usage limits
export function useUsageLimits() {
  return useQuery({
    queryKey: usageSummaryKeys.usage(),
    queryFn: async (): Promise<UsageItem[]> => {
      try {
        const response = await api.get('/usage-limit', { withCredentials: true });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch usage limits:', error);
        // Return mock data for development
        return [
          { type: 'AI Generations', used: 245, limit: -1 },
          { type: 'Scheduled Posts', used: 67, limit: -1 },
          { type: 'Social Accounts', used: 8, limit: -1 },
          { type: 'AI Agents', used: 3, limit: 5 }
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          return false;
        }
      }
      return true;
    },
  });
}

// Helper functions
export function getUsagePercentage(used: number, limit: number): number {
  if (limit === -1) return 0; // Unlimited
  return Math.min((used / limit) * 100, 100);
}

export function formatUsageText(used: number, limit: number): string {
  if (limit === -1) {
    return `${used.toLocaleString()} / Unlimited`;
  }
  return `${used.toLocaleString()} / ${limit.toLocaleString()}`;
}

export function getUsageStatus(percentage: number): 'safe' | 'warning' | 'danger' {
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warning';
  return 'safe';
}

export function getUsageColor(status: 'safe' | 'warning' | 'danger'): string {
  switch (status) {
    case 'danger':
      return 'text-red-600';
    case 'warning':
      return 'text-orange-600';
    default:
      return 'text-green-600';
  }
}

export function getProgressColor(status: 'safe' | 'warning' | 'danger'): string {
  switch (status) {
    case 'danger':
      return 'bg-red-500';
    case 'warning':
      return 'bg-orange-500';
    default:
      return 'bg-green-500';
  }
}

export function getPlanBadgeVariant(planName: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const lowerName = planName.toLowerCase();
  if (lowerName.includes('free') || lowerName.includes('basic')) return 'outline';
  if (lowerName.includes('business') || lowerName.includes('pro')) return 'default';
  if (lowerName.includes('agency') || lowerName.includes('enterprise')) return 'secondary';
  return 'default';
}
