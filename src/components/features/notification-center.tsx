'use client';

import { useState } from 'react';
import { Bell, Check, Calendar, Megaphone, MessageSquare, Sparkles, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'message' | 'campaign' | 'calendar' | 'ai' | 'system';
}

export default function NotificationCenter() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: t('notifications.aiSuggestion', 'AI Post Suggestion'),
      message: t('notifications.aiSuggestionMsg', 'AI has generated new content ideas for your social media campaign.'),
      time: '10m',
      read: false,
      type: 'ai',
    },
    {
      id: '2',
      title: t('notifications.campaignStarted', 'Campaign Started'),
      message: t('notifications.campaignStartedMsg', 'Your "Summer Sale 2025" campaign has started running.'),
      time: '1h',
      read: false,
      type: 'campaign',
    },
    {
      id: '3',
      title: t('notifications.scheduledPost', 'Post Scheduled'),
      message: t('notifications.scheduledPostMsg', 'Your post for Facebook has been scheduled for April 15, 2025.'),
      time: '2h',
      read: true,
      type: 'calendar',
    },
    {
      id: '4',
      title: t('notifications.newMessage', 'New Message'),
      message: t('notifications.newMessageMsg', 'You received a new message from the client regarding the latest campaign.'),
      time: '1d',
      read: true,
      type: 'message',
    },
  ]);
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'campaign':
        return <Megaphone className="h-5 w-5 text-purple-500" />;
      case 'calendar':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'ai':
        return <Sparkles className="h-5 w-5 text-indigo-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleNotifications}
        className={cn(
          "relative h-9 w-9 rounded-full transition-transform hover:scale-105",
          isOpen && "bg-accent"
        )}
        aria-label={t('header.notifications', 'Notifications')}
      >
        <Bell className="h-[1.2rem] w-[1.2rem]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate__animated animate__pulse animate__infinite">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={toggleNotifications} 
            aria-hidden="true"
          />
          <Card className={cn(
            "absolute right-0 mt-2 w-80 md:w-96 z-50 shadow-lg overflow-hidden",
            "animate__animated animate__fadeInDown animate__faster"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <h3 className="font-medium">{t('notifications.title', 'Notifications')}</h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {unreadCount} {t('notifications.new', 'new')}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-8 px-2 hover:bg-accent"
                  onClick={markAllAsRead}
                >
                  <Check className="h-3 w-3 mr-1" />
                  {t('notifications.markAllRead', 'Mark all read')}
                </Button>
              )}
            </div>
            
            {/* Notifications List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <p>{t('notifications.noNotifications', 'No notifications')}</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-4 relative hover:bg-accent/50 transition-colors",
                        !notification.read && "bg-accent/30"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 pr-8">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className={cn(
                              "text-sm font-medium",
                              !notification.read && "text-foreground",
                              notification.read && "text-foreground/80"
                            )}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          
                          {!notification.read && (
                            <Button
                              variant="ghost" 
                              size="sm"
                              className="absolute right-3 top-4 h-6 w-6 p-0 text-muted-foreground/70 hover:text-foreground"
                              onClick={() => markAsRead(notification.id)}
                              aria-label={t('notifications.markAsRead', 'Mark as read')}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          
                          {notification.read && (
                            <Button
                              variant="ghost" 
                              size="sm"
                              className="absolute right-3 top-4 h-6 w-6 p-0 text-muted-foreground/50 hover:text-foreground"
                              onClick={() => removeNotification(notification.id)}
                              aria-label={t('notifications.remove', 'Remove notification')}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t p-2 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 w-full px-2 hover:bg-accent text-muted-foreground"
                onClick={toggleNotifications}
              >
                {t('notifications.viewAll', 'View all notifications')}
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}