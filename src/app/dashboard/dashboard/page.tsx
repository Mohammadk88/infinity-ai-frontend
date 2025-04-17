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
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth(true);
  const { t } = useTranslation();
  console.log('User in dashboard:', user);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-2 border-primary border-r-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">{t('dashboard.loading')}</p>
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
    <div className="space-y-8 animate__animated animate__fadeIn">
      {/* Welcome section with AI suggestion */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard.welcome')}, {user?.name} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.overview')}
          </p>
        </div>
        <div className="flex gap-3 self-start">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Calendar className="h-4 w-4" />
            {t('dashboard.viewSchedule')}
          </Button>
          <Button variant="default" size="sm" className="gap-2 group">
            <SparklesIcon className="h-4 w-4" />
            <span>{t('dashboard.createContent')}</span>
            <ArrowRight className="h-3 w-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>

      {/* AI Insight card */}
      <Card className="border border-primary/10 bg-primary/5 shadow-sm overflow-hidden relative">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span>{t('dashboard.aiInsight.title')}</span>
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">AI</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('dashboard.aiInsight.content')}
              </p>
            </div>
            <Button variant="ghost" className="mt-2 md:mt-0 self-start">
              {t('dashboard.aiInsight.button')}
            </Button>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-primary/10 rounded-full blur-2xl"></div>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GlobeIcon className="h-4 w-4 text-muted-foreground" />
              {t('dashboard.accounts.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">4</div>
              <div className="text-xs text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1 
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('dashboard.accounts.subtitle')}
            </p>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-400"></div>
        </Card>

        <Card className="overflow-hidden border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              {t('dashboard.posts.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">12</div>
              <div className="text-xs text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('dashboard.posts.subtitle')}
            </p>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-400"></div>
        </Card>

        <Card className="overflow-hidden border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {t('dashboard.campaigns.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">3</div>
              <div className="text-xs text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('dashboard.campaigns.subtitle')}
            </p>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-rose-400"></div>
        </Card>

        <Card className="overflow-hidden border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {t('dashboard.audience.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">2.4k</div>
              <div className="text-xs text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('dashboard.audience.subtitle')}
            </p>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-yellow-400"></div>
        </Card>
      </div>

      {/* Two column layout for recent activities and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{t('dashboard.recentActivity.title')}</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                {t('dashboard.recentActivity.viewAll')}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <CardDescription>
              {t('dashboard.recentActivity.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-1">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center justify-between py-3 px-6 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center 
                      ${activity.type === 'post' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' : 
                        activity.type === 'campaign' ? 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400' : 
                        'bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400'}`}
                    >
                      {activity.type === 'post' && <MessageSquare className="h-4 w-4" />}
                      {activity.type === 'campaign' && <Calendar className="h-4 w-4" />}
                      {activity.type === 'ai' && <SparklesIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.platform} • {activity.time}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${activity.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 
                        activity.status === 'scheduled' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' : 
                        'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'}`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-fit border-border/60">
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions.title')}</CardTitle>
            <CardDescription>
              {t('dashboard.quickActions.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('dashboard.quickActions.newPost')}
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Calendar className="h-4 w-4" />
              {t('dashboard.quickActions.scheduleCampaign')}
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <GlobeIcon className="h-4 w-4" />
              {t('dashboard.quickActions.connectAccount')}
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('dashboard.quickActions.viewAnalytics')}
            </Button>
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full gap-2" variant="default">
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
