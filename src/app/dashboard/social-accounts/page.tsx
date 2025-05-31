'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search,
  Users,
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useSocialAccountStore, SOCIAL_PLATFORMS } from '@/store/useSocialAccountStore';
import {
  useSocialAccounts,
  useSocialAccountStats,
  useDisconnectSocialAccount,
  useRefreshSocialAccount
} from '@/hooks/useSocialAccounts';
import { PlatformCard } from '@/components/social/platform-card';
import { ConnectedAccountCard } from '@/components/social/connected-account-card';
import { ConnectionModal } from '@/components/social/connection-modal';
import { PlatformType, AccountStatus } from '@/types/SocialAccount';
import { connectSocial } from '@/utils/oauthConnect';
import { useOAuthMessageListener } from '@/hooks/useOAuthMessageListener';

export default function SocialAccountsPage() {
  const { t } = useTranslation();
  useAuth(true); // Remove unused user variable
  const { toast } = useToast();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<AccountStatus | 'all'>('all');
  
  // Store state
  const {
    showConnectionModal,
    setShowConnectionModal,
    selectedPlatform,
    isConnecting,
    isRefreshing
  } = useSocialAccountStore();

  // React Query hooks
  const { 
    data: accounts = [], 
    isLoading: accountsLoading, 
    error: accountsError,
    refetch: refetchAccounts,
    isFetching: accountsFetching
  } = useSocialAccounts();
  const { data: stats, isLoading: statsLoading, error: statsError } = useSocialAccountStats();
  const disconnectAccountMutation = useDisconnectSocialAccount();
  const refreshAccountMutation = useRefreshSocialAccount();

  // ✅ Handle OAuth success messages from popup window using custom hook
  useOAuthMessageListener({
    onSuccess: (data, provider) => {
      console.log('✅ OAuth success from', provider);
      
      // Refresh accounts list after successful connection
      refetchAccounts();
      
      // Show success toast
      toast({
        title: t('common.success', 'Success'),
        description: t('socialAccounts.oauth.success', 'Social account connected successfully!'),
      });
      
      // Close connection modal if open
      setShowConnectionModal(false);
    },
    onError: (error) => {
      console.error('❌ OAuth error:', error);
      
      // Show error toast
      toast({
        title: t('common.error', 'Error'),
        description: error || t('socialAccounts.oauth.failed', 'Failed to connect account'),
        variant: 'destructive',
      });
    }
  });

  // Filter accounts based on search and status
  const filteredAccounts = accounts.filter(account => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (account.username?.toLowerCase().includes(searchLower) ?? false) || 
      (account.profileName?.toLowerCase().includes(searchLower) ?? false);
    const matchesFilter = filterStatus === 'all' ? true : account.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Get connected platform IDs
  const connectedPlatforms = new Set(accounts.map(account => account.platform));

  // Handle platform connection
  const handleConnectPlatform = async (platformId: PlatformType) => {
    try {
      // ✅ Open OAuth popup - the useEffect will handle the success/error response
      await connectSocial(platformId);
      
      // Show initial message that popup opened
      toast({
        title: t('socialAccounts.oauth.started', 'OAuth Started'),
        description: t('socialAccounts.oauth.popupOpened', 'Please complete authorization in the popup window.'),
      });
      
    } catch (error) {
      console.error('❌ Failed to open OAuth popup:', error);
      
      let errorMessage = t('socialAccounts.oauth.failed', 'Failed to connect platform');
      
      if (error instanceof Error) {
        if (error.message.includes('popup')) {
          errorMessage = t('socialAccounts.oauth.popupBlocked', 'Please allow popups for this site and try again.');
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: t('common.error', 'Error'),
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Handle account refresh
  const handleRefreshAccount = async (accountId: string) => {
    try {
      await refreshAccountMutation.mutateAsync(accountId);
      toast({
        title: t('common.success', 'Success'),
        description: t('socialAccounts.account.refreshed', 'Account refreshed successfully'),
      });
    } catch (error) {
      toast({
        title: t('common.error', 'Error'),
        description: error instanceof Error ? error.message : t('socialAccounts.account.refreshFailed', 'Failed to refresh account'),
        variant: 'destructive',
      });
    }
  };

  // Handle account disconnect
  const handleDisconnectAccount = async (accountId: string) => {
    try {
      await disconnectAccountMutation.mutateAsync(accountId);
      toast({
        title: t('common.success', 'Success'),
        description: t('socialAccounts.account.disconnected', 'Account disconnected successfully'),
      });
    } catch (error) {
      toast({
        title: t('common.error', 'Error'),
        description: error instanceof Error ? error.message : t('socialAccounts.account.disconnectFailed', 'Failed to disconnect account'),
        variant: 'destructive',
      });
    }
  };

  // Handle account profile view
  const handleViewProfile = (account: { profileUrl?: string }) => {
    if (account.profileUrl) {
      window.open(account.profileUrl, '_blank');
    }
  };

  // Handle manual refresh
  const handleManualRefresh = () => {
    refetchAccounts();
    toast({
      title: t('common.refreshing', 'Refreshing'),
      description: t('socialAccounts.refreshing', 'Refreshing social accounts...'),
    });
  };

  const isAnyAccountRefreshing = isRefreshing !== null;
  const statusOptions = [
    { value: 'all', label: t('common.all', 'All'), count: accounts.length },
    { value: 'connected', label: t('socialAccounts.status.connected', 'Connected'), count: accounts.filter(a => a.status === 'connected').length },
    { value: 'error', label: t('socialAccounts.status.error', 'Error'), count: accounts.filter(a => a.status === 'error').length },
    { value: 'expired', label: t('socialAccounts.status.expired', 'Expired'), count: accounts.filter(a => a.status === 'expired').length },
  ];

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 Social Accounts Page Debug Info:', {
      accountsCount: accounts.length,
      accountsLoading,
      accountsError: accountsError?.message,
      accountsFetching,
      stats,
      statsLoading,
      statsError: statsError?.message,
      accounts: accounts.map(acc => ({ id: acc.id, platform: acc.platform, status: acc.status }))
    });
  }, [accounts, accountsLoading, accountsError, accountsFetching, stats, statsLoading, statsError]);

  // Check for errors and show debug info
  if (accountsError) {
    console.error('❌ Accounts Error:', accountsError);
  }
  if (statsError) {
    console.error('❌ Stats Error:', statsError);
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('socialAccounts.title', 'Social Accounts')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('socialAccounts.description', 'Connect and manage your social media accounts for content distribution and engagement.')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={accountsLoading || isAnyAccountRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(accountsLoading || isAnyAccountRefreshing) ? 'animate-spin' : ''}`} />
            {t('common.refresh', 'Refresh')}
          </Button>
          
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            {t('common.settings', 'Settings')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('socialAccounts.stats.totalAccounts', 'Total Accounts')}
                  </p>
                  <p className="text-2xl font-bold">{stats.totalAccounts}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('socialAccounts.stats.connectedAccounts', 'Connected')}
                  </p>
                  <p className="text-2xl font-bold text-green-600">{stats.connectedAccounts}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('socialAccounts.stats.errorAccounts', 'With Errors')}
                  </p>
                  <p className="text-2xl font-bold text-red-600">{stats.errorAccounts}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('socialAccounts.stats.totalFollowers', 'Total Followers')}
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.totalFollowers >= 1000000 
                      ? `${(stats.totalFollowers / 1000000).toFixed(1)}M`
                      : stats.totalFollowers >= 1000
                      ? `${(stats.totalFollowers / 1000).toFixed(1)}K`
                      : stats.totalFollowers.toString()
                    }
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card> */}
        </div>
      )}

      {/* Available Platforms */}
      <Card id="available-platforms">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            {t('socialAccounts.availablePlatforms', 'Available Platforms')}
          </CardTitle>
          <CardDescription>
            {t('socialAccounts.availablePlatformsDescription', 'Connect your social media accounts to start managing your content.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOCIAL_PLATFORMS.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                isConnected={connectedPlatforms.has(platform.id)}
                isConnecting={isConnecting && selectedPlatform === platform.id}
                onConnect={handleConnectPlatform}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {t('socialAccounts.connectedAccounts', 'Connected Accounts')} ({filteredAccounts.length})
              </CardTitle>
              <CardDescription>
                {t('socialAccounts.connectedAccountsDescription', 'Manage your connected social media accounts.')}
              </CardDescription>
            </div>
            
            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('common.search', 'Search accounts...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                  suppressHydrationWarning
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              
              <div className="flex items-center gap-1">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filterStatus === option.value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterStatus(option.value as AccountStatus | 'all')}
                    className="text-xs"
                  >
                    {option.label}
                    {option.count > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {option.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {accountsError ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-red-600">
                {t('socialAccounts.error.fetchFailed', 'Failed to load social accounts')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {accountsError instanceof Error 
                  ? accountsError.message 
                  : t('socialAccounts.error.unknown', 'An unknown error occurred')
                }
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => refetchAccounts()} 
                  variant="outline"
                  disabled={accountsFetching}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${accountsFetching ? 'animate-spin' : ''}`} />
                  {t('common.retry', 'Retry')}
                </Button>
                {process.env.NODE_ENV === 'development' && (
                  <details className="text-left mt-4">
                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      Debug Information
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                      {JSON.stringify({
                        error: accountsError,
                        accountsCount: accounts.length,
                        isLoading: accountsLoading,
                        isFetching: accountsFetching
                      }, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ) : accountsLoading || accountsFetching ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                {accountsFetching && !accountsLoading 
                  ? t('common.refreshing', 'Refreshing...')
                  : t('common.loading', 'Loading...')
                }
              </span>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || filterStatus !== 'all'
                  ? t('socialAccounts.noFilteredAccounts', 'No accounts match your filters')
                  : accounts.length === 0
                  ? t('socialAccounts.noConnectedAccounts', 'No connected accounts')
                  : t('socialAccounts.noFilteredAccounts', 'No accounts match your filters')
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? t('socialAccounts.tryDifferentFilters', 'Try adjusting your search or filters.')
                  : accounts.length === 0
                  ? t('socialAccounts.connectFirstAccount', 'Connect your first social media account to get started.')
                  : t('socialAccounts.tryDifferentFilters', 'Try adjusting your search or filters.')
                }
              </p>
              
              {/* Debug information for empty accounts */}
              {accounts.length === 0 && process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    🔍 Debug Information (Development Only)
                  </h4>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                    <p>• API Endpoint: <code>GET /social-accounts</code></p>
                    <p>• Total Accounts: <code>{accounts.length}</code></p>
                    <p>• Loading State: <code>{accountsLoading ? 'true' : 'false'}</code></p>
                    <p>• Error State: <code>{accountsError ? 'has error' : 'no error'}</code></p>
                    <p className="mt-2 font-medium">Troubleshooting:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Check if user is authenticated</li>
                      <li>Verify userId is sent to backend</li>
                      <li>Confirm user has connected social accounts</li>
                      <li>Check backend logs for API call</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {!searchTerm && filterStatus === 'all' && accounts.length === 0 && (
                <Button onClick={() => document.querySelector('#available-platforms')?.scrollIntoView({ behavior: 'smooth' })}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t('socialAccounts.connectAccount', 'Connect Account')}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAccounts.map((account) => (
                <ConnectedAccountCard
                  key={account.id}
                  account={account}
                  isRefreshing={isRefreshing === account.id}
                  onRefresh={handleRefreshAccount}
                  onDisconnect={handleDisconnectAccount}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Modal */}
      <ConnectionModal
        open={showConnectionModal}
        onOpenChange={setShowConnectionModal}
      />
    </div>
  );
}