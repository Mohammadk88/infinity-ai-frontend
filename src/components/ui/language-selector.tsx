'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageOption {
  code: string;
  name: string;
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
  
  // Update state when language changes externally
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    // Store language preference
    localStorage.setItem('i18nextLng', langCode);
  };

  if (variant === 'full') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Globe className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-2">
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
    <div className={cn("flex items-center gap-2 rounded-md border border-border/40 bg-card/50 p-1 backdrop-blur-sm", className)}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={cn(
            "px-2 py-1 rounded-sm text-xs transition-colors",
            currentLang === lang.code 
              ? "font-medium text-foreground bg-background/40" 
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={`Switch language to ${lang.name}`}
        >
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}