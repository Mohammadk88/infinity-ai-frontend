'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Check,
  Sparkles,
  Users,
  Building2,
  Rocket,
  Crown,
  Zap
} from 'lucide-react';

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: PlanFeature[];
  ctaText: string;
  gradient: string;
  comingSoon?: boolean;
}

export default function PlansPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'freelancer',
      name: 'Freelancer',
      description: 'Perfect for solo creators and freelancers getting started',
      monthlyPrice: 15,
      yearlyPrice: 12, // 20% discount
      icon: <Users className="h-6 w-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        { name: 'Social Media Accounts', included: true, limit: '3 accounts' },
        { name: 'AI Content Generation', included: true, limit: '10 generations/month' },
        { name: 'Post Scheduling', included: true, limit: '20 posts/month' },
        { name: 'AI Agent', included: true, limit: '1 agent' },
        { name: 'Basic Rewards System', included: true },
        { name: 'Email Support', included: true },
        { name: 'Content Templates', included: true },
        { name: 'Basic Analytics', included: true },
        { name: 'Custom AI Provider Support', included: false },
        { name: 'Affiliate System', included: false },
        { name: 'Priority Support', included: false },
        { name: 'Advanced Analytics', included: false },
        { name: 'Team Collaboration', included: false }
      ],
      ctaText: 'Get Started'
    },
    {
      id: 'small-business',
      name: 'Small Business',
      description: 'Ideal for growing businesses and marketing teams',
      monthlyPrice: 59,
      yearlyPrice: 47, // 20% discount
      badge: 'Most Popular',
      popular: true,
      icon: <Building2 className="h-6 w-6" />,
      gradient: 'from-purple-500 to-pink-500',
      features: [
        { name: 'Social Media Accounts', included: true, limit: 'Unlimited' },
        { name: 'Full AI Generator Access', included: true, limit: 'Unlimited generations' },
        { name: 'Advanced Post Scheduling', included: true, limit: 'Unlimited posts' },
        { name: 'AI Agents', included: true, limit: '5 agents' },
        { name: 'Custom AI Provider Support', included: true, limit: 'Basic integration' },
        { name: 'Affiliate & Rewards System', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Advanced Analytics', included: true },
        { name: 'Content Automation', included: true },
        { name: 'Team Collaboration', included: true },
        { name: 'Custom Branding', included: true },
        { name: 'API Access', included: true },
        { name: 'Webhook Integrations', included: true }
      ],
      ctaText: 'Upgrade Now'
    },
    {
      id: 'agency',
      name: 'Agency',
      description: 'For agencies and large organizations with advanced needs',
      monthlyPrice: 199,
      yearlyPrice: 159, // 20% discount
      badge: 'Coming Soon',
      icon: <Crown className="h-6 w-6" />,
      gradient: 'from-gray-400 to-gray-600',
      comingSoon: true,
      features: [
        { name: 'Multi-Client Support', included: true, limit: 'Unlimited clients' },
        { name: 'AI Agents', included: true, limit: '20 agents' },
        { name: 'Custom AI Provider Support', included: true, limit: 'Advanced + Custom APIs' },
        { name: 'Advanced Analytics & Reports', included: true },
        { name: 'Full Automation Suite', included: true },
        { name: 'White-label Options', included: true },
        { name: 'Dedicated Support Manager', included: true },
        { name: 'Early Access to New Features', included: true },
        { name: 'Custom Integrations', included: true },
        { name: 'Enterprise Security', included: true },
        { name: 'Custom Training & Onboarding', included: true },
        { name: 'SLA Guarantee', included: true },
        { name: 'Custom Development', included: true }
      ],
      ctaText: 'Coming Soon'
    }
  ];

  const handleSubscribe = (planId: string) => {
    // TODO: Implement Stripe integration
    console.log(`Subscribing to plan: ${planId}, yearly: ${isYearly}`);
    
    // For now, show alert
    alert(`Starting subscription process for ${planId} plan (${isYearly ? 'yearly' : 'monthly'})`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your social media strategy with AI-powered content creation, scheduling, and automation tools
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <span className={cn("text-sm font-medium", !isYearly ? "text-foreground" : "text-muted-foreground")}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-primary"
          />
          <span className={cn("text-sm font-medium", isYearly ? "text-foreground" : "text-muted-foreground")}>
            Yearly
          </span>
          {isYearly && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Zap className="h-3 w-3 mr-1" />
              Save 20%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative overflow-hidden border-2 transition-all duration-300",
              plan.comingSoon 
                ? "border-border opacity-75 cursor-not-allowed" 
                : "hover:shadow-xl hover:scale-105",
              plan.popular 
                ? "border-primary shadow-lg scale-105" 
                : "border-border hover:border-primary/50"
            )}
          >
            {/* Popular Badge */}
            {plan.badge && (
              <div className="absolute top-0 right-0 left-0">
                <div className={cn(
                  "text-center py-2 text-sm font-semibold text-white",
                  `bg-gradient-to-r ${plan.gradient}`
                )}>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {plan.badge}
                  </Badge>
                </div>
              </div>
            )}

            <CardHeader className={cn("text-center", plan.badge && "pt-12")}>
              {/* Icon */}
              <div className={cn(
                "mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center text-white",
                `bg-gradient-to-r ${plan.gradient}`
              )}>
                {plan.icon}
              </div>

              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {plan.description}
              </CardDescription>

              {/* Price */}
              <div className="pt-4">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-bold">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <div className="text-left">
                    <div className="text-sm text-muted-foreground">per month</div>
                    {isYearly && (
                      <div className="text-xs text-green-600 line-through">
                        ${plan.monthlyPrice}
                      </div>
                    )}
                  </div>
                </div>
                {isYearly && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed annually (${(isYearly ? plan.yearlyPrice : plan.monthlyPrice) * 12}/year)
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features List */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={cn(
                      "rounded-full p-1 mt-0.5",
                      feature.included 
                        ? "bg-green-100 text-green-600" 
                        : "bg-gray-100 text-gray-400"
                    )}>
                      <Check className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm",
                        feature.included 
                          ? "text-foreground" 
                          : "text-muted-foreground line-through"
                      )}>
                        {feature.name}
                      </p>
                      {feature.limit && feature.included && (
                        <p className="text-xs text-muted-foreground">
                          {feature.limit}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className={cn(
                  "w-full font-semibold",
                  plan.popular && !plan.comingSoon
                    ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white border-0`
                    : "bg-background hover:bg-muted"
                )}
                variant={plan.popular && !plan.comingSoon ? "default" : "outline"}
                size="lg"
                disabled={plan.comingSoon}
                onClick={() => !plan.comingSoon && handleSubscribe(plan.id)}
              >
                {plan.ctaText}
                {!plan.comingSoon && <Rocket className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="text-center mt-16 space-y-8">
        {/* Money Back Guarantee */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 rounded-xl border border-border/50">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">30-Day Money-Back Guarantee</h3>
            </div>
            <p className="text-muted-foreground">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Have questions about our plans? 
            <Button variant="link" className="px-2 font-semibold">
              View FAQ
            </Button>
            or 
            <Button variant="link" className="px-2 font-semibold">
              Contact Sales
            </Button>
          </p>
          
          {/* Trusted by */}
          <p className="text-sm text-muted-foreground">
            Trusted by 1,000+ content creators and businesses worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
