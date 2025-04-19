'use client';

import {  useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, AlertCircle, User, DollarSign, ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
// import { cn } from '@/lib/utils';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import { Button } from '@/components/ui/button';

export default function ReferralHistoryPage() {
  const { t } = useTranslation();
  const { logs, isLoading, error, fetchLogs } = useAffiliateStore();
  
  // Fetch referral data on page load
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Helper function to determine status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return {
          variant: "outline" as const,
          className: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30",
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />
        };
      case 'rejected':
        return {
          variant: "outline" as const,
          className: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30",
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />
        };
      default: // pending
        return {
          variant: "outline" as const,
          className: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
    }
  };

  // Format date function
  const formatDate = (dateString: string | Date | unknown) => {
    if (dateString === null || dateString === undefined) {
      return 'N/A';
    }
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString as Date;
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">
            {t('affiliate.referrals.title', 'My Referrals')}
            </h1>
            <p className="text-muted-foreground mt-1">
            {t('affiliate.referrals.subtitle', 'Track the status of people you\'ve referred')}
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard/me/affiliate">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              {t('affiliate.backToAffiliate', 'Back to Affiliate')}
            </Button>
          </Link>
          <Link href="/dashboard/me/affiliate/earnings">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('affiliate.viewEarnings', 'View Earnings')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Referrals Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t('affiliate.referrals.history', 'Referral History')}</CardTitle>
          <CardDescription>
            {t('affiliate.referrals.description', 'Complete history of all your referrals and their status')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Show error message if there's an error */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
              <div className="flex gap-2 items-center">
                <AlertCircle className="h-4 w-4" />
                <span>{t('affiliate.referrals.error', 'Error loading referral data')}</span>
              </div>
            </div>
          )}

          {/* Table for displaying referrals */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('affiliate.referrals.user', 'User')}</TableHead>
                  <TableHead>{t('affiliate.referrals.status', 'Status')}</TableHead>
                  <TableHead className="text-right">{t('affiliate.referrals.earnings', 'Earnings')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('affiliate.referrals.date', 'Date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Loading state */}
                {isLoading && logs.length === 0 && (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-[80px] ml-auto" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-[100px]" /></TableCell>
                    </TableRow>
                  ))
                )}
                
                {/* Empty state when no referrals */}
                {!isLoading && logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-sm">{t('affiliate.referrals.noReferralsYet', 'No Referrals Yet')}</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          {t('affiliate.referrals.startSharing', 'Start sharing your referral link to see your referrals here')}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                
                {/* Actual referral data */}
                {!isLoading && logs.map((referral) => {
                  const badge = getStatusBadge(referral.status);
                  return (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">
                        {referral.referredEmail}
                        {referral.referredName && (
                          <div className="text-xs text-muted-foreground">
                            {referral.referredName}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={badge.variant} className={badge.className}>
                          <span className="flex items-center">
                            {badge.icon}
                            {t(`affiliate.status.${referral.status}`, referral.status)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {referral.earnings !== undefined ? (
                          formatCurrency(referral.earnings)
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {t('affiliate.referrals.pending', 'Pending')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(referral.referredAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}