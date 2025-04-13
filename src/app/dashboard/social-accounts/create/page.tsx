'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { 
  ArrowLeft,
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Play,
  ImageIcon, 
  Globe, 
  ArrowRight, 
  Check, 
  RefreshCw,
  AlertCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Type definitions
interface PlatformType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  authMethod: 'oauth' | 'credentials' | 'api';
  permissions?: string[];
}

export default function CreateSocialAccountPage() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [step, setStep] = useState<'select-platform' | 'authorize' | 'configure' | 'complete'>('select-platform');
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [credentialInputs, setCredentialInputs] = useState({
    username: '',
    password: '',
    apiKey: '',
    apiSecret: '',
    accessToken: '',
  });
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Available platforms to connect
  const platforms: PlatformType[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
      description: t('socialAccounts.platforms.facebook.description', 'Connect your Facebook Pages and Business accounts to schedule posts, upload videos, and manage comments.'),
      authMethod: 'oauth',
      permissions: [
        'pages_read_engagement',
        'pages_manage_posts',
        'pages_manage_metadata'
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',
      description: t('socialAccounts.platforms.instagram.description', 'Connect your Instagram Business account to schedule posts, upload photos and videos, and analyze performance.'),
      authMethod: 'oauth',
      permissions: [
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_comments'
      ]
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',
      description: t('socialAccounts.platforms.twitter.description', 'Connect your Twitter account to post tweets, schedule content, and engage with your audience.'),
      authMethod: 'oauth',
      permissions: [
        'tweet.read',
        'tweet.write',
        'users.read'
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
      description: t('socialAccounts.platforms.linkedin.description', 'Connect your LinkedIn personal profile or company page to share updates and articles.'),
      authMethod: 'oauth',
      permissions: [
        'r_liteprofile',
        'w_member_social',
        'r_organization_admin',
        'w_organization_social'
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="h-5 w-5" />,
      color: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400',
      description: t('socialAccounts.platforms.youtube.description', 'Connect your YouTube channel to upload videos, manage playlists, and respond to comments.'),
      authMethod: 'oauth',
      permissions: [
        'youtube.readonly',
        'youtube.upload',
        'youtube.force-ssl'
      ]
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <Play className="h-5 w-5" />,
      color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-950/50 dark:text-neutral-400',
      description: t('socialAccounts.platforms.tiktok.description', 'Connect your TikTok account to schedule videos, analyze performance metrics, and grow your audience.'),
      authMethod: 'oauth',
      permissions: [
        'user.info.basic',
        'video.upload',
        'video.list'
      ]
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: <ImageIcon className="h-5 w-5" />,
      color: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400',
      description: t('socialAccounts.platforms.pinterest.description', 'Connect your Pinterest account to create pins, schedule content, and manage boards.'),
      authMethod: 'oauth',
      permissions: [
        'boards:read',
        'pins:read',
        'pins:write'
      ]
    },
  ];

  // Get platform info
  const getPlatform = (platformId: string | null): PlatformType | undefined => {
    return platforms.find(p => p.id === platformId);
  };

  // Toggle platform details
  const toggleDetails = (platformId: string) => {
    setOpenDetails(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
  };

  // Handle platform selection
  const handleSelectPlatform = (platformId: string) => {
    setSelectedPlatform(platformId);
    setStep('authorize');
    setAuthError(null);
  };

  // Handle OAuth authorization
  const handleOAuthAuthorize = async () => {
    setIsProcessing(true);
    setAuthError(null);
    
    try {
      // In a real implementation, we would redirect to the OAuth flow
      // For this demo, we'll simulate the OAuth process with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate a successful OAuth connection
      setStep('configure');
    } catch (error) {
      console.error('OAuth authorization error:', error);
      setAuthError('Failed to connect to the platform. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle credential-based authorization
  const handleCredentialAuthorize = async () => {
    setIsProcessing(true);
    setAuthError(null);
    
    try {
      // In a real implementation, we would validate the credentials
      // For this demo, we'll simulate the process with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validate inputs (simple validation for demo)
      if (credentialInputs.username && 
          (credentialInputs.password || credentialInputs.apiKey)) {
        setStep('configure');
      } else {
        setAuthError('Please fill in all required fields.');
      }
    } catch (error) {
      console.error('Credential authorization error:', error);
      setAuthError('Invalid credentials. Please check your information and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle final account creation
  const handleCreateAccount = async () => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, we would finalize the account connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful account connection
      setStep('complete');
    } catch (error) {
      console.error('Error creating account:', error);
      setAuthError('Failed to complete the account setup. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigation helpers
  const goBack = () => {
    if (step === 'authorize') {
      setStep('select-platform');
      setSelectedPlatform(null);
    } else if (step === 'configure') {
      setStep('authorize');
    } else {
      router.push('/dashboard/social-accounts');
    }
  };

  const goToAccounts = () => {
    router.push('/dashboard/social-accounts');
  };

  // Render page content based on current step
  const renderStepContent = () => {
    const platform = getPlatform(selectedPlatform);
    
    switch (step) {
      case 'select-platform':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <Card 
                  key={platform.id}
                  className={cn(
                    "cursor-pointer border-border/60 hover:border-primary/30 transition-all overflow-hidden",
                    "hover:shadow-md hover:-translate-y-0.5 duration-300"
                  )}
                  onClick={() => handleSelectPlatform(platform.id)}
                >
                  <div className={cn(
                    "h-1.5 w-full",
                    platform.color.split(' ')[0] // Use the bg color for the top bar
                  )}></div>
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className={cn(
                        "flex items-center justify-center rounded-full w-16 h-16 mb-3",
                        platform.color
                      )}>
                        {platform.icon}
                      </div>
                      <h3 className="font-medium text-lg mb-2">{platform.name}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {platform.description}
                    </p>
                    
                    <div>
                      <button
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mb-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDetails(platform.id);
                        }}
                      >
                        {openDetails[platform.id] ? (
                          <>
                            <ChevronUp className="h-3 w-3" />
                            {t('socialAccounts.create.hideDetails', 'Hide details')}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            {t('socialAccounts.create.showDetails', 'Show details')}
                          </>
                        )}
                      </button>
                      
                      {openDetails[platform.id] && (
                        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                          <h4 className="font-medium mb-1">{t('socialAccounts.create.permissions', 'Required permissions')}</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {platform.permissions?.map((permission) => (
                              <li key={permission} className="text-xs">{permission}</li>
                            ))}
                          </ul>
                          <div className="flex items-center gap-1 mt-2 text-xs">
                            <Lock className="h-3 w-3" />
                            {t('socialAccounts.create.secure', 'Secure OAuth authentication')}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full mt-4 gap-2 group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlatform(platform.id);
                      }}
                    >
                      {t('socialAccounts.create.connect', 'Connect')}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case 'authorize':
        if (!platform) return null;
        
        return (
          <Card className="border-border/60 overflow-hidden max-w-2xl mx-auto">
            <div className={cn("h-2 w-full", platform.color.split(' ')[0])}></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", platform.color)}>
                  {platform.icon}
                </div>
                <div>
                  <CardTitle>{t('socialAccounts.create.connectTo', 'Connect to {{platform}}', { platform: platform.name })}</CardTitle>
                  <CardDescription>{t('socialAccounts.create.authorization', 'Authorize access to your account')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {platform.authMethod === 'oauth' ? (
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-md text-sm">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="mb-2">{t('socialAccounts.create.oauthInfo', "You'll be redirected to {{platform}} to authorize this application. We'll never post without your permission.", { platform: platform.name })}</p>
                        
                        <div className="text-xs text-muted-foreground">
                          <p className="font-medium mb-1">{t('socialAccounts.create.permissions', 'Required permissions:')}</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {platform.permissions?.map((permission) => (
                              <li key={permission}>{permission}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {authError && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{authError}</p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full gap-2"
                    onClick={handleOAuthAuthorize}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        {t('socialAccounts.create.authorizing', 'Authorizing...')}
                      </>
                    ) : (
                      <>
                        {platform.icon}
                        {t('socialAccounts.create.continueWith', 'Continue with {{platform}}', { platform: platform.name })}
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-md text-sm">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <p>{t('socialAccounts.create.apiInfo', 'Enter your account credentials or API keys to authorize access.')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">{t('socialAccounts.create.username', 'Username or Email')}</Label>
                      <Input 
                        id="username"
                        value={credentialInputs.username}
                        onChange={(e) => setCredentialInputs({...credentialInputs, username: e.target.value})}
                        placeholder={t('socialAccounts.create.usernamePlaceholder', 'Enter your username or email')}
                      />
                    </div>
                    
                    {platform.authMethod === 'credentials' && (
                      <div className="space-y-2">
                        <Label htmlFor="password">{t('socialAccounts.create.password', 'Password')}</Label>
                        <Input 
                          id="password"
                          type="password"
                          value={credentialInputs.password}
                          onChange={(e) => setCredentialInputs({...credentialInputs, password: e.target.value})}
                          placeholder={t('socialAccounts.create.passwordPlaceholder', 'Enter your password')}
                        />
                      </div>
                    )}
                    
                    {platform.authMethod === 'api' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">{t('socialAccounts.create.apiKey', 'API Key')}</Label>
                          <Input 
                            id="apiKey"
                            value={credentialInputs.apiKey}
                            onChange={(e) => setCredentialInputs({...credentialInputs, apiKey: e.target.value})}
                            placeholder={t('socialAccounts.create.apiKeyPlaceholder', 'Enter your API key')}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="apiSecret">{t('socialAccounts.create.apiSecret', 'API Secret')}</Label>
                          <Input 
                            id="apiSecret"
                            value={credentialInputs.apiSecret}
                            onChange={(e) => setCredentialInputs({...credentialInputs, apiSecret: e.target.value})}
                            placeholder={t('socialAccounts.create.apiSecretPlaceholder', 'Enter your API secret')}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  {authError && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{authError}</p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full"
                    onClick={handleCredentialAuthorize}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        {t('socialAccounts.create.authorizing', 'Authorizing...')}
                      </>
                    ) : (
                      t('socialAccounts.create.authorize', 'Authorize Account')
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'configure':
        if (!platform) return null;
        
        return (
          <Card className="border-border/60 overflow-hidden max-w-2xl mx-auto">
            <div className={cn("h-2 w-full", platform.color.split(' ')[0])}></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", platform.color)}>
                  {platform.icon}
                </div>
                <div>
                  <CardTitle>{t('socialAccounts.create.configureAccount', 'Configure {{platform}} Account', { platform: platform.name })}</CardTitle>
                  <CardDescription>{t('socialAccounts.create.configureDescription', 'Set up your account preferences')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium block mb-4">
                  {t('socialAccounts.create.accountConnected', 'Account successfully authenticated')}
                </Label>
                
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 p-3 rounded-md mb-6">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Check className="h-5 w-5" />
                    <span>{t('socialAccounts.create.authenticated', 'Successfully authenticated with {{platform}}', { platform: platform.name })}</span>
                  </div>
                </div>
                
                <div className="space-y-4 bg-muted/30 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('socialAccounts.create.accountType', 'Account Type')}</p>
                      <p className="font-medium">{platform.name} {t('socialAccounts.create.businessAccount', 'Business Account')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('socialAccounts.create.connectedAs', 'Connected As')}</p>
                      <p className="font-medium">Infinity Marketing</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">{t('socialAccounts.create.accountName', 'Account Name (internal)')}</Label>
                    <Input 
                      id="accountName"
                      placeholder={t('socialAccounts.create.accountNamePlaceholder', 'E.g., Company {{platform}}', { platform: platform.name })}
                      defaultValue={`Infinity ${platform.name}`}
                    />
                    <p className="text-xs text-muted-foreground">{t('socialAccounts.create.accountNameHelp', 'This name is only visible to you and your team')}</p>
                  </div>
                  
                  {platform.id === 'facebook' && (
                    <div className="space-y-2 pt-2">
                      <Label>{t('socialAccounts.create.selectPages', 'Select Pages to Connect')}</Label>
                      
                      <div className="space-y-2">
                        <Card className="border-border/40 p-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 text-blue-600 h-10 w-10 rounded flex items-center justify-center shrink-0">
                              <svg viewBox="0 0 36 36" fill="currentColor" className="h-6 w-6">
                                <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path>
                                <path fill="#fff" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"></path>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">Infinity Marketing</h4>
                                  <p className="text-xs text-muted-foreground">Business Page • 12.5K followers</p>
                                </div>
                                <input type="checkbox" className="h-4 w-4" defaultChecked />
                              </div>
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="border-border/40 p-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 text-blue-600 h-10 w-10 rounded flex items-center justify-center shrink-0">
                              <svg viewBox="0 0 36 36" fill="currentColor" className="h-6 w-6">
                                <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path>
                                <path fill="#fff" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"></path>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">Infinity AI Products</h4>
                                  <p className="text-xs text-muted-foreground">Product Page • 3.2K followers</p>
                                </div>
                                <input type="checkbox" className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('socialAccounts.create.pagesHelp', 'You can manage multiple pages with a single connection')}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {authError && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{authError}</p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-border/60 bg-muted/20 px-6 py-4">
              <Button variant="outline" onClick={goBack}>
                {t('socialAccounts.create.back', 'Back')}
              </Button>
              
              <Button 
                onClick={handleCreateAccount}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    {t('socialAccounts.create.finalizing', 'Finalizing...')}
                  </>
                ) : (
                  t('socialAccounts.create.finalize', 'Finalize Connection')
                )}
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 'complete':
        if (!platform) return null;
        
        return (
          <Card className="border-border/60 overflow-hidden max-w-2xl mx-auto text-center">
            <CardContent className="pt-8 px-8 pb-6 flex flex-col items-center">
              <div className={cn(
                "h-20 w-20 rounded-full flex items-center justify-center mb-6",
                platform.color
              )}>
                {platform.icon}
              </div>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {t('socialAccounts.create.success', '{{platform}} Account Connected!', { platform: platform.name })}
                </h2>
                <p className="text-muted-foreground">
                  {t('socialAccounts.create.successMessage', 'Your {{platform}} account has been successfully connected and is ready to use.', { platform: platform.name })}
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 p-4 rounded-md mb-6 flex items-center gap-3 w-full max-w-md mx-auto">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Check className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-green-800 dark:text-green-300">
                    {t('socialAccounts.create.readyToUse', 'Ready to use')}
                  </p>
                  <p className="text-sm text-green-700/70 dark:text-green-400/70">
                    {t('socialAccounts.create.startPosting', 'You can now start posting and scheduling content')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
                <Button 
                  className="flex-1 gap-2"
                  onClick={goToAccounts}
                >
                  {t('socialAccounts.create.viewAccounts', 'View All Accounts')}
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => router.push('/dashboard/posts/create')}
                >
                  {t('socialAccounts.create.createPost', 'Create First Post')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="rounded-full h-8 w-8 p-0 mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t('socialAccounts.create.back', 'Back')}</span>
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {step === 'select-platform' && t('socialAccounts.create.title', 'Connect Social Media Account')}
            {step === 'authorize' && t('socialAccounts.create.authorizeTitle', 'Authorize Connection')}
            {step === 'configure' && t('socialAccounts.create.configureTitle', 'Configure Account')}
            {step === 'complete' && t('socialAccounts.create.completeTitle', 'Connection Complete')}
          </h1>
          <p className="text-muted-foreground">
            {step === 'select-platform' && t('socialAccounts.create.subtitle', 'Connect your social media accounts to manage them from one place')}
            {step === 'authorize' && t('socialAccounts.create.authorizeSubtitle', 'Securely authorize access to your account')}
            {step === 'configure' && t('socialAccounts.create.configureSubtitle', 'Customize your account settings')}
            {step === 'complete' && t('socialAccounts.create.completeSubtitle', 'Your account is ready to use')}
          </p>
        </div>
      </div>
      
      {/* Progress steps */}
      {step !== 'complete' && (
        <div className="flex items-center gap-2 mb-8 max-w-2xl mx-auto">
          <div className={cn(
            "h-2 flex-1 rounded-full",
            step === 'select-platform' ? "bg-primary" : "bg-primary",
          )}></div>
          <div className={cn(
            "h-2 flex-1 rounded-full",
            step === 'select-platform' ? "bg-muted" : "bg-primary",
          )}></div>
          <div className={cn(
            "h-2 flex-1 rounded-full",
            step === 'configure' ? "bg-primary" : "bg-muted",
          )}></div>
        </div>
      )}
      
      {/* Step content */}
      {renderStepContent()}
    </div>
  );
}
