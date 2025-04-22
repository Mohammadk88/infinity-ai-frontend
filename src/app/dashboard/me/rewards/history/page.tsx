'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Gift, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import api from '@/app/lib/axios';

interface Award {
  id: string;
  title: string;
  image?: string;
  description?: string;
}

interface Redemption {
  id: string;
  award: Award;
  status: 'pending' | 'approved' | 'rejected';
  redeemedAt: string;
  note?: string;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function RedemptionHistoryPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const fetchRedemptions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/rewards/redemptions');
      setRedemptions(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('rewards.error', 'Error'),
        description: t('rewards.errorLoading', 'Failed to load redemption history'),
        variant: 'destructive',
      });
      console.error('Failed to load redemptions:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    setMounted(true);
    fetchRedemptions();
  }, [fetchRedemptions]);

  const getStatusBadge = (status: Redemption['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            {t('rewards.status.approved', 'Approved')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            {t('rewards.status.rejected', 'Rejected')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {t('rewards.status.pending', 'Pending')}
          </Badge>
        );
    }
  };

  const filteredRedemptions = redemptions.filter(redemption => 
    statusFilter === 'all' || redemption.status === statusFilter
  );

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('rewards.history.title', 'Redemption History')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('rewards.history.subtitle', 'Track the status of your redeemed rewards')}
          </p>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onValueChange={(value: StatusFilter) => setStatusFilter(value)}
          >
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('rewards.filter.status', 'Filter by status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('rewards.filter.all', 'All')}</SelectItem>
              <SelectItem value="pending">{t('rewards.status.pending', 'Pending')}</SelectItem>
              <SelectItem value="approved">{t('rewards.status.approved', 'Approved')}</SelectItem>
              <SelectItem value="rejected">{t('rewards.status.rejected', 'Rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : filteredRedemptions.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">
                {redemptions.length === 0 
                  ? t('rewards.history.noRedemptions', 'No Redemptions Yet')
                  : t('rewards.history.noResults', 'No Results Found')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {redemptions.length === 0 
                  ? t('rewards.history.noRedemptionsDesc', 'Start redeeming rewards from the store')
                  : t('rewards.history.noResultsDesc', 'Try a different status filter')}
              </p>
              {redemptions.length > 0 && statusFilter !== 'all' && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setStatusFilter('all')}
                >
                  {t('rewards.filter.showAll', 'Show All Redemptions')}
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('rewards.history.award', 'Award')}</TableHead>
                  <TableHead>{t('rewards.history.status', 'Status')}</TableHead>
                  <TableHead>{t('rewards.history.date', 'Date')}</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {t('rewards.history.note', 'Note')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRedemptions.map((redemption) => (
                  <TableRow key={redemption.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-muted relative overflow-hidden">
                          {redemption.award.image ? (
                            <Image
                              src={redemption.award.image}
                              alt={redemption.award.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Gift className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{redemption.award.title}</div>
                          {redemption.award.description && (
                            <div className="text-xs text-muted-foreground hidden sm:block">
                              {redemption.award.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(redemption.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(redemption.redeemedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {redemption.note || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}