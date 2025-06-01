'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Check, 
  X, 
  Settings, 
  Filter,
  Trash2,
  Eye,
  AlertTriangle,
  Info,
  CheckCircle,
  Calendar,
  Users,
  CreditCard,
  Sparkles
} from 'lucide-react';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Post Published Successfully',
      message: 'Your LinkedIn post "Product Launch Update" has been published.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      category: 'posts'
    },
    {
      id: 2,
      type: 'info',
      title: 'New AI Feature Available',
      message: 'Try our new AI image generator - create stunning visuals in seconds.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      category: 'features'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Subscription Expires Soon',
      message: 'Your subscription will expire in 3 days. Renew to continue using premium features.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      category: 'billing'
    },
    {
      id: 4,
      type: 'success',
      title: 'Schedule Completed',
      message: 'All 5 posts scheduled for today have been published successfully.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      category: 'schedule'
    },
    {
      id: 5,
      type: 'info',
      title: 'Points Earned',
      message: 'You earned 50 points for completing your daily posting goal!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false,
      category: 'rewards'
    }
  ]);

  const notificationSettings = {
    posts: true,
    schedule: true,
    billing: true,
    features: true,
    rewards: true,
    email: false,
    push: true,
    desktop: true
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      case 'info': 
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'posts': return <Bell className="h-4 w-4" />;
      case 'schedule': return <Calendar className="h-4 w-4" />;
      case 'billing': return <CreditCard className="h-4 w-4" />;
      case 'features': return <Sparkles className="h-4 w-4" />;
      case 'rewards': return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !n.read;
    return n.category === selectedTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            {t('notifications.title', 'Notifications')}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('notifications.description', 'Stay updated with your content and account activity')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Notifications */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="space-y-3 mt-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No notifications found</p>
                      <p className="text-sm">You&apos;re all caught up!</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                          !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-background'
                        }`}
                      >
                        <div className="flex-shrink-0 pt-1">
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1 ml-4">
                              <Badge variant="outline" className="text-xs">
                                {getCategoryIcon(notification.category)}
                                <span className="ml-1 capitalize">{notification.category}</span>
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.timestamp)}
                            </span>
                            
                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-medium">{notifications.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Unread</span>
                <span className="font-medium text-primary">{unreadCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-medium">{notifications.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Categories</h4>
                <div className="space-y-2">
                  {Object.entries(notificationSettings).slice(0, 5).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key}</span>
                      <Switch checked={value} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium">Delivery</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <Switch checked={notificationSettings.push} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <Switch checked={notificationSettings.email} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Desktop Notifications</span>
                    <Switch checked={notificationSettings.desktop} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Test Notification
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
