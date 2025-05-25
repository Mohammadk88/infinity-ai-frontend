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
  FileText,
  MessageSquare,
  LaptopIcon,
  ImageIcon
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

type PromptType = 'text' | 'image' | 'social';

const Header = () => {
  useSessionLoader();
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileSearchVisible, setMobileSearchVisible] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [promptGeneratorOpen, setPromptGeneratorOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { clearUser } = useUserStore();
  const [activePromptMode, setActivePromptMode] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [, setGeneratedResult] = useState<string | null>(null);
  const [promptType, setPromptType] = useState<PromptType>('text');
  const [miniPromptValue, setMiniPromptValue] = useState<string>('');

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

  const togglePromptGenerator = () => {
    setPromptGeneratorOpen(!promptGeneratorOpen);
  };

  const handleMiniPromptSubmit = async () => {
    if (!miniPromptValue.trim() || isGenerating) return;

    try {
      setPromptGeneratorOpen(false);
      setActivePromptMode(true);
      setIsGenerating(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let mockResponse = '';
      
      switch (promptType) {
        case 'text':
          mockResponse = `Generated marketing text for: "${miniPromptValue}".\n\nThis is a sample text content from the Infinity AI System optimized for marketing copy.`;
          break;
        case 'image':
          mockResponse = `Generated image content for: "${miniPromptValue}".\n\nThis is a placeholder for image generation. In a production environment, this would generate an image based on your description.`;
          break;
        case 'social':
          mockResponse = `Generated social media post for: "${miniPromptValue}".\n\nThis is a sample social media content from the Infinity AI System optimized for engagement and reach.`;
          break;
        default:
          mockResponse = `Generated content for: "${miniPromptValue}".\n\nThis is a sample response from the Infinity AI System based on your prompt.`;
      }
      
      setGeneratedResult(mockResponse);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedResult('Error generating content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  

  const handlePromptTypeChange = (type: PromptType) => {
    setPromptType(type);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-premium",
      "glass-blur border-b border-white/8 backdrop-blur-xl",
      "shadow-premium page-transition"
    )}>
      <div className="mx-auto max-w-[calc(100%-1rem)] lg:max-w-[calc(100%-2rem)]">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left section */}
          <div className="flex items-center gap-6">
            <CompanySwitcher />
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-4 hover:opacity-90 transition-premium group">
                <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20 group-hover:border-primary/30 transition-premium group-hover:shadow-premium">
                  <Sparkles className="h-5 w-5 text-primary group-hover:scale-110 transition-premium" />
                  <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-glow"></div>
                </div>
                <div className="hidden md:block">
                  <h1 className="font-manrope font-bold text-lg tracking-heading text-foreground">
                    <span className="gradient-text">
                      Infinity
                    </span>
                    <span className="ml-1.5 text-muted-foreground/80">AI</span>
                  </h1>
                  <p className="text-xs text-muted-foreground/60 tracking-wide-text font-medium -mt-0.5">Intelligence Platform</p>
                </div>
              </Link>
            </div>
          </div>
        
        <div className="flex-1 flex items-center justify-center max-w-md mx-6">
          <div className={cn(
            "relative transition-all duration-300 ease-in-out w-full",
            mobileSearchVisible ? "flex animate-in fade-in-0 slide-in-from-top-2 duration-300" : "hidden md:flex"
          )}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-center">
                <div className={cn(
                  "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-300",
                  searchFocused ? "text-primary" : "text-muted-foreground/60"
                )}>
                  <Search className="w-4 h-4" />
                </div>
                
                <input 
                  ref={searchInputRef}
                  type="search" 
                  placeholder={searchFocused ? t('header.search', 'Search files, actions, or tools...') : t('header.searchShort', 'Search...')} 
                  className={cn(
                    "w-full h-9 pl-10 pr-4 text-sm rounded-xl border",
                    "bg-background/50 backdrop-blur-sm transition-all duration-300",
                    searchFocused 
                      ? "border-primary/50 ring-2 ring-primary/20 shadow-lg bg-background/80" 
                      : "border-border/30 hover:border-border/50 hover:bg-background/70",
                    "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
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
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
                    onClick={handleClearSearch}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors duration-200"
            onClick={toggleMobileSearch}
          >
            {mobileSearchVisible ? (
              <X className="h-4 w-4" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>

          {/* AI Provider Badge */}
          <AIProviderBadge />
        
          {/* AI Prompt Generator */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-300",
              "hover:bg-primary/10 hover:scale-105",
              "text-primary/80 hover:text-primary",
              (activePromptMode || promptGeneratorOpen) && "bg-primary/10 shadow-sm"
            )}
            onClick={togglePromptGenerator}
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <NotificationCenter />
          
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-all duration-300 hover:scale-105"
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

          {/* Language Selector */}
          <LanguageSelector variant="minimal" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 flex items-center gap-2 px-2 rounded-lg hover:bg-primary/10 transition-all duration-300 hover:shadow-sm" 
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium hidden md:inline-block max-w-[80px] truncate">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50" />
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

        {/* Prompt Generator Dropdown */}
        {promptGeneratorOpen && (
          <div className="absolute top-14 right-4 mt-2 z-40 w-72 md:w-80 animate-in fade-in-0 slide-in-from-top-4 duration-300">
            <div className="glass-card rounded-xl shadow-premium border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  {t('header.quickPrompt', 'Quick AI Prompt')}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-lg hover:bg-white/10"
                  onClick={() => setPromptGeneratorOpen(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder={t('header.promptPlaceholder', 'Enter your prompt here...')}
                  className="w-full text-sm p-3 border border-white/10 rounded-xl bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                  value={miniPromptValue}
                  onChange={(e) => setMiniPromptValue(e.target.value)}
                  autoFocus
                />
                
                <div className="flex gap-2 overflow-x-auto py-1">
                  <Button 
                    size="sm" 
                    variant={promptType === 'text' ? 'default' : 'outline'} 
                    className={cn(
                      "text-xs h-7 whitespace-nowrap rounded-lg",
                      promptType === 'text' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-primary/10"
                    )}
                    onClick={() => handlePromptTypeChange('text')}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Text
                  </Button>
                  <Button 
                    size="sm" 
                    variant={promptType === 'image' ? 'default' : 'outline'} 
                    className={cn(
                      "text-xs h-7 whitespace-nowrap rounded-lg",
                      promptType === 'image' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-primary/10"
                    )}
                    onClick={() => handlePromptTypeChange('image')}
                  >
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Image
                  </Button>
                  <Button 
                    size="sm" 
                    variant={promptType === 'social' ? 'default' : 'outline'} 
                    className={cn(
                      "text-xs h-7 whitespace-nowrap rounded-lg",
                      promptType === 'social' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-primary/10"
                    )}
                    onClick={() => handlePromptTypeChange('social')}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Social
                  </Button>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full h-8 bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 transition-all duration-200 rounded-lg shadow-sm"
                  onClick={handleMiniPromptSubmit}
                  disabled={!miniPromptValue.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-2">
                        <div className="h-1 w-1 rounded-full bg-white/80 animate-pulse"></div>
                        <div className="h-1 w-1 rounded-full bg-white/80 animate-pulse [animation-delay:0.2s]"></div>
                        <div className="h-1 w-1 rounded-full bg-white/80 animate-pulse [animation-delay:0.4s]"></div>
                      </div>
                      {t('header.generating', 'Generating...')}
                    </div>
                  ) : (
                    t('header.generate', 'Generate')
                  )}
                </Button>
                
                <div className="text-xs text-muted-foreground/60 text-center">
                  {t('header.promptHelp', 'Opens full generator for more options')}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </header>
  );
}

export default Header;

