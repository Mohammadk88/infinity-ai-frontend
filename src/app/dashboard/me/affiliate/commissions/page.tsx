'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  ArrowLeftCircle,
  RefreshCw,
  Search,
  ChevronDown,
  Filter,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import api from '@/app/lib/axios';

interface Commission {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'paid';
  type: 'referral' | 'bonus' | 'payout';
  paymentDate: string;
}

export default function CommissionsPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setIsRefreshing(true);
      const { data } = await api.get('/affiliate/commissions', { withCredentials: true });
      setCommissions(data);
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return (
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            {t('affiliate.commissions.paid', 'Paid')}
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            {t('affiliate.commissions.approved', 'Approved')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {t('affiliate.commissions.pending', 'Pending')}
          </Badge>
        );
    }
  };

  const filteredCommissions = commissions.filter(commission => {
    if (searchQuery && !commission.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter && commission.status !== statusFilter) {
      return false;
    }
    if (typeFilter && commission.type !== typeFilter) {
      return false;
    }
    return true;
  });

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('affiliate.commissions.title', 'Commissions History')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('affiliate.commissions.subtitle', 'Track your commission payments and status')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard/me/affiliate">
            <Button variant="outline" size="sm">
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              {t('affiliate.backToAffiliate', 'Back to Affiliate')}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCommissions}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            {t('affiliate.refreshData', 'Refresh')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('affiliate.commissions.search', 'Search commissions...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter || t('affiliate.commissions.status', 'Status')}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    {t('affiliate.commissions.allStatuses', 'All Statuses')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    {t('affiliate.commissions.pending', 'Pending')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                    {t('affiliate.commissions.approved', 'Approved')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('paid')}>
                    {t('affiliate.commissions.paid', 'Paid')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {typeFilter || t('affiliate.commissions.type', 'Type')}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                    {t('affiliate.commissions.allTypes', 'All Types')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('referral')}>
                    {t('affiliate.commissions.referral', 'Referral')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('bonus')}>
                    {t('affiliate.commissions.bonus', 'Bonus')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('payout')}>
                    {t('affiliate.commissions.payout', 'Payout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commissions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredCommissions.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">
                {t('affiliate.commissions.noCommissions', 'No commissions found')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('affiliate.commissions.startEarning', 'Start sharing your referral link to earn commissions')}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCommissions.map((commission) => (
            <Card key={commission.id}>
              <CardHeader className="pb-2">
                <CardDescription>
                  {format(new Date(commission.paymentDate), 'MMM d, yyyy')}
                </CardDescription>
                <CardTitle className="text-lg">
                  {formatCurrency(commission.amount, commission.currency)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t('affiliate.commissions.method', 'Method')}
                    </span>
                    <span className="text-sm font-medium">
                      {commission.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t('affiliate.commissions.type', 'Type')}
                    </span>
                    <span className="text-sm font-medium capitalize">
                      {commission.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t('affiliate.commissions.status', 'Status')}
                    </span>
                    {getStatusBadge(commission.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}