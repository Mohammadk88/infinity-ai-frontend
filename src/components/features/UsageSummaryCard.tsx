'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Calendar,
  Users,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useCurrentSubscription, 
  useUsageLimits,
  getUsagePercentage,
  formatUsageText,
  getUsageStatus,
  getUsageColor,
  getPlanBadgeVariant
} from '@/hooks/useUsageSummary';

interface UsageSummaryCardProps {
  className?: string;
}

const getUsageIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('generation') || lowerType.includes('ai')) return <Zap className="h-4 w-4" />;
  if (lowerType.includes('post') || lowerType.includes('schedule')) return <Calendar className="h-4 w-4" />;
  if (lowerType.includes('social') || lowerType.includes('account')) return <Users className="h-4 w-4" />;
  if (lowerType.includes('agent') || lowerType.includes('bot')) return <Bot className="h-4 w-4" />;
  return <TrendingUp className="h-4 w-4" />;
};

export default function UsageSummaryCard({ className }: UsageSummaryCardProps) {
  const router = useRouter();
  
  const { 
    data: subscription, 
    isLoading: subscriptionLoading, 
    error: subscriptionError 
  } = useCurrentSubscription();
  
  const { 
    data: usageLimits, 
    isLoading: usageLoading, 
    error: usageError 
  } = useUsageLimits();

  const isLoading = subscriptionLoading || usageLoading;
  const hasError = subscriptionError || usageError;

  const handleUpgradeClick = () => {
    router.push('/dashboard/plans');
  };

  // Show error state
  if (hasError && !isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load usage information. Please try refreshing the page.
            </AlertDescription>
          </Alert>
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
            <CardTitle className="text-lg">Usage Summary</CardTitle>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!subscription || !usageLimits) {
    return null;
  }

  // Count usage items nearing limits
  const nearingLimitCount = usageLimits.filter(item => {
    const percentage = getUsagePercentage(item.used, item.limit);
    return percentage >= 75 && item.limit !== -1;
  }).length;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Usage Summary</CardTitle>
          <Badge variant={getPlanBadgeVariant(subscription.planName)} className="font-medium">
            {subscription.planName}
          </Badge>
        </div>
        
        {nearingLimitCount > 0 && (
          <Alert className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {nearingLimitCount} {nearingLimitCount === 1 ? 'feature is' : 'features are'} nearing their limit
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {usageLimits.map((item, index) => {
          const percentage = getUsagePercentage(item.used, item.limit);
          const status = getUsageStatus(percentage);
          const isUnlimited = item.limit === -1;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-md",
                    status === 'danger' ? 'bg-red-100 text-red-600' :
                    status === 'warning' ? 'bg-orange-100 text-orange-600' :
                    'bg-green-100 text-green-600'
                  )}>
                    {getUsageIcon(item.type)}
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.type}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-medium",
                    isUnlimited ? 'text-green-600' : getUsageColor(status)
                  )}>
                    {formatUsageText(item.used, item.limit)}
                  </span>
                  
                  {!isUnlimited && (
                    <div className="flex items-center gap-1">
                      {status === 'danger' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                      {status === 'safe' && <CheckCircle className="h-3 w-3 text-green-500" />}
                    </div>
                  )}
                </div>
              </div>
              
              {!isUnlimited && (
                <div className="space-y-1">
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    style={{
                      background: 'rgb(241 245 249)'
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(percentage)}% used</span>
                    {item.limit > 0 && (
                      <span>{(item.limit - item.used).toLocaleString()} remaining</span>
                    )}
                  </div>
                </div>
              )}
              
              {isUnlimited && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Unlimited usage</span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleUpgradeClick}
          className="w-full"
          variant="default"
        >
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Upgrade Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
