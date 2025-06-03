'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Check, 
  X, 
  AlertCircle,
  Crown,
  Zap,
  ArrowRight,
  RefreshCw,
  Calendar,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useSubscriptionStatus,
  calculateDaysRemaining,
  isSubscriptionExpired,
  isSubscriptionExpiringSoon,
  getSubscriptionStatusType,
  formatTimeRemaining,
  getStatusBadgeVariant,
  getStatusBadgeColor
} from '@/hooks/useSubscriptionStatus';

interface SubscriptionSummaryCardProps {
  className?: string;
  onSubscribe?: (planId?: string) => void;
  showUpgradeButton?: boolean;
  variant?: 'dashboard' | 'plans';
}

const getPlanIcon = (planName: string | null) => {
  if (!planName) return <User className="h-5 w-5" />;
  
  const lowerName = planName.toLowerCase();
  if (lowerName.includes('free') || lowerName.includes('basic')) return <User className="h-5 w-5" />;
  if (lowerName.includes('business') || lowerName.includes('pro')) return <Zap className="h-5 w-5" />;
  if (lowerName.includes('agency') || lowerName.includes('enterprise')) return <Crown className="h-5 w-5" />;
  return <Zap className="h-5 w-5" />;
};

const getPlanGradient = (planName: string | null) => {
  if (!planName) return 'from-gray-500 to-gray-600';
  
  const lowerName = planName.toLowerCase();
  if (lowerName.includes('free') || lowerName.includes('basic')) return 'from-gray-500 to-gray-600';
  if (lowerName.includes('business') || lowerName.includes('pro')) return 'from-blue-500 to-purple-600';
  if (lowerName.includes('agency') || lowerName.includes('enterprise')) return 'from-purple-500 to-pink-600';
  return 'from-blue-500 to-purple-600';
};

export default function SubscriptionSummaryCard({ 
  className, 
  onSubscribe, 
  showUpgradeButton = true,
  variant = 'dashboard'
}: SubscriptionSummaryCardProps) {
  const router = useRouter();
  
  const { 
    data: subscription, 
    isLoading, 
    error,
    refetch
  } = useSubscriptionStatus();

  const handleSubscribeClick = () => {
    if (onSubscribe) {
      onSubscribe();
    } else {
      router.push('/dashboard/plans');
    }
  };

  const handleRenewClick = () => {
    if (onSubscribe && subscription?.planId) {
      onSubscribe(subscription.planId);
    } else {
      router.push('/dashboard/plans');
    }
  };

  // Show error state
  if (error && !isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load subscription information. Please try refreshing the page.
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="mt-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Subscription Status</CardTitle>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!subscription) {
    return null;
  }

  const statusType = getSubscriptionStatusType(subscription.planId, subscription.endDate);
  const daysRemaining = subscription.endDate ? calculateDaysRemaining(subscription.endDate) : 0;
  const isExpired = isSubscriptionExpired(subscription.endDate);
  const isExpiringSoon = isSubscriptionExpiringSoon(subscription.endDate, 7);

  // No subscription case
  if (!subscription.planId) {
    return (
      <Card className={cn("w-full border-dashed", className)}>
        <CardHeader className="text-center pb-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle className="text-lg">No Active Subscription</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You are not subscribed to any plan.
          </p>
          <p className="text-sm text-muted-foreground">
            Choose a plan to unlock advanced features and boost your productivity.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubscribeClick}
            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
          >
            <Crown className="h-4 w-4 mr-2" />
            Choose Your Plan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Expired subscription case
  if (isExpired) {
    return (
      <Card className={cn("w-full border-red-200 bg-red-50/50", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-red-800">Subscription Expired</CardTitle>
            <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300">
              <X className="h-3 w-3 mr-1" />
              Expired
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-800">{subscription.planName}</p>
              <p className="text-sm text-red-600">
                Expired {Math.abs(daysRemaining)} day{Math.abs(daysRemaining) !== 1 ? 's' : ''} ago
              </p>
            </div>
          </div>
          
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Your subscription has expired. Renew now to continue enjoying premium features.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleRenewClick}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Renew Subscription
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Active subscription case
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Subscription Status</CardTitle>
          <div className="flex items-center space-x-2">
            {subscription.isTrial && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                <Calendar className="h-3 w-3 mr-1" />
                Trial
              </Badge>
            )}
            <Badge 
              variant={getStatusBadgeVariant(statusType)}
              className={cn(
                "font-medium",
                getStatusBadgeColor(statusType)
              )}
            >
              <Check className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Plan Information */}
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            `bg-gradient-to-r ${getPlanGradient(subscription.planName)}`
          )}>
            {getPlanIcon(subscription.planName)}
          </div>
          <div className="flex-1">
            <h3 className={cn(
              "font-semibold text-lg",
              `bg-gradient-to-r ${getPlanGradient(subscription.planName)} bg-clip-text text-transparent`
            )}>
              {subscription.planName}
            </h3>
            {subscription.isTrial && (
              <p className="text-sm text-blue-600 font-medium">Trial Period Active</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Expiration Information */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatTimeRemaining(subscription.endDate)}
            </span>
          </div>
          
          {isExpiringSoon && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                Your subscription expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. 
                Consider renewing to avoid service interruption.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Subscription Dates */}
        {subscription.startDate && subscription.endDate && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Started:</span>
              <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Expires:</span>
              <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Show upgrade button only if specified and not the highest tier */}
      {showUpgradeButton && variant === 'dashboard' && !subscription.planName?.toLowerCase().includes('agency') && !subscription.planName?.toLowerCase().includes('enterprise') && (
        <CardFooter>
          <Button 
            onClick={handleSubscribeClick}
            variant="outline"
            className="w-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Plan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
