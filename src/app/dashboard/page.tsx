'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  Sparkles,
  FileText,
  Calendar,
  Gift,
  Users,
  TrendingUp,
  Clock,
  Bell,
  Zap,
  ArrowRight,
  Coins,
  CrownIcon,
  Target,
  Activity,
  CheckCircle2,
  Timer,
  BrainCircuit,
  Settings,
  Cpu,
  Wifi,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Play
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/useUserStore';
import { useSocialAccounts } from '@/hooks/useSocialAccounts';
import DynamicGreetingBlock from '@/components/features/dynamic-greeting-block';

// MVP Metrics Data
const mvpMetrics = {
  totalPosts: 156,
  scheduledPosts: 24,
  aiGenerations: 89,
  totalPoints: 2450,
  referralEarnings: 156.80,
  activeNotifications: 7
};

// Recent Activity Data (MVP focused)
interface ActivityItem {
  id: string;
  type: 'post' | 'ai-generation' | 'schedule' | 'reward' | 'referral';
  title: string;
  time: string;
  status: 'completed' | 'scheduled' | 'pending';
}

const recentActivity: ActivityItem[] = [
  { id: '1', type: 'post', title: 'Instagram post published successfully', time: '2h ago', status: 'completed' },
  { id: '2', type: 'ai-generation', title: 'AI content generated for LinkedIn', time: '4h ago', status: 'completed' },
  { id: '3', type: 'schedule', title: 'Twitter post scheduled for tomorrow', time: '6h ago', status: 'scheduled' },
  { id: '4', type: 'reward', title: 'Earned 50 points for daily activity', time: '1d ago', status: 'completed' },
  { id: '5', type: 'referral', title: 'New referral bonus: $25.00', time: '2d ago', status: 'completed' }
];

