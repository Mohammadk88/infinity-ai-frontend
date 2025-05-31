'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, RefreshCw } from 'lucide-react';
import { handleOAuthCallback } from '@/utils/oauthConnect';

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing OAuth authorization...');

  useEffect(() => {
    const processCallback = () => {
      try {
        // Get parameters from URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');
        
        if (error) {
          // OAuth error occurred
          setStatus('error');
          setMessage(`Authorization failed: ${error}`);
          handleOAuthCallback(false, undefined, error);
          return;
        }
        
        if (code) {
          // OAuth successful - send code back to parent
          setStatus('success');
          setMessage('Authorization successful! Closing window...');
          
          // Extract platform from state or URL path
          const urlParams = new URLSearchParams(window.location.search);
          const platform = urlParams.get('platform') || state?.split('-')[0] || 'unknown';
          
          handleOAuthCallback(true, {
            code,
            state: state || undefined,
            platform,
            timestamp: new Date().toISOString()
          });
          
          // Close window after a short delay
          setTimeout(() => {
            window.close();
          }, 1500);
        } else {
          // No code or error - something went wrong
          setStatus('error');
          setMessage('No authorization code received');
          handleOAuthCallback(false, undefined, 'No authorization code received');
        }
        
      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setMessage('An error occurred processing the authorization');
        handleOAuthCallback(false, undefined, 'Processing error');
      }
    };

    // Small delay to ensure page has loaded
    const timer = setTimeout(processCallback, 500);
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <RefreshCw className="h-5 w-5 animate-spin" />}
            {status === 'success' && <Check className="h-5 w-5 text-green-600" />}
            {status === 'error' && <X className="h-5 w-5 text-red-600" />}
            
            OAuth Authorization
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className={`text-sm ${
            status === 'success' ? 'text-green-600' : 
            status === 'error' ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {message}
          </p>
          
          {status === 'success' && (
            <p className="text-xs text-muted-foreground mt-2">
              This window will close automatically.
            </p>
          )}
          
          {status === 'error' && (
            <p className="text-xs text-muted-foreground mt-2">
              You can close this window and try again.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}