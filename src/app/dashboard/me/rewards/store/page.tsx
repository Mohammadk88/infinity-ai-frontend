'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, CheckCircle, Timer, Lock, Search, History } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import api from '@/app/lib/axios';

interface Award {
  id: string;
  title: string;
  description?: string;
  points: number;
  type: 'limited' | 'permanent';
  image?: string;
  available?: number;
  redeemed?: boolean;
}

export default function RewardsStorePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [awards, setAwards] = useState<Award[]>([]);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAwards = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/awards');
      setAwards(data);
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
      await api.post('/rewards/redeem', { awardId });
      toast({
        title: t('rewards.success', 'Success'),
        description: t('rewards.redeemSuccess', 'Award redeemed successfully'),
      });
      fetchAwards(); // Refresh awards list
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
          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30">
            <Timer className="h-3.5 w-3.5 mr-1" />
            {t('rewards.type.limited', 'Limited')}
          </Badge>
        );
      case 'permanent':
        return (
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30">
            <Lock className="h-3.5 w-3.5 mr-1" />
            {t('rewards.type.permanent', 'Permanent')}
          </Badge>
        );
    }
  };

  const filteredAwards = awards.filter(award => {
    const searchLower = searchTerm.toLowerCase();
    return (
      award.title.toLowerCase().includes(searchLower) ||
      (award.description && award.description.toLowerCase().includes(searchLower))
    );
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
            <Card key={award.id} className="overflow-hidden">
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
                  className="w-full"
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