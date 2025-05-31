'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Types and Services
import { SocialAccountService } from '@/services/api/SocialAccountService';
import { ConnectableAccount, PlatformType, SocialAccountCreate } from '@/types/SocialAccount';
import { useConnectSocialAccount } from '@/hooks/useSocialAccounts';
import { cn } from '@/lib/utils';

// Form schema for account selection
const accountSelectionSchema = z.object({
  selectedAccounts: z.array(z.string()).min(1, 'Please select at least one account to connect'),
});

type AccountSelectionForm = z.infer<typeof accountSelectionSchema>;

// Platform configurations
const platformConfig = {
  facebook: {
    name: 'Facebook',
    color: 'bg-blue-500',
    icon: '📘',
  },
  instagram: {
    name: 'Instagram',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    icon: '📷',
  },
  twitter: {
    name: 'Twitter',
    color: 'bg-sky-500',
    icon: '🐦',
  },
  linkedin: {
    name: 'LinkedIn',
    color: 'bg-blue-600',
    icon: '💼',
  },
  tiktok: {
    name: 'TikTok',
    color: 'bg-black',
    icon: '🎵',
  },
  youtube: {
    name: 'YouTube',
    color: 'bg-red-500',
    icon: '📺',
  },
};

export default function SocialAccountConnectPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const platform = params?.platform as PlatformType;
  const code = searchParams?.get('code');
  const state = searchParams?.get('state');

  const [availableAccounts, setAvailableAccounts] = useState<ConnectableAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const connectAccountMutation = useConnectSocialAccount();

  const form = useForm<AccountSelectionForm>({
    resolver: zodResolver(accountSelectionSchema),
    defaultValues: {
      selectedAccounts: [],
    },
  });

  const selectedAccounts = form.watch('selectedAccounts');

  // Fetch available accounts from OAuth callback
  const {
    data: accounts,
    error: fetchError,
    isLoading: isFetching,
  } = useQuery({
    queryKey: ['oauth-callback', platform, code, state],
    queryFn: async () => {
      if (!code || !state || !platform) {
        throw new Error('Missing required OAuth parameters');
      }

      const result = await SocialAccountService.handleOAuthCallback({
        code,
        state,
        platform,
      });
      return result;
    },
    enabled: !!(code && state && platform),
    retry: false,
  });

  // Update state when accounts are fetched
  useEffect(() => {
    if (accounts) {
      setAvailableAccounts(accounts);
      setIsLoading(false);
    }
  }, [accounts]);

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      setIsLoading(false);
      toast({
        title: 'Connection Failed',
        description: fetchError instanceof Error ? fetchError.message : 'Failed to fetch available accounts',
        variant: 'destructive',
      });
    }
  }, [fetchError, toast]);

  // Handle missing OAuth parameters
  useEffect(() => {
    if (!code || !state || !platform) {
      toast({
        title: 'Invalid Request',
        description: 'Missing OAuth parameters. Please try connecting again.',
        variant: 'destructive',
      });
      router.push('/dashboard/social-accounts');
    }
  }, [code, state, platform, router, toast]);

  const handleFormSubmit = async (data: AccountSelectionForm) => {
    if (!data.selectedAccounts.length) return;

    setShowConfirmDialog(true);
  };

  const handleConfirmConnection = async () => {
    const selectedAccountData = availableAccounts.filter(account => 
      selectedAccounts.includes(account.id)
    );

    setIsConnecting(true);
    setShowConfirmDialog(false);
    
    let successCount = 0;
    let failedCount = 0;

    // Connect accounts one by one
    for (const account of selectedAccountData) {
      try {
        const createData: SocialAccountCreate = {
          platform,
          accessToken: 'temporary_token', // This would be handled by the backend
          selectedAccountId: account.id,
        };

        await connectAccountMutation.mutateAsync(createData);
        successCount++;
      } catch (error) {
        failedCount++;
        console.error(`Failed to connect account ${account.name}:`, error);
      }
    }

    setIsConnecting(false);

    // Show results toast
    if (successCount > 0 && failedCount === 0) {
      toast({
        title: 'Success!',
        description: `Successfully connected ${successCount} account${successCount > 1 ? 's' : ''}`,
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
    } else if (successCount > 0 && failedCount > 0) {
      toast({
        title: 'Partial Success',
        description: `Connected ${successCount} account${successCount > 1 ? 's' : ''}, ${failedCount} failed`,
        variant: 'default',
      });
    } else {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect any accounts. Please try again.',
        variant: 'destructive',
      });
    }

    // Redirect back to social accounts page after a delay
    setTimeout(() => {
      router.push('/dashboard/social-accounts');
    }, 2000);
  };

  const formatFollowerCount = (count?: number) => {
    if (!count) return 'N/A';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const currentPlatformConfig = platformConfig[platform] || {
    name: platform?.charAt(0).toUpperCase() + platform?.slice(1) || 'Social',
    color: 'bg-gray-500',
    icon: '🔗',
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connecting to {currentPlatformConfig.name}</h3>
            <p className="text-muted-foreground text-center">
              Please wait while we fetch your available accounts...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold">Connect {currentPlatformConfig.name} Accounts</h1>
              <p className="text-muted-foreground">
                Select the accounts you want to connect to your workspace
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {availableAccounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Accounts Available</h3>
              <p className="text-muted-foreground text-center mb-6">
                We couldn&apos;t find any accounts to connect from your {currentPlatformConfig.name} profile.
              </p>
              <Button onClick={() => router.push('/dashboard/social-accounts')}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Available Accounts ({availableAccounts.length})
                  </CardTitle>
                  <CardDescription>
                    Select the accounts you want to connect. You can always disconnect them later.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="selectedAccounts"
                    render={() => (
                      <FormItem>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {availableAccounts.map((account) => (
                            <motion.div
                              key={account.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Card className={cn(
                                "cursor-pointer transition-all hover:shadow-md border-2",
                                selectedAccounts.includes(account.id)
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}>
                                <CardContent className="p-4">
                                  <FormField
                                    control={form.control}
                                    name="selectedAccounts"
                                    render={({ field }) => (
                                      <>
                                        <FormItem className="flex items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(account.id)}
                                              onCheckedChange={(checked) => {
                                                const updatedValue = checked
                                                  ? [...(field.value || []), account.id]
                                                  : (field.value || []).filter((value) => value !== account.id);
                                                field.onChange(updatedValue);
                                              }}
                                            />
                                          </FormControl>
                                          <div className="flex-1 space-y-2">
                                            <div className="flex items-start gap-2">
                                              {account.profileImage && (
                                                <Image
                                                  src={account.profileImage}
                                                  alt={account.name}
                                                  width={32}
                                                  height={32}
                                                  className="rounded-full object-cover"
                                                />
                                              )}
                                              <div className="flex-1 min-w-0">
                                                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                  {account.name}
                                                </FormLabel>
                                                <p className="text-xs text-muted-foreground truncate">
                                                  @{account.username}
                                                </p>
                                              </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between text-xs">
                                              <div className="flex items-center gap-2">
                                                {account.followers !== undefined && (
                                                  <Badge variant="secondary" className="text-xs">
                                                    {formatFollowerCount(account.followers)} followers
                                                  </Badge>
                                                )}
                                                {account.isBusinessAccount && (
                                                  <Badge variant="outline" className="text-xs">
                                                    Business
                                                  </Badge>
                                                )}
                                              </div>
                                              {account.accountType && (
                                                <span className="text-muted-foreground">
                                                  {account.accountType}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </FormItem>
                                      </>
                                    )}
                                  />
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/social-accounts')}
                >
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  {selectedAccounts.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {selectedAccounts.length} account{selectedAccounts.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={selectedAccounts.length === 0 || isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Connect {selectedAccounts.length > 0 ? selectedAccounts.length : ''} Account{selectedAccounts.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Account Connection</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to connect {selectedAccounts.length} account{selectedAccounts.length > 1 ? 's' : ''} to your workspace? 
                This will allow you to manage and post content through these accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected accounts:</h4>
                <ul>
                  {availableAccounts
                    .filter(account => selectedAccounts.includes(account.id))
                    .map(account => (
                      <li key={account.id} className="flex items-center gap-2 text-sm">
                        {account.profileImage && (
                          <Image
                            src={account.profileImage}
                            alt={account.name}
                            width={16}
                            height={16}
                            className="rounded-full object-cover"
                          />
                        )}
                        {account.name} (@{account.username})
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmConnection} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Accounts'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
