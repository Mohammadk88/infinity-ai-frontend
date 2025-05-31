'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import axios from '@/app/lib/axios';

interface OAuthConnectButtonProps {
  platform: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const OAuthConnectButton: React.FC<OAuthConnectButtonProps> = ({
  platform,
  children,
  variant = 'default',
  size = 'default',
  className,
  disabled = false,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    
    try {
      // Fetch OAuth URL from backend first
      const response = await axios.get(`/social-accounts/oauth/${platform}/authorize`);
      const url = response.data?.url;
      
      if (!url) {
        throw new Error('OAuth URL not returned from backend');
      }
      
      // Navigate to the OAuth URL in the same window
      window.location.href = url;
      
      // Call success callback if provided
      onSuccess?.();
      
    } catch (error) {
      console.error('Failed to connect to', platform, ':', error);
      const errorObj = error instanceof Error ? error : new Error('Failed to connect to platform');
      onError?.(errorObj);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || isLoading}
      onClick={handleConnect}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        children
      )}
    </Button>
  );
};
