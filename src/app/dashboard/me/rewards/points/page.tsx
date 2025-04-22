'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Gift,
  Star,
  Clock,
  CalendarClock,
  RefreshCw,
  AlertCircle,
  UserPlus,
  MessageSquare,
  Calendar,
  Store
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MetricCard } from '@/components/features/metric-card';
import { cn } from "@/lib/utils";

// Types for rewards data
interface PointEvent {
  id: string;
  type: 'signup' | 'referral' | 'daily_login' | 'purchase' | 'review' | 'other';
  description?: string;
  points: number;
  createdAt: string;
}

interface RewardsStats {
  totalPoints: number;
  pointsThisMonth: number;
  lifetimePoints: number;
  availablePoints: number;
}

export default function RewardsPointsPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<RewardsStats | null>(null);
  const [pointHistory, setPointHistory] = useState<PointEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchRewardsData = useCallback(async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      
      // These would be real API calls in production
      // const statsResponse = await api.get('/rewards/stats');
      // const historyResponse = await api.get('/rewards/points/history');
      
      // Mock data for demonstration
      const mockStats: RewardsStats = {
        totalPoints: 1250,
        pointsThisMonth: 450,
        lifetimePoints: 2800,
        availablePoints: 750
      };

      const mockHistory: PointEvent[] = [
        {
          id: '1',
          type: 'signup',
          points: 500,
          createdAt: '2025-04-01T10:00:00Z',
          description: 'Welcome bonus'
        },
        {
          id: '2',
          type: 'referral',
          points: 200,
          createdAt: '2025-04-15T14:30:00Z',
          description: 'Referred Sarah Miller'
        },
        {
          id: '3',
          type: 'daily_login',
          points: 50,
          createdAt: '2025-04-21T09:15:00Z',
          description: '5-day streak bonus'
        }
      ];

      setStats(mockStats);
      setPointHistory(mockHistory);
    } catch (err) {
      setError(t('rewards.error.loadFailed', 'Failed to load rewards data'));
      console.error('Error fetching rewards data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    setMounted(true);
    fetchRewardsData();
  }, [fetchRewardsData]);

  if (!mounted) return null;

  const getEventTypeBadge = (type: PointEvent['type']) => {
    const configs = {
      signup: { icon: UserPlus, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30' },
      referral: { icon: Star, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30' },
      daily_login: { icon: Calendar, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30' },
      purchase: { icon: Store, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/30' },
      review: { icon: MessageSquare, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30' },
      other: { icon: Star, color: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-900/30' }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={cn("flex items-center gap-1", config.color)}>
        <Icon className="h-3 w-3" />
        <span>{t(`rewards.eventType.${type}`, type.replace('_', ' '))}</span>
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('rewards.points.title', 'Reward Points')}
          </h2>
          <p className="text-muted-foreground">
            {t('rewards.points.subtitle', 'Track and manage your reward points')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRewardsData}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            {t('rewards.refresh', 'Refresh')}
          </Button>
          <Link href="/dashboard/me/rewards/store">
            <Button size="sm" className="gap-2">
              <Store className="h-4 w-4" />
              {t('rewards.store.visit', 'Visit Store')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('rewards.metrics.availablePoints', 'Available Points')}
          value={stats?.availablePoints || 0}
          icon={Gift}
          iconColor="text-green-500"
          gradientColors="from-green-400 to-green-600"
          loading={isLoading}
          description={t('rewards.metrics.availableDesc', 'Points ready to use')}
        />
        
        <MetricCard
          title={t('rewards.metrics.thisMonth', 'This Month')}
          value={stats?.pointsThisMonth || 0}
          icon={CalendarClock}
          iconColor="text-blue-500"
          gradientColors="from-blue-400 to-blue-600"
          loading={isLoading}
          description={t('rewards.metrics.monthlyDesc', 'Points earned this month')}
        />
        
        <MetricCard
          title={t('rewards.metrics.totalPoints', 'Total Points')}
          value={stats?.totalPoints || 0}
          icon={Star}
          iconColor="text-amber-500"
          gradientColors="from-amber-400 to-amber-600"
          loading={isLoading}
          description={t('rewards.metrics.totalDesc', 'Current point balance')}
        />
        
        <MetricCard
          title={t('rewards.metrics.lifetimePoints', 'Lifetime Points')}
          value={stats?.lifetimePoints || 0}
          icon={Clock}
          iconColor="text-purple-500"
          gradientColors="from-purple-400 to-purple-600"
          loading={isLoading}
          description={t('rewards.metrics.lifetimeDesc', 'All-time points earned')}
        />
      </div>

      {/* Points History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('rewards.history.title', 'Points History')}</CardTitle>
          <CardDescription>
            {t('rewards.history.description', 'Your recent point-earning activities')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : pointHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">
                {t('rewards.history.noPoints', 'No points yet')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('rewards.history.startEarning', 'Start earning points by completing actions')}
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('rewards.history.date', 'Date')}</TableHead>
                    <TableHead>{t('rewards.history.type', 'Type')}</TableHead>
                    <TableHead>{t('rewards.history.description', 'Description')}</TableHead>
                    <TableHead className="text-right">{t('rewards.history.points', 'Points')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pointHistory.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(event.createdAt)}
                      </TableCell>
                      <TableCell>
                        {getEventTypeBadge(event.type)}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {event.description || t(`rewards.eventType.${event.type}.defaultDesc`, 'Points earned')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        +{event.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">
            {t('rewards.lastUpdated', 'Last updated: {time}', 
              { time: new Date().toLocaleTimeString() })
            }
          </span>
          <span className="text-xs text-muted-foreground">
            {pointHistory.length > 0 && 
              t('rewards.showing', 'Showing {count} events', 
                { count: pointHistory.length })
            }
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}