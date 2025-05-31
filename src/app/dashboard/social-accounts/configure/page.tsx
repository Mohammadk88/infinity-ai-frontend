'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, Users, Eye, EyeOff, Globe, Calendar, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

// Types and Services
import { SocialAccountService } from '@/services/api/SocialAccountService';
import { ConnectableAccount, PlatformType, SocialAccountCreate } from '@/types/SocialAccount';
import { cn } from '@/lib/utils';

// Form schema for page/profile selection
const configurationSchema = z.object({
  selectedPageId: z.string().min(1, 'Please select a page or profile to connect'),
  customName: z.string().min(1, 'Please provide a custom name for this connection').max(50, 'Name must be 50 characters or less'),
});

type ConfigurationForm = z.infer<typeof configurationSchema>;

// Platform configurations
const platformConfig = {
  facebook: {
    name: 'Facebook',
    color: 'bg-blue-500',
    icon: '📘',
    pageTypeLabel: 'Pages',
  },
  instagram: {
    name: 'Instagram',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500', 
    icon: '📷',
    pageTypeLabel: 'Business Accounts',
  },
  twitter: {
    name: 'Twitter',
    color: 'bg-sky-500',
    icon: '🐦',
    pageTypeLabel: 'Accounts',
  },
  linkedin: {
    name: 'LinkedIn',
    color: 'bg-blue-600',
    icon: '💼',
    pageTypeLabel: 'Company Pages',
  },
  tiktok: {
    name: 'TikTok',
    color: 'bg-black',
    icon: '🎵',
    pageTypeLabel: 'Accounts',
  },
  youtube: {
    name: 'YouTube',
    color: 'bg-red-500',
    icon: '📺',
    pageTypeLabel: 'Channels',
  },
};

// Mock OAuth data interface (in production this would come from sessionStorage/localStorage)
interface OAuthData {
  platform: PlatformType;
  accessToken: string;
  expiresAt?: string;
  userProfile: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
  availablePages: ConnectableAccount[];
}

