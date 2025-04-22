'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Mail, 
  Shield, 
  RefreshCw,
  Copy, 
  Check,
  AlertCircle, 
  AlertTriangle,
  Link as LinkIcon,
  Gift
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/store/useUserStore';

// Extending the User type with avatar property
declare module '@/store/useUserStore' {
  interface User {
    avatar?: string;
  }
}

export default function UserProfilePage() {

  const { t } = useTranslation();
  const { user } = useUserStore();
  // console.log('profile user', user);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted || !user) return null;

  const copyReferralLink = () => {
    if (!user?.referralCode) return;
    
    const referralUrl = `${window.location.origin}/auth/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    setReferralLinkCopied(true);
    
    setTimeout(() => {
      setReferralLinkCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('userProfile.title', 'My Profile')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('userProfile.subtitle', 'Manage your account settings and preferences')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Add referrals link in header if user is an active affiliate */}
          {user?.affiliate?.status === 'approved' && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => window.location.href = '/dashboard/me/affiliate'}
            >
              <Shield className="h-4 w-4" />
              {t('userProfile.viewAffiliateAccount', 'View Affiliate Account')}
            </Button>
          )}
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => window.location.href = '/dashboard/me/rewards/points'}
          >
            <Gift className="h-4 w-4" />
            {t('userProfile.viewRewards', 'View Rewards')}
          </Button>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center">
          <TabsList className="mb-2">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4 mr-2" />
              {t('userProfile.tabs.profile', 'Profile')}
            </TabsTrigger>
            <TabsTrigger value="affiliate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4 mr-2" />
              {t('userProfile.tabs.affiliate', 'Affiliate')}
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Gift className="h-4 w-4 mr-2" />
              {t('userProfile.tabs.rewards', 'Rewards')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-4">
          <Card className="border-muted/40">
            <CardHeader>
              <CardTitle>{t('userProfile.personalDetails', 'Personal Details')}</CardTitle>
              <CardDescription>
                {t('userProfile.personalDetailsDesc', 'Update your personal information')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-medium">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{user.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        {user.role && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 w-fit">
                            {t(`user.role.${user.role.toLowerCase()}`, user.role)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="text-sm font-medium">
                          {t('userProfile.fullName', 'Full Name')}
                        </label>
                        <Input 
                          id="name" 
                          value={user.name} 
                          disabled
                          className="mt-1 bg-muted/50" 
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-sm font-medium">
                          {t('userProfile.email', 'Email Address')}
                        </label>
                        <Input 
                          id="email" 
                          value={user.email} 
                          disabled
                          className="mt-1 bg-muted/50" 
                        />
                      </div>
                    </div>

                    <div>
                      <Button variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t('userProfile.updateDetails', 'Update Details')}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliate" className="space-y-4">
          <Card className="border-muted/40">
            <CardHeader>
              <CardTitle>{t('userProfile.affiliateProgram', 'Affiliate Program')}</CardTitle>
              <CardDescription>
                {t('userProfile.affiliateProgramDesc', 'Manage your affiliate account settings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : !user.affiliate ? (
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-600 dark:text-blue-400">
                    {t('userProfile.affiliate.notMember', 'You are not part of the affiliate program yet.')}
                  </AlertTitle>
                  <AlertDescription className="text-blue-600/90 dark:text-blue-400/90">
                    {t('userProfile.affiliate.joinDesc', 'Join our affiliate program to earn commissions on referrals.')}
                  </AlertDescription>
                </Alert>
              ) : user.affiliate.status === 'pending' ? (
                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-600 dark:text-amber-400">
                    {t('userProfile.affiliate.pending', 'Your affiliate account is pending approval.')}
                  </AlertTitle>
                  <AlertDescription className="text-amber-600/90 dark:text-amber-400/90">
                    {t('userProfile.affiliate.pendingDesc', 'You can use the platform normally while we review your application.')}
                  </AlertDescription>
                </Alert>
              ) : user.affiliate.status === 'approved' ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-5 w-5" />
                      <h4 className="font-medium">
                        {t('userProfile.affiliate.active', 'Your affiliate account is active!')}
                      </h4>
                    </div>
                    <p className="text-sm text-green-600/90 dark:text-green-400/90">
                      {t('userProfile.affiliate.activeDesc', 'You are earning a {commission}% commission on each referral.', { commission: user.affiliate.commission })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('userProfile.affiliate.referralCode', 'Your Referral Code')}
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge className="text-sm py-1 font-mono bg-primary/10 text-primary border-primary/20">
                        {user.referralCode}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('userProfile.affiliate.referralLink', 'Your Referral Link')}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref=${user.referralCode || ''}`}
                          readOnly
                          className="pl-10 font-mono text-sm bg-muted/50"
                        />
                      </div>
                      <Button 
                        onClick={copyReferralLink} 
                        variant={referralLinkCopied ? "outline" : "default"}
                        className={referralLinkCopied 
                          ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 hover:text-green-600" 
                          : ""
                        }
                      >
                        {referralLinkCopied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            {t('userProfile.affiliate.copied', 'Copied!')}
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            {t('userProfile.affiliate.copyLink', 'Copy Link')}
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('userProfile.affiliate.shareDesc', 'Share this link with others to earn commissions when they sign up.')}
                    </p>
                  </div>

                  <div className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-muted/30 hover:bg-muted/50 mt-2"
                      onClick={() => window.location.href = '/dashboard/me/affiliate/referrals'}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {t('userProfile.affiliate.viewReferrals', 'View My Referrals History')}
                    </Button>
                  </div>
                </div>
              ) : (
                <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <AlertTitle className="text-red-600 dark:text-red-400">
                    {t('userProfile.affiliate.inactive', 'Your affiliate account is inactive.')}
                  </AlertTitle>
                  <AlertDescription className="text-red-600/90 dark:text-red-400/90">
                    {t('userProfile.affiliate.inactiveDesc', 'Please contact support to reactivate your affiliate account.')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card className="border-muted/40">
            <CardHeader>
              <CardTitle>{t('userProfile.rewards.title', 'Rewards Program')}</CardTitle>
              <CardDescription>
                {t('userProfile.rewards.description', 'Earn and track your reward points')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-md bg-muted/50 border">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">
                    {t('userProfile.rewards.availablePoints', 'Available Points')}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('userProfile.rewards.pointsDescription', 'View your points balance and rewards history in the rewards dashboard.')}
                </p>
                <Button
                  onClick={() => window.location.href = '/dashboard/me/rewards/points'}
                  className="w-full sm:w-auto"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  {t('userProfile.rewards.viewDashboard', 'View Rewards Dashboard')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}