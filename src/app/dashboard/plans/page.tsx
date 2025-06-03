'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  Check,
  Sparkles,
  Users,
  Building2,
  Crown,
  Zap,
  CheckCircle,
  Loader2,
  ArrowRight,
  Bot,
  Calendar,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import api from '@/app/lib/axios';
import SubscriptionSummaryCard from '@/components/features/SubscriptionSummaryCard';

// Types
interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  priceMonthly?: number;
  priceYearly?: number;
  price?: number; // fallback
  billing_cycle?: 'monthly' | 'yearly';
  features: {
    ai_generation?: number; // Note: API uses ai_generation (singular)
    ai_generations?: number; // fallback for plural
    scheduled_posts?: number;
    social_accounts?: number;
    ai_agents?: number;
  };
  is_popular?: boolean;
  is_recommended?: boolean;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  current_period_start: string;
  current_period_end: string;
  plan: SubscriptionPlan;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

// API functions
const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const response = await api.get('/subscription-plans');
    // Transform API response to match our interface
    const apiPlans = response.data;
    
    if (!Array.isArray(apiPlans)) {
      console.warn('API response is not an array:', apiPlans);
      return [];
    }
    
    // Create both monthly and yearly variants for each plan
    const transformedPlans: SubscriptionPlan[] = [];
    
    apiPlans.forEach((plan: {
      id: string;
      name: string;
      description?: string;
      priceMonthly?: number;
      priceYearly?: number;
      price?: number;
      features?: {
        ai_generation?: number;
        ai_generations?: number;
        scheduled_posts?: number;
        social_accounts?: number;
        ai_agents?: number;
      };
      is_popular?: boolean;
      is_recommended?: boolean;
    }) => {
      // Monthly variant
      transformedPlans.push({
        id: plan.id,
        name: plan.name,
        description: plan.description || `Perfect for ${plan.name.toLowerCase()} usage`,
        price: plan.priceMonthly || plan.price || 0,
        billing_cycle: 'monthly',
        features: {
          ai_generations: plan.features?.ai_generation || plan.features?.ai_generations || 0,
          scheduled_posts: plan.features?.scheduled_posts || 0,
          social_accounts: plan.features?.social_accounts || 0,
          ai_agents: plan.features?.ai_agents || 0,
        },
        is_popular: plan.is_popular || plan.name.toLowerCase().includes('business'),
        is_recommended: plan.is_recommended || plan.name.toLowerCase().includes('business'),
      });
      
      // Yearly variant (with 20% discount)
      const yearlyPrice = plan.priceYearly || Math.floor((plan.priceMonthly || plan.price || 0) * 0.8);
      transformedPlans.push({
        id: `${plan.id}-yearly`,
        name: plan.name,
        description: plan.description || `Perfect for ${plan.name.toLowerCase()} usage`,
        price: yearlyPrice,
        billing_cycle: 'yearly',
        features: {
          ai_generations: plan.features?.ai_generation || plan.features?.ai_generations || 0,
          scheduled_posts: plan.features?.scheduled_posts || 0,
          social_accounts: plan.features?.social_accounts || 0,
          ai_agents: plan.features?.ai_agents || 0,
        },
        is_popular: plan.is_popular || plan.name.toLowerCase().includes('business'),
        is_recommended: plan.is_recommended || plan.name.toLowerCase().includes('business'),
      });
    });
    
    return transformedPlans;
  } catch (error) {
    console.error('Failed to fetch subscription plans:', error);
    // Return mock data for development
    return [
      {
        id: 'freelancer',
        name: 'Freelancer',
        description: 'Perfect for solo creators and freelancers getting started',
        price: 15,
        billing_cycle: 'monthly',
        features: {
          ai_generations: 10,
          scheduled_posts: 20,
          social_accounts: 3,
          ai_agents: 1
        }
      },
      {
        id: 'freelancer-yearly',
        name: 'Freelancer',
        description: 'Perfect for solo creators and freelancers getting started',
        price: 12,
        billing_cycle: 'yearly',
        features: {
          ai_generations: 10,
          scheduled_posts: 20,
          social_accounts: 3,
          ai_agents: 1
        }
      },
      {
        id: 'small-business',
        name: 'Small Business',
        description: 'Ideal for growing businesses and marketing teams',
        price: 59,
        billing_cycle: 'monthly',
        features: {
          ai_generations: -1,
          scheduled_posts: -1,
          social_accounts: -1,
          ai_agents: 5
        },
        is_popular: true,
        is_recommended: true
      },
      {
        id: 'small-business-yearly',
        name: 'Small Business',
        description: 'Ideal for growing businesses and marketing teams',
        price: 47,
        billing_cycle: 'yearly',
        features: {
          ai_generations: -1,
          scheduled_posts: -1,
          social_accounts: -1,
          ai_agents: 5
        },
        is_popular: true,
        is_recommended: true
      },
      {
        id: 'agency',
        name: 'Agency',
        description: 'For agencies and large organizations with advanced needs',
        price: 199,
        billing_cycle: 'monthly',
        features: {
          ai_generations: -1,
          scheduled_posts: -1,
          social_accounts: -1,
          ai_agents: 20
        }
      },
      {
        id: 'agency-yearly',
        name: 'Agency',
        description: 'For agencies and large organizations with advanced needs',
        price: 159,
        billing_cycle: 'yearly',
        features: {
          ai_generations: -1,
          scheduled_posts: -1,
          social_accounts: -1,
          ai_agents: 20
        }
      }
    ];
  }
};

