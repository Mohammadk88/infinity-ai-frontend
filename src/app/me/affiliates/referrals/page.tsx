'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowLeftCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/app/lib/axios';

// Define interface for referral data
interface ReferredUser {
  id: string;
  name: string;
  email: string;
}

interface Referral {
  id: string;
  referredUser: ReferredUser;
  status: 'pending' | 'approved' | 'rejected';
  reward?: number;
  createdAt: string;
}

export default function ReferralsPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  // Use React Query to fetch and cache the referrals data
  const { data: referrals = [], isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['affiliateReferrals'],
    queryFn: async () => {
      const { data } = await api.get<Referral[]>('/me/affiliates/referrals');
      return data;
    },
    enabled: mounted, // Only run the query after component has mounted
  });
  
  // Set mounted state on client side to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render until client-side to prevent hydration issues
  if (!mounted) {
    return null;
  }
  
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
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('affiliates.referrals.title', 'My Referrals')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('affiliates.referrals.subtitle', 'View the status of your referrals and rewards')}
          </p>
        </div>
        <Link href="/me/affiliates">
          <Button variant="outline" size="sm">
            <ArrowLeftCircle className="h-4 w-4 mr-2" />
            {t('affiliates.backToAffiliate', 'Back to Affiliate')}
          </Button>
        </Link>
      </div>

      {/* Referrals Table Card */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('affiliates.referrals.history', 'Referral History')}</CardTitle>
            <CardDescription>
              {t('affiliates.referrals.description', 'Complete history of all the users you have referred')}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefetching && "animate-spin")} />
            {t('affiliates.referrals.refresh', 'Refresh')}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Show error message if there's an error */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
              <div className="flex gap-2 items-center">
                <AlertCircle className="h-4 w-4" />
                <span>{t('affiliates.referrals.error', 'Error loading referral data')}</span>
              </div>
            </div>
          )}

          {/* Table for displaying referrals */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">{t('affiliates.referrals.user', 'Referred User')}</TableHead>
                  <TableHead className="w-[20%]">{t('affiliates.referrals.status', 'Status')}</TableHead>
                  <TableHead className="text-right w-[20%]">{t('affiliates.referrals.reward', 'Reward')}</TableHead>
                  <TableHead className="hidden md:table-cell w-[20%]">{t('affiliates.referrals.date', 'Date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Loading state */}
                {(isLoading || isRefetching) && !referrals.length && (
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
                {!isLoading && !isRefetching && referrals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-sm">{t('affiliates.referrals.noReferralsYet', 'No Referrals Yet')}</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          {t('affiliates.referrals.startSharing', 'Start sharing your referral link to see your referrals here')}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                
                {/* Actual referral data */}
                {!isLoading && !isRefetching && referrals.map((referral) => {
                  const badge = getStatusBadge(referral.status);
                  return (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">
                        {referral.referredUser.name}
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {referral.referredUser.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={badge.variant} className={badge.className}>
                          <span className="flex items-center">
                            {badge.icon}
                            {t(`affiliates.status.${referral.status}`, referral.status)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {referral.reward !== undefined ? (
                          formatCurrency(referral.reward)
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {t('affiliates.referrals.pending', 'Pending')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(referral.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground px-6 pt-2 pb-4">
          <span>
            {isRefetching ? 
              t('affiliates.referrals.refreshing', 'Refreshing data...') :
              t('affiliates.referrals.lastUpdated', 'Last updated {time}', { time: new Date().toLocaleTimeString() })
            }
          </span>
          <span>
            {referrals.length > 0 && 
              t('affiliates.referrals.showing', 'Showing {count} referrals', { count: referrals.length })
            }
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}