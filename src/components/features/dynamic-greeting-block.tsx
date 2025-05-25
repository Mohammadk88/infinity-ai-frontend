'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Coffee,
  Clock,
  TrendingUp,
  Target,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

interface GreetingData {
  greeting: string;
  icon: React.ReactNode;
  timeBasedMessage: string;
  suggestion: string;
  gradient: string;
}

const DynamicGreetingBlock = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greetingData, setGreetingData] = useState<GreetingData | null>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Generate dynamic greeting based on time
  useEffect(() => {
    const hour = currentTime.getHours();
    const name = user?.name?.split(' ')[0] || 'there';
    let greeting: GreetingData;

    if (hour >= 5 && hour < 12) {
      // Morning (5 AM - 12 PM)
      greeting = {
        greeting: `Good morning, ${name}! ☀️`,
        icon: <Sunrise className="h-5 w-5" />,
        timeBasedMessage: "Time to seize the day and boost your marketing game!",
        suggestion: "Best time to schedule social posts is around 9 AM",
        gradient: "from-orange-400 via-yellow-400 to-amber-300"
      };
    } else if (hour >= 12 && hour < 17) {
      // Afternoon (12 PM - 5 PM)
      greeting = {
        greeting: `Good afternoon, ${name}! 🌞`,
        icon: <Sun className="h-5 w-5" />,
        timeBasedMessage: "Peak productivity hours! Let's crush those marketing goals.",
        suggestion: "Afternoon is perfect for content creation and lead outreach",
        gradient: "from-blue-400 via-sky-400 to-cyan-300"
      };
    } else if (hour >= 17 && hour < 21) {
      // Evening (5 PM - 9 PM)
      greeting = {
        greeting: `Good evening, ${name}! 🌅`,
        icon: <Sunset className="h-5 w-5" />,
        timeBasedMessage: "Wind down time. Review today's wins and plan tomorrow.",
        suggestion: "Evening posts get 23% more engagement on average",
        gradient: "from-purple-400 via-pink-400 to-rose-300"
      };
    } else {
      // Night (9 PM - 5 AM)
      greeting = {
        greeting: `Working late, ${name}? 🌙`,
        icon: <Moon className="h-5 w-5" />,
        timeBasedMessage: "Night owl mode activated! Don't forget to rest.",
        suggestion: "Late-night content planning can boost tomorrow's productivity",
        gradient: "from-indigo-400 via-purple-400 to-blue-300"
      };
    }

    setGreetingData(greeting);
  }, [currentTime, user?.name]);

  if (!greetingData) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="glass-card border-border/50 overflow-hidden relative group hover:shadow-premium transition-premium">
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-premium",
        greetingData.gradient
      )} />
      
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center text-white",
              "bg-gradient-to-br shadow-lg",
              greetingData.gradient
            )}>
              {greetingData.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                {greetingData.greeting}
              </h2>
              <p className="text-sm text-muted-foreground">
                {greetingData.timeBasedMessage}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <p className="text-xs text-muted-foreground/70">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center">
                AI Insight
                <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary border-primary/20">
                  Smart
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                {greetingData.suggestion}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-lg font-bold text-foreground">+23%</span>
            </div>
            <p className="text-xs text-muted-foreground">Today's Growth</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-bold text-foreground">8</span>
            </div>
            <p className="text-xs text-muted-foreground">Active Campaigns</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-lg font-bold text-foreground">5</span>
            </div>
            <p className="text-xs text-muted-foreground">Tasks Due</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-border/30">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between hover:bg-primary/10 hover:text-primary transition-premium group"
          >
            <span className="text-sm">Let's boost your marketing today</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-premium" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicGreetingBlock;
