import axios from '@/app/lib/axios';
import { 
  SocialAccount, 
  SocialAccountCreate, 
  SocialAccountUpdate, 
  PlatformType,
  OAuthAuthorizationUrl,
  OAuthCallback,
  ConnectableAccount,
  SocialAccountStats
} from '@/types/SocialAccount';

export const SocialAccountService = {
  /**
   * Get all social accounts for the current user
   */
  getAccounts: async (): Promise<SocialAccount[]> => {
    console.log('🔍 SocialAccountService: Requesting social accounts from API...');
    console.log('🌐 API Endpoint: POST /social-accounts/my-social-accounts');
    
    try {
      const response = await axios.post('social-accounts/my-social-accounts');
      console.log('✅ SocialAccountService: API response received:', {
        status: response.status,
        dataLength: response.data?.length || 0,
        data: response.data
      });
      
      // Ensure we return an array
      const accounts = Array.isArray(response.data) ? response.data : [];
      
      if (accounts.length === 0) {
        console.log('⚠️ SocialAccountService: No social accounts found for user');
        console.log('💡 Troubleshooting tips:');
        console.log('  - Check if user is properly authenticated');
        console.log('  - Verify userId is sent to backend');
        console.log('  - Confirm user has connected social accounts');
        console.log('  - Check backend logs for API call');
      } else {
        console.log(`✅ Successfully fetched ${accounts.length} social accounts`);
      }
      
      return accounts;
    } catch (error) {
      console.error('❌ SocialAccountService: Failed to fetch accounts:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } };
        console.error('📋 Error details:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          url: 'social-accounts/my-social-accounts'
        });
        
        if (axiosError.response?.status === 401) {
          console.error('🔒 Authentication error - user may not be logged in');
          console.error('💡 User needs to authenticate to access social accounts');
        } else if (axiosError.response?.status === 403) {
          console.error('🚫 Authorization error - user may not have access');
        } else if (axiosError.response?.status === 404) {
          console.error('🔍 Endpoint not found - check if backend API is running');
        } else if (axiosError.response?.status && axiosError.response.status >= 500) {
          console.error('🔥 Server error - check backend logs');
        }
      } else {
        console.error('🌐 Network error or API unavailable');
      }
      
      throw error;
    }
  },

  /**
   * Get social account statistics
   */
  getStats: async (): Promise<SocialAccountStats> => {
    console.log('🔍 Fetching social account stats...');
    try {
      const response = await axios.post('social-accounts/get-account-stats');
      console.log('✅ Social account stats received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch social account stats:', error);
      throw error;
    }
  },

  /**
   * Get OAuth authorization URL for a platform
   */
  getOAuthUrl: async (platform: PlatformType): Promise<OAuthAuthorizationUrl> => {
    const response = await axios.post(`/social-accounts/oauth/${platform}/authorize`);
    return response.data;
  },

  /**
   * Handle OAuth callback and get available accounts
   */
  handleOAuthCallback: async (data: OAuthCallback): Promise<ConnectableAccount[]> => {
    const response = await axios.post(`/social-accounts/oauth/${data.platform}/callback`, {
      code: data.code,
      state: data.state
    });
    return response.data;
  },

  /**
   * Connect a social account
   */
  connectAccount: async (data: SocialAccountCreate): Promise<SocialAccount> => {
    const response = await axios.post('/social-accounts', data);
    return response.data;
  },

  /**
   * Update an existing social account
   */
  updateAccount: async (id: string, data: SocialAccountUpdate): Promise<SocialAccount> => {
    const response = await axios.patch(`/social-accounts/${id}`, data);
    return response.data;
  },

  /**
   * Disconnect/delete a social account
   */
  disconnectAccount: async (id: string): Promise<void> => {
    await axios.delete(`/social-accounts/${id}`);
  },

  /**
   * Refresh account data (sync with platform)
   */
  refreshAccount: async (id: string): Promise<SocialAccount> => {
    const response = await axios.post(`/social-accounts/${id}/refresh`);
    return response.data;
  },

  /**
   * Test account connection
   */
  testConnection: async (id: string): Promise<{ success: boolean; error?: string }> => {
    const response = await axios.post(`/social-accounts/${id}/test`);
    return response.data;
  }
};