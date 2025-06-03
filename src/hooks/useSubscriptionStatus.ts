import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/axios';

// Types for subscription status
export interface SubscriptionStatus {
  planId: string | null;          // null if not subscribed
  planName: string | null;
  isTrial: boolean;
  startDate: string | null;       // ISO date string
  endDate: string | null;         // ISO date string
}

// Query Keys
export const subscriptionStatusKeys = {
  all: ['subscription-status'] as const,
  status: () => [...subscriptionStatusKeys.all, 'status'] as const,
};

// Hook to fetch current subscription status
export function useSubscriptionStatus() {
  return useQuery({
    queryKey: subscriptionStatusKeys.status(),
    queryFn: async (): Promise<SubscriptionStatus> => {
      try {
        console.log('🔍 Fetching subscription status from /subscriptions/me');
        const response = await api.get('/subscriptions/me', { withCredentials: true });
        console.log('✅ Subscription status received:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Failed to fetch subscription status:', error);
        
        // Check if it's a 404 (no subscription found)
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            // Return "no subscription" state
            return {
              planId: null,
              planName: null,
              isTrial: false,
              startDate: null,
              endDate: null,
            };
          }
        }
        
        // For development, return mock data
        return {
          planId: 'small-business',
          planName: 'Small Business',
          isTrial: false,
          startDate: '2025-06-01T00:00:00.000Z',
          endDate: '2025-07-01T00:00:00.000Z',
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        // Don't retry for auth errors or 404 (no subscription)
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403 || axiosError.response?.status === 404) {
          return false;
        }
      }
      return true;
    },
  });
}

// Helper functions
export function calculateDaysRemaining(endDate: string | null): number {
  if (!endDate) return 0;
  
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

export function isSubscriptionExpired(endDate: string | null): boolean {
  if (!endDate) return false;
  
  const now = new Date();
  const end = new Date(endDate);
  
  return now > end;
}

export function isSubscriptionExpiringSoon(endDate: string | null, daysThreshold: number = 7): boolean {
  if (!endDate) return false;
  
  const daysRemaining = calculateDaysRemaining(endDate);
  return daysRemaining > 0 && daysRemaining <= daysThreshold;
}

export function getSubscriptionStatusType(
  planId: string | null,
  endDate: string | null
): 'none' | 'active' | 'expired' | 'expiring-soon' {
  if (!planId) return 'none';
  if (isSubscriptionExpired(endDate)) return 'expired';
  if (isSubscriptionExpiringSoon(endDate)) return 'expiring-soon';
  return 'active';
}

export function formatTimeRemaining(endDate: string | null): string {
  if (!endDate) return '';
  
  const daysRemaining = calculateDaysRemaining(endDate);
  
  if (daysRemaining === 0) return 'Expires today';
  if (daysRemaining === 1) return 'Expires tomorrow';
  if (daysRemaining <= 30) return `Expires in ${daysRemaining} days`;
  
  // For longer periods, show months
  const monthsRemaining = Math.floor(daysRemaining / 30);
  if (monthsRemaining === 1) return 'Expires in 1 month';
  if (monthsRemaining < 12) return `Expires in ${monthsRemaining} months`;
  
  // For very long periods, show years
  const yearsRemaining = Math.floor(daysRemaining / 365);
  return `Expires in ${yearsRemaining} year${yearsRemaining > 1 ? 's' : ''}`;
}

export function getStatusBadgeVariant(statusType: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (statusType) {
    case 'active':
      return 'default';
    case 'expired':
      return 'destructive';
    case 'expiring-soon':
      return 'secondary';
    default:
      return 'outline';
  }
}

export function getStatusBadgeColor(statusType: string): string {
  switch (statusType) {
    case 'active':
      return 'text-green-700 bg-green-100 border-green-300';
    case 'expired':
      return 'text-red-700 bg-red-100 border-red-300';
    case 'expiring-soon':
      return 'text-orange-700 bg-orange-100 border-orange-300';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}
