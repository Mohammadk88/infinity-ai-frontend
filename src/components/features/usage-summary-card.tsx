'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Crown,
  Zap,
  Users,
  Building2,
  ArrowRight,
  TrendingUp,
  Bot,
  Calendar,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  useUsageLimits, 
  getUsagePercentage, 
  formatUsage, 
  getUsageColor,
  type UsageLimit 
} from '@/hooks/useUsageLimits';

const UsageSummaryCard = () => {
  const [mounted, setMounted] = useState(false);
  
  // Fetch usage limits using the custom hook
  const { data: usageData, isLoading, error } = useUsageLimits();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPlanBadgeColor = (tier: string) => {
    switch (tier) {
      case 'freelancer':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400';
      case 'small-business':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400';
      case 'agency':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/50 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'freelancer':
        return <Users className="h-4 w-4" />;
      case 'small-business':
        return <Building2 className="h-4 w-4" />;
      case 'agency':
        return <Crown className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getPlanGradient = (tier: string) => {
    switch (tier) {
      case 'freelancer':
        return 'from-blue-500 to-cyan-500';
      case 'small-business':
        return 'from-purple-500 to-pink-500';
      case 'agency':
        return 'from-gray-400 to-gray-600';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const renderUsageRow = (
    icon: React.ReactNode,
    label: string,
    usage: UsageLimit,
    showProgress = true
  ) => {
    const percentage = getUsagePercentage(usage.used, usage.total);
    const isUnlimited = usage.total === -1;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-muted-foreground">
              {icon}
            </div>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={cn(
              "text-sm font-medium",
              isUnlimited ? "text-green-600" : getUsageColor(percentage)
            )}>
              {formatUsage(usage.used, usage.total)}
            </span>
            {!isUnlimited && percentage >= 90 && (
              <Badge variant="destructive" className="text-xs">
                {Math.round(percentage)}%
              </Badge>
            )}
          </div>
        </div>
        
        {showProgress && !isUnlimited && (
          <Progress 
            value={percentage} 
            className="h-2"
            style={{
              backgroundColor: 'rgb(241 245 249)'
            }}
          />
        )}
        
        {showProgress && isUnlimited && (
          <div className="h-2 bg-gradient-to-r from-green-200 to-green-300 rounded-full opacity-50"></div>
        )}
      </div>
    );
  };

  if (!mounted) return null;

  // Show loading state
  if (isLoading) {
    return (
      <Card className="glass-card border-border/50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-2 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Show error state or fallback
  if (error || !usageData) {
    return (
      <Card className="glass-card border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-muted-foreground">
            Usage data unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unable to load usage information. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const plan = usageData.plan;
  const limits = usageData.limits;

  return (
    <Card className="glass-card border-border/50 overflow-hidden">
      {/* Header with gradient */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg",
              "bg-gradient-to-br",
              getPlanGradient(plan.tier)
            )}>
              {getPlanIcon(plan.tier)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {plan.name} Plan
              </CardTitle>
              <Badge variant="outline" className={cn("text-xs", getPlanBadgeColor(plan.tier))}>
                {plan.tier.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
            <TrendingUp className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Overview */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            Current Usage
          </h4>
          
          {/* AI Generations */}
          {renderUsageRow(
            <Zap className="h-4 w-4" />,
            'AI Generations',
            limits.aiGenerations
          )}

          {/* Scheduled Posts */}
          {renderUsageRow(
            <Calendar className="h-4 w-4" />,
            'Scheduled Posts',
            limits.scheduledPosts
          )}

          {/* Social Accounts */}
          {renderUsageRow(
            <Users className="h-4 w-4" />,
            'Social Accounts',
            limits.socialAccounts
          )}

          {/* AI Agents */}
          {renderUsageRow(
            <Bot className="h-4 w-4" />,
            'AI Agents',
            limits.aiAgents
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {limits.aiGenerations.total === -1 ? '∞' : 
                Math.round(((limits.aiGenerations.used / limits.aiGenerations.total) * 100))}
              {limits.aiGenerations.total !== -1 && '%'}
            </div>
            <div className="text-xs text-muted-foreground">AI Usage</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {limits.socialAccounts.total === -1 ? 
                limits.socialAccounts.used : 
                `${limits.socialAccounts.total - limits.socialAccounts.used}`}
            </div>
            <div className="text-xs text-muted-foreground">
              {limits.socialAccounts.total === -1 ? 'Connected' : 'Accounts Left'}
            </div>
          </div>
        </div>

        {/* Upgrade Button */}
        <div className="pt-2">
          <Link href="/dashboard/plans" passHref>
            <Button 
              className={cn(
                "w-full font-semibold transition-premium",
                plan.tier === 'freelancer' 
                  ? "bg-gradient-to-r from-primary to-accent hover:shadow-glow text-white border-0"
                  : "bg-background hover:bg-muted border border-border"
              )}
              variant={plan.tier === 'freelancer' ? "default" : "outline"}
            >
              {plan.tier === 'freelancer' ? (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Plan
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Manage Plan
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageSummaryCard;
