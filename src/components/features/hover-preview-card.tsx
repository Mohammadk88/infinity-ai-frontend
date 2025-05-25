'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Eye, 
  Calendar, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Play,
  Edit,
  ChevronRight
} from 'lucide-react';

interface PreviewData {
  id: string;
  title: string;
  description: string;
  type: 'campaign' | 'tool' | 'project' | 'report';
  status: 'active' | 'inactive' | 'draft' | 'completed' | 'pending';
  lastUpdated: string;
  metrics?: {
    views?: number;
    engagement?: number;
    completion?: number;
    users?: number;
  };
  tags?: string[];
  thumbnail?: string;
  actions?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
}

interface HoverPreviewCardProps {
  children: React.ReactNode;
  preview: PreviewData;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const HoverPreviewCard: React.FC<HoverPreviewCardProps> = ({
  children,
  preview,
  className,
  side = 'right',
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'draft':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'draft':
        return <Edit className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'campaign':
        return <TrendingUp className="h-4 w-4" />;
      case 'tool':
        return <Play className="h-4 w-4" />;
      case 'project':
        return <BarChart3 className="h-4 w-4" />;
      case 'report':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getSideClasses = () => {
    switch (side) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      default:
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
    }
  };

  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : side === 'bottom' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : side === 'bottom' ? -10 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute z-50 w-80",
              getSideClasses()
            )}
          >
            <Card className="glass-card border-border/50 shadow-premium backdrop-blur-xl">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="flex-shrink-0 text-primary">
                      {getTypeIcon(preview.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-semibold text-foreground truncate">
                        {preview.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground capitalize">
                        {preview.type}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs border flex items-center space-x-1 px-2 py-1",
                      getStatusColor(preview.status)
                    )}
                  >
                    {getStatusIcon(preview.status)}
                    <span className="capitalize">{preview.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {preview.description}
                </p>

                {/* Metrics */}
                {preview.metrics && (
                  <div className="grid grid-cols-2 gap-3">
                    {preview.metrics.views !== undefined && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Eye className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">Views:</span>
                        <span className="font-medium text-foreground">
                          {preview.metrics.views.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {preview.metrics.users !== undefined && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Users className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">Users:</span>
                        <span className="font-medium text-foreground">
                          {preview.metrics.users.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {preview.metrics.engagement !== undefined && (
                      <div className="flex items-center space-x-2 text-xs">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        <span className="text-muted-foreground">Engagement:</span>
                        <span className="font-medium text-foreground">
                          {preview.metrics.engagement}%
                        </span>
                      </div>
                    )}
                    {preview.metrics.completion !== undefined && (
                      <div className="flex items-center space-x-2 text-xs">
                        <BarChart3 className="h-3 w-3 text-orange-500" />
                        <span className="text-muted-foreground">Complete:</span>
                        <span className="font-medium text-foreground">
                          {preview.metrics.completion}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {preview.tags && preview.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {preview.tags.slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground hover:bg-muted/70"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {preview.tags.length > 3 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground"
                      >
                        +{preview.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Last Updated */}
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {preview.lastUpdated}</span>
                </div>

                {/* Actions */}
                {preview.actions && preview.actions.length > 0 && (
                  <div className="flex items-center space-x-2 pt-2 border-t border-border/50">
                    {preview.actions.slice(0, 2).map((action, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={action.onClick}
                        className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary transition-premium"
                      >
                        {action.icon}
                        <span className="ml-1">{action.label}</span>
                      </Button>
                    ))}
                    {preview.actions.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
