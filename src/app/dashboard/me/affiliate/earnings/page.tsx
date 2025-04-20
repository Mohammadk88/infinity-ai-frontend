'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowLeftCircle,
  Users,
  BarChart4,
  Calendar,
  ChevronDown,
  Filter,
  Download
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricCard, StatsCard } from '@/components/features/metric-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import { cn } from '@/lib/utils';
import api from '@/app/lib/axios';
import { AffiliateStats } from '@/types/AffiliateStats';

interface DateRange {
  start: Date;
  end: Date;
}

export default function AffiliateEarningsPage() {
  const { t } = useTranslation();
  const { stats, error, fetchStats } = useAffiliateStore();
  const [data, setData] = useState<AffiliateStats | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: startOfMonth(subMonths(new Date(), 1)),
    end: endOfMonth(new Date())
  });
  const [chartFilter, setChartFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const fetchEarningsData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/affiliate/earnings', {
        params: {
          startDate: format(dateRange.start, 'yyyy-MM-dd'),
          endDate: format(dateRange.end, 'yyyy-MM-dd')
        }
      });
      setData(data);
      await fetchStats();
    } catch (err) {
      console.error('Failed to load earnings:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange, fetchStats]);

  // Fetch affiliate data on mount and when date range changes
  useEffect(() => {
    setMounted(true);
    fetchEarningsData();
  }, [fetchEarningsData]);

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: stats?.currency || 'USD',
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const getDateRangePreset = (months: number) => {
    return {
      start: startOfMonth(subMonths(new Date(), months)),
      end: endOfMonth(new Date())
    };
  };

  if (!mounted) return null;

  if (!data && !loading) {
    return (
      <div className="p-6 center text-center bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400">
        {t('affiliate.earnings.noData', 'No earnings data found.')}
      </div>
    );
  }

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
            <Button variant="outline" size="sm">
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              {t('affiliate.backToAffiliate', 'Back to Affiliate')}
            </Button>
          </Link>
          <Link href="/dashboard/me/affiliate/referrals">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              {t('affiliate.viewReferrals', 'View Referrals')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setDateRange(getDateRangePreset(1))}>
                  {t('affiliate.earnings.lastMonth', 'Last Month')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange(getDateRangePreset(3))}>
                  {t('affiliate.earnings.last3Months', 'Last 3 Months')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange(getDateRangePreset(6))}>
                  {t('affiliate.earnings.last6Months', 'Last 6 Months')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange(getDateRangePreset(12))}>
                  {t('affiliate.earnings.lastYear', 'Last Year')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('affiliate.earnings.filterBy', 'Filter Chart')}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setChartFilter('all')}>
                    {t('affiliate.earnings.showAll', 'Show All')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChartFilter('approved')}>
                    {t('affiliate.earnings.showApproved', 'Approved Only')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChartFilter('pending')}>
                    {t('affiliate.earnings.showPending', 'Pending Only')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t('affiliate.earnings.export', 'Export')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
          value={data?.totalApprovedEarnings || 0}
          description={t('affiliate.earnings.approvedDesc', 'Earnings ready for payout')}
          icon={DollarSign}
          iconColor="text-green-500"
          gradientColors="from-green-400 to-green-600"
          loading={loading}
          formatter={formatCurrency}
        />

        {/* Pending Earnings */}
        <MetricCard 
          title={t('affiliate.earnings.pending', 'Pending Earnings')}
          value={data?.totalPendingEarnings || 0}
          description={t('affiliate.earnings.pendingDesc', 'Earnings awaiting approval')}
          icon={DollarSign}
          iconColor="text-amber-500"
          gradientColors="from-amber-400 to-amber-600"
          loading={loading}
          formatter={formatCurrency}
        />

        {/* Average Earnings */}
        <MetricCard 
          title={t('affiliate.earnings.average', 'Average Per Referral')}
          value={data?.totalConvertedReferrals ? (data.totalApprovedEarnings / data.totalConvertedReferrals) : 0}
          description={t('affiliate.earnings.averageDesc', 'Average earnings per converted referral')}
          icon={DollarSign}
          iconColor="text-blue-500"
          gradientColors="from-blue-400 to-blue-600"
          loading={loading}
          formatter={formatCurrency}
        />
      </div>

      {/* Referral Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Converted Referrals */}
        <StatsCard 
          title={t('affiliate.metrics.converted', 'Converted Referrals')}
          value={data?.totalConvertedReferrals || 0}
          description={t('affiliate.metrics.subscribedUsers', 'Subscribed users')}
          icon={TrendingUp}
          iconBackground="bg-blue-50 dark:bg-blue-900/20" 
          iconColor="text-blue-600 dark:text-blue-400"
          loading={loading}
        />

        {/* Approved Referrals */}
        <StatsCard 
          title={t('affiliate.metrics.approved', 'Approved Referrals')}
          value={data?.totalApprovedReferrals || 0}
          description={t('affiliate.metrics.earnedCommission', 'Earned commission')}
          icon={CheckCircle}
          iconBackground="bg-green-50 dark:bg-green-900/20" 
          iconColor="text-green-600 dark:text-green-400"
          loading={loading}
        />

        {/* Success Rate */}
        <StatsCard 
          title={t('affiliate.metrics.successRate', 'Success Rate')}
          value={data?.totalConvertedReferrals && data.totalApprovedReferrals 
            ? `${Math.round((data.totalApprovedReferrals / data.totalConvertedReferrals) * 100)}%`
            : '0%'}
          description={t('affiliate.metrics.approvalRate', 'Referral approval rate')}
          icon={TrendingUp}
          iconBackground="bg-purple-50 dark:bg-purple-900/20" 
          iconColor="text-purple-600 dark:text-purple-400"
          loading={loading}
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
          {loading ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <Skeleton className="h-full w-[80%] max-w-[500px]" />
            </div>
          ) : (
            <div className="relative h-[200px] w-full flex items-center justify-center">
              {/* Earnings visualization based on chartFilter */}
              <div className="flex items-end justify-center w-full gap-6 h-full pt-4 pb-8">
                {(chartFilter === 'all' || chartFilter === 'approved') && (
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className={cn(
                        "w-16 bg-green-500 rounded-t-md transition-all duration-500",
                        data && data.totalApprovedEarnings > 0 ? "h-[60%]" : "h-[10%]" 
                      )}
                    ></div>
                    <span className="text-xs font-medium">{t('affiliate.status.approved', 'Approved')}</span>
                    <span className="text-xs text-muted-foreground">{formatCurrency(data?.totalApprovedEarnings || 0)}</span>
                  </div>
                )}
                
                {(chartFilter === 'all' || chartFilter === 'pending') && (
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className={cn(
                        "w-16 bg-amber-500 rounded-t-md transition-all duration-500",
                        data && data.totalPendingEarnings > 0 ? "h-[40%]" : "h-[5%]" 
                      )}
                    ></div>
                    <span className="text-xs font-medium">{t('affiliate.status.pending', 'Pending')}</span>
                    <span className="text-xs text-muted-foreground">{formatCurrency(data?.totalPendingEarnings || 0)}</span>
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-4 right-4 text-muted-foreground">
                <BarChart4 className="h-5 w-5" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end mt-6">
        <Button className="w-full sm:w-auto flex gap-2 items-center" onClick={fetchEarningsData}>
          <TrendingUp className="h-4 w-4" />
          {t('affiliate.earnings.refreshData', 'Refresh Data')}
        </Button>
      </div>
    </div>
  );
}