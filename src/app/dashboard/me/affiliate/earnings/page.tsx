'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  DollarSign,
  CheckCircle,
  Clock,
  ArrowLeftCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import { cn } from '@/lib/utils';
import api from '@/app/lib/axios';
import type { Commission } from '@/types/Commission';

export default function AffiliateEarningsPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { stats } = useAffiliateStore();

  const fetchEarnings = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await api.get('/affiliate/referrals/earnings');
      setCommissions(response.data?.commissions || []);
      setError(null);
    } catch (err) {
      setError(t('affiliate.earnings.error', 'Failed to load earnings data'));
      console.error('Failed to fetch earnings:', err);
      setCommissions([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    setMounted(true);
    fetchEarnings();
  }, [fetchEarnings]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {t('affiliate.status.pending', 'Pending')}
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            {t('affiliate.status.approved', 'Approved')}
          </Badge>
        );
      case 'paid':
        return (
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30">
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            {t('affiliate.status.paid', 'Paid')}
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('affiliate.earnings.title', 'Earnings')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('affiliate.earnings.subtitle', 'Track all your affiliate income')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/me/affiliate">
            <Button variant="outline" size="sm">
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              {t('affiliate.backToAffiliate', 'Back to Affiliate')}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEarnings}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            {t('affiliate.refreshData', 'Refresh')}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('affiliate.error.title', 'Error')}</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEarnings}
              className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
            >
              {t('affiliate.retry', 'Retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Total Earnings */}
        <Card className="border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('affiliate.metrics.totalEarnings', 'Total Earnings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold flex items-center">
                  <DollarSign className="h-5 w-5 mr-1 text-green-500" />
                  {formatCurrency(stats?.totalEarnings || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('affiliate.metrics.allTimeEarnings', 'All-time earnings')}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Earnings */}
        <Card className="border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('affiliate.metrics.pendingEarnings', 'Pending Earnings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold flex items-center">
                  <Clock className="h-5 w-5 mr-1 text-yellow-500" />
                  {formatCurrency(stats?.pendingEarnings || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('affiliate.metrics.awaitingApproval', 'Awaiting approval')}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Commission Rate */}
        <Card className="border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('affiliate.metrics.commissionRate', 'Commission Rate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold flex items-center">
                  {stats?.commissionRate || 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('affiliate.metrics.currentRate', 'Your current rate')}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Referrals */}
        <Card className="border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('affiliate.metrics.totalReferrals', 'Total Referrals')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.referralCount || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('affiliate.metrics.referralCount', 'People referred')}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('affiliate.earnings.commissions', 'Commission History')}</CardTitle>
          <CardDescription>
            {t('affiliate.earnings.commissionsDesc', 'Your latest commission earnings')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">
                {t('affiliate.earnings.noEarnings', 'No earnings yet')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('affiliate.earnings.startEarning', 'Start referring to earn commissions')}
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('affiliate.earnings.date', 'Date')}</TableHead>
                    <TableHead>{t('affiliate.earnings.type', 'Type')}</TableHead>
                    <TableHead>{t('affiliate.earnings.amount', 'Amount')}</TableHead>
                    <TableHead>{t('affiliate.earnings.status', 'Status')}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {t('affiliate.earnings.method', 'Method')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        {format(new Date(commission.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="capitalize">{commission.type}</TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(commission.amount, commission.currency)}
                      </TableCell>
                      <TableCell>{getStatusBadge(commission.status)}</TableCell>
                      <TableCell className="hidden sm:table-cell capitalize">
                        {commission.paymentMethod.replace('_', ' ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}