export default function SocialAccountConfigurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Get platform from URL params
  const platform = searchParams?.get('platform') as PlatformType;
  
  const [oauthData, setOauthData] = useState<OAuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ConfigurationForm>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      selectedPageId: '',
      customName: '',
    },
  });

  const selectedPageId = form.watch('selectedPageId');

  // Save account mutation
  const saveAccountMutation = useMutation({
    mutationFn: async (data: SocialAccountCreate) => {
      return await SocialAccountService.connectAccount(data);
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Social account connected successfully',
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/social-accounts');
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to save social account connection',
        variant: 'destructive',
      });
    },
  });

  // Load OAuth data on mount
  useEffect(() => {
    const loadOAuthData = () => {
      try {
        // In production, this would come from URL params, sessionStorage, or a temporary backend endpoint
        const mockData: OAuthData = {
          platform: platform || 'facebook',
          accessToken: 'fb_access_token_here_' + Math.random().toString(36).substr(2, 9),
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
          userProfile: {
            id: 'user_123',
            name: 'John Smith',
            username: 'johnsmith',
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          },
          availablePages: generateMockPages(platform || 'facebook'),
        };

        setOauthData(mockData);
        
        // Set default custom name using platform config
        const platformCfg = platformConfig[platform] || {
          name: platform?.charAt(0).toUpperCase() + platform?.slice(1) || 'Social',
          color: 'bg-gray-500',
          icon: '🔗',
          pageTypeLabel: 'Accounts',
        };
        const defaultName = `${mockData.userProfile.name} ${platformCfg.name}`;
        form.setValue('customName', defaultName);
        
        setIsLoading(false);
      } catch {
        setError('Failed to load OAuth data. Please try connecting again.');
        setIsLoading(false);
      }
    };

    if (platform) {
      loadOAuthData();
    } else {
      setError('Invalid platform specified');
      setIsLoading(false);
    }
  }, [platform, form]);

  // Generate mock pages based on platform
  const generateMockPages = (platform: PlatformType): ConnectableAccount[] => {
    const basePages: Record<PlatformType, ConnectableAccount[]> = {
      facebook: [
        {
          id: 'page_1',
          name: 'Infinity AI Solutions',
          username: 'infinityai.solutions',
          profileImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
          followers: 12500,
          isBusinessAccount: true,
          accountType: 'Business Page',
        },
        {
          id: 'page_2', 
          name: 'Tech Innovation Hub',
          username: 'techinnovationhub',
          profileImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop',
          followers: 8900,
          isBusinessAccount: true,
          accountType: 'Community Page',
        },
        {
          id: 'page_3',
          name: 'John Smith Personal',
          username: 'johnsmith.personal',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          followers: 450,
          isBusinessAccount: false,
          accountType: 'Personal Profile',
        },
      ],
      instagram: [
        {
          id: 'ig_1',
          name: 'infinityai.official',
          username: 'infinityai.official',
          profileImage: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=150&h=150&fit=crop',
          followers: 25400,
          isBusinessAccount: true,
          accountType: 'Business Account',
        },
        {
          id: 'ig_2',
          name: 'techstartup.daily',
          username: 'techstartup.daily',
          profileImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop',
          followers: 18200,
          isBusinessAccount: true,
          accountType: 'Creator Account',
        },
      ],
      twitter: [
        {
          id: 'tw_1',
          name: 'Infinity AI',
          username: 'InfinityAI_Tech',
          profileImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
          followers: 15600,
          isBusinessAccount: false,
          accountType: 'Business Account',
        },
      ],
      linkedin: [
        {
          id: 'li_1',
          name: 'Infinity AI Solutions',
          username: 'infinity-ai-solutions',
          profileImage: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=150&h=150&fit=crop',
          followers: 8500,
          isBusinessAccount: true,
          accountType: 'Company Page',
        },
        {
          id: 'li_2',
          name: 'AI Innovation Network',
          username: 'ai-innovation-network',
          profileImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop',
          followers: 12000,
          isBusinessAccount: true,
          accountType: 'Showcase Page',
        },
      ],
      tiktok: [
        {
          id: 'tt_1',
          name: 'infinityai.tech',
          username: 'infinityai.tech',
          profileImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
          followers: 45200,
          isBusinessAccount: true,
          accountType: 'Business Account',
        },
      ],
      youtube: [
        {
          id: 'yt_1',
          name: 'Infinity AI Channel',
          username: 'InfinityAI',
          profileImage: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=150&h=150&fit=crop',
          followers: 128000,
          isBusinessAccount: true,
          accountType: 'Brand Account',
        },
      ],
    };

    return basePages[platform] || [];
  };

  // Handle form submission
  const handleFormSubmit = async (data: ConfigurationForm) => {
    if (!oauthData) return;

    const selectedPage = oauthData.availablePages.find(page => page.id === data.selectedPageId);
    if (!selectedPage) return;

    setIsSaving(true);

    const createData: SocialAccountCreate = {
      platform: oauthData.platform,
      accessToken: oauthData.accessToken,
      expiresAt: oauthData.expiresAt,
      selectedAccountId: selectedPage.id,
    };

    try {
      await saveAccountMutation.mutateAsync(createData);
    } catch (error) {
      console.error('Failed to save account:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatFollowerCount = (count?: number) => {
    if (!count) return 'N/A';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const maskAccessToken = (token: string) => {
    if (token.length <= 8) return token;
    return token.substring(0, 4) + '•••••••••••••••••' + token.substring(token.length - 4);
  };

  const formatExpiryDate = (expiresAt?: string) => {
    if (!expiresAt) return 'Never expires';
    const date = new Date(expiresAt);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentPlatformConfig = platformConfig[platform] || {
    name: platform?.charAt(0).toUpperCase() + platform?.slice(1) || 'Social',
    color: 'bg-gray-500',
    icon: '🔗',
    pageTypeLabel: 'Accounts',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading Configuration</h3>
            <p className="text-muted-foreground text-center">
              Please wait while we prepare your {currentPlatformConfig.name} connection...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !oauthData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Configuration Error</h3>
            <p className="text-muted-foreground text-center mb-6">
              {error || 'Failed to load OAuth configuration data.'}
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/social-accounts')}
              >
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedPage = oauthData.availablePages.find(page => page.id === selectedPageId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/social-accounts')}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white text-lg",
              currentPlatformConfig.color
            )}>
              {currentPlatformConfig.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Configure {currentPlatformConfig.name} Connection</h1>
              <p className="text-muted-foreground">
                Complete the setup for your {currentPlatformConfig.name} account
              </p>
            </div>
          </div>
        </div>

        {/* Connected Account Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Connected Account Summary
            </CardTitle>
            <CardDescription>
              Your {currentPlatformConfig.name} account has been successfully authenticated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* User Profile */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  User Profile
                </h4>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={oauthData.userProfile.profileImage} alt={oauthData.userProfile.name} />
                    <AvatarFallback>
                      {oauthData.userProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{oauthData.userProfile.name}</p>
                    <p className="text-sm text-muted-foreground">@{oauthData.userProfile.username}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Authenticated
                  </Badge>
                </div>
              </div>

              {/* Access Token Info */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Access Token
                </h4>
                <div className="p-3 border rounded-lg bg-muted/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-background px-2 py-1 rounded border flex-1">
                      {showAccessToken ? oauthData.accessToken : maskAccessToken(oauthData.accessToken)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAccessToken(!showAccessToken)}
                      className="h-8 w-8 p-0"
                    >
                      {showAccessToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Expires: {formatExpiryDate(oauthData.expiresAt)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Page/Profile Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Select {currentPlatformConfig.pageTypeLabel} to Connect
                </CardTitle>
                <CardDescription>
                  Choose which {currentPlatformConfig.pageTypeLabel.toLowerCase()} you want to connect to your workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                {oauthData.availablePages.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No {currentPlatformConfig.pageTypeLabel.toLowerCase()} found. You may need to create a business account first.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <FormField
                    control={form.control}
                    name="selectedPageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            {oauthData.availablePages.map((page) => (
                              <motion.div
                                key={page.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className={cn(
                                  "relative flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer",
                                  field.value === page.id && "border-primary bg-primary/5"
                                )}>
                                  <RadioGroupItem 
                                    value={page.id} 
                                    id={page.id}
                                    className="mt-1" 
                                  />
                                  <div className="flex items-center gap-3 flex-1">
                                    {page.profileImage && (
                                      <Image
                                        src={page.profileImage}
                                        alt={page.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-sm">{page.name}</h4>
                                        {page.isBusinessAccount && (
                                          <Badge variant="outline" className="text-xs">
                                            {page.accountType}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">@{page.username}</p>
                                      <div className="flex items-center gap-4 mt-2">
                                        {page.followers !== undefined && (
                                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Users className="h-3 w-3" />
                                            {formatFollowerCount(page.followers)} followers
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Custom Name */}
            <Card>
              <CardHeader>
                <CardTitle>Connection Settings</CardTitle>
                <CardDescription>
                  Customize how this connection appears in your workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="customName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={`e.g., ${oauthData.userProfile.name} ${currentPlatformConfig.name}`}
                          suppressHydrationWarning
                          autoComplete="off"
                          spellCheck={false}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This name will be displayed in your workspace. Make it descriptive for easy identification.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Preview Card */}
            {selectedPage && (
              <Card>
                <CardHeader>
                  <CardTitle>Connection Preview</CardTitle>
                  <CardDescription>
                    This is how your connection will appear in your workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                        currentPlatformConfig.color
                      )}>
                        {currentPlatformConfig.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{form.watch('customName') || 'Custom Name'}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {currentPlatformConfig.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedPage.name} (@{selectedPage.username})
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Connected
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/social-accounts')}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedPageId || isSaving}
                className="min-w-[140px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Connection
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
