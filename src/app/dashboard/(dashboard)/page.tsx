'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  GlobeIcon, 
  MessageSquare,
  SparklesIcon,
  ArrowUpRight,
  Zap,
  Brain,
  ArrowRight,
  TrendingDown,
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, loading } = useAuth(true);
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 border-2 border-primary/30 border-r-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 h-12 w-12 border-2 border-transparent border-t-accent rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-muted-foreground font-medium">{t('dashboard.loading')}</p>
            <p className="text-xs text-muted-foreground/60">Initializing your intelligence platform...</p>
          </div>
        </div>
      </div>
    );
  }

  // Recent activity data (mock)
  const recentActivity = [
    {
      id: 1,
      type: 'post',
      platform: 'Instagram',
      title: 'Summer Collection Launch',
      time: '2 hours ago',
      status: 'published'
    },
    {
      id: 2,
      type: 'campaign',
      platform: 'Multiple',
      title: 'End of Season Sale',
      time: '1 day ago',
      status: 'scheduled'
    },
    {
      id: 3,
      type: 'ai',
      platform: 'Twitter',
      title: 'Content Generation',
      time: '3 days ago',
      status: 'completed'
    },
  ];

  return (
    <div className="space-y-8 page-transition">
      {/* Welcome section with AI suggestion */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-heading gradient-text">
            {t('dashboard.welcome')}, {user?.name} 👋
          </h1>
          <p className="text-muted-foreground/80 text-lg tracking-text">
            {t('dashboard.overview')}
          </p>
        </div>
        <div className="flex gap-3 self-start">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2 rounded-xl border-white/10 hover:bg-white/5 hover:shadow-glow transition-premium">
            <Calendar className="h-4 w-4" />
            {t('dashboard.viewSchedule')}
          </Button>
          <Button variant="default" size="sm" className="gap-2 group rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-premium hover:shadow-glow transition-premium hover:scale-105">
            <SparklesIcon className="h-4 w-4" />
            <span>{t('dashboard.createContent')}</span>
            <ArrowRight className="h-3 w-3 opacity-50 group-hover:translate-x-0.5 transition-premium" />
          </Button>
        </div>
      </div>

      {/* AI Insight card */}
      <Card className="glass-card border-primary/20 shadow-premium overflow-hidden relative group hover:shadow-glow transition-premium hover:scale-[1.01]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20 group-hover:border-primary/30 transition-premium group-hover:shadow-premium">
              <Brain className="h-6 w-6 text-primary group-hover:scale-110 transition-premium" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-glow"></div>
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2 tracking-heading">
                <span>{t('dashboard.aiInsight.title')}</span>
                <span className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-xs px-2 py-0.5 rounded-lg font-medium border border-primary/20 shadow-sm">AI</span>
              </h3>
              <p className="text-muted-foreground/80 text-sm tracking-text">
                {t('dashboard.aiInsight.content')}
              </p>
            </div>
            <Button variant="ghost" className="mt-2 md:mt-0 self-start rounded-xl hover:bg-primary/10 hover:text-primary transition-premium hover:shadow-glow">
              {t('dashboard.aiInsight.button')}
            </Button>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl group-hover:blur-2xl transition-premium"></div>
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-24 w-24 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-2xl"></div>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <Card className="glass-card shadow-premium overflow-hidden border-white/10 group hover:shadow-glow transition-premium hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 tracking-text">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-400/20 border border-indigo-500/30">
                <GlobeIcon className="h-4 w-4 text-indigo-500" />
              </div>
              {t('dashboard.accounts.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-heading gradient-text">4</div>
              <div className="text-xs text-emerald-600 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-medium flex items-center shadow-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1 
              </div>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-1 tracking-text">
              {t('dashboard.accounts.subtitle')}
            </p>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-400 shadow-sm"></div>
        </Card>

        <Card className="glass-card shadow-premium overflow-hidden border-white/10 group hover:shadow-glow transition-premium hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 tracking-text">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-400/20 border border-violet-500/30">
                <MessageSquare className="h-4 w-4 text-violet-500" />
              </div>
              {t('dashboard.posts.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-heading gradient-text">12</div>
              <div className="text-xs text-emerald-600 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-medium flex items-center shadow-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3
              </div>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-1 tracking-text">
              {t('dashboard.posts.subtitle')}
            </p>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-400 shadow-sm"></div>
        </Card>

        <Card className="glass-card shadow-premium overflow-hidden border-white/10 group hover:shadow-glow transition-premium hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 tracking-text">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-400/20 border border-pink-500/30">
                <Calendar className="h-4 w-4 text-pink-500" />
              </div>
              {t('dashboard.campaigns.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-heading gradient-text">3</div>
              <div className="text-xs text-emerald-600 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-medium flex items-center shadow-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1
              </div>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-1 tracking-text">
              {t('dashboard.campaigns.subtitle')}
            </p>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-rose-400 shadow-sm"></div>
        </Card>

        <Card className="glass-card shadow-premium overflow-hidden border-white/10 group hover:shadow-glow transition-premium hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 tracking-text">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-400/20 border border-amber-500/30">
                <Users className="h-4 w-4 text-amber-500" />
              </div>
              {t('dashboard.audience.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-heading gradient-text">2.4k</div>
              <div className="text-xs text-emerald-600 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-medium flex items-center shadow-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8%
              </div>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-1 tracking-text">
              {t('dashboard.audience.subtitle')}
            </p>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-sm"></div>
        </Card>
      </div>

      {/* Two column layout for recent activities and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card shadow-premium border-white/10 hover:shadow-glow transition-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="tracking-heading">{t('dashboard.recentActivity.title')}</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1 rounded-xl hover:bg-primary/10 hover:text-primary transition-premium">
                {t('dashboard.recentActivity.viewAll')}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <CardDescription className="tracking-text">
              {t('dashboard.recentActivity.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <div 
                  key={activity.id}
                  className="flex items-center justify-between py-3 px-6 rounded-xl mx-4 hover:bg-white/5 hover:shadow-glow transition-premium hover:scale-[1.01] group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-premium group-hover:scale-110 group-hover:shadow-glow
                      ${activity.type === 'post' ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-500' : 
                        activity.type === 'campaign' ? 'bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-500' : 
                        'bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-500'}`}
                    >
                      {activity.type === 'post' && <MessageSquare className="h-4 w-4" />}
                      {activity.type === 'campaign' && <Calendar className="h-4 w-4" />}
                      {activity.type === 'ai' && <SparklesIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium tracking-text">{activity.title}</p>
                      <p className="text-xs text-muted-foreground/70 tracking-text">{activity.platform} • {activity.time}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`text-xs px-3 py-1.5 rounded-lg font-medium border shadow-sm transition-premium group-hover:scale-105
                      ${activity.status === 'published' ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-600 border-emerald-500/20' : 
                        activity.status === 'scheduled' ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-600 border-amber-500/20' : 
                        'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-500/20'}`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-fit glass-card shadow-premium border-white/10 hover:shadow-glow transition-premium">
          <CardHeader>
            <CardTitle className="tracking-heading">{t('dashboard.quickActions.title')}</CardTitle>
            <CardDescription className="tracking-text">
              {t('dashboard.quickActions.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-white/10 hover:bg-white/5 hover:shadow-glow transition-premium hover:scale-[1.02] group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 group-hover:shadow-glow transition-premium">
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </div>
              {t('dashboard.quickActions.newPost')}
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-white/10 hover:bg-white/5 hover:shadow-glow transition-premium hover:scale-[1.02] group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 group-hover:shadow-glow transition-premium">
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              {t('dashboard.quickActions.scheduleCampaign')}
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-white/10 hover:bg-white/5 hover:shadow-glow transition-premium hover:scale-[1.02] group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 group-hover:shadow-glow transition-premium">
                <GlobeIcon className="h-4 w-4 text-indigo-500" />
              </div>
              {t('dashboard.quickActions.connectAccount')}
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-white/10 hover:bg-white/5 hover:shadow-glow transition-premium hover:scale-[1.02] group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 group-hover:shadow-glow transition-premium">
                <BarChart3 className="h-4 w-4 text-amber-500" />
              </div>
              {t('dashboard.quickActions.viewAnalytics')}
            </Button>
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-premium hover:shadow-glow transition-premium hover:scale-105" variant="default">
              <SparklesIcon className="h-4 w-4" />
              <span>{t('dashboard.quickActions.generateWithAI')}</span>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Engagement charts placeholder */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.engagement.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.engagement.subtitle')}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Weekly</Button>
              <Button variant="outline" size="sm">Monthly</Button>
              <Button variant="default" size="sm">Yearly</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] flex items-center justify-center bg-muted/20 rounded-md">
            <div className="text-center space-y-2">
              <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">{t('dashboard.engagement.chartPlaceholder')}</p>
              <Button size="sm" variant="outline">{t('dashboard.engagement.loadData')}</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex justify-between">
          <p className="flex items-center">
            <Zap className="h-3 w-3 mr-1 text-amber-500" />
            {t('dashboard.engagement.footer')}
          </p>
          <Link href="/dashboard/analytics" className="text-primary hover:underline flex items-center">
            <span>{t('dashboard.engagement.viewDetailed')}</span>
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
