import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/axios';

// Types
export interface UsageLimit {
  used: number;
  total: number; // -1 for unlimited
}

export interface UsageLimits {
  aiGenerations: UsageLimit;
  scheduledPosts: UsageLimit;
  socialAccounts: UsageLimit;
  aiAgents: UsageLimit;
}

export interface UserPlan {
  id: string;
  name: string;
  tier: 'freelancer' | 'small-business' | 'agency';
  limits: UsageLimits;
}

interface UsageLimitResponse {
  plan: UserPlan;
  limits: UsageLimits;
}

// Query Keys
export const usageLimitKeys = {
  all: ['usage-limit'] as const,
  limits: () => [...usageLimitKeys.all, 'limits'] as const,
  plan: () => [...usageLimitKeys.all, 'plan'] as const,
};

// Hook to fetch usage limits
export function useUsageLimits() {
  return useQuery({
    queryKey: usageLimitKeys.limits(),
    queryFn: async (): Promise<UsageLimitResponse> => {
      try {
        const response = await api.get('/usage-limit', { withCredentials: true });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch usage limits:', error);
        // Return mock data for development
        return {
          plan: {
            id: 'small-business',
            name: 'Small Business',
            tier: 'small-business',
            limits: {
              aiGenerations: { used: 45, total: -1 },
              scheduledPosts: { used: 85, total: -1 },
              socialAccounts: { used: 8, total: -1 },
              aiAgents: { used: 3, total: 5 }
            }
          },
          limits: {
            aiGenerations: { used: 45, total: -1 },
            scheduledPosts: { used: 85, total: -1 },
            socialAccounts: { used: 8, total: -1 },
            aiAgents: { used: 3, total: 5 }
          }
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry for auth errors
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

// Helper function to calculate usage percentage
export function getUsagePercentage(used: number, total: number): number {
  if (total === -1) return 0; // Unlimited
  return Math.min((used / total) * 100, 100);
}

// Helper function to format usage display
export function formatUsage(used: number, total: number): string {
  if (total === -1) {
    return `${used.toLocaleString()} / Unlimited`;
  }
  return `${used.toLocaleString()} / ${total.toLocaleString()}`;
}

// Helper function to get usage color based on percentage
export function getUsageColor(percentage: number): string {
  if (percentage >= 90) return 'text-red-600';
  if (percentage >= 75) return 'text-orange-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-green-600';
}
