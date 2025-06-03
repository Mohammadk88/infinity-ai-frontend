'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getCurrentSubscription, 
  cancelSubscription, 
  resumeSubscription, 
  updateBillingCycle,
  UserSubscription 
} from '@/services/api/subscriptions';
import { getPaymentMethods, PaymentMethod } from '@/services/api/payments';

interface SubscriptionManagementProps {
  className?: string;
}

export default function SubscriptionManagement({ className }: SubscriptionManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current subscription
  const { 
    data: subscription, 
    isLoading: subscriptionLoading, 
    error: subscriptionError 
  } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: getCurrentSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch payment methods
  const { 
    data: paymentMethods = [], 
    isLoading: paymentMethodsLoading 
  } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel subscription',
        variant: 'destructive',
      });
    },
  });

  // Resume subscription mutation
  const resumeMutation = useMutation({
    mutationFn: resumeSubscription,
    onSuccess: () => {
      toast({
        title: 'Subscription Resumed',
        description: 'Your subscription has been resumed successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resume subscription',
        variant: 'destructive',
      });
    },
  });

  // Update billing cycle mutation
  const updateBillingMutation = useMutation({
    mutationFn: updateBillingCycle,
    onSuccess: () => {
      toast({
        title: 'Billing Updated',
        description: 'Your billing cycle has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update billing cycle',
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">
            <Clock className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      case 'trial':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Trial
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (subscriptionLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (subscriptionError || !subscription) {
    return (
      <div className={cn("space-y-6", className)}>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No active subscription found. 
            <Button variant="link" className="px-2 text-primary">
              View available plans
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Current Subscription Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{subscription.plan.name} Plan</span>
                {getStatusBadge(subscription.status)}
              </CardTitle>
              <CardDescription>
                {subscription.plan.description || `Your current ${subscription.plan.name} subscription`}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${subscription.plan.price || subscription.plan.priceMonthly || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                per {subscription.plan.billing_cycle === 'yearly' ? 'year' : 'month'}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Current Period:</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Billing Cycle:</span>
              </div>
              <div className="text-sm text-muted-foreground ml-6 capitalize">
                {subscription.plan.billing_cycle || 'monthly'}
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Plan Features</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>AI Generations: {subscription.plan.features.ai_generations === -1 ? 'Unlimited' : subscription.plan.features.ai_generations}</div>
              <div>Scheduled Posts: {subscription.plan.features.scheduled_posts === -1 ? 'Unlimited' : subscription.plan.features.scheduled_posts}</div>
              <div>Social Accounts: {subscription.plan.features.social_accounts === -1 ? 'Unlimited' : subscription.plan.features.social_accounts}</div>
              <div>AI Agents: {subscription.plan.features.ai_agents === -1 ? 'Unlimited' : subscription.plan.features.ai_agents}</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex space-x-2">
          {subscription.status === 'active' && (
            <>
              {subscription.plan.billing_cycle === 'monthly' && (
                <Button
                  variant="outline"
                  onClick={() => updateBillingMutation.mutate('yearly')}
                  disabled={updateBillingMutation.isPending}
                >
                  {updateBillingMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Switch to Yearly (Save 20%)
                </Button>
              )}
              
              {subscription.plan.billing_cycle === 'yearly' && (
                <Button
                  variant="outline"
                  onClick={() => updateBillingMutation.mutate('monthly')}
                  disabled={updateBillingMutation.isPending}
                >
                  {updateBillingMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Switch to Monthly
                </Button>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your subscription? You&apos;ll continue to have access until the end of your current billing period.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Keep Subscription</Button>
                    <Button 
                      variant="destructive"
                      onClick={() => cancelMutation.mutate()}
                      disabled={cancelMutation.isPending}
                    >
                      {cancelMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Yes, Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          {subscription.status === 'cancelled' && (
            <Button
              onClick={() => resumeMutation.mutate()}
              disabled={resumeMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {resumeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Resume Subscription
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Payment Methods Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods and billing information</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethodsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Skeleton className="h-8 w-8" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : paymentMethods.length === 0 ? (
            <Alert>
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                No payment methods found. Add a payment method to manage your subscription.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">
                      {method.brand?.toUpperCase()} ending in {method.last4}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline">
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
