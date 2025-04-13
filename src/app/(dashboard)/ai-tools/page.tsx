'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  SparklesIcon,
  Brain,
  MessageCircle, 
  Image as ImageIcon,
  BarChart3, 
  Lightbulb, 
  Target, 
  Calendar, 
  Zap,
  Wand2,
  PencilRuler,
  LayoutGrid,
  UserRoundCog,
  TrendingUp,
  Palette,
  ArrowRight,
  LineChart,
  Rocket,
  RefreshCw,
  PlusCircle,
  Star,
  CheckCircle
} from 'lucide-react';

export default function AIToolsPage() {
  const { t } = useTranslation();

  // Sample suggestion
  const aiSuggestion = {
    title: "Engagement Opportunity",
    description: "Based on your audience data, posting lifestyle content on Tuesday evenings could increase engagement by 27%.",
    action: "Schedule Content",
    actionLink: "/dashboard/posts"
  };

  const toolCategories = [
    {
      id: 'content',
      title: t('aiTools.categories.content', 'Content Creation'),
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      id: 'visual',
      title: t('aiTools.categories.visual', 'Visual Generation'),
      icon: <ImageIcon className="h-5 w-5" />
    },
    {
      id: 'analytics',
      title: t('aiTools.categories.analytics', 'Smart Analytics'),
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      id: 'automation',
      title: t('aiTools.categories.automation', 'Automation'),
      icon: <RefreshCw className="h-5 w-5" />
    },
  ];

  const aiTools = [
    {
      id: 'social-post-generator',
      name: t('aiTools.tools.postGenerator.name', 'Social Post Generator'),
      description: t('aiTools.tools.postGenerator.description', 'Generate engaging social media posts tailored to your brand voice and target audience.'),
      category: 'content',
      icon: <PencilRuler className="h-5 w-5 text-violet-500" />,
      usageCount: 24,
      isNew: false,
      isPro: false,
      color: 'violet'
    },
    {
      id: 'campaign-ideas',
      name: t('aiTools.tools.campaignIdeas.name', 'Campaign Ideas Generator'),
      description: t('aiTools.tools.campaignIdeas.description', 'Get AI-generated marketing campaign ideas based on your industry, goals, and target audience.'),
      category: 'content',
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      usageCount: 12,
      isNew: false,
      isPro: true,
      color: 'amber'
    },
    {
      id: 'image-generator',
      name: t('aiTools.tools.imageGenerator.name', 'AI Image Generator'),
      description: t('aiTools.tools.imageGenerator.description', 'Create stunning visuals for your social media posts and campaigns with AI.'),
      category: 'visual',
      icon: <ImageIcon className="h-5 w-5 text-cyan-500" />,
      usageCount: 36,
      isNew: false,
      isPro: true,
      color: 'cyan'
    },
    {
      id: 'audience-insights',
      name: t('aiTools.tools.audienceInsights.name', 'Audience Insights'),
      description: t('aiTools.tools.audienceInsights.description', 'Get AI-powered insights about your followers and their preferences.'),
      category: 'analytics',
      icon: <UserRoundCog className="h-5 w-5 text-indigo-500" />,
      usageCount: 8,
      isNew: false,
      isPro: false,
      color: 'indigo'
    },
    {
      id: 'content-calendar',
      name: t('aiTools.tools.contentCalendar.name', 'Smart Content Calendar'),
      description: t('aiTools.tools.contentCalendar.description', 'AI-optimized scheduling for maximum engagement based on your audience patterns.'),
      category: 'automation',
      icon: <Calendar className="h-5 w-5 text-emerald-500" />,
      usageCount: 18,
      isNew: false,
      isPro: true,
      color: 'emerald'
    },
    {
      id: 'performance-predictor',
      name: t('aiTools.tools.performancePredictor.name', 'Performance Predictor'),
      description: t('aiTools.tools.performancePredictor.description', 'Predict how your content will perform before publishing it.'),
      category: 'analytics',
      icon: <LineChart className="h-5 w-5 text-blue-500" />,
      usageCount: 7,
      isNew: true,
      isPro: true,
      color: 'blue'
    },
    {
      id: 'hashtag-generator',
      name: t('aiTools.tools.hashtagGenerator.name', 'Hashtag Optimizer'),
      description: t('aiTools.tools.hashtagGenerator.description', 'Generate the most effective hashtags for your content to maximize reach.'),
      category: 'content',
      icon: <Target className="h-5 w-5 text-rose-500" />,
      usageCount: 42,
      isNew: false,
      isPro: false,
      color: 'rose'
    },
    {
      id: 'auto-responder',
      name: t('aiTools.tools.autoResponder.name', 'AI Comment Responder'),
      description: t('aiTools.tools.autoResponder.description', 'Automatically generate personalized responses to comments on your posts.'),
      category: 'automation',
      icon: <MessageCircle className="h-5 w-5 text-orange-500" />,
      usageCount: 5,
      isNew: true,
      isPro: true,
      color: 'orange'
    },
  ];

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = activeCategory ? tool.category === activeCategory : true;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getToolCardColor = (color: string) => {
    const colorMap: Record<string, string> = {
      violet: 'bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300',
      amber: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
      cyan: 'bg-cyan-100 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300',
      indigo: 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300',
      emerald: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
      blue: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300',
      rose: 'bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300',
      orange: 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300',
    };
    return colorMap[color] || 'bg-primary/10 text-primary';
  };

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SparklesIcon className="h-8 w-8 text-primary" />
            {t('aiTools.title', 'AI Tools')}
          </h1>
          <p className="text-muted-foreground">
            {t('aiTools.subtitle', 'Supercharge your marketing with our suite of AI-powered tools')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Star className="h-4 w-4" />
            {t('aiTools.favorites', 'Favorites')}
          </Button>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {t('aiTools.newWorkflow', 'New Workflow')}
          </Button>
        </div>
      </div>

      {/* Smart suggestion card */}
      <Card className="border border-primary/10 bg-primary/5 shadow-sm overflow-hidden relative">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span>{t('aiTools.suggestion.title', aiSuggestion.title)}</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('aiTools.suggestion.description', aiSuggestion.description)}
              </p>
            </div>
            <Button className="mt-2 md:mt-0 self-start gap-2 group">
              <span>{t('aiTools.suggestion.action', aiSuggestion.action)}</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-primary/10 rounded-full blur-2xl"></div>
      </Card>

      {/* Quick access grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            {t('aiTools.quickAccess', 'Quick Access')}
          </h2>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            {t('aiTools.customizeTools', 'Customize Tools')}
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {aiTools.slice(0, 4).map(tool => (
            <Card key={tool.id} className="border-border/60 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getToolCardColor(tool.color)} mb-3`}>
                  {tool.icon}
                </div>
                <h3 className="text-sm font-medium mb-1">{tool.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('aiTools.usedTimes', 'Used {{count}} times', { count: tool.usageCount })}
                </p>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm" className="text-xs">
                    {t('aiTools.openTool', 'Open')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Magic section */}
      <Card className="relative overflow-hidden border-border/60">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-primary/5 to-purple-500/5 z-0"></div>
        <CardContent className="pt-6 z-10 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-primary/10 text-primary">
              <Wand2 className="h-7 w-7" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-xl font-semibold">{t('aiTools.magic.title', 'AI Magic Content Creator')}</h3>
                <p className="text-muted-foreground">{t('aiTools.magic.description', 'Turn your brief ideas into fully crafted marketing content with our most advanced AI tool')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card className="bg-background/50 backdrop-blur-sm border-border/40">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-medium">
                      {t('aiTools.magic.features.posts', 'Social Posts')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('aiTools.magic.features.postsDesc', 'Generate platform-specific posts')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/50 backdrop-blur-sm border-border/40">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-2">
                      <LayoutGrid className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-medium">
                      {t('aiTools.magic.features.campaigns', 'Full Campaigns')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('aiTools.magic.features.campaignsDesc', 'Create multi-platform campaigns')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/50 backdrop-blur-sm border-border/40">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-medium">
                      {t('aiTools.magic.features.analytics', 'Smart Analytics')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('aiTools.magic.features.analyticsDesc', 'Performance predictions & insights')}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-4">
                <Button className="gap-2">
                  <SparklesIcon className="h-4 w-4" />
                  {t('aiTools.magic.button', 'Start Creating')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools explorer */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">{t('aiTools.explorer.title', 'Tools Explorer')}</h2>
          <div className="relative w-64">
            <Input
              placeholder={t('aiTools.explorer.search', 'Search tools...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeCategory === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            {t('aiTools.explorer.allTools', 'All Tools')}
          </Button>
          {toolCategories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              {category.title}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => (
            <Card key={tool.id} className="border-border/60 hover:border-primary/20 transition-all cursor-pointer group overflow-hidden">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getToolCardColor(tool.color)} mb-3`}>
                      {tool.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      {tool.isNew && (
                        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                          {t('aiTools.new', 'NEW')}
                        </Badge>
                      )}
                      {tool.isPro && (
                        <Badge variant="outline" className="border-amber-500/20 bg-amber-100/20 text-amber-600 dark:text-amber-400">
                          {t('aiTools.pro', 'PRO')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="text-base font-medium mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {t('aiTools.usedTimes', 'Used {{count}} times', { count: tool.usageCount })}
                    </div>
                    <Button variant="outline" size="sm" className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('aiTools.useTool', 'Use Tool')}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-muted to-transparent opacity-30"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick start templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            {t('aiTools.templates.title', 'Quick Start Templates')}
          </h2>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            {t('aiTools.templates.viewAll', 'View All Templates')}
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: t('aiTools.templates.product', 'Product Launch'),
              description: t('aiTools.templates.productDesc', 'Complete campaign for new product releases'),
              icon: <Rocket className="h-4 w-4" />,
              bgClass: 'from-blue-500/20 to-indigo-500/20'
            },
            {
              title: t('aiTools.templates.event', 'Event Promotion'),
              description: t('aiTools.templates.eventDesc', 'Drive attendance to your upcoming events'),
              icon: <Calendar className="h-4 w-4" />,
              bgClass: 'from-amber-500/20 to-orange-500/20'
            },
            {
              title: t('aiTools.templates.content', 'Content Series'),
              description: t('aiTools.templates.contentDesc', 'Create a multi-part content series'),
              icon: <LayoutGrid className="h-4 w-4" />,
              bgClass: 'from-emerald-500/20 to-green-500/20'
            },
            {
              title: t('aiTools.templates.seasonal', 'Seasonal Promotion'),
              description: t('aiTools.templates.seasonalDesc', 'Holiday and seasonal marketing campaigns'),
              icon: <Palette className="h-4 w-4" />,
              bgClass: 'from-rose-500/20 to-pink-500/20'
            }
          ].map((template, index) => (
            <Card key={index} className="overflow-hidden cursor-pointer group border-border/60">
              <CardContent className="p-0">
                <div className={`h-24 bg-gradient-to-r ${template.bgClass} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background/80 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center">
                      {template.icon}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-medium mb-1">{template.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                  <Button variant="ghost" size="sm" className="gap-1 w-full justify-center text-xs">
                    {t('aiTools.templates.use', 'Use Template')}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}