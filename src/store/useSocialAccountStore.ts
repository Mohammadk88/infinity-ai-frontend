import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  SocialAccount, 
  SocialAccountCreate, 
  SocialAccountUpdate, 
  PlatformType,
  ConnectableAccount,
  SocialAccountStats,
  SocialPlatform
} from '@/types/SocialAccount';
import { SocialAccountService } from '@/services/api/SocialAccountService';

interface SocialAccountState {
  // State
  accounts: SocialAccount[];
  connectableAccounts: ConnectableAccount[];
  stats: SocialAccountStats | null;
  isLoading: boolean;
  isConnecting: boolean;
  isRefreshing: string | null; // Account ID being refreshed
  error: string | null;
  selectedPlatform: PlatformType | null;
  
  // Connection flow state
  oauthUrl: string | null;
  oauthState: string | null;
  showConnectionModal: boolean;
  
  // Actions
  fetchAccounts: () => Promise<void>;
  fetchStats: () => Promise<void>;
  startOAuthFlow: (platform: PlatformType) => Promise<void>;
  handleOAuthCallback: (code: string, state: string, platform: PlatformType) => Promise<void>;
  connectAccount: (data: SocialAccountCreate) => Promise<void>;
  disconnectAccount: (id: string) => Promise<void>;
  refreshAccount: (id: string) => Promise<void>;
  updateAccount: (id: string, data: SocialAccountUpdate) => Promise<void>;
  testConnection: (id: string) => Promise<boolean>;
  
  // UI Actions
  setSelectedPlatform: (platform: PlatformType | null) => void;
  setShowConnectionModal: (show: boolean) => void;
  clearError: () => void;
  reset: () => void;
}

// Available social platforms configuration
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    description: 'Connect your Facebook Pages and Business accounts to schedule posts and manage content.',
    authMethod: 'oauth',
    permissions: ['pages_read_engagement', 'pages_manage_posts', 'pages_manage_metadata'],
    isAvailable: true
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',
    description: 'Connect your Instagram Business account to schedule posts and analyze performance.',
    authMethod: 'oauth',
    permissions: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_comments'],
    isAvailable: true
  },
  {
    id: 'twitter',
    name: 'Twitter',
    color: 'bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',
    description: 'Connect your Twitter account to schedule tweets and engage with your audience.',
    authMethod: 'oauth',
    permissions: ['tweet.read', 'tweet.write', 'users.read'],
    isAvailable: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    description: 'Connect your LinkedIn profile or company page to share professional content.',
    authMethod: 'oauth',
    permissions: ['r_liteprofile', 'w_member_social'],
    isAvailable: true
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-950/50 dark:text-neutral-400',
    description: 'Connect your TikTok account to schedule videos and track performance.',
    authMethod: 'oauth',
    permissions: ['user.info.basic', 'video.upload'],
    isAvailable: true
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400',
    description: 'Connect your YouTube channel to upload videos and manage content.',
    authMethod: 'oauth',
    permissions: ['youtube.upload', 'youtube.readonly'],
    isAvailable: true
  }
];

