'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Filter, 
  ArrowUpRight, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter,
  MoreHorizontal,
  SparklesIcon,
  Brain,
  Zap,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CampaignsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: 'Summer Sale Promotion',
      status: 'active',
      type: 'promotion',
      budget: 5000,
      spent: 2750,
      reach: '45.2k',
      engagement: '3.8k',
      conversions: 382,
      roi: 2.1,
      aiOptimized: true,
      platforms: ['facebook', 'instagram'],
      startDate: '2025-04-01',
      endDate: '2025-04-30'
    },
    {
      id: 2,
      name: 'Brand Awareness Campaign',
      status: 'active',
      type: 'brand_awareness',
      budget: 10000,
      spent: 4200,
      reach: '128.5k',
      engagement: '8.4k',
      conversions: 215,
      roi: 3.2,
      aiOptimized: true,
      platforms: ['linkedin', 'twitter'],
      startDate: '2025-04-10',
      endDate: '2025-05-10'
    },
    {
      id: 3,
      name: 'Q2 Lead Generation',
      status: 'draft',
      type: 'lead_generation',
      budget: 7500,
      spent: 0,
      reach: '0',
      engagement: '0',
      conversions: 0,
      roi: 0,
      aiOptimized: true,
      platforms: ['linkedin', 'facebook'],
      startDate: '2025-04-15',
      endDate: '2025-06-15'
    }
  ];

  const campaignMetrics = [
    {
      title: t('campaigns.metrics.activeCount', 'Active Campaigns'),
      value: '8',
      change: 2,
      trend: 'up',
      icon: <Calendar className="h-5 w-5 text-blue-500" />
    },
    {
      title: t('campaigns.metrics.totalReach', 'Total Reach'),
      value: '283.4k',
      change: 12.5,
      trend: 'up',
      icon: <Users className="h-5 w-5 text-indigo-500" />
    },
    {
      title: t('campaigns.metrics.totalBudget', 'Total Budget'),
      value: '$24,600',
      change: 8.2,
      trend: 'up',
      icon: <DollarSign className="h-5 w-5 text-green-500" />
    },
    {
      title: t('campaigns.metrics.avgConversion', 'Avg. Conversion Rate'),
      value: '3.2%',
      change: 0.8,
      trend: 'up',
      icon: <Target className="h-5 w-5 text-rose-500" />
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">{t('campaigns.status.active', 'Active')}</Badge>;
      case 'draft':
        return <Badge variant="secondary">{t('campaigns.status.draft', 'Draft')}</Badge>;
      case 'scheduled':
        return <Badge variant="warning">{t('campaigns.status.scheduled', 'Scheduled')}</Badge>;
      case 'completed':
        return <Badge variant="info">{t('campaigns.status.completed', 'Completed')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'promotion':
        return <Badge variant="info">{t('campaigns.type.promotion', 'Promotion')}</Badge>;
      case 'brand_awareness':
        return <Badge variant="purple">{t('campaigns.type.brandAwareness', 'Brand Awareness')}</Badge>;
      case 'lead_generation':
        return <Badge variant="warning">{t('campaigns.type.leadGeneration', 'Lead Generation')}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus ? campaign.status === filterStatus : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('campaigns.title', 'Campaigns')}
          </h1>
          <p className="text-muted-foreground">
            {t('campaigns.subtitle', 'Manage and track your marketing campaigns')}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t('campaigns.newCampaign', 'New Campaign')}
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaignMetrics.map((metric, index) => (
          <Card key={index} className="border-border/60 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {metric.icon}
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className={`text-xs ${metric.trend === 'up' ? 'text-green-500 bg-green-50 dark:bg-green-950/30' : 'text-red-500 bg-red-50 dark:bg-red-950/30'} px-2 py-0.5 rounded-full font-medium flex items-center`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${metric.trend === 'up' ? '' : 'rotate-180'}`} />
                  {metric.change}%
                </div>
              </div>
            </CardContent>
            <div className={`h-1 w-full ${
              index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
              index === 1 ? 'bg-gradient-to-r from-indigo-500 to-violet-400' :
              index === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
              'bg-gradient-to-r from-rose-500 to-pink-400'
            }`}></div>
          </Card>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder={t('campaigns.searchPlaceholder', 'Search campaigns...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filterStatus === null ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus(null)}
          >
            All
          </Button>
          <Button 
            variant={filterStatus === "active" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus("active")}
          >
            Active
          </Button>
          <Button 
            variant={filterStatus === "draft" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus("draft")}
          >
            Draft
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-3.5 w-3.5" />
            {t('campaigns.filters', 'Filters')}
          </Button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden border-border/60">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                        {getTypeBadge(campaign.type)}
                        {campaign.aiOptimized && (
                          <Badge variant="outline" className="gap-1 border-primary/20 bg-primary/5 text-primary">
                            <SparklesIcon className="h-3 w-3" />
                            AI Optimized
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('campaigns.dateRange', 'Runs from {{startDate}} to {{endDate}}', {
                          startDate: new Date(campaign.startDate).toLocaleDateString(),
                          endDate: new Date(campaign.endDate).toLocaleDateString()
                        })}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {campaign.platforms.map((platform) => (
                          <div key={platform} className="flex items-center justify-center h-6 w-6 rounded-full bg-muted">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('campaigns.metrics.budget', 'Budget')}
                      </p>
                      <p className="text-lg font-semibold">${campaign.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('campaigns.metrics.reach', 'Reach')}
                      </p>
                      <p className="text-lg font-semibold">{campaign.reach}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('campaigns.metrics.engagement', 'Engagement')}
                      </p>
                      <p className="text-lg font-semibold">{campaign.engagement}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t('campaigns.metrics.conversions', 'Conversions')}
                      </p>
                      <p className="text-lg font-semibold">{campaign.conversions}</p>
                    </div>
                  </div>
                  
                  {campaign.aiOptimized && campaign.status === 'active' && (
                    <Card className="mt-6 bg-primary/5 border border-primary/20 overflow-hidden relative">
                      <CardContent className="p-4 pb-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Brain className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                              {t('campaigns.aiInsight', 'AI Insight')}
                              <span className="text-xs bg-primary/10 text-primary px-1 rounded">AI</span>
                            </h4>
                            <p className="text-sm text-purple-600 dark:text-purple-300">
                              {t('campaigns.aiInsightExample', 'Engagement peaks detected during evening hours. Consider adjusting posting schedule for 25% higher reach.')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-primary/10 rounded-full blur-2xl"></div>
                    </Card>
                  )}
                </div>
                
                {/* Progress sidebar for active campaigns */}
                {campaign.status === 'active' && (
                  <div className="lg:w-64 bg-muted/30 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border/60">
                    <div>
                      <h4 className="text-sm font-medium mb-6">{t('campaigns.progress', 'Campaign Progress')}</h4>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{t('campaigns.spent', 'Spent')}</span>
                        <span className="text-xs font-medium">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-6">
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-sm font-medium">{t('campaigns.roi', 'ROI')}</span>
                        </div>
                        <div className="text-2xl font-bold">{campaign.roi}x</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button variant="outline" size="sm" className="w-full gap-1 justify-center">
                        <BarChart3 className="h-4 w-4" />
                        {t('campaigns.viewAnalytics', 'View Analytics')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}