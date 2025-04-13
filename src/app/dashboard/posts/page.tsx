'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Filter, 
  Calendar, 
  Image as ImageIcon, 
  Clock, 
  Search,
  BarChart,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  SparklesIcon,
  MessageCircle,
  Heart,
  Repeat,
  MoreVertical,
  ThumbsUp,
  Eye,
  Zap,
  Palette,
  EditIcon,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

export default function PostsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock posts data
  const posts = [
    {
      id: 1,
      title: 'Summer collection launch with exclusive discounts',
      content: 'Excited to announce our new summer collection! 🌞 Get 25% off with code SUMMER25 #SummerFashion #NewCollection',
      status: 'scheduled',
      scheduledDate: '2025-04-15T15:30:00',
      platforms: ['instagram', 'facebook'],
      image: '/summer-collection.jpg',
      metrics: {
        likes: 254,
        comments: 42,
        shares: 18,
        impressions: 3850
      },
      aiGenerated: true,
      aiOptimized: true
    },
    {
      id: 2,
      title: 'Industry insights from our CEO',
      content: 'Our CEO shared valuable insights on the future of digital marketing at yesterday\'s conference. Read the full interview on our blog! #DigitalMarketing #IndustryTrends',
      status: 'published',
      publishedDate: '2025-04-10T09:15:00',
      platforms: ['linkedin', 'twitter'],
      image: '/ceo-interview.jpg',
      metrics: {
        likes: 128,
        comments: 24,
        shares: 37,
        impressions: 2140
      },
      aiGenerated: false,
      aiOptimized: true
    },
    {
      id: 3,
      title: 'Weekly product spotlight: Premium headphones',
      content: 'This week\'s spotlight: Our premium noise-canceling headphones. Perfect for work, travel, or relaxation. Shop now with free shipping! #ProductSpotlight #PremiumAudio',
      status: 'draft',
      platforms: ['instagram', 'facebook', 'twitter'],
      image: '/headphones-spotlight.jpg',
      aiGenerated: true,
      aiOptimized: false
    }
  ];

  const upcomingPosts = posts.filter(post => post.status === 'scheduled');
  const publishedPosts = posts.filter(post => post.status === 'published');
  const draftPosts = posts.filter(post => post.status === 'draft');

  const getPlatformIcon = (platform: string, size = 'md') => {
    const iconSize = size === 'sm' ? "h-3 w-3" : "h-4 w-4";
    
    switch (platform) {
      case 'facebook':
        return <Facebook className={iconSize} />;
      case 'instagram':
        return <Instagram className={iconSize} />;
      case 'linkedin':
        return <Linkedin className={iconSize} />;
      case 'twitter':
        return <Twitter className={iconSize} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">{t('posts.status.published', 'Published')}</Badge>;
      case 'scheduled':
        return <Badge variant="info">{t('posts.status.scheduled', 'Scheduled')}</Badge>;
      case 'draft':
        return <Badge variant="secondary">{t('posts.status.draft', 'Draft')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlatformFilterButton = (platform: string) => {
    return (
      <Button 
        key={platform}
        variant={filterPlatform === platform ? "default" : "outline"} 
        size="sm" 
        className="gap-1"
        onClick={() => setFilterPlatform(filterPlatform === platform ? null : platform)}
      >
        {getPlatformIcon(platform, 'sm')}
        <span className="capitalize">{platform}</span>
      </Button>
    );
  };

  const formatScheduleTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const getDisplayPosts = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingPosts;
      case 'published':
        return publishedPosts;
      case 'drafts':
        return draftPosts;
      default:
        return upcomingPosts;
    }
  };

  const displayPosts = getDisplayPosts().filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform ? post.platforms.includes(filterPlatform) : true;
    return matchesSearch && matchesPlatform;
  });

  // Calendar view data preparation (just for UI demonstration)
  const currentDate = new Date();
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDay = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date);
  };

  // Check if a post is scheduled for a specific day
  const getPostsForDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return posts.filter(post => 
      post.status === 'scheduled' && 
      post.scheduledDate?.startsWith(dateString)
    );
  };

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('posts.title', 'Posts')}
          </h1>
          <p className="text-muted-foreground">
            {t('posts.subtitle', 'Create and schedule posts across your social media accounts')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t('posts.viewSchedule', 'Calendar View')}
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('posts.newPost', 'New Post')}
          </Button>
        </div>
      </div>

      {/* AI Content Creator Card */}
      <Card className="border border-primary/10 bg-primary/5 shadow-sm overflow-hidden relative">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span>{t('posts.aiContentCreator.title', 'AI Content Creator')}</span>
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">NEW</Badge>
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('posts.aiContentCreator.description', 'Generate engaging social media content with AI. Choose your tone, style, and target audience.')}
              </p>
            </div>
            <Button className="mt-2 md:mt-0 self-start gap-2 group" size="sm">
              <span>{t('posts.aiContentCreator.button', 'Generate Content')}</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-primary/10 rounded-full blur-3xl"></div>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t('posts.calendar.title', 'Publishing Schedule')}
          </CardTitle>
          <CardDescription>{t('posts.calendar.description', 'Your upcoming posts for the next 7 days')}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto pb-0">
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-full text-center py-2 mb-2 font-medium rounded-md ${i === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                  <div className="text-xs">{formatDay(date)}</div>
                  <div className={`text-lg ${i === 0 ? '' : 'text-foreground'}`}>{formatDate(date)}</div>
                </div>
                <div className="w-full space-y-2">
                  {getPostsForDay(date).map((post) => (
                    <div 
                      key={post.id} 
                      className="p-2 bg-muted/40 border border-border/60 rounded-md text-xs relative group" 
                      title={post.title}
                    >
                      <div className="flex gap-1 mb-1">
                        {post.platforms.map(platform => (
                          <div key={platform} className="flex items-center justify-center h-4 w-4">
                            {getPlatformIcon(platform, 'sm')}
                          </div>
                        ))}
                      </div>
                      <div className="truncate">{post.title.substring(0, 20)}...</div>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(post.scheduledDate as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {post.aiOptimized && (
                        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4">
                          <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <SparklesIcon className="h-2 w-2 text-primary" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-md transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" className="text-xs h-7 whitespace-nowrap px-2">
                          {t('posts.calendar.view', 'View')}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full h-6 border border-dashed border-muted-foreground/20 text-[10px] text-muted-foreground"
                  >
                    <Plus className="h-2 w-2 mr-1" />
                    {t('posts.calendar.add', 'Add')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div>
        {/* Tabs */}
        <div className="flex border-b border-border/60 mb-6">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            {t('posts.tabs.upcoming', 'Upcoming')} ({upcomingPosts.length})
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'published' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('published')}
          >
            {t('posts.tabs.published', 'Published')} ({publishedPosts.length})
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'drafts' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('drafts')}
          >
            {t('posts.tabs.drafts', 'Drafts')} ({draftPosts.length})
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
            <Input
              placeholder={t('posts.searchPlaceholder', 'Search posts...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {getPlatformFilterButton('facebook')}
            {getPlatformFilterButton('instagram')}
            {getPlatformFilterButton('twitter')}
            {getPlatformFilterButton('linkedin')}
          </div>
        </div>

        {displayPosts.length === 0 ? (
          <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-2">{t('posts.empty.title', 'No posts found')}</h3>
            <p className="text-muted-foreground mb-6">{t('posts.empty.description', 'You have no posts in this category yet or they don\'t match your filters.')}</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('posts.empty.button', 'Create New Post')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {displayPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden border-border/60">
                <div className="flex flex-col lg:flex-row">
                  {/* Main post content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <div className="flex gap-2 flex-wrap items-center mb-2">
                          {getStatusBadge(post.status)}
                          <div className="flex gap-1">
                            {post.platforms.map(platform => (
                              <div key={platform} className="flex items-center justify-center h-5 w-5 rounded-full bg-muted/50">
                                {getPlatformIcon(platform)}
                              </div>
                            ))}
                          </div>
                          {post.aiGenerated && (
                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary gap-1">
                              <SparklesIcon className="h-3 w-3" />
                              {t('posts.aiGenerated', 'AI Generated')}
                            </Badge>
                          )}
                          {post.aiOptimized && !post.aiGenerated && (
                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary gap-1">
                              <Zap className="h-3 w-3" />
                              {t('posts.aiOptimized', 'AI Optimized')}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <EditIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                      {/* Display post image if available */}
                      {post.image && (
                        <div className="md:w-32 h-24 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                        
                        {/* Schedule info */}
                        <div className="flex items-center mt-4 text-xs text-muted-foreground">
                          {post.status === 'scheduled' && (
                            <>
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>
                                {t('posts.scheduledFor', 'Scheduled for {{time}}', {
                                  time: formatScheduleTime(post.scheduledDate as string)
                                })}
                              </span>
                            </>
                          )}
                          {post.status === 'published' && (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                              <span>
                                {t('posts.publishedOn', 'Published on {{time}}', {
                                  time: formatScheduleTime(post.publishedDate as string)
                                })}
                              </span>
                            </>
                          )}
                          {post.status === 'draft' && (
                            <>
                              <EditIcon className="h-3.5 w-3.5 mr-1" />
                              <span>{t('posts.inDraft', 'In draft')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Post metrics */}
                    {post.status === 'published' && post.metrics && (
                      <div className="mt-6 pt-4 border-t border-border/40">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
                          <BarChart className="h-3.5 w-3.5 text-muted-foreground" />
                          {t('posts.performance', 'Post Performance')}
                        </h4>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex items-center gap-1.5">
                            <div className="h-7 w-7 rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center text-rose-500">
                              <Heart className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">{t('posts.metrics.likes', 'Likes')}</p>
                              <p className="text-sm font-medium">{post.metrics.likes}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-500">
                              <MessageCircle className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">{t('posts.metrics.comments', 'Comments')}</p>
                              <p className="text-sm font-medium">{post.metrics.comments}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="h-7 w-7 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center text-green-500">
                              <Repeat className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">{t('posts.metrics.shares', 'Shares')}</p>
                              <p className="text-sm font-medium">{post.metrics.shares}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center text-purple-500">
                              <Eye className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">{t('posts.metrics.impressions', 'Impressions')}</p>
                              <p className="text-sm font-medium">{post.metrics.impressions}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI optimization suggestions for drafts */}
                    {post.status === 'draft' && !post.aiOptimized && (
                      <div className="mt-6 pt-4 border-t border-border/40">
                        <Card className="bg-primary/5 border border-primary/20">
                          <CardContent className="p-3 flex gap-2 items-start">
                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                              <Palette className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{t('posts.aiSuggestion.title', 'AI Optimization Available')}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t('posts.aiSuggestion.description', 'Let AI analyze and optimize this post for better engagement based on your audience.')}
                              </p>
                              <Button variant="outline" size="sm" className="mt-2 gap-1 text-xs h-7 border-primary text-primary">
                                <SparklesIcon className="h-3 w-3" />
                                {t('posts.aiSuggestion.button', 'Optimize with AI')}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Action sidebar */}
                  {post.status === 'scheduled' && (
                    <div className="lg:w-56 bg-muted/30 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border/60">
                      <div>
                        <h4 className="text-sm font-medium mb-6">{t('posts.actions.title', 'Post Actions')}</h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                            <EditIcon className="h-3.5 w-3.5" />
                            {t('posts.actions.edit', 'Edit Post')}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            {t('posts.actions.reschedule', 'Reschedule')}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5">
                            {t('posts.actions.unschedule', 'Unschedule')}
                          </Button>
                        </div>
                      </div>

                      {post.aiOptimized && (
                        <Card className="mt-6 bg-primary/5 border-primary/20">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <SparklesIcon className="h-3.5 w-3.5 text-primary" />
                              <span className="text-sm font-medium text-primary">{t('posts.aiPrediction.title', 'AI Prediction')}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {t('posts.aiPrediction.description', 'This post is predicted to receive 15-20% higher engagement than your average post.')}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}