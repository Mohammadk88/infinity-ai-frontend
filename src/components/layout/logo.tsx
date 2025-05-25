'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: { icon: 'h-8 w-8', text: 'text-base', subtitle: 'text-[9px]' },
    md: { icon: 'h-10 w-10', text: 'text-lg', subtitle: 'text-[10px]' },
    lg: { icon: 'h-12 w-12', text: 'text-xl', subtitle: 'text-xs' }
  };

  // Initial loading animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Link href="/dashboard">
      <div 
        className={cn(
          "flex items-center gap-3 transition-premium hover-scale", 
          className,
          isHovered ? "scale-105" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={cn(
            "relative flex items-center justify-center rounded-xl bg-premium-gradient shadow-premium transition-premium",
            sizeConfig[size].icon,
            isHovered && "shadow-premium-lg glow-primary",
            isAnimating && "page-transition stagger-1"
          )}
        >
          {/* Premium glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-xl bg-premium-gradient opacity-0 blur-xl transition-premium",
            isHovered && "opacity-40"
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
            "absolute inset-2 rounded-lg border border-white/15 opacity-0 transition-premium",
            isHovered && "opacity-100"
          )}>
            <div className="absolute top-1 left-1 w-1 h-1 bg-white/70 rounded-full float-subtle" />
            <div className="absolute top-1 right-1 w-1 h-1 bg-white/70 rounded-full float-subtle stagger-2" />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/70 rounded-full float-subtle stagger-3" />
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/70 rounded-full float-subtle stagger-4" />
            <div className="absolute top-2 left-1/2 w-0.5 h-0.5 bg-white/50 rounded-full transform -translate-x-1/2 float-subtle stagger-5" />
            <div className="absolute bottom-2 left-1/2 w-0.5 h-0.5 bg-white/50 rounded-full transform -translate-x-1/2 float-subtle" />
          </div>
          
          {/* Logo icon - Premium SVG or fallback */}
          <div className={cn(
            "relative z-10 text-white transition-premium", 
            isHovered ? "scale-110" : "scale-100",
            isLoaded && isHovered && "animate-pulse-glow"
          )}>
            {isLoaded ? (
              <Image
                src="/infinityai-logo-premium.svg"
                alt="Infinity AI"
                width={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
                height={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
                className="drop-shadow-sm"
              />
            ) : (
              <Brain className={cn(
                size === 'sm' ? "h-4 w-4" : size === 'md' ? "h-5 w-5" : "h-6 w-6"
              )} />
            )}
          </div>
        </div>

        {showText && (
          <div className="flex flex-col">
            <span className={cn(
              "font-bold leading-none tracking-heading text-foreground transition-premium",
              sizeConfig[size].text,
              isAnimating && "page-transition stagger-2",
            )}>
              <span className="gradient-text">
                Infinity
              </span>
              <span className={cn(
                "ml-1 text-muted-foreground/80",
                isHovered && "text-primary/80"
              )}>
                AI
              </span>
            </span>
            <span className={cn(
              "text-muted-foreground/60 tracking-wide-text font-medium transition-premium",
              sizeConfig[size].subtitle,
              isAnimating && "page-transition stagger-3",
              isHovered && "text-muted-foreground/80"
            )}>
              Intelligence Platform
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}