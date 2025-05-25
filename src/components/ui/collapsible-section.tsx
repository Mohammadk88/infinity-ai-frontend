'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  isCollapsed?: boolean;
  icon?: React.ReactNode;
  count?: number;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  isCollapsed = false,
  icon,
  count
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (isCollapsed) {
    return (
      <div className="space-y-1">
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full justify-start px-2 py-2 h-auto text-xs font-semibold",
          "text-muted-foreground/80 hover:text-foreground hover:bg-background/30",
          "transition-premium group"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            {icon && <div className="h-3 w-3">{icon}</div>}
            <span className="tracking-wide uppercase">{title}</span>
            {count !== undefined && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {count}
              </span>
            )}
          </div>
          <div className={cn(
            "transition-transform duration-200",
            isExpanded ? "rotate-0" : "-rotate-90"
          )}>
            <ChevronDown className="h-3 w-3" />
          </div>
        </div>
      </Button>
      
      <div className={cn(
        "space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
};
