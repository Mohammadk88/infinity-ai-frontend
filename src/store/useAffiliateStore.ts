import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '@/app/lib/axios';

interface ReferralLog {
  id: string;
  referredEmail: string;
  status: 'pending' | 'converted';
  registrationDate: string;
  commission?: number;
  plan?: string;
}

interface AffiliateStats {
  referralCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  referralCount: number;
  convertedCount: number;
  commissionRate: number;
  currency: string;
}

interface AffiliateState {
  stats: AffiliateStats | null;
  logs: ReferralLog[];
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchLogs: (page?: number, limit?: number, search?: string) => Promise<void>;
  resetState: () => void;
}

const initialStats: AffiliateStats = {
  referralCode: '',
  totalEarnings: 0,
  pendingEarnings: 0,
  referralCount: 0,
  convertedCount: 0,
  commissionRate: 10, // Default 10%
  currency: 'USD',
};

export const useAffiliateStore = create<AffiliateState>()(
  devtools(
    persist(
      (set, get) => ({
        stats: null,
        logs: [],
        isLoading: false,
        error: null,
        
        fetchStats: async () => {
          set({ isLoading: true, error: null });
          try {
            const { data } = await api.get('/affiliate/me');
            set({ stats: data, isLoading: false });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to fetch affiliate stats';
            set({ 
              error: errorMessage,
              isLoading: false 
            });
          }
        },
        
        fetchLogs: async (page = 1, limit = 10, search = '') => {
          set({ isLoading: true, error: null });
          try {
            const { data } = await api.get('/affiliate/me/logs', { 
              params: { page, limit, search }
            });
            set({ logs: data, isLoading: false });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to fetch referral logs';
            set({ 
              error: errorMessage,
              isLoading: false 
            });
          }
        },
        
        resetState: () => {
          set({ stats: null, logs: [], error: null });
        }
      }),
      {
        name: 'affiliate-storage',
        partialize: (state) => ({ stats: state.stats }),
      }
    )
  )
);

// Example of another interface if needed
export interface AffiliateReferralState {
  referrals: ReferralLog[];
  isLoading: boolean;
  fetchReferrals: () => Promise<void>;
  // other properties...
}

export interface AffiliateReferralsState {
  referrals: ReferralLog[];
  isLoading: boolean;
  fetchReferrals: () => void;
  // other properties...
}