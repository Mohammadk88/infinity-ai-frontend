'use client';

import { useEffect, useCallback } from 'react';

interface OAuthMessage {
  type: 'OAUTH_SUCCESS' | 'OAUTH_ERROR';
  data?: Record<string, unknown>;
  error?: string;
  provider?: string;
  timestamp?: string;
}

interface UseOAuthMessageListenerOptions {
  onSuccess?: (data?: Record<string, unknown>, provider?: string) => void;
  onError?: (error?: string) => void;
  enabled?: boolean;
}

/**
 * Custom hook for handling OAuth popup messages
 * Provides a clean way to listen for OAuth success/error messages from popup windows
 */
export const useOAuthMessageListener = ({
  onSuccess,
  onError,
  enabled = true
}: UseOAuthMessageListenerOptions) => {
  
  const handleMessage = useCallback((event: MessageEvent<OAuthMessage>) => {
    // Verify origin for security
    if (event.origin !== window.location.origin) {
      return;
    }

    // Ensure the message is related to OAuth
    if (!event.data || typeof event.data !== 'object') {
      return;
    }

    if (event.data.type === 'OAUTH_SUCCESS') {
      console.log('✅ OAuth success from', event.data.provider);
      onSuccess?.(event.data.data, event.data.provider);
    } else if (event.data.type === 'OAUTH_ERROR') {
      console.error('❌ OAuth error:', event.data.error);
      onError?.(event.data.error);
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage, enabled]);
};
