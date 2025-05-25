'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AIProviderBadgeProps {
  className?: string;
}

const AI_PROVIDERS = [
  { name: 'Claude', icon: '🤖', color: 'from-orange-500 to-amber-500' },
  { name: 'OpenAI', icon: '🧠', color: 'from-green-500 to-emerald-500' },
  { name: 'Gemini', icon: '✨', color: 'from-blue-500 to-cyan-500' },
];

export default function AIProviderBadge({ className }: AIProviderBadgeProps) {
  const [currentProvider, setCurrentProvider] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentProvider((prev) => (prev + 1) % AI_PROVIDERS.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const provider = AI_PROVIDERS[currentProvider];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge 
        variant="secondary" 
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50 transition-premium",
          "hover:shadow-premium hover:bg-background/90"
        )}
      >
        <div className={cn(
          "relative flex items-center justify-center w-4 h-4 rounded-full transition-premium",
          isAnimating && "scale-110"
        )}>
          <div className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r opacity-20",
            provider.color
          )} />
          <span className="text-xs">{provider.icon}</span>
        </div>
        
        <span className={cn(
          "text-xs font-medium text-muted-foreground transition-premium",
          isAnimating && "scale-95"
        )}>
          Powered by {provider.name}
        </span>
        
        <Sparkles className={cn(
          "w-3 h-3 text-muted-foreground/50 transition-premium",
          isAnimating && "animate-pulse"
        )} />
      </Badge>
    </div>
  );
}
