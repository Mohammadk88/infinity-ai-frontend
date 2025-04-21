'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Shield, Copy, Check, AlertCircle, AlertTriangle, Link as LinkIcon, DollarSign, Users, Settings, TrendingUp, PieChart } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/store/useUserStore';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AffiliateEarningsPage from './earnings/page';
import ReferralHistoryPage from './referrals/page';

export default function AffiliateDashboardPage() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { stats, isLoading, error, fetchStats } = useAffiliateStore();
  const [mounted, setMounted] = useState(false);
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, [fetchStats]);

  const copyReferralLink = () => {
    if (!user?.referralCode) return;
    
    const referralUrl = `${window.location.origin}/auth/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    setReferralLinkCopied(true);
    
    setTimeout(() => {
      setReferralLinkCopied(false);
    }, 2000);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted || !user) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-[120px]" />
            <Skeleton className="h-9 w-[120px]" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-muted/40">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('affiliate.greeting', 'Welcome back, {{name}}!', { name: user.name.split(' ')[0] })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('affiliate.subtitle', 'Track your referrals and earnings')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/me/affiliate/commissions">
            <Button variant="outline" size="sm">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('affiliate.viewCommissions', 'Commissions')}
            </Button>
          </Link>
          <Link href="/dashboard/me/affiliate/referrals">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              {t('affiliate.viewReferrals', 'Referrals')}
            </Button>
          </Link>
          <Link href="/dashboard/me/affiliate/payouts">
            <Button variant="outline" size="sm">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('affiliate.viewPayouts', 'Payouts')}
            </Button>
          </Link>
          <Link href="/dashboard/me/affiliate/settings">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              {t('affiliate.settings', 'Settings')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Status and Referral Info Card */}
      <Card className="border-muted/40">
        <CardHeader>
          <CardTitle>{t('affiliate.referralInfo', 'Referral Information')}</CardTitle>
          <CardDescription>
            {t('affiliate.referralInfoDesc', 'Share your link and start earning')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('affiliate.error.title', 'Error')}</AlertTitle>
              <AlertDescription>{t('affiliate.error.desc', 'Failed to load affiliate data. Please try again.')}</AlertDescription>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchStats()}
                className="mt-2"
              >
                {t('affiliate.retry', 'Retry')}
              </Button>
            </Alert>
          ) : user.affiliate?.status === 'pending' ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('affiliate.pending.title', 'Application Pending')}</AlertTitle>
              <AlertDescription>
                {t('affiliate.pending.desc', 'Your application is being reviewed. We\'ll notify you once approved.')}
              </AlertDescription>
            </Alert>
          ) : user.affiliate?.status === 'approved' ? (
            <>
              <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400">
                      {t('affiliate.active.title', 'Your affiliate account is active!')}
                    </h4>
                    <p className="text-sm text-green-600/90 dark:text-green-400/90">
                      {t('affiliate.active.desc', 'You earn {{rate}}% commission on each successful referral', 
                        { rate: stats?.commissionRate || user.affiliate.commission })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Referral Code */}
                <div>
                  <label className="text-sm font-medium">
                    {t('affiliate.referralCode', 'Your Referral Code')}
                  </label>
                  <div className="mt-1.5">
                    <Badge className="text-sm py-1.5 px-3 font-mono bg-primary/10 text-primary border-primary/20">
                      {user.referralCode}
                    </Badge>
                  </div>
                </div>

                {/* Referral Link */}
                <div>
                  <label className="text-sm font-medium">
                    {t('affiliate.referralLink', 'Your Referral Link')}
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref=${user.referralCode}`}
                        readOnly
                        className="pl-10 font-mono bg-muted/50"
                      />
                    </div>
                    <Button
                      onClick={copyReferralLink}
                      variant={referralLinkCopied ? "outline" : "default"}
                      className={cn("gap-2 min-w-[100px]",
                        referralLinkCopied && "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                      )}
                    >
                      {referralLinkCopied ? (
                        <>
                          <Check className="h-4 w-4" />
                          {t('affiliate.copied', 'Copied!')}
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          {t('affiliate.copy', 'Copy')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('affiliate.join.title', 'Join Our Affiliate Program')}</AlertTitle>
              <AlertDescription>
                {t('affiliate.join.desc', 'Start earning commission by referring new users to our platform.')}
              </AlertDescription>
              <Button className="mt-2">
                {t('affiliate.join.cta', 'Apply Now')}
              </Button>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      {user.affiliate?.status === 'approved' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Earnings */}
            <Card className="border-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('affiliate.metrics.earnings', 'Total Earnings')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold flex items-center">
                      <DollarSign className="h-5 w-5 mr-1 text-green-500" />
                      {stats?.totalEarnings.toFixed(2) || '0.00'}
                      <span className="text-sm font-normal ml-1">{stats?.currency || 'USD'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('affiliate.metrics.earningsDesc', 'Total earnings to date')}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Total Referrals */}
            <Card className="border-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('affiliate.metrics.referrals', 'Total Referrals')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold flex items-center">
                      <Users className="h-5 w-5 mr-1 text-blue-500" />
                      {stats?.referralCount || '0'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('affiliate.metrics.referralsDesc', 'People who used your code')}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Conversion Rate */}
            <Card className="border-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('affiliate.metrics.conversion', 'Conversion Rate')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold flex items-center">
                      <TrendingUp className="h-5 w-5 mr-1 text-indigo-500" />
                      {stats?.referralCount ? 
                        ((stats.convertedCount / stats.referralCount) * 100).toFixed(1) : 
                        '0'}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('affiliate.metrics.conversionDesc', 'Sign-ups that converted')}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Commission Rate */}
            <Card className="border-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('affiliate.metrics.commission', 'Commission Rate')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold flex items-center">
                      <PieChart className="h-5 w-5 mr-1 text-purple-500" />
                      {stats?.commissionRate || user.affiliate.commission}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('affiliate.metrics.commissionDesc', 'Your earning percentage')}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* How It Works Section */}
          <div className="mt-8 space-y-6">
            
            
            

            {/* Commission Details Box */}
           {/*  <Card className="border-muted/40">
              <CardContent className="flex items-start space-x-4 pt-6">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">
                    {t('affiliate.commissionDetails.title', 'Commission Details')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('affiliate.commissionDetails.desc', 'You earn {{percent}}% of the subscription fee when your referrals subscribe to a paid plan. Commissions are paid out monthly for all confirmed subscriptions.', 
                      { percent: stats?.commissionRate || user.affiliate.commission || 10 }
                    )}
                  </p>
                </div>
              </CardContent>
            </Card> */}
            {/* How It Works Section */}
          <Card className="border-muted/40 mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                {t('affiliate.howItWorks.title', 'How It Works')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Step 1 - Share Link */}
              <div className="flex flex-col items-center text-center border rounded-lg p-4 bg-muted/50">
                <LinkIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">{t('affiliate.howItWorks.step1.title', 'Share Your Link')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('affiliate.howItWorks.step1.desc', 'Share your unique referral link with friends and networks')}
                </p>
              </div>

              {/* Step 2 - Friends Sign Up */}
              <div className="flex flex-col items-center text-center border rounded-lg p-4 bg-muted/50">
                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">{t('affiliate.howItWorks.step2.title', 'Friends Sign Up')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('affiliate.howItWorks.step2.desc', 'When they register using your link, they become your referral')}
                </p>
              </div>

              {/* Step 3 - Earn Commissions */}
              <div className="flex flex-col items-center text-center border rounded-lg p-4 bg-muted/50">
                <DollarSign className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">{t('affiliate.howItWorks.step3.title', 'Earn Commissions')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('affiliate.howItWorks.step3.desc', 'Earn commission when they subscribe to a paid plan')}
                </p>
              </div>
            </CardContent>

            {/* Commission Details Box */}
            <div className="mt-4 border-t p-4 flex items-start gap-3 text-muted-foreground bg-muted/50 rounded-b-lg">
              <AlertCircle className="h-5 w-5 mt-1 text-muted-foreground" />
              <p className="text-sm">
                {t(
                  'affiliate.howItWorks.details',
                  'You earn {{percent}}% of the subscription fee when your referrals subscribe to a paid plan. Commissions are paid out monthly for all confirmed subscriptions.',
                  { percent: stats?.commissionRate || user.affiliate?.commission || 10 }
                )}
              </p>
            </div>
          </Card>

          </div>
          <Tabs defaultValue="overview" className="w-full space-y-6">
  {/* Header Tabs */}
  <TabsList className="mb-4">
    <TabsTrigger value="overview">{t('affiliate.tabs.overview', 'Overview')}</TabsTrigger>
    <TabsTrigger value="referrals">{t('affiliate.tabs.recentReferrals', 'Recent Referrals')}</TabsTrigger>
    <TabsTrigger value="marketing">{t('affiliate.tabs.marketingTools', 'Marketing Tools')}</TabsTrigger>
  </TabsList>

  {/* Overview Tab */}
  <TabsContent value="overview" className="space-y-6">
    {/* محتوى الـ Overview: greeting, status, referral link, metrics, how it works... */}
    {/* استبدل هذا بالتفاصيل يلي كتبناها فوق أو قسمها داخل كومبوننت منفصل للوضوح */}
    <AffiliateEarningsPage />
  </TabsContent>

  {/* Recent Referrals Tab */}
  <TabsContent value="referrals" className="space-y-6">
    <ReferralHistoryPage />
  </TabsContent>

  {/* Marketing Tools Tab */}
    <TabsContent value="marketing" className="space-y-6">
      <Card className="border-muted/40">
        <CardHeader>
          <CardTitle>{t('affiliate.marketing.title', 'Marketing Tools')}</CardTitle>
          <CardDescription>
            {t('affiliate.marketing.desc', 'Boost your conversions with our ready-made assets')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* محتوى قابل للتوسعة لاحقًا - مثل صور، بانرات، PDF، أو كود HTML لزر تسجيل */}
          <div className="text-muted-foreground text-sm">
            {t('affiliate.marketing.placeholder', 'Coming soon! Custom banners and email templates...')}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>

        </>
      )}
    </div>
  );
}