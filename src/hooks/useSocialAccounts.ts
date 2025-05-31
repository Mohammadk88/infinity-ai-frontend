import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SocialAccountService } from '@/services/api/SocialAccountService';
import {
  SocialAccount,
  SocialAccountCreate,
  SocialAccountUpdate,
  PlatformType,
  ConnectableAccount
} from '@/types/SocialAccount';

// Query Keys
export const socialAccountsKeys = {
  all: ['social-accounts'] as const,
  accounts: () => [...socialAccountsKeys.all, 'accounts'] as const,
  stats: () => [...socialAccountsKeys.all, 'stats'] as const,
  account: (id: string) => [...socialAccountsKeys.all, 'account', id] as const,
  oauthCallback: (platform: PlatformType, code: string, state: string) => 
    [...socialAccountsKeys.all, 'oauth-callback', platform, code, state] as const,
};

// Hooks
export function useSocialAccounts() {
  return useQuery({
    queryKey: socialAccountsKeys.accounts(),
    queryFn: async () => {
      console.log('🔍 Fetching social accounts...');
      try {
        const accounts = await SocialAccountService.getAccounts();
        console.log('✅ Social accounts fetched:', accounts);
        console.log(`📊 Found ${accounts.length} social accounts`);
        return accounts;
      } catch (error) {
        console.error('❌ Failed to fetch social accounts:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for social accounts`);
      // Retry up to 3 times for network errors, but not for auth errors
      if (failureCount >= 3) return false;
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          return false; // Don't retry auth errors
        }
      }
      return true;
    },
    refetchOnWindowFocus: false,
  });
}

export function useSocialAccountStats() {
  return useQuery({
    queryKey: socialAccountsKeys.stats(),
    queryFn: SocialAccountService.getStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useConnectSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SocialAccountCreate) => SocialAccountService.connectAccount(data),
    onSuccess: (newAccount: SocialAccount) => {
      // Update accounts list
      queryClient.setQueryData(
        socialAccountsKeys.accounts(),
        (old: SocialAccount[] = []) => [...old, newAccount]
      );
      
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.stats() });
    },
    onError: (error: Error) => {
      console.error('Failed to connect account:', error.message);
    },
  });
}

export function useDisconnectSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SocialAccountService.disconnectAccount(id),
    onSuccess: (_, accountId) => {
      // Remove from accounts list
      queryClient.setQueryData(
        socialAccountsKeys.accounts(),
        (old: SocialAccount[] = []) => old.filter(account => account.id !== accountId)
      );
      
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.stats() });
    },
    onError: (error: Error) => {
      console.error('Failed to disconnect account:', error.message);
    },
  });
}

export function useRefreshSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SocialAccountService.refreshAccount(id),
    onSuccess: (updatedAccount) => {
      // Update the specific account in the list
      queryClient.setQueryData(
        socialAccountsKeys.accounts(),
        (old: SocialAccount[] = []) =>
          old.map(account => account.id === updatedAccount.id ? updatedAccount : account)
      );
    },
    onError: (error: Error) => {
      console.error('Failed to refresh account:', error.message);
    },
  });
}

export function useUpdateSocialAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SocialAccountUpdate }) =>
      SocialAccountService.updateAccount(id, data),
    onSuccess: (updatedAccount) => {
      // Update the specific account in the list
      queryClient.setQueryData(
        socialAccountsKeys.accounts(),
        (old: SocialAccount[] = []) =>
          old.map(account => account.id === updatedAccount.id ? updatedAccount : account)
      );
    },
    onError: (error: Error) => {
      console.error('Failed to update account:', error.message);
    },
  });
}

export function useStartOAuthFlow() {
  return useMutation({
    mutationFn: (platform: PlatformType) => SocialAccountService.getOAuthUrl(platform),
    onSuccess: ({ url }) => {
      // Open OAuth URL in new window
      const popup = window.open(url, 'oauth', 'width=600,height=600,scrollbars=yes,resizable=yes');
      
      // Focus the popup window
      if (popup) {
        popup.focus();
      }
    },
    onError: (error: Error) => {
      console.error('Failed to start OAuth flow:', error.message);
    },
  });
}

export function useOAuthCallback(platform: PlatformType, code: string, state: string) {
  return useQuery({
    queryKey: socialAccountsKeys.oauthCallback(platform, code, state),
    queryFn: async (): Promise<ConnectableAccount[]> => {
      if (!code || !state || !platform) {
        throw new Error('Missing required OAuth parameters');
      }

      const result = await SocialAccountService.handleOAuthCallback({
        code,
        state,
        platform,
      });
      return result;
    },
    enabled: !!(code && state && platform),
    retry: false,
    staleTime: 0, // Don't cache OAuth callback results
  });
}
