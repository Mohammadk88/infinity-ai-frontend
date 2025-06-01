'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Calendar, CheckCircle, Clock, ExternalLink, Zap } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ActiveAIProvider {
  id: string;
  name: string;
  type: string;
  activatedAt: string;
  expiresAt: string;
  features: string[];
  usageLimit?: number;
  currentUsage?: number;
}

export default function AIProviderStatus() {
  const { t } = useTranslation();
  const [activeProviders, setActiveProviders] = useState<ActiveAIProvider[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Mock data - in production this would fetch from API
    const mockActiveProviders: ActiveAIProvider[] = [
      {
        id: 'claude-3-pro',
        name: 'Claude 3 Pro',
        type: 'Anthropic Claude 3',
        activatedAt: '2025-05-28T16:45:00Z',
        expiresAt: '2025-06-27T16:45:00Z',
        features: ['Advanced reasoning', 'Longer context', 'Code analysis', 'Document processing'],
        usageLimit: 1000,
        currentUsage: 245
      },
      {
        id: 'gemini-25',
        name: 'Gemini 2.5 Trial',
        type: 'Google Gemini 2.5',
        activatedAt: '2025-05-20T11:20:00Z',
        expiresAt: '2025-05-27T11:20:00Z', // Expired
        features: ['Multimodal processing', 'Image generation', 'Code completion', 'Fast responses'],
        usageLimit: 500,
        currentUsage: 387
      }
    ];
    
    setActiveProviders(mockActiveProviders);
  }, []);

  if (!mounted) return null;

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();
  const daysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (provider: ActiveAIProvider) => {
    if (isExpired(provider.expiresAt)) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          <Clock className="h-3 w-3 mr-1" />
          {t('aiProvider.status.expired', 'Expired')}
        </Badge>
      );
    }
    
    const days = daysRemaining(provider.expiresAt);
    if (days <= 3) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          {t('aiProvider.status.expiringSoon', '{days}d remaining', { days })}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        {t('aiProvider.status.active', '{days}d remaining', { days })}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (activeProviders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            {t('aiProvider.activeProviders', 'Active AI Providers')}
          </CardTitle>
          <CardDescription>
            {t('aiProvider.noActiveProviders', 'No active AI providers found')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <BrainCircuit className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t('aiProvider.getStarted', 'Redeem AI provider access from the rewards store')}
            </p>
            <Link href="/dashboard/me/rewards/store">
              <Button variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                {t('aiProvider.browseRewards', 'Browse Rewards')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              {t('aiProvider.activeProviders', 'Active AI Providers')}
            </CardTitle>
            <CardDescription>
              {t('aiProvider.manageAccess', 'Manage your redeemed AI provider access')}
            </CardDescription>
          </div>
          <Link href="/dashboard/ai-providers">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              {t('aiProvider.manage', 'Manage')}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeProviders.map((provider) => (
          <div key={provider.id} className="p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{provider.name}</h4>
                <p className="text-sm text-muted-foreground">{provider.type}</p>
              </div>
              {getStatusBadge(provider)}
            </div>
            
            {/* Usage Progress */}
            {provider.usageLimit && provider.currentUsage !== undefined && (
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('aiProvider.usage', 'Usage')}</span>
                  <span className="font-medium">
                    {provider.currentUsage}/{provider.usageLimit} {t('aiProvider.requests', 'requests')}
                  </span>
                </div>
                <Progress 
                  value={(provider.currentUsage / provider.usageLimit) * 100} 
                  className="h-2"
                />
              </div>
            )}
            
            {/* Expiry Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="h-3 w-3" />
              <span>
                {isExpired(provider.expiresAt) 
                  ? t('aiProvider.expiredOn', 'Expired on {date}', { date: formatDate(provider.expiresAt) })
                  : t('aiProvider.expiresOn', 'Expires on {date}', { date: formatDate(provider.expiresAt) })
                }
              </span>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap gap-1">
              {provider.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {provider.features.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{provider.features.length - 3} {t('aiProvider.more', 'more')}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
