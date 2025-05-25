'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Target,
  Calendar,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIData {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  suffix?: string;
  prefix?: string;
  description: string;
  trend: number[];
}

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0
}) => {
  const [count, setCount] = useState(from);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const difference = to - from;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = from + difference * easeOutCubic;
      
      setCount(Number(current.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, from, to, duration, decimals]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const AnimatedKPICounters = () => {
  const { t } = useTranslation();

  // Mock KPI data - in real app, this would come from your API
  const kpiData: KPIData[] = [
    {
      id: 'clients',
      title: 'Active Clients',
      value: 247,
      previousValue: 235,
      change: 5.1,
      changeType: 'increase',
      icon: <Users className="h-5 w-5" />,
      color: 'blue',
      description: 'Total active clients this month',
      trend: [220, 225, 235, 240, 247]
    },
    {
      id: 'projects',
      title: 'Active Projects',
      value: 89,
      previousValue: 92,
      change: -3.3,
      changeType: 'decrease',
      icon: <Briefcase className="h-5 w-5" />,
      color: 'purple',
      description: 'Currently running projects',
      trend: [95, 93, 92, 90, 89]
    },
    {
      id: 'leads',
      title: 'Hot Leads',
      value: 156,
      previousValue: 142,
      change: 9.9,
      changeType: 'increase',
      icon: <Target className="h-5 w-5" />,
      color: 'green',
      description: 'Qualified leads ready for outreach',
      trend: [130, 135, 142, 150, 156]
    },
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: 84750,
      previousValue: 78200,
      change: 8.4,
      changeType: 'increase',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'emerald',
      prefix: '$',
      description: 'Revenue generated this month',
      trend: [72000, 75000, 78200, 82000, 84750]
    },
    {
      id: 'tasks',
      title: 'Tasks Completed',
      value: 1247,
      previousValue: 1189,
      change: 4.9,
      changeType: 'increase',
      icon: <Activity className="h-5 w-5" />,
      color: 'orange',
      description: 'Tasks completed this month',
      trend: [1100, 1150, 1189, 1220, 1247]
    },
    {
      id: 'meetings',
      title: 'Meetings Scheduled',
      value: 43,
      previousValue: 41,
      change: 4.9,
      changeType: 'increase',
      icon: <Calendar className="h-5 w-5" />,
      color: 'pink',
      description: 'Upcoming meetings this week',
      trend: [38, 39, 41, 42, 43]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50 border-blue-200',
      purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50 border-purple-200',
      green: 'from-green-500 to-green-600 text-green-600 bg-green-50 border-green-200',
      emerald: 'from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-50 border-emerald-200',
      orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50 border-orange-200',
      pink: 'from-pink-500 to-pink-600 text-pink-600 bg-pink-50 border-pink-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return <ArrowUp className="h-3 w-3" />;
      case 'decrease':
        return <ArrowDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'decrease':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {kpiData.map((kpi, index) => {
        const colorClasses = getColorClasses(kpi.color);
        const [gradientFrom, gradientTo] = colorClasses.split(' to-');
        
        return (
          <Card 
            key={kpi.id} 
            className={cn(
              "glass-card border-border/50 hover:shadow-premium transition-premium group",
              "hover:scale-[1.02] hover:-translate-y-1"
            )}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  "bg-gradient-to-br shadow-lg transition-premium group-hover:scale-110",
                  gradientFrom.replace('from-', 'from-') + ' ' + gradientTo
                )}>
                  <div className="text-white">
                    {kpi.icon}
                  </div>
                </div>
                
                {kpi.change !== undefined && (
                  <Badge variant="outline" className={cn(
                    "text-xs border transition-premium",
                    getChangeColor(kpi.changeType)
                  )}>
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(kpi.changeType)}
                      <span>{Math.abs(kpi.change)}%</span>
                    </div>
                  </Badge>
                )}
              </div>
              
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter
                    from={0}
                    to={kpi.value}
                    duration={1500 + index * 200}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {kpi.description}
                </p>
                
                {/* Mini trend chart */}
                <div className="flex items-end space-x-1 h-8">
                  {kpi.trend.map((value, i) => {
                    const maxValue = Math.max(...kpi.trend);
                    const height = (value / maxValue) * 100;
                    const isLast = i === kpi.trend.length - 1;
                    
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 rounded-sm transition-all duration-500 ease-out",
                          isLast 
                            ? `bg-gradient-to-t ${gradientFrom.replace('from-', 'from-')} ${gradientTo}` 
                            : 'bg-muted/50',
                          "hover:opacity-80"
                        )}
                        style={{
                          height: `${height}%`,
                          animationDelay: `${(index * 100) + (i * 50)}ms`
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnimatedKPICounters;
