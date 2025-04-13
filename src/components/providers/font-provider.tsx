'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function FontProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  useEffect(() => {
    // Load Cairo font for Arabic language
    if (currentLanguage === 'ar') {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      link.id = 'cairo-font';
      document.head.appendChild(link);
      
      // Apply Cairo font to Arabic content
      document.documentElement.style.setProperty('--font-arabic', '"Cairo", sans-serif');
      document.documentElement.classList.add('arabic-font');
    } else {
      // Remove Cairo font if language is not Arabic
      const existingLink = document.getElementById('cairo-font');
      if (existingLink) {
        existingLink.remove();
      }
      document.documentElement.classList.remove('arabic-font');
    }
    
    return () => {
      const existingLink = document.getElementById('cairo-font');
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [currentLanguage]);

  return <>{children}</>;
}