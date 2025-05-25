'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  TrendingUp,
  Clock,
  Target,
  Lightbulb,
  Sparkles,
  Calendar,
  Users,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIRecommendation {
  id: string;
  type: 'timing' | 'content' | 'audience' | 'optimization' | 'trending';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  action?: string;
  actionUrl?: string;
  icon: React.ReactNode;
  priority: number;
}

const AIRecommendationsBlock = () => {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Generate AI recommendations based on current data and time
  const generateRecommendations = () => {
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const hour = new Date().getHours();
      const dayOfWeek = new Date().getDay();
      const mockRecommendations: AIRecommendation[] = [];

      // Time-based recommendations
      if (hour >= 6 && hour < 9) {
        mockRecommendations.push({
          id: 'morning-post',
          type: 'timing',
          title: 'Best Time to Post Today',
          description: 'Your audience is most active between 8-10 AM. Schedule your social media posts now for maximum engagement.',
          confidence: 87,
          impact: 'high',
          action: 'Schedule Posts',
          actionUrl: '/dashboard/social-accounts',
          icon: <Clock className="h-4 w-4" />,
          priority: 1
        });
      }

      if (hour >= 14 && hour < 17) {
        mockRecommendations.push({
          id: 'afternoon-outreach',
          type: 'audience',
          title: 'Lead Outreach Window',
          description: 'B2B leads are 34% more likely to respond to emails sent between 2-4 PM. Perfect time for outreach!',
          confidence: 92,
          impact: 'high',
          action: 'Contact Leads',
          actionUrl: '/dashboard/leads',
          icon: <Target className="h-4 w-4" />,
          priority: 1
        });
      }

      // Day-specific recommendations
      if (dayOfWeek === 1) { // Monday
        mockRecommendations.push({
          id: 'monday-planning',
          type: 'optimization',
          title: 'Weekly Planning Boost',
          description: 'Teams that plan on Mondays are 23% more productive. Review your weekly goals and set priorities.',
          confidence: 78,
          impact: 'medium',
          action: 'Plan Week',
          actionUrl: '/dashboard/calendar',
          icon: <Calendar className="h-4 w-4" />,
          priority: 2
        });
      }

      // Content recommendations
      mockRecommendations.push({
        id: 'trending-topic',
        type: 'trending',
        title: 'Trending in Your Niche',
        description: '"AI automation" is trending up 340% this week. Create content around this topic to boost visibility.',
        confidence: 94,
        impact: 'high',
        action: 'Create Content',
        actionUrl: '/dashboard/ai-tools',
        icon: <TrendingUp className="h-4 w-4" />,
        priority: 1
      });

      // Audience insights
      mockRecommendations.push({
        id: 'engagement-pattern',
        type: 'audience',
        title: 'Audience Engagement Pattern',
        description: 'Your posts with questions get 67% more engagement. Try asking your audience about their biggest challenges.',
        confidence: 85,
        impact: 'medium',
        action: 'Engage Audience',
        actionUrl: '/dashboard/posts',
        icon: <MessageSquare className="h-4 w-4" />,
        priority: 2
      });

      // Optimization recommendations
      mockRecommendations.push({
        id: 'conversion-optimization',
        type: 'optimization',
        title: 'Landing Page Optimization',
        description: 'Your lead capture form has a 23% conversion rate. Adding social proof could increase it to 31%.',
        confidence: 76,
        impact: 'medium',
        action: 'Optimize Pages',
        actionUrl: '/dashboard/projects',
        icon: <Lightbulb className="h-4 w-4" />,
        priority: 3
      });

      // Sort by priority and impact
      const sortedRecommendations = mockRecommendations
        .sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          const impactOrder = { high: 3, medium: 2, low: 1 };
          return impactOrder[b.impact] - impactOrder[a.impact];
        })
        .slice(0, 4); // Show top 4 recommendations

      setRecommendations(sortedRecommendations);
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-blue-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card className="glass-card border-border/50 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold flex items-center">
                AI Recommendations
                <Badge variant="outline" className="ml-2 text-xs bg-purple-50 text-purple-700 border-purple-200">
                  Smart
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Last updated {lastUpdated.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateRecommendations}
            disabled={isLoading}
            className="hover:bg-purple-50 hover:text-purple-700 transition-premium"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted/50 h-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div
                key={recommendation.id}
                className={cn(
                  "group p-4 rounded-lg border border-border/30 bg-background/50",
                  "hover:shadow-premium hover:border-purple-200 transition-premium cursor-pointer",
                  "hover:bg-purple-50/50"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-premium">
                    {recommendation.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground line-clamp-1">
                        {recommendation.title}
                      </h4>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getImpactColor(recommendation.impact))}
                        >
                          {recommendation.impact}
                        </Badge>
                        <span 
                          className={cn("text-xs font-medium", getConfidenceColor(recommendation.confidence))}
                        >
                          {recommendation.confidence}%
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {recommendation.description}
                    </p>
                    
                    {recommendation.action && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs text-purple-600 hover:bg-purple-100 group-hover:translate-x-1 transition-premium"
                      >
                        {recommendation.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-3 border-t border-border/30">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-premium"
          >
            <span className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              View All AI Insights
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsBlock;
