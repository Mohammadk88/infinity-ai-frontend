'use client';

import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAIProviderStore } from '@/store/useAIProviderStore';

interface AIProviderBadgeProps {
  className?: string;
}

// Enhanced provider configurations with better visual identity
const PROVIDER_CONFIG = {
  openai: { 
    name: 'OpenAI', 
    icon: '🧠', 
    color: 'from-green-500 to-emerald-500',
    textColor: 'text-green-600'
  },
  claude: { 
    name: 'Claude', 
    icon: '🤖', 
    color: 'from-orange-500 to-amber-500',
    textColor: 'text-orange-600'
  },
  anthropic: { 
    name: 'Claude', 
    icon: '🤖', 
    color: 'from-orange-500 to-amber-500',
    textColor: 'text-orange-600'
  },
  gemini: { 
    name: 'Gemini', 
    icon: '✨', 
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-600'
  },
  google: { 
    name: 'Gemini', 
    icon: '✨', 
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-600'
  },
} as const;

export default function AIProviderBadge({ className }: AIProviderBadgeProps) {
  const { providers, fetchProviders, isLoading } = useAIProviderStore();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Fetch providers on component mount
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Animate when provider changes
  useEffect(() => {
    if (providers.length > 0) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [providers]);

  // Get the active provider
  const activeProvider = providers.find(p => p.isActive);
  
  // Get provider configuration
  const getProviderConfig = (providerName: string) => {
    const normalizedName = providerName.toLowerCase();
    return PROVIDER_CONFIG[normalizedName as keyof typeof PROVIDER_CONFIG] || {
      name: providerName,
      icon: '🤖',
      color: 'from-gray-500 to-slate-500',
      textColor: 'text-gray-600'
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50"
        >
          <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            Loading...
          </span>
          <div className="w-3 h-3 bg-muted rounded animate-pulse" />
        </Badge>
      </div>
    );
  }

  // No active provider state
  if (!activeProvider) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90 transition-premium"
        >
          <div className="relative flex items-center justify-center w-4 h-4 rounded-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500 to-slate-500 opacity-20" />
            <AlertCircle className="w-3 h-3 text-muted-foreground/70" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            No AI Provider
          </span>
          <AlertCircle className="w-3 h-3 text-muted-foreground/50" />
        </Badge>
      </div>
    );
  }

  const providerConfig = getProviderConfig(activeProvider.provider);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge 
        variant="secondary" 
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50 transition-premium",
          "hover:shadow-premium hover:bg-background/90",
          "group cursor-pointer"
        )}
        title={`Active: ${providerConfig.name} (${activeProvider.model})`}
      >
        {/* Provider Icon */}
        <div className={cn(
          "relative flex items-center justify-center w-4 h-4 rounded-full transition-premium",
          isAnimating && "scale-110"
        )}>
          <div className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r opacity-20 group-hover:opacity-30 transition-premium",
            providerConfig.color
          )} />
          <span className="text-xs relative z-10">{providerConfig.icon}</span>
        </div>
        
        {/* Provider Name */}
        <span className={cn(
          "text-xs font-medium text-muted-foreground transition-premium group-hover:text-foreground",
          isAnimating && "scale-95"
        )}>
          Powered by {providerConfig.name}
        </span>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-1">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse",
            "shadow-sm shadow-green-500/50"
          )} />
          <Sparkles className={cn(
            "w-3 h-3 text-muted-foreground/50 transition-premium group-hover:text-muted-foreground",
            isAnimating && "animate-pulse"
          )} />
        </div>
      </Badge>
      
      {/* Model Information */}
      {activeProvider.model && (
        <Badge 
          variant="outline" 
          className="text-xs px-2 py-0.5 bg-background/60 backdrop-blur-sm border-border/30"
        >
          {activeProvider.model}
        </Badge>
      )}
    </div>
  );
}
