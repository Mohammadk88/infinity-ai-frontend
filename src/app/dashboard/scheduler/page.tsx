'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  Play,
  Pause,
  BarChart3,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

export default function SchedulerPage() {
  const { t } = useTranslation();
  const [selectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const scheduledPosts = [
    {
      id: 1,
      title: 'Product Launch Announcement',
      platform: 'LinkedIn',
      scheduledFor: new Date(2025, 5, 2, 10, 0),
      status: 'scheduled',
      content: 'Exciting news! Our new product is launching soon...',
      image: null
    },
    {
      id: 2,
      title: 'Weekly Team Update',
      platform: 'Twitter',
      scheduledFor: new Date(2025, 5, 2, 14, 30),
      status: 'scheduled',
      content: 'This week our team achieved incredible milestones...',
      image: null
    },
    {
      id: 3,
      title: 'Customer Success Story',
      platform: 'Instagram',
      scheduledFor: new Date(2025, 5, 3, 9, 0),
      status: 'draft',
      content: 'Meet Sarah, one of our amazing customers who...',
      image: '/placeholder-image.jpg'
    }
  ];

  const platforms = [
    { name: 'LinkedIn', color: 'bg-blue-600', connected: true },
    { name: 'Twitter', color: 'bg-black', connected: true },
    { name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500', connected: false },
    { name: 'Facebook', color: 'bg-blue-500', connected: true }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800 border-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'published': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-8 w-8 text-primary" />
            {t('scheduler.title', 'Content Scheduler')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('scheduler.description', 'Plan and schedule your content across all platforms')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Pause className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platforms</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content Calendar</CardTitle>
                <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'list')}>
                  <TabsList>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {view === 'calendar' ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-8 text-center">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Calendar view coming soon</p>
                    <p className="text-sm text-muted-foreground">Interactive calendar will be available in the next update</p>
                  </div>
                  
                  {selectedDate && (
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        Posts for {format(selectedDate, 'MMMM d, yyyy')}
                      </h4>
                      <div className="space-y-2">
                        {scheduledPosts
                          .filter(post => 
                            post.scheduledFor.toDateString() === selectedDate.toDateString()
                          )
                          .map(post => (
                            <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <div>
                                  <p className="font-medium text-sm">{post.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(post.scheduledFor, 'h:mm a')} • {post.platform}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary" className={getStatusColor(post.status)}>
                                {post.status}
                              </Badge>
                            </div>
                          ))
                        }
                        {scheduledPosts.filter(post => 
                          post.scheduledFor.toDateString() === selectedDate.toDateString()
                        ).length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No posts scheduled for this date
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledPosts.map(post => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{post.title}</h4>
                            <Badge variant="secondary" className={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{format(post.scheduledFor, 'MMM d, yyyy h:mm a')}</span>
                            <span>•</span>
                            <span>{post.platform}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Connected Platforms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connected Platforms</CardTitle>
              <CardDescription>Manage your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                  <Badge variant={platform.connected ? "default" : "outline"}>
                    {platform.connected ? "Connected" : "Connect"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Post
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Bulk Schedule
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Best Times to Post */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Times to Post</CardTitle>
              <CardDescription>Based on your audience activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-6 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Coming Soon</p>
                <p className="text-xs">AI-powered optimal posting times</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
