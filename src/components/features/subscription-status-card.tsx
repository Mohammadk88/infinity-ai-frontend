'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Crown,
  Zap,
  Star,
  TrendingUp,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'free' | 'business' | 'agency' | 'enterprise';
  color: string;
  icon: React.ReactNode;
  features: string[];
  limits: {
    clients: number;
    projects: number;
    users: number;
    storage: number; // in GB
  };
  usage: {
    clients: number;
    projects: number;
    users: number;
    storage: number; // in GB
  };
}

const SubscriptionStatusCard = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    // Mock subscription data - in real app, this would come from your API
    const mockSubscription: SubscriptionPlan = {
      id: 'business_001',
      name: 'Business Pro',
      tier: 'business',
      color: 'from-blue-500 to-purple-600',
      icon: <Zap className="h-4 w-4" />,
      features: [
        'Unlimited AI generations',
        'Advanced analytics',
        'Priority support',
        'Custom branding'
      ],
      limits: {
        clients: 100,
        projects: 50,
        users: 5,
        storage: 100
      },
      usage: {
        clients: 24,
        projects: 18,
        users: 3,
        storage: 45.2
      }
    };

    // Simulate different plans based on user or random
    const plans = {
      free: {
        ...mockSubscription,
        name: 'Free',
        tier: 'free' as const,
        color: 'from-gray-500 to-gray-600',
        icon: <Star className="h-4 w-4" />,
        limits: { clients: 5, projects: 3, users: 1, storage: 5 },
        usage: { clients: 3, projects: 2, users: 1, storage: 2.1 }
      },
      business: mockSubscription,
      agency: {
        ...mockSubscription,
        name: 'Agency',
        tier: 'agency' as const,
        color: 'from-purple-500 to-pink-600',
        icon: <Crown className="h-4 w-4" />,
        limits: { clients: 500, projects: 200, users: 25, storage: 500 },
        usage: { clients: 124, projects: 78, users: 12, storage: 234.5 }
      }
    };

    // For demo, randomly assign a plan or use a specific one
    const planType = 'business'; // You can change this to 'free' or 'agency' for testing
    setSubscription(plans[planType]);
  }, [user]);

  if (!subscription) return null;

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 75) return 'text-orange-600 bg-orange-50';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPlanBadgeColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'business':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agency':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enterprise':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="glass-card border-border/50 overflow-hidden">
      {/* Header with gradient */}
      <CardHeader className="pb-3 relative">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-10",
          subscription.color
        )} />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg",
              "bg-gradient-to-br",
              subscription.color
            )}>
              {subscription.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {subscription.name}
              </CardTitle>
              <Badge variant="outline" className={cn("text-xs", getPlanBadgeColor(subscription.tier))}>
                {subscription.tier.toUpperCase()} PLAN
              </Badge>
            </div>
          </div>
          
          {subscription.tier !== 'enterprise' && (
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              <TrendingUp className="h-4 w-4 mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Overview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center">
            <Users className="h-4 w-4 mr-2 text-primary" />
            Monthly Usage
          </h4>
          
          {/* Clients Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Clients</span>
              <span className="font-medium">
                {subscription.usage.clients} / {subscription.limits.clients}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(subscription.usage.clients, subscription.limits.clients)} 
              className="h-2"
              style={{
                background: 'rgb(226 232 240)'
              }}
            />
          </div>

          {/* Projects Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Projects</span>
              <span className="font-medium">
                {subscription.usage.projects} / {subscription.limits.projects}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(subscription.usage.projects, subscription.limits.projects)} 
              className="h-2"
            />
          </div>

          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Storage</span>
              <span className="font-medium">
                {subscription.usage.storage}GB / {subscription.limits.storage}GB
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(subscription.usage.storage, subscription.limits.storage)} 
              className="h-2"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {Math.round(((subscription.usage.clients / subscription.limits.clients) * 100))}%
            </div>
            <div className="text-xs text-muted-foreground">Clients Used</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {subscription.limits.storage - subscription.usage.storage}GB
            </div>
            <div className="text-xs text-muted-foreground">Storage Left</div>
          </div>
        </div>

        {/* Renewal Info */}
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Renews on March 15, 2024</span>
          </div>
        </div>

        {/* Action Button */}
        {subscription.tier === 'free' && (
          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-premium">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Business
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusCard;
