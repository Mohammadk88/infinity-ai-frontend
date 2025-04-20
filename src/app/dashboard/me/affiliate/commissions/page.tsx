'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  PercentIcon, 
  ArrowLeftCircle, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calculator,
  InfoIcon
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAffiliateStore } from '@/store/useAffiliateStore';
// import { cn } from '@/lib/utils';

// Simple chart component to show earnings growth
const SimpleBarChart = ({ data, height = 40 }: { data: number[], height?: number }) => {
  const max = Math.max(...data);
  
  return (
    <div className="flex items-end gap-1 h-[40px]">
      {data.map((value, index) => (
        <div 
          key={index} 
          className="bg-primary/80 hover:bg-primary rounded-sm w-full transition-all"
          style={{ 
            height: `${max ? (value / max) * height : 0}px`,
            minHeight: value > 0 ? '4px' : '0'
          }}
          title={`${value}`}
        />
      ))}
    </div>
  );
};

// Stats card component for metrics
const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  chartData,
  loading = false,
  formatter = (val: number | string) => val,
}: {
  title: string,
  value: number | string,
  description?: string,
  icon: React.ElementType,
  chartData?: number[],
  loading?: boolean,
  formatter?: (val: number | string) => React.ReactNode,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="rounded-full bg-muted/50 p-1">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {formatter(value)}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        {chartData && !loading && (
          <div className="mt-3">
            <SimpleBarChart data={chartData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function CommissionsPage() {
  const { t } = useTranslation();
  const { stats, isLoading, error, fetchStats } = useAffiliateStore();
  const [mounted, setMounted] = useState(false);
  
  // Fetch affiliate data on page load
  useEffect(() => {
    setMounted(true);
    fetchStats();
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
  
  // Format percentage
  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `${numValue}%`;
  };

  // Derived stats for the cards
  const commissionData = {
    currentRate: stats?.commissionRate || 0,
    totalConvertedReferrals: stats?.totalConvertedReferrals || 0,
    totalApprovedEarnings: stats?.totalApprovedEarnings || 0,
    averageCommission: stats?.totalConvertedReferrals 
      ? (stats.totalApprovedEarnings / stats.totalConvertedReferrals) 
      : 0,
  };

  // Mock data for earnings chart - in a real app this would come from API
  const mockEarningsGrowth = [12, 18, 24, 32, 28, 36, 42, 48, 52, 58, 64, 72];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('affiliates.commissions.title', 'Commission Summary')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('affiliates.commissions.subtitle', 'View your commission rates and earnings statistics')}
          </p>
        </div>
        <Link href="/dashboard/me/affiliate">
          <Button variant="outline" size="sm">
            <ArrowLeftCircle className="h-4 w-4 mr-2" />
            {t('affiliates.backToAffiliate', 'Back to Affiliate')}
          </Button>
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
          <div className="flex gap-2 items-center">
            <InfoIcon className="h-4 w-4" />
            <span>{t('affiliates.commissions.error', 'Error loading commission data')}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Commission Rate Card */}
        <StatCard
          title={t('affiliates.commissions.currentRate', 'Current Commission Rate')}
          value={commissionData.currentRate}
          description={t('affiliates.commissions.rateDescription', 'Your earnings percentage per conversion')}
          icon={PercentIcon}
          loading={isLoading && !stats}
          formatter={formatPercentage}
        />

        {/* Converted Referrals Card */}
        <StatCard
          title={t('affiliates.commissions.totalReferrals', 'Total Converted Referrals')}
          value={commissionData.totalConvertedReferrals}
          description={t('affiliates.commissions.referralDescription', 'Users who subscribed through your link')}
          icon={Users}
          loading={isLoading && !stats}
        />

        {/* Total Approved Earnings Card */}
        <StatCard
          title={t('affiliates.commissions.approvedEarnings', 'Total Approved Earnings')}
          value={commissionData.totalApprovedEarnings}
          description={t('affiliates.commissions.earningsDescription', 'Total commissions paid out to date')}
          icon={DollarSign}
          chartData={mockEarningsGrowth}
          loading={isLoading && !stats}
          formatter={formatCurrency}
        />

        {/* Average Commission Card */}
        <StatCard
          title={t('affiliates.commissions.averageCommission', 'Average Commission')}
          value={commissionData.averageCommission}
          description={t('affiliates.commissions.averageDescription', 'Average earnings per converted referral')}
          icon={Calculator}
          loading={isLoading && !stats}
          formatter={formatCurrency}
        />
      </div>

      {/* Commission Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('affiliates.commissions.details', 'Commission Details')}</CardTitle>
          <CardDescription>
            {t('affiliates.commissions.detailsDescription', 'Additional information about your commission structure')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && !stats ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                {t('affiliates.commissions.explainer', 
                  'As an affiliate partner, you earn {rate}% commission on all qualifying purchases made by users who sign up through your referral link. Commissions are calculated based on the subscription fee paid by the referred user.',
                  { rate: commissionData.currentRate }
                )}
              </p>
              
              <div className="my-4 p-4 rounded-md bg-muted">
                <h4 className="font-medium text-base">
                  {t('affiliates.commissions.howCalculated', 'How commissions are calculated')}
                </h4>
                <p className="text-sm">
                  {t('affiliates.commissions.calculationExample', 
                    'Example: If a user purchases a $99/month subscription through your link, you would earn ${earned} per month for as long as they remain subscribed.',
                    { earned: ((99 * commissionData.currentRate) / 100).toFixed(2) }
                  )}
                </p>
              </div>

              <p className="text-sm">
                {t('affiliates.commissions.paymentSchedule', 'Commissions are processed at the end of each month and paid out according to your chosen payment method. The minimum payout threshold is $50.')}
              </p>
              
              <div className="flex items-center my-4 gap-2 text-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('affiliates.commissions.performanceTip', 'Higher conversion rates may qualify you for increased commission percentages.')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-muted-foreground">
                  {t('affiliates.commissions.performanceBased', 'Commission rates are performance-based and may be adjusted over time.')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <span className="text-xs text-muted-foreground">
            {isLoading ? 
              t('affiliates.commissions.loading', 'Loading data...') :
              t('affiliates.commissions.lastUpdated', 'Last updated: {date}', { date: new Date().toLocaleDateString() })
            }
          </span>
          <Link href="/dashboard/me/affiliate/earnings">
            <Button variant="ghost" size="sm">
              {t('affiliates.commissions.viewEarningsHistory', 'View Earnings History')}
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}