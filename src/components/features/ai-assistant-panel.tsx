'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bot,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Target,
  FileText,
  Send,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import { AIAssistantTrigger } from './ai-assistant-trigger';

interface Suggestion {
  id: string;
  type: 'content' | 'analytics' | 'task' | 'optimization';
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

interface AIAssistantPanelProps {
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

const AIAssistantPanel = ({ externalOpen, onExternalOpenChange, showTrigger = true }: AIAssistantPanelProps) => {
  const { user } = useUserStore();
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external control if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onExternalOpenChange || setInternalOpen;
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  // Mock AI suggestions based on time and user activity
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    // Generate contextual suggestions based on time of day and user data
    const generateSuggestions = () => {
      const hour = new Date().getHours();
      const baseSuggestions: Suggestion[] = [];

      // Morning suggestions (6-12)
      if (hour >= 6 && hour < 12) {
        baseSuggestions.push({
          id: '1',
          type: 'analytics',
          title: 'Morning Analytics Review',
          description: 'Review yesterday\'s performance metrics and plan today\'s priorities',
          action: 'View Dashboard',
          icon: <TrendingUp className="h-4 w-4" />,
          priority: 'high'
        });
      }

      // Afternoon suggestions (12-17)
      if (hour >= 12 && hour < 17) {
        baseSuggestions.push({
          id: '2',
          type: 'content',
          title: 'Content Creation Time',
          description: 'Optimal time for social media posts. Create engaging content now.',
          action: 'Generate Content',
          icon: <FileText className="h-4 w-4" />,
          priority: 'medium'
        });
      }

      // Evening suggestions (17-22)
      if (hour >= 17 && hour < 22) {
        baseSuggestions.push({
          id: '3',
          type: 'task',
          title: 'Daily Wrap-up',
          description: 'Review completed tasks and prepare tomorrow\'s agenda',
          action: 'Review Tasks',
          icon: <Target className="h-4 w-4" />,
          priority: 'medium'
        });
      }

      // Universal suggestions
      baseSuggestions.push(
        {
          id: '4',
          type: 'optimization',
          title: 'AI Content Optimizer',
          description: 'Enhance your existing content with AI-powered suggestions',
          action: 'Optimize Content',
          icon: <Sparkles className="h-4 w-4" />,
          priority: 'high'
        },
        {
          id: '5',
          type: 'analytics',
          title: 'Lead Scoring Update',
          description: '3 hot leads detected. Review and prioritize outreach.',
          action: 'View Leads',
          icon: <Target className="h-4 w-4" />,
          priority: 'high'
        }
      );

      setSuggestions(baseSuggestions);
    };

    generateSuggestions();
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setIsTyping(true);
    // Simulate AI thinking
    setTimeout(() => {
      setIsTyping(false);
      setInputMessage('');
      // Here you would integrate with your AI service
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    if (hour < 22) return `Good evening, ${name}!`;
    return `Working late, ${name}?`;
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {showTrigger && (
          <SheetTrigger asChild>
            <AIAssistantTrigger onClick={() => setIsOpen(true)} />
          </SheetTrigger>
        )}

        <SheetContent className="w-[400px] sm:w-[540px] p-0 overflow-hidden">
          <div className="h-full flex flex-col bg-gradient-to-br from-background via-blue-50/30 to-purple-50/20 dark:from-background dark:via-purple-950/20 dark:to-blue-950/20">
            {/* Header */}
            <SheetHeader className="p-6 pb-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-semibold">AI Assistant</SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    {getGreeting()} How can I help you today?
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                  Smart Suggestions
                </h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="glass-card hover:shadow-premium transition-premium cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              {suggestion.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-sm font-medium text-foreground truncate">
                                  {suggestion.title}
                                </h4>
                                <Badge variant="outline" className={cn("text-xs", getPriorityColor(suggestion.priority))}>
                                  {suggestion.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {suggestion.description}
                              </p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs text-primary hover:bg-primary/10 group-hover:translate-x-1 transition-premium"
                              >
                                {suggestion.action}
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* AI Chat Interface */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  Ask AI Assistant
                </h3>
                
                {/* Chat messages would go here */}
                {isTyping && (
                  <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                    <Bot className="h-4 w-4 text-primary" />
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Ask me anything about your marketing..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full px-4 py-2 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-premium"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-premium"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AIAssistantPanel;
