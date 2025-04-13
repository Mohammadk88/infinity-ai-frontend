'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrainCircuit, Infinity } from 'lucide-react';
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
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Link href="/dashboard">
      <div 
        className={cn(
          "flex items-center gap-1.5", 
          className,
          isHovered ? "scale-105" : "",
          "transition-all duration-300"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600",
            isHovered && "animate__animated animate__pulse",
            isAnimating && "animate__animated animate__fadeIn"
          )}
        >
          {/* Logo glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 opacity-75 blur-sm",
            isHovered && "opacity-100 animate__animated animate__pulse"
          )} />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className={cn(
              "h-full w-full bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_100%] bg-[-100%_0]",
              isHovered && "animate-shimmer"
            )} />
          </div>
          
          {/* Neural network lines */}
          <div className={cn(
            "absolute inset-0 rounded-lg overflow-hidden opacity-20",
            isHovered && "opacity-40 transition-opacity duration-300"
          )}>
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
            <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full" />
            <div className="absolute bottom-1 right-2 w-1 h-1 bg-white rounded-full" />
            <div className="absolute bottom-2 left-1 w-1 h-1 bg-white rounded-full" />
            <div className="absolute top-1.5 right-1 w-[2px] h-[2px] bg-white rounded-full" />
            <div className="absolute inset-[3px] border-[0.5px] border-white/30 rounded-md" />
            <div className="absolute h-[1px] w-4 bg-white/60 rotate-45 top-[45%] left-[25%]" />
            <div className="absolute h-[1px] w-4 bg-white/60 rotate-[135deg] top-[45%] left-[25%]" />
          </div>
          
          {/* Logo icon */}
          <div className={cn(
            "relative z-10 text-white transition-all duration-300", 
            isHovered ? "scale-110" : "scale-100",
            isLoaded && isHovered && "animate__animated animate__heartBeat"
          )}>
            {isLoaded ? (
              <Infinity className="h-4 w-4" />
            ) : (
              <BrainCircuit className="h-4 w-4" />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <span className={cn(
            "font-semibold leading-none tracking-tight",
            isAnimating && "animate__animated animate__fadeInRight animate__faster",
          )}>
            Infinity<span className={cn(
              "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600",
              isHovered && "animate__animated animate__flash animate__faster"
            )}>AI</span>
          </span>
          <span className={cn(
            "text-[9px] text-muted-foreground/80 tracking-tight",
            isAnimating && "animate__animated animate__fadeInRight animate__delay-1s",
          )}>
            Marketing Platform
          </span>
        </div>
      </div>
    </Link>
  );
}