const fetchCurrentSubscription = async (): Promise<UserSubscription | null> => {
  try {
    const response = await api.get('/subscriptions/me');
    return response.data;
  } catch (error) {
    // If no subscription found, return null
    const apiError = error as ApiError;
    if (apiError.response?.status === 404) {
      return null;
    }
    console.error('Failed to fetch current subscription:', error);
    return null;
  }
};

export default function PlansPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle payment success/cancel from URL params
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const cancelled = urlParams.get('cancelled');

    if (success === 'true') {
      toast({
        title: 'Payment Successful!',
        description: 'Your subscription has been activated successfully.',
      });
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/plans');
      // Refresh subscription data
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['usage-limit'] });
    } else if (cancelled === 'true') {
      toast({
        title: 'Payment Cancelled',
        description: 'Your payment was cancelled. No charges were made.',
        variant: 'destructive',
      });
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/plans');
    }
  }, [toast, queryClient]);

  // Fetch subscription plans
  const { 
    data: plans = [], 
    isLoading: plansLoading, 
    error: plansError 
  } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: fetchSubscriptionPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch current subscription
  const { 
    data: currentSubscription, 
    isLoading: subscriptionLoading 
  } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: fetchCurrentSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create Paddle checkout session mutation
  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await api.post('/payments/paddle/create-checkout', { 
        planId 
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to Paddle checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: 'Error',
          description: 'No checkout URL received',
          variant: 'destructive',
        });
      }
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Failed to create checkout session';
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Helper functions
  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'freelancer':
        return <Users className="h-6 w-6" />;
      case 'small business':
        return <Building2 className="h-6 w-6" />;
      case 'agency':
        return <Crown className="h-6 w-6" />;
      default:
        return <Sparkles className="h-6 w-6" />;
    }
  };

  const getPlanGradient = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'freelancer':
        return 'from-emerald-500 via-teal-500 to-cyan-500';
      case 'small business':
        return 'from-violet-500 via-purple-500 to-indigo-500';
      case 'agency':
        return 'from-amber-500 via-orange-500 to-red-500';
      default:
        return 'from-emerald-500 via-teal-500 to-cyan-500';
    }
  };

  const formatLimit = (value: number | undefined, label: string) => {
    if (value === undefined || value === null) return `0 ${label}`;
    if (value === -1) return `Unlimited ${label}`;
    return `${value.toLocaleString()} ${label}`;
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan_id === planId && currentSubscription?.status === 'active';
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubscription = () => {
    if (selectedPlan) {
      // Use the plan ID directly for Paddle checkout
      checkoutMutation.mutate(selectedPlan.id);
      setShowConfirmDialog(false);
    }
  };

  // Filter plans by billing cycle with proper array check
  const filteredPlans = Array.isArray(plans) ? plans.filter(plan => 
    plan.billing_cycle === (isYearly ? 'yearly' : 'monthly')
  ) : [];

  // Debug logging
  console.log('Plans data:', plans);
  console.log('Filtered plans:', filteredPlans);
  console.log('Is yearly:', isYearly);

  // Enhanced loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="relative overflow-hidden border border-border/60 bg-gradient-to-br from-background via-background to-muted/20">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="relative mx-auto">
              <Skeleton className="h-20 w-20 rounded-2xl mx-auto" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-8 w-32 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-center space-x-2">
                <Skeleton className="h-12 w-20" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center space-x-4 p-3 rounded-xl bg-muted/30">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="p-8 pt-4">
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  if (plansError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Plans</h1>
          <p className="text-muted-foreground">
            Unable to load subscription plans. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-400/8 via-teal-400/8 to-cyan-400/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-r from-violet-400/8 via-purple-400/8 to-indigo-400/8 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-400/4 via-orange-400/4 to-red-400/4 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-300/10 to-sky-300/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-pink-300/10 to-rose-300/10 rounded-full blur-2xl animate-pulse animation-delay-3000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Compact Modern Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative group">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg transition-transform duration-500 ease-out group-hover:scale-105">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="absolute inset-0 h-12 w-12 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-15 blur-lg group-hover:opacity-25 transition-opacity duration-500 ease-out"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight ml-4">
              Choose Your Plan
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Transform your social media strategy with AI-powered tools
          </p>
          
          {/* Compact Billing Toggle */}
          <div className="inline-flex items-center space-x-6 p-3 bg-card/80 backdrop-blur-xl rounded-full border border-border/50 shadow-md hover:shadow-lg transition-all duration-500 ease-out group/toggle">
            <span className={cn(
              "text-sm font-semibold transition-all duration-500 ease-out px-3 py-1.5 rounded-full",
              !isYearly 
                ? "text-foreground bg-gradient-to-r from-primary/10 to-accent/10" 
                : "text-muted-foreground hover:text-foreground"
            )}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className={cn(
                "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-500 data-[state=checked]:to-purple-500",
                "h-6 w-11 transition-all duration-500 ease-out"
              )}
            />
            <span className={cn(
              "text-sm font-semibold transition-all duration-500 ease-out px-3 py-1.5 rounded-full",
              isYearly 
                ? "text-foreground bg-gradient-to-r from-primary/10 to-accent/10" 
                : "text-muted-foreground hover:text-foreground"
            )}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-300 text-xs px-3 py-1">
                <Zap className="h-3 w-3 mr-1" />
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Current Subscription Status */}
        <div className="mb-12 max-w-2xl mx-auto">
          <SubscriptionSummaryCard 
            variant="plans"
            onSubscribe={(planId) => {
              if (planId) {
                // Find the plan by ID and trigger subscription
                const plan = filteredPlans.find(p => p.id === planId || p.id.replace('-yearly', '') === planId);
                if (plan) {
                  handleSubscribe(plan);
                }
              } else {
                // Scroll to pricing cards if no specific plan ID
                const pricingSection = document.querySelector('.pricing-cards-section');
                pricingSection?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            showUpgradeButton={false}
            className="shadow-lg"
          />
          
          {/* Link to subscription management for existing subscribers */}
          {currentSubscription && (
            <div className="text-center mt-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/subscription">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Link>
              </Button>
            </div>
          )}
        </div>

      {/* Pricing Cards */}
      {plansLoading || subscriptionLoading ? (
        <LoadingSkeleton />
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Plans Available</h3>
          <p className="text-sm text-muted-foreground">
            Unable to load subscription plans. Please try again later.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto pricing-cards-section">
          {filteredPlans.map((plan) => {
            const isCurrentUserPlan = isCurrentPlan(plan.id);
            const isPopular = plan.is_popular;
            const isRecommended = plan.is_recommended;

            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative overflow-hidden group cursor-pointer plan-card-modern",
                  "border transition-all duration-700 ease-out",
                  "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
                  "transform hover:scale-[1.01] hover:-translate-y-1",
                  isPopular 
                    ? "border-primary/30 shadow-lg scale-[1.01] hover:shadow-primary/10" 
                    : "border-border/20 hover:border-primary/15",
                  isCurrentUserPlan && "ring-1 ring-green-400/30 shadow-green-300/10 border-green-400/40"
                )}
              >
                {/* Subtle background gradient overlay */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out",
                  `bg-gradient-to-br ${getPlanGradient(plan.name)} opacity-[0.01] group-hover:opacity-[0.03]`
                )} />
                
                {/* Soft border glow */}
                <div className={cn(
                  "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-800 ease-out",
                  "bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                )} />

                {/* Compact Popular badge */}
                {isPopular && (
                  <div className="absolute -top-1 -right-1 z-20">
                    <div className="bg-gradient-to-r from-primary via-primary to-accent text-white px-3 py-1.5 text-xs font-bold rounded-bl-2xl rounded-tr-xl shadow-lg">
                      <div className="flex items-center space-x-1">
                        <span>⭐</span>
                        <span>POPULAR</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compact Recommended badge */}
                {isRecommended && !isPopular && (
                  <div className="absolute -top-1 -right-1 z-20">
                    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-3 py-1.5 text-xs font-bold rounded-bl-2xl rounded-tr-xl shadow-lg">
                      <div className="flex items-center space-x-1">
                        <span>⚡</span>
                        <span>BEST</span>
                      </div>
                    </div>
                  </div>
                )}

                <CardHeader className="text-center space-y-4 pb-6 relative z-10">
                  {/* Elegant Plan Icon */}
                  <div className="relative mx-auto group/icon">
                    <div className={cn(
                      "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md",
                      "transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-1",
                      `bg-gradient-to-br ${getPlanGradient(plan.name)}`,
                      "group-hover:shadow-lg group-hover/icon:shadow-primary/10"
                    )}>
                      <div className="transform group-hover/icon:scale-105 transition-transform duration-500 ease-out">
                        {getPlanIcon(plan.name)}
                      </div>
                    </div>
                    {/* Soft glowing effect */}
                    <div className={cn(
                      "absolute inset-0 w-16 h-16 mx-auto rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-700 ease-out blur-xl",
                      `bg-gradient-to-br ${getPlanGradient(plan.name)}`
                    )} />
                  </div>

                  <div className="space-y-2">
                    <CardTitle className={cn(
                      "text-2xl font-bold transition-all duration-700 ease-out group-hover:scale-[1.02]",
                      `bg-gradient-to-r ${getPlanGradient(plan.name)} bg-clip-text text-transparent`,
                      "tracking-heading"
                    )}>
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto group-hover:text-foreground/80 transition-all duration-700 ease-out tracking-wide-text">
                      {plan.description || `Perfect for ${plan.name.toLowerCase()} usage`}
                    </CardDescription>
                  </div>

                  {/* Elegant Price Display */}
                  <div className="pt-2">
                    <div className="flex items-center justify-center space-x-2 group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                      <span className={cn(
                        "text-3xl font-bold transition-all duration-700 ease-out tracking-heading",
                        `bg-gradient-to-r ${getPlanGradient(plan.name)} bg-clip-text text-transparent`
                      )}>
                        ${plan.price || 0}
                      </span>
                      <div className="text-left">
                        <div className="text-xs text-muted-foreground font-semibold tracking-wide-text">per month</div>
                        {isYearly && (
                          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-sm">
                            Yearly
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!isYearly && plan.billing_cycle === 'monthly' && (
                      <p className="text-xs text-muted-foreground mt-1 opacity-60 group-hover:opacity-80 transition-opacity duration-700 ease-out">
                        💰 Save 20% yearly
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 px-6 relative z-10">
                  {/* Compact Current Plan Badge */}
                  {isCurrentUserPlan && (
                    <div className="flex items-center justify-center">
                      <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-400 px-3 py-1.5 text-xs font-semibold">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active Plan
                      </Badge>
                    </div>
                  )}

                  {/* Elegant Features List */}
                  <div className="space-y-3">
                    <div className={cn(
                      "flex items-center space-x-3 p-3 rounded-xl border transition-all duration-500 ease-out hover:shadow-sm hover:scale-[1.01] group/feature",
                      "bg-gradient-to-r from-emerald-50/70 via-teal-50/70 to-cyan-50/70 border-emerald-200/40"
                    )}>
                      <div className="rounded-xl p-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm group-hover/feature:scale-105 transition-transform duration-500 ease-out">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-emerald-800 tracking-heading">
                          {formatLimit(plan.features?.ai_generations, 'AI Generations')}
                        </p>
                      </div>
                    </div>

                    <div className={cn(
                      "flex items-center space-x-3 p-3 rounded-xl border transition-all duration-500 ease-out hover:shadow-sm hover:scale-[1.01] group/feature",
                      "bg-gradient-to-r from-violet-50/70 via-purple-50/70 to-indigo-50/70 border-violet-200/40"
                    )}>
                      <div className="rounded-xl p-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-sm group-hover/feature:scale-105 transition-transform duration-500 ease-out">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-violet-800 tracking-heading">
                          {formatLimit(plan.features?.scheduled_posts, 'Scheduled Posts')}
                        </p>
                      </div>
                    </div>

                    <div className={cn(
                      "flex items-center space-x-3 p-3 rounded-xl border transition-all duration-500 ease-out hover:shadow-sm hover:scale-[1.01] group/feature",
                      "bg-gradient-to-r from-blue-50/70 via-cyan-50/70 to-sky-50/70 border-blue-200/40"
                    )}>
                      <div className="rounded-xl p-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm group-hover/feature:scale-105 transition-transform duration-500 ease-out">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-blue-800 tracking-heading">
                          {formatLimit(plan.features?.social_accounts, 'Social Accounts')}
                        </p>
                      </div>
                    </div>

                    <div className={cn(
                      "flex items-center space-x-3 p-3 rounded-xl border transition-all duration-500 ease-out hover:shadow-sm hover:scale-[1.01] group/feature",
                      "bg-gradient-to-r from-amber-50/70 via-orange-50/70 to-red-50/70 border-amber-200/40"
                    )}>
                      <div className="rounded-xl p-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm group-hover/feature:scale-105 transition-transform duration-500 ease-out">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-amber-800 tracking-heading">
                          {formatLimit(plan.features?.ai_agents, 'AI Agents')}
                        </p>
                      </div>
                    </div>

                    {/* Compact premium features */}
                    {plan.name.toLowerCase() !== 'freelancer' && (
                      <div className="border-t border-primary/20 pt-3 space-y-2">
                        <h4 className="text-sm font-bold text-foreground flex items-center tracking-heading">
                          <Sparkles className="h-4 w-4 mr-2 text-primary" />
                          Premium Features
                        </h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-primary/3 to-accent/3 hover:from-primary/5 hover:to-accent/5 transition-all duration-500 ease-out">
                            <div className="rounded-full p-1 bg-gradient-to-r from-primary/15 to-accent/15">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <p className="text-xs font-medium text-foreground tracking-wide-text">Priority Support</p>
                          </div>

                          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-primary/3 to-accent/3 hover:from-primary/5 hover:to-accent/5 transition-all duration-500 ease-out">
                            <div className="rounded-full p-1 bg-gradient-to-r from-primary/15 to-accent/15">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <p className="text-xs font-medium text-foreground tracking-wide-text">Advanced Analytics</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {plan.name.toLowerCase() === 'agency' && (
                      <div className="border-t border-amber-200/50 pt-3 space-y-2">
                        <h4 className="text-sm font-bold text-amber-800 flex items-center tracking-heading">
                          <Crown className="h-4 w-4 mr-2 text-amber-600" />
                          Enterprise
                        </h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/30 hover:from-amber-50/70 hover:to-orange-50/70 transition-all duration-500 ease-out">
                            <div className="rounded-full p-1 bg-gradient-to-r from-amber-500/15 to-orange-500/15">
                              <Check className="h-3 w-3 text-amber-600" />
                            </div>
                            <p className="text-xs font-medium text-amber-800 tracking-wide-text">White-label Solutions</p>
                          </div>

                          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/30 hover:from-amber-50/70 hover:to-orange-50/70 transition-all duration-500 ease-out">
                            <div className="rounded-full p-1 bg-gradient-to-r from-amber-500/15 to-orange-500/15">
                              <Check className="h-3 w-3 text-amber-600" />
                            </div>
                            <p className="text-xs font-medium text-amber-800 tracking-wide-text">Dedicated Support</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-4 relative z-10">
                  <Button
                    className={cn(
                      "w-full font-semibold text-sm py-4 rounded-xl transition-all duration-500 ease-out shadow-sm hover:shadow-md",
                      "transform hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group/button",
                      isPopular && !isCurrentUserPlan
                        ? `bg-gradient-to-r ${getPlanGradient(plan.name)} hover:opacity-95 text-white border-0 shadow-md hover:shadow-primary/15`
                        : isCurrentUserPlan
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm"
                        : `bg-gradient-to-r from-background to-muted hover:from-muted hover:to-muted/80 border border-border hover:border-primary/30 text-foreground hover:text-primary`
                    )}
                    variant={isPopular && !isCurrentUserPlan ? "default" : "outline"}
                    size="default"
                    disabled={isCurrentUserPlan || checkoutMutation.isPending}
                    onClick={() => !isCurrentUserPlan && handleSubscribe(plan)}
                  >
                    {/* Subtle button shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out" />
                    
                    {checkoutMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentUserPlan ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Active Plan
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">
                          Get {plan.name}
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-0.5 transition-transform duration-500 ease-out relative z-10" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

        {/* Bottom Section */}
        <div className="text-center mt-20 space-y-8">
          {/* Money Back Guarantee */}
          <div className="max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-200/50 p-8 shadow-lg backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800">30-Day Money-Back Guarantee</h3>
                </div>
                <p className="text-green-700 text-lg leading-relaxed">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <span className="text-lg">Have questions about our plans?</span>
              <Button variant="link" className="px-3 font-semibold text-primary hover:text-primary/80 text-lg">
                View FAQ
              </Button>
              <span className="text-lg">or</span>
              <Button variant="link" className="px-3 font-semibold text-primary hover:text-primary/80 text-lg">
                Contact Sales
              </Button>
            </div>
            
            {/* Trusted by */}
            <div className="flex items-center justify-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 border-2 border-background flex items-center justify-center text-white text-sm font-semibold"
                  >
                    {String.fromCharCode(65 + i - 1)}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground font-medium">
                Trusted by <span className="font-bold text-foreground">1,000+</span> content creators and businesses worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center text-white",
                selectedPlan && `bg-gradient-to-r ${getPlanGradient(selectedPlan.name)}`
              )}>
                {selectedPlan && getPlanIcon(selectedPlan.name)}
              </div>
              <span>Confirm Subscription</span>
            </DialogTitle>
            <DialogDescription>
              You&apos;re about to subscribe to the {selectedPlan?.name} plan
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="py-4 space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Plan:</span>
                  <span className="font-semibold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Billing:</span>
                  <span className="capitalize font-semibold">{selectedPlan.billing_cycle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Price:</span>
                  <span className="font-bold text-lg">
                    ${selectedPlan.price}
                    <span className="text-sm text-muted-foreground ml-1">
                      /{selectedPlan.billing_cycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </span>
                </div>
                {selectedPlan.billing_cycle === 'yearly' && (
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center justify-center">
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-300">
                        <Zap className="h-3 w-3 mr-1" />
                        Save 20% with yearly billing
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• You&apos;ll be redirected to our secure payment processor</p>
                <p>• Your subscription will be activated immediately after payment</p>
                <p>• 30-day money-back guarantee applies</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={checkoutMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSubscription}
              disabled={checkoutMutation.isPending}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
