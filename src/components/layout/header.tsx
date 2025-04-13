'use client';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Moon, 
  Sun, 
  ChevronDown, 
  User, 
  LogOut, 
  Globe, 
  Settings 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { t, i18n: i18next } = useTranslation();
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
  
  // Initialize dark mode from system preference
  useEffect(() => {
    // Check if dark mode is set in localStorage or use system preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setDarkMode(isDarkMode);
    applyTheme(isDarkMode);
  }, []);
  
  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDark));
  };
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    applyTheme(newMode);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    clearUser(); // ✅ يمسح الجلسة من zustand
    router.push('/auth/login');
  };

  const languageLabel = {
    en: 'English',
    ar: 'العربية',
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-border/40 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 w-full transition-all duration-200 ease-in-out">
      <div className="flex items-center">
        <h1 className="font-bold text-lg tracking-tight text-foreground">
          <span className="text-primary">Infinity</span> AI System
        </h1>
      </div>
      <div className="flex gap-3 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="relative animate__animated animate__fadeIn h-9 w-9 rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
              {unreadNotifications}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="h-9 w-9 rounded-full"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <Sun className={cn("h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all", 
            darkMode ? "opacity-0" : "opacity-100")} />
          <Moon className={cn("absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all", 
            darkMode ? "rotate-0 scale-100 opacity-100" : "opacity-0")} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-2 flex items-center gap-1 text-sm" aria-label="Language selection">
              <Globe className="h-4 w-4 mr-1" />
              {languageLabel[i18next.language as 'en' | 'ar']}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('ar')} className="cursor-pointer">
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 flex items-center gap-2 px-2 rounded-full" aria-label="User menu">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium hidden md:inline-block">{user?.name}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('layout.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
