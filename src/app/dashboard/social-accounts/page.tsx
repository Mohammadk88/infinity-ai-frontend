'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Trash2, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Globe, 
  Youtube, 
  Play, 
  IceCream, 
  Check, 
  AlertCircle, 
  RefreshCw,
  MoreVertical,
  Filter,
  Search,
  ArrowRight,
  BarChart,
  Share2,
  Settings,
  Calendar,
  Unlink
} from 'lucide-react';
import api from '@/app/lib/axios';
import { useAuth } from '@/hooks/useAuth';

// Type definitions for social accounts
interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  profileName: string;
  profileImage?: string;
  status: 'connected' | 'error' | 'expired';
  followers?: number;
  lastSync?: string;
  error?: string;
}

export default function SocialAccountsPage() {
  const { t } = useTranslation();
  const { user } = useAuth(true);
  
  // State for social accounts
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  
  // Platforms available to connect
  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-5 w-5" />, color: 'bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400' },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-5 w-5" />, color: 'bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="h-5 w-5" />, color: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400' },
    { id: 'tiktok', name: 'TikTok', icon: <Play className="h-5 w-5" />, color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-950/50 dark:text-neutral-400' },
    { id: 'pinterest', name: 'Pinterest', icon: <IceCream className="h-5 w-5" />, color: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400' },
  ];

  // Mock account data - would be replaced with API calls in production
  const mockAccounts: SocialAccount[] = [
    {
      id: '1',
      platform: 'facebook',
      username: 'infinity.marketing',
      profileName: 'Infinity Marketing',
      status: 'connected',
      followers: 12500,
      lastSync: '2025-04-12T10:30:00Z',
    },
    {
      id: '2',
      platform: 'instagram',
      username: 'infinity.marketing',
      profileName: 'Infinity Marketing',
      status: 'connected',
      followers: 28700,
      lastSync: '2025-04-12T10:30:00Z',
    },
    {
      id: '3',
      platform: 'twitter',
      username: 'infinitymarketing',
      profileName: 'Infinity Marketing AI',
      status: 'error',
      followers: 5200,
      lastSync: '2025-04-10T15:45:00Z',
      error: 'API authentication expired'
    },
    {
      id: '4',
      platform: 'linkedin',
      username: 'infinity-marketing-ai',
      profileName: 'Infinity Marketing AI',
      status: 'connected',
      followers: 3800,
      lastSync: '2025-04-12T10:30:00Z',
    }
  ];

  // Fetch social accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        // In a real implementation, we'd fetch from the API
        // const response = await api.get('/social-accounts');
        // setAccounts(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setAccounts(mockAccounts);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching social accounts:', error);
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Filter accounts based on search and status filter
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      account.profileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus ? account.status === filterStatus : true;
    return matchesSearch && matchesFilter;
  });

  // Handle connect new account
  const handleConnect = (platformId: string) => {
    setIsConnecting(platformId);
    
    // Simulate API connection process
    setTimeout(() => {
      const platform = platforms.find(p => p.id === platformId);
      if (platform) {
        const newAccount: SocialAccount = {
          id: Math.random().toString(36).substring(2, 9),
          platform: platformId,
          username: `user_${platformId}`,
          profileName: `User ${platform.name}`,
          status: 'connected',
          followers: Math.floor(Math.random() * 10000),
          lastSync: new Date().toISOString()
        };
        
        setAccounts([...accounts, newAccount]);
      }
      
      setIsConnecting(null);
    }, 2000);
  };

  // Handle disconnect account
  const handleDisconnect = (accountId: string) => {
    // In a real implementation, we'd make an API call to disconnect
    // api.delete(`/social-accounts/${accountId}`);
    
    setAccounts(accounts.filter(account => account.id !== accountId));
  };

  // Handle refresh account
  const handleRefresh = (accountId: string) => {
    // In a real implementation, we'd make an API call to refresh the account data
    // For now, just update the lastSync timestamp
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, lastSync: new Date().toISOString() }
        : account
    ));
  };

  // Get platform icon component
  const getPlatformIcon = (platformId: string, size = 'md') => {
    const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    const platform = platforms.find(p => p.id === platformId);
    
    if (platform) {
      return <div className={`${iconSize}`}>{platform.icon}</div>;
    }
    
    return <Globe className={iconSize} />;
  };

  // Get platform color class
  const getPlatformColorClass = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.color || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="success" className="gap-1"><Check className="h-3 w-3" />{t('socialAccounts.status.connected', 'Connected')}</Badge>;
      case 'error':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />{t('socialAccounts.status.error', 'Error')}</Badge>;
      case 'expired':
        return <Badge variant="warning" className="gap-1"><AlertCircle className="h-3 w-3" />{t('socialAccounts.status.expired', 'Expired')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return t('socialAccounts.time.justNow', 'just now');
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return t('socialAccounts.time.minutesAgo', '{{count}} minute(s) ago', { count: diffInMinutes });
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t('socialAccounts.time.hoursAgo', '{{count}} hour(s) ago', { count: diffInHours });
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return t('socialAccounts.time.daysAgo', '{{count}} day(s) ago', { count: diffInDays });
    }
    
    return date.toLocaleDateString();
  };

  // Format large numbers with K, M suffix
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Get available platforms (those not already connected)
  const getAvailablePlatforms = () => {
    const connectedPlatforms = accounts.map(account => account.platform);
    return platforms.filter(platform => !connectedPlatforms.includes(platform.id));
  };

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('socialAccounts.title', 'Social Accounts')}
          </h1>
          <p className="text-muted-foreground">
            {t('socialAccounts.subtitle', 'Manage your connected social media accounts')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            {t('socialAccounts.settings', 'Account Settings')}
          </Button>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {t('socialAccounts.connect', 'Connect Account')}
          </Button>
        </div>
      </div>

      {/* Social Accounts Summary Card */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            {t('socialAccounts.summary.title', 'Accounts Overview')}
          </CardTitle>
          <CardDescription>
            {t('socialAccounts.summary.description', 'Your connected social media accounts and their status')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-secondary/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="text-4xl font-bold mb-1">{accounts.filter(a => a.status === 'connected').length}</div>
                <p className="text-sm text-muted-foreground">{t('socialAccounts.summary.connected', 'Connected Accounts')}</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="text-4xl font-bold mb-1">{accounts.filter(a => a.status === 'error').length}</div>
                <p className="text-sm text-muted-foreground">{t('socialAccounts.summary.errors', 'Accounts with Errors')}</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="text-4xl font-bold mb-1">
                  {accounts.reduce((total, account) => total + (account.followers || 0), 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">{t('socialAccounts.summary.followers', 'Total Followers')}</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="text-4xl font-bold mb-1">{platforms.length - accounts.length}</div>
                <p className="text-sm text-muted-foreground">{t('socialAccounts.summary.available', 'Available Platforms')}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder={t('socialAccounts.searchPlaceholder', 'Search accounts...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filterStatus === null ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus(null)}
          >
            All
          </Button>
          <Button 
            variant={filterStatus === "connected" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus("connected")}
          >
            Connected
          </Button>
          <Button 
            variant={filterStatus === "error" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus("error")}
          >
            Errors
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-3.5 w-3.5" />
            {t('socialAccounts.filters', 'Filters')}
          </Button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div>
        <h2 className="text-lg font-medium mb-4">{t('socialAccounts.connected.title', 'Connected Accounts')}</h2>
        
        {loading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="border-border/60">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : filteredAccounts.length === 0 ? (
          // Empty state
          <Card className="border-dashed border-muted-foreground/20">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                <Share2 className="h-8 w-8 text-muted-foreground/70" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t('socialAccounts.empty.title', 'No Social Accounts Connected')}</h3>
              <p className="text-muted-foreground mb-6 max-w-md">{t('socialAccounts.empty.description', 'Connect your social media accounts to start creating and scheduling content across platforms.')}</p>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                {t('socialAccounts.empty.cta', 'Connect Your First Account')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Account list
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className="border-border/60 overflow-hidden animate__animated animate__fadeIn">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className={`h-2 w-full ${account.status === 'connected' ? 'bg-green-500' : account.status === 'error' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getPlatformColorClass(account.platform)}`}>
                            {getPlatformIcon(account.platform)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{account.profileName}</h3>
                              {getStatusBadge(account.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">@{account.username}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {account.followers && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{formatNumber(account.followers)}</span>
                                  <span>{t('socialAccounts.metrics.followers', 'Followers')}</span>
                                </div>
                              )}
                              
                              {account.lastSync && (
                                <div className="flex items-center gap-1">
                                  <RefreshCw className="h-3 w-3" />
                                  <span>{t('socialAccounts.metrics.lastSync', 'Synced {{time}}', { time: formatRelativeTime(account.lastSync) })}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                      
                      {account.error && (
                        <div className="mt-4 p-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-md text-xs">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{account.error}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                            <RefreshCw className="h-3 w-3" />
                            {t('socialAccounts.actions.sync', 'Sync')}
                          </Button>
                          {account.status === 'error' && (
                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                              {t('socialAccounts.actions.reconnect', 'Reconnect')}
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                            <BarChart className="h-3 w-3" />
                            {t('socialAccounts.actions.analytics', 'Analytics')}
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs text-destructive hover:text-destructive gap-1"
                          onClick={() => handleDisconnect(account.id)}
                        >
                          <Unlink className="h-3 w-3" />
                          {t('socialAccounts.actions.disconnect', 'Disconnect')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Connect new accounts */}
      {getAvailablePlatforms().length > 0 && !loading && (
        <div>
          <h2 className="text-lg font-medium mb-4">{t('socialAccounts.available.title', 'Available Platforms')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getAvailablePlatforms().map((platform) => (
              <Card key={platform.id} className="border-border/60 hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${platform.color} mb-3`}>
                    {platform.icon}
                  </div>
                  <h3 className="text-sm font-medium mb-3">{platform.name}</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnecting === platform.id}
                  >
                    {isConnecting === platform.id ? (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
                        <span>{t('socialAccounts.available.connecting', 'Connecting...')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 justify-center">
                        <span>{t('socialAccounts.available.connect', 'Connect')}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Post scheduling card */}
      <Card className="border-border/60 bg-muted/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {t('socialAccounts.scheduling.title', 'Smart Post Scheduling')}
              </h3>
              <p className="text-muted-foreground max-w-lg">
                {t('socialAccounts.scheduling.description', 'Let our AI analyze your audience engagement patterns and automatically schedule your posts for optimal visibility and impact.')}
              </p>
            </div>
            <Button className="gap-2 self-start">
              {t('socialAccounts.scheduling.cta', 'View Schedule')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}