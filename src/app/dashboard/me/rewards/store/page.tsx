'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, CheckCircle, Timer, Lock, Search, History, BrainCircuit, Cpu, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface Award {
  id: string;
  title: string;
  description?: string;
  points: number;
  type: 'limited' | 'permanent' | 'ai_provider';
  category: 'general' | 'ai_provider' | 'premium';
  image?: string;
  available?: number;
  redeemed?: boolean;
  aiProvider?: {
    providerName: string;
    duration: number; // in days
    features: string[];
  };
}

export default function RewardsStorePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [awards, setAwards] = useState<Award[]>([]);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'ai_provider' | 'premium'>('all');

  const fetchAwards = useCallback(async () => {
    try {
      setLoading(true);
      // In production, this would be a real API call
      // const { data } = await api.get('/awards');
      
      // Mock data with AI provider rewards
      const mockAwards: Award[] = [
        // AI Provider Rewards
        {
          id: 'claude-3-pro-30d',
          title: 'Claude 3 Pro Access',
          description: 'Unlock Claude 3 Pro with advanced reasoning and analysis capabilities for 30 days',
          points: 1000,
          type: 'ai_provider',
          category: 'ai_provider',
          available: 50,
          redeemed: false,
          aiProvider: {
            providerName: 'Anthropic Claude 3',
            duration: 30,
            features: ['Advanced reasoning', 'Longer context', 'Code analysis', 'Document processing']
          }
        },
        {
          id: 'gemini-25-7d',
          title: 'Gemini 2.5 Trial',
          description: 'Experience Google\'s latest Gemini 2.5 model with multimodal capabilities for 7 days',
          points: 750,
          type: 'ai_provider',
          category: 'ai_provider',
          available: 25,
          redeemed: false,
          aiProvider: {
            providerName: 'Google Gemini 2.5',
            duration: 7,
            features: ['Multimodal processing', 'Image generation', 'Code completion', 'Fast responses']
          }
        },
        {
          id: 'gpt4-turbo-14d',
          title: 'GPT-4 Turbo Premium',
          description: 'Access GPT-4 Turbo with enhanced speed and performance for 14 days',
          points: 800,
          type: 'ai_provider',
          category: 'ai_provider',
          available: 30,
          redeemed: false,
          aiProvider: {
            providerName: 'OpenAI GPT-4 Turbo',
            duration: 14,
            features: ['Faster responses', 'Enhanced creativity', 'Better accuracy', 'Extended context']
          }
        },
        {
          id: 'dall-e-3-premium',
          title: 'DALL-E 3 Premium',
          description: 'Generate high-quality images with DALL-E 3 for 30 days',
          points: 600,
          type: 'ai_provider',
          category: 'ai_provider',
          available: 40,
          redeemed: false,
          aiProvider: {
            providerName: 'OpenAI DALL-E 3',
            duration: 30,
            features: ['High-res images', 'Better prompt understanding', 'Artistic styles', 'Commercial use']
          }
        },
        // Traditional Rewards
        {
          id: 'premium-templates',
          title: 'Premium Templates Pack',
          description: 'Access to exclusive premium content templates',
          points: 500,
          type: 'permanent',
          category: 'premium',
          available: 100,
          redeemed: false
        },
        {
          id: 'custom-branding',
          title: 'Custom Branding',
          description: 'Add your own branding to generated content',
          points: 1200,
          type: 'permanent',
          category: 'premium',
          available: 20,
          redeemed: false
        }
      ];
      
      setAwards(mockAwards);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('rewards.error', 'Error'),
        description: t('rewards.errorLoading', 'Failed to load available awards'),
        variant: 'destructive',
      });
      console.error('Failed to load awards:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    setMounted(true);
    fetchAwards();
  }, [fetchAwards]);

  const handleRedeem = async (awardId: string) => {
    try {
      setRedeeming(awardId);
      
      const award = awards.find(a => a.id === awardId);
      if (!award) throw new Error('Award not found');
      
      // In production, this would be a real API call
      // await api.post('/rewards/redeem', { awardId });
      
      // For AI provider rewards, simulate activation
      if (award.type === 'ai_provider' && award.aiProvider) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + award.aiProvider.duration);
        
        // This would integrate with the AI provider system
        console.log(`Activating ${award.aiProvider.providerName} until ${expirationDate.toISOString()}`);
        
        toast({
          title: t('rewards.success', 'Success'),
          description: t('rewards.aiProviderActivated', 'AI provider activated! Access expires on {date}', {
            date: expirationDate.toLocaleDateString()
          }),
          duration: 5000,
        });
      } else {
        toast({
          title: t('rewards.success', 'Success'),
          description: t('rewards.redeemSuccess', 'Award redeemed successfully'),
        });
      }
      
      // Update local state to mark as redeemed
      setAwards(prev => prev.map(a => 
        a.id === awardId ? { ...a, redeemed: true } : a
      ));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('rewards.error', 'Error'),
        description: t('rewards.redeemError', 'Failed to redeem award'),
        variant: 'destructive',
      });
      console.error('Failed to redeem award:', errorMessage);
    } finally {
      setRedeeming(null);
    }
  };

  const getTypeBadge = (type: Award['type']) => {
    switch (type) {
      case 'limited':
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Timer className="h-3.5 w-3.5 mr-1" />
            {t('rewards.type.limited', 'Limited')}
          </Badge>
        );
      case 'permanent':
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Lock className="h-3.5 w-3.5 mr-1" />
            {t('rewards.type.permanent', 'Permanent')}
          </Badge>
        );
      case 'ai_provider':
        return (
          <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30">
            <BrainCircuit className="h-3.5 w-3.5 mr-1" />
            {t('rewards.type.aiProvider', 'AI Provider')}
          </Badge>
        );
    }
  };

  const filteredAwards = awards.filter(award => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = award.title.toLowerCase().includes(searchLower) ||
      (award.description && award.description.toLowerCase().includes(searchLower));
    
    const matchesCategory = selectedCategory === 'all' || award.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('rewards.store.title', 'Rewards Store')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('rewards.store.subtitle', 'Redeem your points for exclusive rewards')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard/me/rewards/history">
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              {t('rewards.viewHistory', 'View History')}
            </Button>
          </Link>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('rewards.search.placeholder', 'Search awards...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Rewards', icon: Gift },
          { key: 'ai_provider', label: 'AI Providers', icon: BrainCircuit },
          { key: 'premium', label: 'Premium Features', icon: Sparkles },
          { key: 'general', label: 'General', icon: Zap }
        ].map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.key as 'all' | 'general' | 'ai_provider' | 'premium')}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {t(`rewards.category.${category.key}`, category.label)}
            </Button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-[2/1] bg-muted">
                  <Skeleton className="h-full w-full" />
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAwards.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-2">
              {awards.length === 0 
                ? t('rewards.store.noAwards', 'No Awards Available')
                : t('rewards.store.noResults', 'No Awards Found')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {awards.length === 0 
                ? t('rewards.store.noAwardsDesc', 'Check back later for new rewards to redeem')
                : t('rewards.store.noResultsDesc', 'Try adjusting your search terms')}
            </p>
            {awards.length > 0 && searchTerm && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm('')}
              >
                {t('rewards.search.clear', 'Clear Search')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAwards.map((award) => (
            <Card key={award.id} className={cn(
              "overflow-hidden transition-all duration-300 hover:shadow-lg border-border",
              award.type === 'ai_provider' 
                ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary/40' 
                : 'hover:border-primary/30'
            )}>
              {award.image && (
                <CardHeader className="p-0">
                  <div className="aspect-[2/1] relative bg-muted">
                    <Image
                      src={award.image}
                      alt={award.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
              )}
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium">{award.title}</h3>
                  {getTypeBadge(award.type)}
                </div>
                {award.description && (
                  <p className="text-sm text-muted-foreground">{award.description}</p>
                )}
                
                {/* AI Provider Features */}
                {award.type === 'ai_provider' && award.aiProvider && (
                  <div className="space-y-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{award.aiProvider.providerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{award.aiProvider.duration} days access</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-primary">{t('rewards.features', 'Features')}:</p>
                      <div className="flex flex-wrap gap-1">
                        {award.aiProvider.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {feature}
                          </Badge>
                        ))}
                        {award.aiProvider.features.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            +{award.aiProvider.features.length - 2} {t('rewards.more', 'more')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    <Gift className="h-4 w-4 text-primary" />
                    <span className="font-medium">{award.points} {t('rewards.points', 'Points')}</span>
                  </div>
                  {award.type === 'limited' && award.available !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      {award.available} {t('rewards.remaining', 'remaining')}
                    </span>
                  )}
                </div>
                <Button
                  className={cn(
                    "w-full",
                    award.type === 'ai_provider' && !award.redeemed 
                      ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70' 
                      : ''
                  )}
                  variant={award.redeemed ? "outline" : "default"}
                  disabled={award.redeemed || redeeming === award.id}
                  onClick={() => handleRedeem(award.id)}
                >
                  {award.redeemed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('rewards.redeemed', 'Redeemed')}
                    </>
                  ) : redeeming === award.id ? (
                    t('rewards.redeeming', 'Redeeming...')
                  ) : award.type === 'ai_provider' ? (
                    <>
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      {t('rewards.activate', 'Activate')}
                    </>
                  ) : (
                    t('rewards.redeem', 'Redeem')
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}