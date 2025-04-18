'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isRTL } from '@/i18n/config';
import { motion } from 'framer-motion';

interface LanguageOption {
  code: string;
  name: string;
  rtl?: boolean;
  flag?: string;
}

interface LanguageSelectorProps {
  variant?: 'minimal' | 'full';
  className?: string;
}

export function LanguageSelector({ 
  variant = 'minimal',
  className 
}: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Combine hover and focus states
  useEffect(() => {
    setIsExpanded(isHovered || isFocused);
  }, [isHovered, isFocused]);
  
  // Update state when language changes externally
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL(currentLang) ? 'rtl' : 'ltr';
  }, [currentLang]);

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية', rtl: true },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ru', name: 'Русский' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fa', name: 'فارسی', rtl: true },
    { code: 'ur', name: 'اردو', rtl: true }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    // Store language preference
    localStorage.setItem('i18nextLng', langCode);
    // Update document direction
    document.documentElement.dir = isRTL(langCode) ? 'rtl' : 'ltr';
    // Hide the language options after selection
    setIsHovered(false);
    setIsFocused(false);
  };

  if (variant === 'full') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Globe className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="ghost"
              size="sm"
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "h-8 px-3 text-xs",
                currentLang === lang.code 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {lang.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Current language display */}
      <button
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/40 bg-card/50 backdrop-blur-sm text-sm font-medium",
          "hover:bg-background/60 hover:shadow-sm transition-all duration-200 ease-in-out",
          isExpanded && "rounded-b-none border-b-transparent shadow-sm bg-background/70"
        )}
        aria-label="Language selector"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <span className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-primary/80" />
          <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
        </span>
        <ChevronDown className={cn(
          "h-3 w-3 text-muted-foreground transition-transform duration-300",
          isExpanded && "rotate-180 text-foreground"
        )} />
      </button>

      {/* Dropdown for all languages */}
      <div 
        className={cn(
          "absolute left-0 top-full w-[180px] rounded-md rounded-t-none border border-border/40 border-t-0",
          "bg-background/95 backdrop-blur-md shadow-lg",
          "flex flex-col items-start py-1 z-50 overflow-hidden",
          "origin-top transition-all duration-200 ease-in-out",
          isExpanded ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
        )}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "px-3 py-2 text-sm w-full text-left transition-all group",
              "flex items-center justify-between",
              currentLang === lang.code 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            aria-label={`Switch language to ${lang.name}`}
          >
            <span className="flex items-center gap-2">
              {currentLang === lang.code && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
              <span className={currentLang === lang.code ? "" : "ml-5"}>
                {lang.name}
              </span>
            </span>
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded transition-colors",
              currentLang === lang.code
                ? "bg-primary/20 text-primary"
                : "bg-muted-foreground/10 text-muted-foreground group-hover:bg-muted-foreground/20"
            )}>
              {lang.code.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}