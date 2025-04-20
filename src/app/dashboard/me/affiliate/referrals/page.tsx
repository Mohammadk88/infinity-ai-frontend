'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, AlertCircle, User, ArrowLeftCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import api from '@/app/lib/axios'; // أو حسب مسار الملف يلي عندك

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { Referral } from '@/types/AffiliateStats';

export default function ReferralHistoryPage() {
  const { t } = useTranslation();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Function to fetch referrals
  const fetchReferrals = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const { data } = await api.get('/me/affiliates/referrals');
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setReferrals(data);
      } else {
        console.error('API did not return an array:', data);
        setReferrals([]);
        setError(t('affiliate.referrals.invalidData', 'Received invalid data format from server'));
      }
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
      setReferrals([]);
      setError(t('affiliate.referrals.error', 'Failed to load referral data'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);
  
  // Fetch referral data on mount
  useEffect(() => {
    setMounted(true);
    fetchReferrals();
  }, [fetchReferrals]);
  
  // Don't render until client-side to prevent hydration issues
  if (!mounted) return null;
  
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
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
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => fetchReferrals()}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", (isLoading || isRefreshing) && "animate-spin")} />
            {t('affiliate.refreshData', 'Refresh Data')}
          </Button>
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
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Table for displaying referrals */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('affiliate.referrals.user', 'User')}</TableHead>
                  <TableHead>{t('affiliate.referrals.status', 'Status')}</TableHead>
                  <TableHead className="text-right">{t('affiliate.referrals.reward', 'Reward')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('affiliate.referrals.date', 'Date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Loading state */}
                {isLoading && (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-3 w-[120px]" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                )}

                {/* Empty state */}
                {!isLoading && (!referrals || referrals.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                          <User className="h-6 w-6 text-muted-foreground" />
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
                {!isLoading && referrals && Array.isArray(referrals) && referrals.map((referral) => {
                  if (!referral) return null;
                  
                  const badge = getStatusBadge(referral.status);
                  return (
                    <TableRow key={referral.id || Math.random().toString()}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            {referral.referredUser?.name ? referral.referredUser.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <div>{referral.referredUser?.name || t('affiliate.referrals.unknownUser', 'Unknown User')}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {referral.referredUser?.email || ''}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={badge.variant} className={badge.className}>
                          <div className="flex items-center">
                            {badge.icon}
                            {t(`affiliate.status.${referral.status}`, referral.status.charAt(0).toUpperCase() + referral.status.slice(1))}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(referral.reward)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {referral.createdAt ? formatDate(referral.createdAt) : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">
            {t('affiliate.referrals.lastUpdated', 'Last updated: {time}', 
              { time: new Date().toLocaleTimeString() })
            }
          </span>
          <span className="text-xs text-muted-foreground">
            {referrals && referrals.length > 0 && 
              t('affiliate.referrals.showing', 'Showing {count} referrals', 
                { count: referrals.length })
            }
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}