'use client';

import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAssistantTriggerProps {
  onClick: () => void;
  className?: string;
}

export const AIAssistantTrigger = ({ onClick, className }: AIAssistantTriggerProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "h-14 w-14 rounded-full shadow-premium",
        "bg-gradient-to-br from-primary via-purple-500 to-accent",
        "hover:shadow-glow hover:scale-110 transition-premium",
        "animate-pulse-glow group",
        className
      )}
      size="icon"
    >
      <Bot className="h-6 w-6 text-white group-hover:animate-bounce" />
      <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-ping" />
      <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full" />
    </Button>
  );
};
