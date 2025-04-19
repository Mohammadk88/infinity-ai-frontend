'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  ArrowLeftCircle, 
  Users, 
  BarChart4, 
  ArrowUpRight
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricCard, StatsCard } from '@/components/features/metric-card';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import { cn } from '@/lib/utils';
import api from '@/app/lib/axios';
import { AffiliateStats } from '@/types/AffiliateStats';

export default function AffiliateEarningsPage() {
  const { t } = useTranslation();
  const { stats, isLoading, error, fetchStats } = useAffiliateStore();
  const [data, setData] = useState<AffiliateStats | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch affiliate data on page load
  useEffect(() => {
    setMounted(true);
    fetchStats();
    api.get('/affiliate/earnings')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to load earnings:', err))
      .finally(() => setLoading(false));
  }, [fetchStats]);
  
  // Don't render until client-side to prevent hydration issues
  if (!mounted) {
    return null;
  }
  
  // Format currency function
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: stats?.currency || 'USD',
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;

  if (!data) return <div className="p-6 center text-center bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400">No earnings data found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t('affiliate.earnings.title', 'My Affiliate Earnings')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('affiliate.earnings.subtitle', 'Track your affiliate performance and earnings')}
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard/me/affiliate">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              {t('affiliate.backToAffiliate', 'Back to Affiliate')}
            </Button>
          </Link>
          <Link href="/dashboard/me/affiliate/referrals">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Users className="h-4 w-4 mr-2" />
              {t('affiliate.viewReferrals', 'View Referrals')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Error alert if needed */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
          <div className="flex gap-2 items-center">
            <XCircle className="h-4 w-4" />
            <span>{t('affiliate.earnings.error', 'Error loading affiliate data')}</span>
          </div>
        </div>
      )}

      {/* Main metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Approved Earnings */}
        <MetricCard 
          title={t('affiliate.earnings.approved', 'Approved Earnings')}
          value={`$${data.totalApprovedEarnings.toFixed(2)}`}
          description={t('affiliate.earnings.approvedDesc', 'Earnings ready for payout')}
          icon={DollarSign}
          iconColor="text-green-500"
          gradientColors="from-green-400 to-green-600"
          loading={isLoading && !stats}
          formatter={formatCurrency}
        />

        {/* Pending Earnings */}
        <MetricCard 
          title={t('affiliate.earnings.pending', 'Pending Earnings')}
          value={`$${data.totalPendingEarnings.toFixed(2)}`}
          description={t('affiliate.earnings.pendingDesc', 'Earnings awaiting approval')}
          icon={DollarSign}
          iconColor="text-amber-500"
          gradientColors="from-amber-400 to-amber-600"
          loading={isLoading && !stats}
          formatter={formatCurrency}
        />

        {/* Rejected Earnings */}
        <MetricCard 
          title={t('affiliate.earnings.rejected', 'Rejected Earnings')}
          value={`$${data.totalRejectedEarnings.toFixed(2)}`}
          description={t('affiliate.earnings.rejectedDesc', 'Earnings that were declined')}
          icon={DollarSign}
          iconColor="text-red-500"
          gradientColors="from-red-400 to-red-600"
          loading={isLoading && !stats}
          formatter={formatCurrency}
        />
      </div>

      {/* Referral Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Converted Referrals */}
        <StatsCard 
          title={t('affiliate.metrics.converted', 'Converted Referrals')}
          value={data.totalConvertedReferrals}
          description={t('affiliate.metrics.subscribedUsers', 'Subscribed users')}
          icon={TrendingUp}
          iconBackground="bg-blue-50 dark:bg-blue-900/20" 
          iconColor="text-blue-600 dark:text-blue-400"
          loading={isLoading && !stats}
        />

        {/* Approved Referrals */}
        <StatsCard 
          title={t('affiliate.metrics.approved', 'Approved Referrals')}
          value={data.totalApprovedReferrals}
          description={t('affiliate.metrics.earnedCommission', 'Earned commission')}
          icon={CheckCircle}
          iconBackground="bg-green-50 dark:bg-green-900/20" 
          iconColor="text-green-600 dark:text-green-400"
          loading={isLoading && !stats}
        />

        {/* Rejected Referrals */}
        <StatsCard 
          title={t('affiliate.metrics.rejected', 'Rejected Referrals')}
          value={data.totalRejectedReferrals}
          description={t('affiliate.metrics.rejectedDesc', 'Not eligible for commission')}
          icon={XCircle}
          iconBackground="bg-red-50 dark:bg-red-900/20" 
          iconColor="text-red-600 dark:text-red-400"
          loading={isLoading && !stats}
        />
      </div>

      {/* Earnings Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('affiliate.earnings.breakdown', 'Earnings Breakdown')}</CardTitle>
          <CardDescription>
            {t('affiliate.earnings.breakdownDesc', 'Visual representation of your earnings by status')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <Skeleton className="h-full w-[80%] max-w-[500px]" />
            </div>
          ) : (
            <div className="relative h-[200px] w-full flex items-center justify-center">
              {/* Simple bar chart visualization */}
              <div className="flex items-end justify-center w-full gap-6 h-full pt-4 pb-8">
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className={cn(
                      "w-16 bg-green-500 rounded-t-md transition-all duration-500",
                      stats && stats.totalApprovedEarnings > 0 ? "h-[60%]" : "h-[10%]" 
                    )}
                  ></div>
                  <span className="text-xs font-medium">{t('affiliate.status.approved', 'Approved')}</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className={cn(
                      "w-16 bg-amber-500 rounded-t-md transition-all duration-500",
                      stats && stats.totalPendingEarnings > 0 ? "h-[40%]" : "h-[5%]" 
                    )}
                  ></div>
                  <span className="text-xs font-medium">{t('affiliate.status.pending', 'Pending')}</span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className={cn(
                      "w-16 bg-red-500 rounded-t-md transition-all duration-500",
                      stats && stats.totalRejectedEarnings > 0 ? "h-[20%]" : "h-[3%]" 
                    )}
                  ></div>
                  <span className="text-xs font-medium">{t('affiliate.status.rejected', 'Rejected')}</span>
                </div>
              </div>
              
              {/* Chart placeholder icon */}
              <div className="absolute bottom-4 right-4 text-muted-foreground">
                <BarChart4 className="h-5 w-5" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end mt-6">
        <Button className="w-full sm:w-auto flex gap-2 items-center" onClick={() => fetchStats()}>
          <ArrowUpRight className="h-4 w-4" />
          {t('affiliate.earnings.refreshData', 'Refresh Data')}
        </Button>
      </div>
    </div>
  );
}