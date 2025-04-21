'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  ArrowLeftCircle,
  RefreshCw,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Wallet,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import api from '@/app/lib/axios';
import { cn } from '@/lib/utils';

interface Payout {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  paymentDate?: string;
  paymentReference?: string;
}

export default function PayoutsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { stats } = useAffiliateStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [currency, setCurrency] = useState('USD');

  const fetchPayouts = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const { data } = await api.get('/affiliate/commissions?type=payout', { withCredentials: true });
      setPayouts(data);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
      toast({
        title: t('affiliate.payouts.error', 'Error'),
        description: t('affiliate.payouts.errorLoading', 'Failed to load payout history'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, toast]);

  useEffect(() => {
    setMounted(true);
    fetchPayouts();
  }, [fetchPayouts]);

  const handleRequestPayout = async () => {
    if (!requestAmount || isNaN(Number(requestAmount)) || Number(requestAmount) <= 0) {
      toast({
        title: t('affiliate.payouts.error', 'Error'),
        description: t('affiliate.payouts.invalidAmount', 'Please enter a valid amount'),
        variant: 'destructive'
      });
      return;
    }

    const amount = Number(requestAmount);
    if (amount > (stats?.pendingEarnings || 0)) {
      toast({
        title: t('affiliate.payouts.error', 'Error'),
        description: t('affiliate.payouts.insufficientFunds', 'Insufficient available earnings'),
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsRequesting(true);
      await api.post('/affiliate/commissions', {
        type: 'payout',
        amount,
        currency,
        paymentMethod
      }, { withCredentials: true });
      
      setShowRequestDialog(false);
      setRequestAmount('');
      setCurrency('USD');
      setPaymentMethod('paypal');
      fetchPayouts();
      
      toast({
        title: t('affiliate.payouts.success', 'Success'),
        description: t('affiliate.payouts.requestSubmitted', 'Payout request submitted successfully'),
      });
    } catch (error) {
      console.error('Failed to request payout:', error);
      toast({
        title: t('affiliate.payouts.error', 'Error'),
        description: t('affiliate.payouts.errorRequesting', 'Failed to submit payout request'),
        variant: 'destructive'
      });
    } finally {
      setIsRequesting(false);
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
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            {t('affiliate.payouts.approved', 'Approved')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            {t('affiliate.payouts.rejected', 'Rejected')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {t('affiliate.payouts.pending', 'Pending')}
          </Badge>
        );
    }
  };

  if (!mounted) return null;

  const canRequestPayout = (stats?.pendingEarnings || 0) >= 50;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('affiliate.payouts.title', 'Payout Requests')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('affiliate.payouts.subtitle', 'Manage and track your payout requests')}
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
            onClick={fetchPayouts}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            {t('affiliate.refreshData', 'Refresh')}
          </Button>
        </div>
      </div>

      {!canRequestPayout && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('affiliate.payouts.minimumRequired', 'Minimum Balance Required')}</AlertTitle>
          <AlertDescription>
            {t('affiliate.payouts.minimumDesc', 'You need at least $50 in available earnings to request a payout.')}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('affiliate.payouts.availableBalance', 'Available Balance')}</CardTitle>
              <CardDescription>
                {t('affiliate.payouts.balanceDesc', 'Your current available earnings for payout')}
              </CardDescription>
            </div>
            <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
              <DialogTrigger asChild>
                <Button disabled={!canRequestPayout}>
                  <Wallet className="h-4 w-4 mr-2" />
                  {t('affiliate.payouts.requestPayout', 'Request Payout')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('affiliate.payouts.requestTitle', 'Request Payout')}</DialogTitle>
                  <DialogDescription>
                    {t('affiliate.payouts.requestDesc', 'Enter your payout request details')}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">{t('affiliate.payouts.amount', 'Amount')}</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        max={stats?.pendingEarnings || 0}
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        className="pl-9"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('affiliate.payouts.availableAmount', 'Available: {{amount}}', {
                        amount: formatCurrency(stats?.pendingEarnings || 0)
                      })}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">{t('affiliate.payouts.currency', 'Currency')}</Label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="paymentMethod">{t('affiliate.payouts.paymentMethod', 'Payment Method')}</Label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="paypal">PayPal</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button 
                    onClick={handleRequestPayout} 
                    disabled={isRequesting || !requestAmount || Number(requestAmount) <= 0}
                  >
                    {isRequesting ? t('common.requesting', 'Requesting...') : t('common.submit', 'Submit')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">
              {formatCurrency(stats?.pendingEarnings || 0)}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
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
        ) : payouts.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">
                {t('affiliate.payouts.noPayouts', 'No payout requests')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('affiliate.payouts.noPayoutsDesc', 'Your payout requests will appear here')}
              </p>
            </CardContent>
          </Card>
        ) : (
          payouts.map((payout) => (
            <Card key={payout.id}>
              <CardHeader className="pb-2">
                <CardDescription>
                  {payout.paymentDate ? format(new Date(payout.paymentDate), 'MMM d, yyyy') : t('affiliate.payouts.requested', 'Requested')}
                </CardDescription>
                <CardTitle className="text-lg">
                  {formatCurrency(payout.amount, payout.currency)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t('affiliate.payouts.method', 'Method')}
                    </span>
                    <span className="text-sm font-medium">
                      {payout.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t('affiliate.payouts.status', 'Status')}
                    </span>
                    {getStatusBadge(payout.paymentStatus)}
                  </div>
                  {payout.paymentReference && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t('affiliate.payouts.reference', 'Reference')}
                      </span>
                      <span className="text-sm font-medium">
                        {payout.paymentReference}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}