// Quick Actions for MVP
const quickActions = [
  {
    title: 'Create Post',
    description: 'Share content across your social platforms',
    href: '/dashboard/posts',
    icon: <FileText className="h-6 w-6" />,
    gradient: 'from-blue-500 to-blue-600',
    stats: `${mvpMetrics.totalPosts} posts created`
  },
  {
    title: 'AI Generator',
    description: 'Generate content with AI assistance',
    href: '/dashboard/ai-generator',
    icon: <Sparkles className="h-6 w-6" />,
    gradient: 'from-purple-500 to-purple-600',
    stats: `${mvpMetrics.aiGenerations} AI generations`
  },
  {
    title: 'Schedule Content',
    description: 'Plan and schedule your content',
    href: '/dashboard/scheduler',
    icon: <Calendar className="h-6 w-6" />,
    gradient: 'from-green-500 to-green-600',
    stats: `${mvpMetrics.scheduledPosts} scheduled`
  },
  {
    title: 'Points & Rewards',
    description: 'Track your points and rewards',
    href: '/dashboard/me/rewards/points',
    icon: <Gift className="h-6 w-6" />,
    gradient: 'from-amber-500 to-amber-600',
    stats: `${mvpMetrics.totalPoints} points earned`
  },
  {
    title: 'Referral Program',
    description: 'Earn money by referring friends',
    href: '/dashboard/referrals',
    icon: <Users className="h-6 w-6" />,
    gradient: 'from-rose-500 to-rose-600',
    stats: `$${mvpMetrics.referralEarnings} earned`
  },
  {
    title: 'Notifications',
    description: 'Stay updated with your activities',
    href: '/dashboard/notifications',
    icon: <Bell className="h-6 w-6" />,
    gradient: 'from-indigo-500 to-indigo-600',
    stats: `${mvpMetrics.activeNotifications} unread`
  }
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [mounted, setMounted] = useState(false);

  // Fetch social accounts data
  const { data: socialAccounts, isLoading: socialAccountsLoading } = useSocialAccounts();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Helper function to get platform icons
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-sky-500" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-700" />;
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-600" />;
      case 'tiktok':
        return <Play className="h-4 w-4 text-black" />;
      default:
        return <Globe className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get connected social accounts stats
  const connectedAccounts = socialAccounts?.filter(account => account.status === 'connected') || [];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'post': return <FileText className="h-4 w-4" />;
      case 'ai-generation': return <Sparkles className="h-4 w-4" />;
      case 'schedule': return <Calendar className="h-4 w-4" />;
      case 'reward': return <Gift className="h-4 w-4" />;
      case 'referral': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {t('status.completed', 'Completed')}
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
            <Timer className="h-3 w-3 mr-1" />
            {t('status.scheduled', 'Scheduled')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {t('status.pending', 'Pending')}
          </Badge>
        );
      default:
        return null;
    }
  };

  const userName = user?.name?.split(' ')[0] || 'there';
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning', 'Good morning');
    if (hour < 17) return t('dashboard.goodAfternoon', 'Good afternoon');
    return t('dashboard.goodEvening', 'Good evening');
  })();

  return (
    <div className="space-y-8 page-transition">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-heading gradient-text">
            {greeting}, {userName}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('dashboard.welcomeMessage', 'Ready to supercharge your social media presence with AI?')}
          </p>
        </div>
        <div className="flex gap-3 self-start">
          <Link href="/dashboard/ai-generator">
            <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-premium">
              <Sparkles className="h-4 w-4" />
              {t('dashboard.generateContent', 'Generate Content')}
            </Button>
          </Link>
          <Link href="/dashboard/plans">
            <Button variant="outline" className="gap-2">
              <CrownIcon className="h-4 w-4" />
              {t('dashboard.upgradePlan', 'Upgrade Plan')}
            </Button>
          </Link>
        </div>
      </div>
    <DynamicGreetingBlock />
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover:shadow-premium transition-premium">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                +12%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{mvpMetrics.totalPosts}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.metrics.totalPosts', 'Total Posts')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:shadow-premium transition-premium">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                +23%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{mvpMetrics.aiGenerations}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.metrics.aiGenerations', 'AI Generations')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:shadow-premium transition-premium">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                +8%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{mvpMetrics.totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.metrics.totalPoints', 'Total Points')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:shadow-premium transition-premium">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                +15%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">${mvpMetrics.referralEarnings}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.metrics.referralEarnings', 'Referral Earnings')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          {t('dashboard.quickActions', 'Quick Actions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="glass-card hover:shadow-premium transition-premium group cursor-pointer h-full">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-premium`}>
                    {action.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-premium">
                    {t(`dashboard.actions.${action.title.toLowerCase().replace(/\s+/g, '')}`, action.title)}
                  </CardTitle>
                  <CardDescription>
                    {t(`dashboard.actions.${action.title.toLowerCase().replace(/\s+/g, '')}Desc`, action.description)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{action.stats}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-premium" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Provider Summary */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          {t('dashboard.aiProvider', 'AI Provider Status')}
        </h2>
        <Card className="glass-card hover:shadow-premium transition-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {t('dashboard.aiProvider.title', 'Active AI Provider')}
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5" />
                      {t('dashboard.aiProvider.connected', 'Connected')}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {t('dashboard.aiProvider.description', 'Manage your AI providers and monitor usage')}
                  </CardDescription>
                </div>
              </div>
              <Link href="/dashboard/ai-providers">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  {t('dashboard.aiProvider.manage', 'Manage')}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">OpenAI GPT-4</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.aiProvider.primary', 'Primary Provider')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Wifi className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">8,450 Tokens</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.aiProvider.remaining', 'Remaining this month')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">75% Usage</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.aiProvider.usage', 'This billing cycle')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Accounts Summary */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          {t('dashboard.socialAccounts', 'Connected Social Accounts')}
        </h2>
        <Card className="glass-card hover:shadow-premium transition-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {t('dashboard.socialAccounts.title', 'Connected Social Accounts')}
                    <Badge variant="outline" className={`${connectedAccounts.length > 0 ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                      <div className={`h-2 w-2 rounded-full mr-1.5 ${connectedAccounts.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`} />
                      {connectedAccounts.length > 0 
                        ? t('dashboard.socialAccounts.connected', '{count} Connected', { count: connectedAccounts.length })
                        : t('dashboard.socialAccounts.noAccounts', 'No Accounts')
                      }
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {connectedAccounts.length > 0 
                      ? t('dashboard.socialAccounts.description', 'Manage your connected social media platforms')
                      : t('dashboard.socialAccounts.descriptionEmpty', 'Connect your social media accounts to start publishing')
                    }
                  </CardDescription>
                </div>
              </div>
              <Link href="/dashboard/social-accounts">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  {t('dashboard.socialAccounts.manage', 'Manage Accounts')}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {socialAccountsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 animate-pulse">
                    <div className="h-8 w-8 rounded-lg bg-muted" />
                    <div className="space-y-1">
                      <div className="h-4 w-20 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : connectedAccounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {connectedAccounts.slice(0, 6).map((account) => (
                  <div key={account.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      {getPlatformIcon(account.platform)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{account.profileName || account.username}</p>
                      <p className="text-xs text-muted-foreground capitalize">{account.platform}</p>
                    </div>
                  </div>
                ))}
                {connectedAccounts.length > 6 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">+{connectedAccounts.length - 6}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t('dashboard.socialAccounts.moreAccounts', 'More accounts')}</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.socialAccounts.viewAll', 'View all connected')}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['facebook', 'instagram', 'twitter', 'linkedin'].map((platform) => (
                  <div key={platform} className="flex items-center gap-2 p-3 rounded-lg bg-muted/20 opacity-60">
                    <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
                      {getPlatformIcon(platform)}
                    </div>
                    <span className="text-sm text-muted-foreground capitalize">{platform}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t('dashboard.recentActivity', 'Recent Activity')}
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                {t('dashboard.viewAll', 'View all')}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-4 hover:bg-muted/30 transition-premium">
                  <div className="mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <p className="text-sm font-medium">{item.title}</p>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Productivity Tip */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t('dashboard.productivityTip', 'Productivity Tip')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t('dashboard.tip.title', 'AI Content Strategy')}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t('dashboard.tip.description', 'Generate content in batches using AI, then schedule them throughout the week for consistent engagement.')}
              </p>
              <Link href="/dashboard/ai-generator">
                <Button size="sm" className="w-full">
                  {t('dashboard.tip.action', 'Try AI Generator')}
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">{t('dashboard.quickStats', 'Quick Stats')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('dashboard.stats.thisWeek', 'Posts this week')}</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('dashboard.stats.avgEngagement', 'Avg. engagement')}</span>
                  <span className="font-medium text-green-600">+23%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('dashboard.stats.aiSavings', 'Time saved with AI')}</span>
                  <span className="font-medium text-blue-600">4.2h</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription CTA */}
      <Card className="glass-card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <CrownIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {t('dashboard.upgrade.title', 'Unlock More AI Power')}
                </h3>
                <p className="text-muted-foreground">
                  {t('dashboard.upgrade.description', 'Upgrade your plan to access advanced AI features and unlimited generations.')}
                </p>
              </div>
            </div>
            <Link href="/dashboard/plans">
              <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-premium">
                {t('dashboard.upgrade.action', 'View Plans')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}