import axios from '@/app/lib/axios';

interface OAuthResult {
  success: boolean;
  data?: Record<string, unknown>;
}

interface OAuthMessage {
  type: 'OAUTH_SUCCESS' | 'OAUTH_ERROR';
  data?: Record<string, unknown>;
  error?: string;
  provider?: string;
  timestamp?: string;
}

interface OAuthCallbackData {
  code?: string;
  state?: string;
  platform?: string;
  timestamp?: string;
  [key: string]: unknown;
}

/**
 * Connect to a social media platform using OAuth with popup window
 * @param platform - The platform ID (e.g., 'facebook', 'instagram', 'twitter')
 * @returns Promise that resolves when OAuth is completed or rejects on failure
 * @throws Error if the OAuth URL cannot be retrieved or popup is blocked
 */
export const connectSocial = async (platform: string): Promise<OAuthResult> => {
  try {
    // Get OAuth authorization URL from backend
    const res = await axios.get(`/social-accounts/oauth/${platform}/authorize`);
    const url = res.data?.url;
    
    if (!url) {
      throw new Error('OAuth URL not returned from backend');
    }
    
    // ✅ Open OAuth in a new popup window for better UX
    const popup = window.open(
      url, 
      'oauth_popup', 
      'width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
    );
    
    if (!popup) {
      throw new Error('Failed to open OAuth window. Please allow popups for this site.');
    }
    
    // Focus the popup window
    popup.focus();
    
    // Return a promise that resolves when OAuth is complete
    return new Promise((resolve, reject) => {
      // Listen for messages from the popup
      const messageListener = (event: MessageEvent<OAuthMessage>) => {
        // Verify origin for security (adjust for your domain)
        if (event.origin !== window.location.origin) {
          return;
        }
        
        if (event.data.type === 'OAUTH_SUCCESS') {
          cleanup();
          resolve({ success: true, data: event.data.data });
        } else if (event.data.type === 'OAUTH_ERROR') {
          cleanup();
          reject(new Error(event.data.error || 'OAuth authorization failed'));
        }
      };
      
      // Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          cleanup();
          reject(new Error('OAuth window was closed before completion'));
        }
      }, 1000);
      
      // Cleanup function
      const cleanup = () => {
        window.removeEventListener('message', messageListener);
        clearInterval(checkClosed);
        if (!popup.closed) {
          popup.close();
        }
      };
      
      // Add event listener
      window.addEventListener('message', messageListener);
      
      // Timeout after 5 minutes
      setTimeout(() => {
        cleanup();
        reject(new Error('OAuth authorization timed out'));
      }, 5 * 60 * 1000);
    });
    
  } catch (error) {
    console.error('❌ OAuth connection failed:', error);
    throw error;
  }
};

/**
 * Handle OAuth callback - should be called from the OAuth callback page
 * @param success - Whether the OAuth was successful
 * @param data - Any data to pass back to the parent window
 * @param error - Error message if OAuth failed
 */
export const handleOAuthCallback = (success: boolean, data?: OAuthCallbackData, error?: string) => {
  if (window.opener) {
    const message: OAuthMessage = success 
      ? { 
          type: 'OAUTH_SUCCESS', 
          data,
          provider: data?.platform,
          timestamp: new Date().toISOString()
        }
      : { 
          type: 'OAUTH_ERROR', 
          error,
          timestamp: new Date().toISOString()
        };
    
    window.opener.postMessage(message, window.location.origin);
    window.close();
  }
};
