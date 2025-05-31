'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Play,
  MoreVertical,
  RefreshCw,
  Unlink,
  ExternalLink,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { SocialAccount } from '@/types/SocialAccount';
import { formatDistanceToNow } from 'date-fns';

interface ConnectedAccountCardProps {
  account: SocialAccount;
  isRefreshing: boolean;
  onRefresh: (id: string) => void;
  onDisconnect: (id: string) => void;
  onViewProfile?: (account: SocialAccount) => void;
}

const PlatformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Play,
};

const StatusIcons = {
  connected: CheckCircle,
  error: AlertCircle,
  expired: Clock,
  pending: Loader2,
};

const StatusColors = {
  connected: 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400',
  expired: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400',
  pending: 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
};

export function ConnectedAccountCard({ 
  account, 
  isRefreshing, 
  onRefresh, 
  onDisconnect,
  onViewProfile 
}: ConnectedAccountCardProps) {
  const { t } = useTranslation();
  const IconComponent = PlatformIcons[account.platform];
  const StatusIcon = StatusIcons[account.status];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* Account Info */}
          <div className="flex items-start gap-3 flex-1">
            {/* Avatar */}
            <div className="h-12 w-12 rounded-full border-2 border-background shadow-sm overflow-hidden bg-muted flex items-center justify-center">
              {account.profileImage ? (
                <Image 
                  src={account.profileImage} 
                  alt={account.profileName}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  {account.profileName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm capitalize">{account.platform}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${StatusColors[account.status]}`}
                >
                  <StatusIcon className={`h-3 w-3 mr-1 ${account.status === 'pending' ? 'animate-spin' : ''}`} />
                  {t(`socialAccounts.status.${account.status}`, account.status)}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-base truncate mb-1">
                {account.profileName}
              </h3>
              
              <p className="text-sm text-muted-foreground truncate mb-2">
                @{account.username}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {account.followers && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{formatNumber(account.followers)} followers</span>
                  </div>
                )}
                {account.lastSync && (
                  <span>
                    {t('socialAccounts.lastSync', 'Synced {{time}}', {
                      time: formatDistanceToNow(new Date(account.lastSync), { addSuffix: true })
                    })}
                  </span>
                )}
              </div>

              {/* Error message */}
              {account.status === 'error' && account.error && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/10 rounded-md">
                  <p className="text-xs text-red-700 dark:text-red-400">
                    {account.error}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onRefresh(account.id)}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {t('common.refresh', 'Refresh')}
              </DropdownMenuItem>
              
              {onViewProfile && (
                <DropdownMenuItem onClick={() => onViewProfile(account)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('socialAccounts.viewProfile', 'View Profile')}
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem
                onClick={() => onDisconnect(account.id)}
                className="text-red-600 dark:text-red-400"
              >
                <Unlink className="h-4 w-4 mr-2" />
                {t('common.disconnect', 'Disconnect')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
