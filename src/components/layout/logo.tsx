'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Infinity, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial loading animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setIsLoaded(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Link href="/dashboard">
      <div 
        className={cn(
          "flex items-center gap-3 transition-premium", 
          className,
          isHovered ? "scale-105" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-xl bg-premium-gradient shadow-premium transition-premium",
            isHovered && "shadow-premium-lg rotate-3",
            isAnimating && "animate-fade-in-up"
          )}
        >
          {/* Premium glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-xl bg-premium-gradient opacity-0 blur-xl transition-premium",
            isHovered && "opacity-30"
          )} />
          
          {/* AI shimmer effect */}
          <div className={cn(
            "absolute inset-0 rounded-xl overflow-hidden",
            isHovered && "ai-shimmer"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          
          {/* Neural network pattern */}
          <div className={cn(
            "absolute inset-2 rounded-lg border border-white/20 opacity-0 transition-premium",
            isHovered && "opacity-100"
          )}>
            <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full" />
            <div className="absolute top-1 right-1 w-1 h-1 bg-white/60 rounded-full" />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/60 rounded-full" />
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/60 rounded-full" />
            <div className="absolute top-2 left-1/2 w-0.5 h-0.5 bg-white/40 rounded-full transform -translate-x-1/2" />
            <div className="absolute bottom-2 left-1/2 w-0.5 h-0.5 bg-white/40 rounded-full transform -translate-x-1/2" />
          </div>
          
          {/* Logo icon */}
          <div className={cn(
            "relative z-10 text-white transition-premium", 
            isHovered ? "scale-110" : "scale-100",
            isLoaded && isHovered && "animate-pulse"
          )}>
            {isLoaded ? (
              <Infinity className="h-5 w-5" />
            ) : (
              <Brain className="h-5 w-5" />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <span className={cn(
            "text-lg font-bold leading-none tracking-heading text-foreground",
            isAnimating && "animate-fade-in-right",
          )}>
            Infinity
            <span className={cn(
              "bg-premium-gradient bg-clip-text text-transparent ml-0.5",
              isHovered && "animate-pulse"
            )}>
              AI
            </span>
          </span>
          <span className={cn(
            "text-[10px] text-muted-foreground/70 tracking-wide-text font-medium",
            isAnimating && "animate-fade-in-right",
          )}>
            Intelligence Platform
          </span>
        </div>
      </div>
    </Link>
  );
}