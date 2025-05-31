'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Play,
  Loader2,
  Check
} from 'lucide-react';
import { SocialPlatform, PlatformType } from '@/types/SocialAccount';

interface PlatformCardProps {
  platform: SocialPlatform;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: (platformId: PlatformType) => void;
}

const PlatformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Play,
};

export function PlatformCard({ platform, isConnected, isConnecting, onConnect }: PlatformCardProps) {
  const { t } = useTranslation();
  const IconComponent = PlatformIcons[platform.id];

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${platform.color} group-hover:scale-110 transition-transform`}>
            <IconComponent className="h-5 w-5" />
          </div>
          {isConnected && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400">
              <Check className="h-3 w-3 mr-1" />
              {t('common.connected', 'Connected')}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{platform.name}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {platform.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Auth method info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="capitalize">{platform.authMethod}</span>
            <span>•</span>
            <span>{platform.permissions?.length || 0} permissions</span>
          </div>
          
          {/* Connect button */}
          <Button
            onClick={() => onConnect(platform.id)}
            disabled={!platform.isAvailable || isConnecting || isConnected}
            className="w-full"
            variant={isConnected ? "outline" : "default"}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('common.connecting', 'Connecting...')}
              </>
            ) : isConnected ? (
              t('common.connected', 'Connected')
            ) : (
              t('socialAccounts.platform.connectAccount', 'Connect Account')
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