export const useSocialAccountStore = create<SocialAccountState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        accounts: [],
        connectableAccounts: [],
        stats: null,
        isLoading: false,
        isConnecting: false,
        isRefreshing: null,
        error: null,
        selectedPlatform: null,
        oauthUrl: null,
        oauthState: null,
        showConnectionModal: false,

        // Fetch all social accounts
        fetchAccounts: async () => {
          set({ isLoading: true, error: null });
          try {
            const accounts = await SocialAccountService.getAccounts();
            set({ accounts, isLoading: false });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch social accounts';
            set({ error: errorMessage, isLoading: false });
          }
        },

        // Fetch account statistics
        fetchStats: async () => {
          try {
            const stats = await SocialAccountService.getStats();
            set({ stats });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stats';
            set({ error: errorMessage });
          }
        },

        // Start OAuth flow for a platform
        startOAuthFlow: async (platform: PlatformType) => {
          set({ isConnecting: true, error: null, selectedPlatform: platform });
          try {
            const { url, state } = await SocialAccountService.getOAuthUrl(platform);
            set({ oauthUrl: url, oauthState: state });
            
            // Open OAuth URL in new window
            window.open(url, 'oauth', 'width=600,height=600');
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to start OAuth flow';
            set({ error: errorMessage, isConnecting: false });
          }
        },

        // Handle OAuth callback
        handleOAuthCallback: async (code: string, state: string, platform: PlatformType) => {
          try {
            const connectableAccounts = await SocialAccountService.handleOAuthCallback({
              code,
              state,
              platform
            });
            set({ 
              connectableAccounts, 
              showConnectionModal: true,
              isConnecting: false 
            });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to handle OAuth callback';
            set({ error: errorMessage, isConnecting: false });
          }
        },

        // Connect a social account
        connectAccount: async (data: SocialAccountCreate) => {
          set({ isConnecting: true, error: null });
          try {
            const newAccount = await SocialAccountService.connectAccount(data);
            set((state) => ({
              accounts: [...state.accounts, newAccount],
              isConnecting: false,
              showConnectionModal: false,
              connectableAccounts: [],
              selectedPlatform: null
            }));
            
            // Refresh stats
            get().fetchStats();
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to connect account';
            set({ error: errorMessage, isConnecting: false });
          }
        },

        // Disconnect a social account
        disconnectAccount: async (id: string) => {
          set({ error: null });
          try {
            await SocialAccountService.disconnectAccount(id);
            set((state) => ({
              accounts: state.accounts.filter(account => account.id !== id)
            }));
            
            // Refresh stats
            get().fetchStats();
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect account';
            set({ error: errorMessage });
          }
        },

        // Refresh account data
        refreshAccount: async (id: string) => {
          set({ isRefreshing: id, error: null });
          try {
            const updatedAccount = await SocialAccountService.refreshAccount(id);
            set((state) => ({
              accounts: state.accounts.map(account => 
                account.id === id ? updatedAccount : account
              ),
              isRefreshing: null
            }));
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to refresh account';
            set({ error: errorMessage, isRefreshing: null });
          }
        },

        // Update account
        updateAccount: async (id: string, data: SocialAccountUpdate) => {
          set({ error: null });
          try {
            const updatedAccount = await SocialAccountService.updateAccount(id, data);
            set((state) => ({
              accounts: state.accounts.map(account => 
                account.id === id ? updatedAccount : account
              )
            }));
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update account';
            set({ error: errorMessage });
          }
        },

        // Test connection
        testConnection: async (id: string) => {
          try {
            const result = await SocialAccountService.testConnection(id);
            if (!result.success && result.error) {
              set((state) => ({
                accounts: state.accounts.map(account => 
                  account.id === id 
                    ? { ...account, status: 'error' as const, error: result.error }
                    : account
                )
              }));
            }
            return result.success;
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to test connection';
            set({ error: errorMessage });
            return false;
          }
        },

        // UI Actions
        setSelectedPlatform: (platform: PlatformType | null) => {
          set({ selectedPlatform: platform });
        },

        setShowConnectionModal: (show: boolean) => {
          set({ showConnectionModal: show });
          if (!show) {
            set({ connectableAccounts: [], selectedPlatform: null });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        reset: () => {
          set({
            accounts: [],
            connectableAccounts: [],
            stats: null,
            isLoading: false,
            isConnecting: false,
            isRefreshing: null,
            error: null,
            selectedPlatform: null,
            oauthUrl: null,
            oauthState: null,
            showConnectionModal: false
          });
        }
      }),
      {
        name: 'social-account-store',
        partialize: (state) => ({
          accounts: state.accounts,
          stats: state.stats
        })
      }
    ),
    { name: 'social-account-store' }
  )
);