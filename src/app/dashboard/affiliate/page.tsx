'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Copy, 
  Check, 
  Clipboard, 
  Link as LinkIcon,
  Share2,
  PieChart,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Search
} from 'lucide-react';

import { useAffiliateStore } from '@/store/useAffiliateStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function AffiliateDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { stats, logs, isLoading, error, fetchStats, fetchLogs } = useAffiliateStore();

  const [referralLinkCopied, setReferralLinkCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
    fetchLogs(1, 5); // First page, limited results for dashboard view
  }, [fetchStats, fetchLogs]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const copyReferralLink = () => {
    if (!stats?.referralCode) return;
    
    const referralUrl = `${window.location.origin}/auth/register?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    setReferralLinkCopied(true);
    
    setTimeout(() => {
      setReferralLinkCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('affiliate.title', 'Affiliate Dashboard')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('affiliate.subtitle', 'Track your referrals and earnings')}
          </p>
        </div>
        <Link href="/dashboard/affiliate/logs">
          <Button variant="outline">
            <Clipboard className="mr-2 h-4 w-4" />
            {t('affiliate.viewAllLogs', 'View All Logs')}
          </Button>
        </Link>
      </div>

      {/* Referral Link Card */}
      <Card className="border-muted/40">
        <CardHeader className="pb-3">
          <CardTitle>{t('affiliate.referralLink', 'Your Referral Link')}</CardTitle>
          <CardDescription>
            {t('affiliate.referralLinkDescription', 'Share this link to earn commissions on new sign-ups')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !stats ? (
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{t('affiliate.error', 'Error loading affiliate data')}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input 
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref=${stats?.referralCode || ''}`}
                  readOnly
                  className="pl-10 pr-20 font-mono text-sm bg-muted/50"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pe-3">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {stats?.referralCode || ''}
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={copyReferralLink} 
                variant={referralLinkCopied ? "outline" : "default"}
                className={cn(
                  "min-w-[120px] transition-all",
                  referralLinkCopied ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 hover:text-green-600" : ""
                )}
              >
                {referralLinkCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {t('affiliate.copied', 'Copied!')}
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    {t('affiliate.copy', 'Copy Link')}
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="sm" variant="outline">
              <Share2 className="mr-2 h-3.5 w-3.5" />
              {t('affiliate.shareTwitter', 'Share on Twitter')}
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="mr-2 h-3.5 w-3.5" />
              {t('affiliate.shareLinkedIn', 'Share on LinkedIn')}
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="mr-2 h-3.5 w-3.5" />
              {t('affiliate.shareEmail', 'Share via Email')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings Card */}
        <Card className="overflow-hidden border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('affiliate.totalEarnings', 'Total Earnings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !stats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold flex items-center">
                <DollarSign className="h-5 w-5 mr-1 text-green-500" />
                {stats?.totalEarnings.toFixed(2) || '0.00'} <span className="text-sm font-normal ml-1">{stats?.currency}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {t('affiliate.includingPending', 'Including pending commissions')}
            </p>
          </CardContent>
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 w-full" />
        </Card>

        {/* Referral Count Card */}
        <Card className="overflow-hidden border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('affiliate.referralCount', 'Total Referrals')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !stats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold flex items-center">
                <Users className="h-5 w-5 mr-1 text-blue-500" />
                {stats?.referralCount || '0'}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {t('affiliate.usersReferred', 'Users who signed up with your code')}
            </p>
          </CardContent>
          <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 w-full" />
        </Card>

        {/* Conversion Rate Card */}
        <Card className="overflow-hidden border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('affiliate.conversionRate', 'Conversion Rate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !stats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold flex items-center">
                <TrendingUp className="h-5 w-5 mr-1 text-purple-500" />
                {stats?.referralCount ? 
                  ((stats.convertedCount / stats.referralCount) * 100).toFixed(0) : 
                  '0'}%
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {t('affiliate.referralsConverted', 'Referrals that became customers')}
            </p>
          </CardContent>
          <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 w-full" />
        </Card>

        {/* Commission Rate Card */}
        <Card className="overflow-hidden border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('affiliate.commissionRate', 'Commission Rate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !stats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold flex items-center">
                <PieChart className="h-5 w-5 mr-1 text-amber-500" />
                {stats?.commissionRate || '0'}%
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {t('affiliate.percentOfSales', 'Percentage earned on each sale')}
            </p>
          </CardContent>
          <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600 w-full" />
        </Card>
      </div>

      {/* Tabs for recent referrals and other content */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            {t('affiliate.tabs.overview', 'Overview')}
          </TabsTrigger>
          <TabsTrigger value="recent">
            {t('affiliate.tabs.recentReferrals', 'Recent Referrals')}
          </TabsTrigger>
          <TabsTrigger value="marketing">
            {t('affiliate.tabs.marketingTools', 'Marketing Tools')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="border-muted/40">
            <CardHeader>
              <CardTitle>{t('affiliate.howItWorks', 'How It Works')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg border border-muted/60 bg-muted/20">
                  <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <LinkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium mb-1">{t('affiliate.step1', 'Share Your Link')}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t('affiliate.step1desc', 'Share your unique referral link with friends and networks')}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-muted/60 bg-muted/20">
                  <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium mb-1">{t('affiliate.step2', 'Friends Sign Up')}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t('affiliate.step2desc', 'When they register using your link, they become your referral')}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-muted/60 bg-muted/20">
                  <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium mb-1">{t('affiliate.step3', 'Earn Commissions')}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t('affiliate.step3desc', 'Earn commission when they subscribe to a paid plan')}
                  </p>
                </div>
              </div>

              <Card className="bg-muted/50 border-muted/60">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">
                        {t('affiliate.commissionDetails', 'Commission Details')}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('affiliate.commissionExplained', 'You earn {percent}% of the subscription fee when your referrals subscribe to a paid plan. Commissions are paid out monthly for all confirmed subscriptions.', { percent: stats?.commissionRate || 10 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card className="border-muted/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{t('affiliate.recentReferrals', 'Recent Referrals')}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => fetchLogs(1, 5)}
                  disabled={isLoading}
                  className="h-8 px-2 text-xs"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5 mr-1", isLoading && "animate-spin")} />
                  {t('affiliate.refresh', 'Refresh')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && logs.length === 0 ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-5 w-[200px]" />
                      <Skeleton className="h-5 w-[100px]" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4">
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    <div className="flex gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{t('affiliate.errorLogs', 'Error loading referral logs')}</span>
                    </div>
                  </div>
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium mb-1">{t('affiliate.noReferralsYet', 'No Referrals Yet')}</h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {t('affiliate.startSharing', 'Start sharing your referral link to see your referrals here')}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          {log.referredEmail.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{log.referredEmail}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.registrationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          log.status === 'converted'
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}
                      >
                        {log.status === 'converted'
                          ? t('affiliate.status.converted', 'Converted')
                          : t('affiliate.status.pending', 'Pending')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-3 pb-4">
              <p className="text-xs text-muted-foreground">
                {t('affiliate.showingCount', 'Showing {count} of {total} referrals', 
                  { count: logs.length, total: stats?.referralCount || 0 })}
              </p>
              <Link href="/dashboard/affiliate/logs">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  {t('affiliate.viewAll', 'View All')}
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card className="border-muted/40">
            <CardHeader>
              <CardTitle>{t('affiliate.marketingMaterials', 'Marketing Materials')}</CardTitle>
              <CardDescription>
                {t('affiliate.marketingDescription', 'Use these ready-made materials to promote our service')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-muted/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {t('affiliate.materials.emailTemplate', 'Email Template')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <p className="text-muted-foreground">
                      {t('affiliate.materials.emailDescription', 'Professional email template to send to your contacts')}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('affiliate.materials.download', 'Download')}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-muted/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {t('affiliate.materials.banners', 'Banner Images')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <p className="text-muted-foreground">
                      {t('affiliate.materials.bannersDescription', 'Web banners in various sizes for your website')}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('affiliate.materials.download', 'Download')}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-muted/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {t('affiliate.materials.socialMedia', 'Social Media Kit')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <p className="text-muted-foreground">
                      {t('affiliate.materials.socialDescription', 'Ready-to-post images and captions for social media')}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('affiliate.materials.download', 'Download')}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted/40">
            <CardHeader>
              <CardTitle>{t('affiliate.promotionTips', 'Promotion Tips')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      {t('affiliate.tips.socialMedia', 'Leverage Social Media')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('affiliate.tips.socialMediaDesc', 'Share your referral link on your social media platforms with a personal testimonial about why you love the service.')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      {t('affiliate.tips.blog', 'Write a Blog Post')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('affiliate.tips.blogDesc', 'Create a detailed blog post or review about your experience with our platform and include your referral link.')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      {t('affiliate.tips.email', 'Email Marketing')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('affiliate.tips.emailDesc', 'Add your referral link to your email signature or send a dedicated email to your network introducing the platform.')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}