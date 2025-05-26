'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/axios';
import { useTheme } from '@/components/providers/theme-provider';
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
  Moon, 
  Sun, 
  ChevronDown, 
  User, 
  LogOut, 
  Settings,
  Search,
  X,
  Sparkles,
  LaptopIcon,
  Bot
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import NotificationCenter from '@/components/features/notification-center';
import { useSessionLoader } from '@/hooks/useSessionLoader';
import { useUserStore } from '@/store/useUserStore';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useAuth } from '@/hooks/useAuth';
import { CompanySwitcher } from "@/components/features/company-switcher";
import AIProviderBadge from '@/components/layout/ai-provider-badge';
import AIAssistantPanel from '@/components/features/ai-assistant-panel';

const Header = () => {
  useSessionLoader();
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileSearchVisible, setMobileSearchVisible] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { clearUser } = useUserStore();

  const {loading, user} = useAuth(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, router, user]);
  if (!mounted) return null


  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); // فرضًا عندك endpoint لهذا
      clearUser(); // تنظيف الواجهة من بيانات المستخدم
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const toggleMobileSearch = () => {
    setMobileSearchVisible(!mobileSearchVisible);
    if (!mobileSearchVisible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (!searchValue) {
      setSearchFocused(false);
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      setSearchValue('');
      searchInputRef.current.focus();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchValue);
  };

  const toggleAIAssistant = () => {
    setAiAssistantOpen(!aiAssistantOpen);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-premium",
      "glass-card backdrop-blur-xl border-b border-border/50",
      "shadow-premium bg-background/90 dark:bg-background/95",
      "h-16 md:h-20" // Responsive height
    )}>
      <div className="w-full h-full">
        <div className="flex h-full items-center justify-between px-3 md:px-4 lg:px-6">
          {/* Left section - Mobile optimized */}
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex md:hidden">
              <CompanySwitcher />
            </div>
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2 md:gap-4 hover:opacity-90 transition-premium group">
                <div className="relative flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20 group-hover:border-primary/30 transition-premium group-hover:shadow-premium">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary group-hover:scale-110 transition-premium" />
                  <div className="absolute -top-1 -right-1 h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-glow"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-manrope font-bold text-base md:text-lg tracking-heading text-foreground">
                    <span className="gradient-text">
                      Infinity
                    </span>
                    <span className="ml-1 md:ml-1.5 text-muted-foreground/80">AI</span>
                  </h1>
                  <p className="text-xs text-muted-foreground/60 tracking-wide-text font-medium -mt-0.5">Intelligence Platform</p>
                </div>
              </Link>
            </div>
            <div className="hidden md:flex">
              <CompanySwitcher />
            </div>
          </div>
        
        {/* Search section - Mobile optimized */}
        <div className="flex-1 flex items-center justify-center max-w-xs md:max-w-md mx-2 md:mx-6">
          <div className={cn(
            "relative transition-premium w-full",
            mobileSearchVisible ? "flex animate-in fade-in-0 slide-in-from-top-2 duration-300" : "hidden md:flex"
          )}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-center">
                <div className={cn(
                  "absolute inset-y-0 left-0 flex items-center pl-2 md:pl-3 pointer-events-none transition-colors duration-300",
                  searchFocused ? "text-primary" : "text-muted-foreground/60"
                )}>
                  <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                
                <input 
                  ref={searchInputRef}
                  type="search" 
                  placeholder={searchFocused ? t('header.search', 'Search files, actions, or tools...') : t('header.searchShort', 'Search...')} 
                  className={cn(
                    "w-full h-8 md:h-9 pl-8 md:pl-10 pr-3 md:pr-4 text-sm rounded-lg md:rounded-xl border",
                    "bg-background/50 backdrop-blur-sm transition-premium",
                    searchFocused 
                      ? "border-primary/50 ring-1 md:ring-2 ring-primary/20 shadow-sm md:shadow-lg bg-background/80" 
                      : "border-border/30 hover:border-border/50 hover:bg-background/70",
                    "focus:outline-none focus:border-primary/50 focus:ring-1 md:focus:ring-2 focus:ring-primary/20",
                    "placeholder:text-muted-foreground/60"
                  )}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onChange={handleSearchInput}
                  value={searchValue}
                />
                
                {searchValue && (
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-3 text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
                    onClick={handleClearSearch}
                  >
                    <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* Right section - Mobile optimized */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 rounded-lg hover:bg-primary/10 transition-premium"
            onClick={toggleMobileSearch}
          >
            {mobileSearchVisible ? (
              <X className="h-4 w-4" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>

          {/* AI Provider Badge - Hide on small mobile */}
          <div className="hidden sm:block">
            <AIProviderBadge className="scale-90 md:scale-100" />
          </div>
        
          {/* AI Assistant Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg transition-premium",
              "hover:bg-primary/10 hover:scale-105",
              "text-primary/80 hover:text-primary",
              aiAssistantOpen && "bg-primary/10 shadow-sm"
            )}
            onClick={toggleAIAssistant}
          >
            <Bot className="h-6 w-6 text-white group-hover:animate-bounce" />

            {/* <Sparkles className="h-4 w-4" /> */}
          </Button>

          {/* Notifications */}
          <NotificationCenter />
          
          {/* Theme Toggle - Hide on mobile */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-premium hover:scale-105"
                >
                  {theme === 'dark' && <Moon className="h-4 w-4" />}
                  {theme === 'light' && <Sun className="h-4 w-4" />}
                  {theme === 'system' && <LaptopIcon className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>{t('theme.light', 'Light')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>{t('theme.dark', 'Dark')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                  <LaptopIcon className="mr-2 h-4 w-4" />
                  <span>{t('theme.system', 'System')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Language Selector - Hide on mobile */}
          <div className="hidden md:block">
            <LanguageSelector variant="minimal" />
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 flex items-center gap-1 md:gap-2 px-1 md:px-2 rounded-lg hover:bg-primary/10 transition-premium hover:shadow-sm" 
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium hidden lg:inline-block max-w-[80px] truncate">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/me')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              {/* Mobile only options */}
              <div className="sm:hidden">
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer">
                  {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  <span>{theme === 'dark' ? t('theme.light', 'Light') : t('theme.dark', 'Dark')}</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('layout.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* AI Assistant Panel positioned outside header */}
        <AIAssistantPanel 
          externalOpen={aiAssistantOpen} 
          onExternalOpenChange={setAiAssistantOpen}
          showTrigger={false}
        />
        </div>
      </div>
    </header>
  );
}

export default Header;

