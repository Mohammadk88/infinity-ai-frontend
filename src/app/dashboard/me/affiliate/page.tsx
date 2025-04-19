'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Copy, Check, AlertCircle, AlertTriangle, Link as LinkIcon, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/store/useUserStore';
import { useAuth } from '@/hooks/useAuth';

export default function AffiliatePage() {
  const { t } = useTranslation();
  const { user: authUser, loading } = useAuth(true);
  const { user, setUser } = useUserStore();
  
  const [mounted, setMounted] = useState(false);
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sync auth user with user store if needed
    if (authUser && !user) {
      setUser(authUser);
    }
  }, [authUser, user, setUser]);

  const copyReferralLink = () => {
    if (!user?.referralCode) return;
    
    const referralUrl = `${window.location.origin}/auth/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    setReferralLinkCopied(true);
    
    setTimeout(() => {
      setReferralLinkCopied(false);
    }, 2000);
  };

  // Show loading state for both client-side mounting and data fetching
  if (!mounted || loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Card className="border-muted/40">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('userProfile.affiliateProgram', 'Affiliate Program')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('userProfile.affiliateSubtitle', 'Manage your affiliate settings and track referrals')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard/me/affiliate/earnings">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('affiliate.viewEarnings', 'View Earnings')}
            </Button>
          </Link>
          <Link href="/dashboard/me/affiliate/referrals">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Users className="h-4 w-4 mr-2" />
              {t('affiliate.viewReferrals', 'View Referrals')}
            </Button>
          </Link>
          <Link href="/dashboard/me">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Users className="h-4 w-4 mr-2" />
              {t('affiliate.viewProfile', 'Back to Profile')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <Card className="border-muted/40">
        <CardHeader>
          <CardTitle>{t('userProfile.affiliateSettings', 'Affiliate Settings')}</CardTitle>
          <CardDescription>
            {t('userProfile.affiliateSettingsDesc', 'Your affiliate program information and settings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user?.affiliate ? (
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
            <>
              {/* Active affiliate information */}
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

              {/* Referral code section */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('userProfile.affiliate.referralCode', 'Your Referral Code')}
                </label>
                <div className="flex items-center gap-2">
                  <Badge className="text-sm py-1 px-3 font-mono bg-primary/10 text-primary border-primary/20">
                    {user.referralCode}
                  </Badge>
                </div>
              </div>

              {/* Referral link section */}
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
            </>
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
    </div>
  );
}