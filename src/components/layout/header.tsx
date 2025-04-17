'use client';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useRouter } from 'next/navigation';
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
  Globe, 
  Settings,
  Search,
  Menu,
  X,
  Sparkles,
  FileText,
  Image,
  MessageSquare,
  LaptopIcon
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import NotificationCenter from '@/components/features/notification-center';
import { useSessionLoader } from '@/hooks/useSessionLoader';
import { useAuth } from '@/hooks/useAuth';

type PromptType = 'text' | 'image' | 'social';

export default function Header() {
  useSessionLoader(); 
  const { t, i18n: i18next } = useTranslation();
  const router = useRouter();
  // const { user, clearUser } = useUserStore();
  const { theme, setTheme } = useTheme();
  const [scrolled] = useState<boolean>(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [promptGeneratorOpen, setPromptGeneratorOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [activePromptMode, setActivePromptMode] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [, setGeneratedResult] = useState<string | null>(null);
  // const [setCopySuccess] = useState<boolean>(false);
  // const activePromptRef = useRef<HTMLInputElement>(null);
  const [promptType, setPromptType] = useState<PromptType>('text');
  const [miniPromptValue, setMiniPromptValue] = useState<string>('');
  // const [unreadNotifications, setUnreadN otifications] = useState<number>(3);

  const {loading, user} = useAuth();
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

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    clearUser();
    router.push('/auth/login');
  };

  const languageLabel = {
    en: 'English',
    ar: 'العربية',
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

  // Removed unused function

  const handleMiniPromptSubmit = async () => {
    if (!miniPromptValue.trim() || isGenerating) return;

    try {
      setPromptGeneratorOpen(false);
      setActivePromptMode(true);
      // setActivePromptValue(miniPromptValue);
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
    <header 
      className={cn(
        "h-16 px-4 md:px-6 flex items-center justify-between border-b sticky top-0 z-30 w-full",
        scrolled 
          ? "border-border/40 bg-background/95 backdrop-blur-md shadow-sm" 
          : "border-transparent bg-background/90 backdrop-blur-sm",
        "transition-all duration-200 ease-in-out"
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-9 w-9"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 className="font-bold text-lg tracking-tight text-foreground hidden md:block">
          <span className="text-primary">Infinity</span> AI System
        </h1>
        
        <div className={cn(
          "relative md:flex-1 max-w-md transition-all duration-300 ease-in-out",
          mobileSearchVisible ? "flex w-full animate__animated animate__fadeIn" : "hidden md:flex"
        )}>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative flex items-center w-full">
              <div className={cn(
                "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-300",
                searchFocused ? "text-primary" : "text-muted-foreground",
                "rtl:left-auto rtl:right-0"
              )}>
                <Search className="w-4 h-4" />
              </div>
              
              <input 
                ref={searchInputRef}
                type="search" 
                placeholder={t('header.search', 'Search...')} 
                className={cn(
                  "py-2 pl-10 pr-4 text-sm bg-muted/50 border rounded-lg outline-none",
                  "transition-all duration-300 ease-in-out",
                  searchFocused 
                    ? "w-full border-primary ring-1 ring-primary/30 shadow-sm" 
                    : "w-[180px] md:w-[220px] border-border/30 hover:border-border/70",
                  "focus:border-primary lg:focus:w-full",
                  "rtl:pl-4 rtl:pr-10",
                  searchFocused && "animate__animated animate__pulse animate__faster"
                )}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onChange={handleSearchInput}
                value={searchValue}
                aria-label="Search"
              />
              
              {searchValue && (
                <button 
                  type="button"
                  className={cn(
                    "absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-opacity",
                    "rtl:left-0 rtl:right-auto rtl:pl-3 rtl:pr-0",
                    "animate__animated animate__fadeIn animate__faster"
                  )}
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
          onClick={toggleMobileSearch}
          aria-label="Toggle search"
        >
          {mobileSearchVisible ? (
            <X className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Search className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full transition-transform hover:scale-105",
            "text-primary hover:text-primary hover:bg-primary/10",
            (activePromptMode || promptGeneratorOpen) && "bg-primary/10"
          )}
          aria-label={t('header.promptGenerator', 'AI Prompt Generator')}
          onClick={togglePromptGenerator}
        >
          <Sparkles className="h-[1.2rem] w-[1.2rem]" />
        </Button>

        <NotificationCenter />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full transition-transform hover:scale-105"
              aria-label="Theme options"
            >
              {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
              {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
              {theme === 'system' && <LaptopIcon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="animate__animated animate__fadeInDown animate__faster">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="px-2 flex items-center gap-1 text-sm h-9 hover:bg-primary/5 transition-colors" 
              aria-label="Language selection"
            >
              <Globe className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
              <span className="hidden sm:inline-block">{languageLabel[i18next.language as 'en' | 'ar']}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 animate__animated animate__fadeInDown animate__faster">
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
            <Button 
              variant="ghost" 
              className="relative h-9 flex items-center gap-2 px-2 rounded-full hover:bg-primary/5 transition-all hover:shadow-sm" 
              aria-label="User menu"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium hidden md:inline-block max-w-[100px] truncate">
                {user?.name || <span className="opacity-50">User</span> || 'User'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1 animate__animated animate__fadeIn animate__faster">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/me')} className="cursor-pointer transition-colors hover:bg-accent/70">
              <User className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-accent/70">
              <Settings className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              <span>{t('layout.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {promptGeneratorOpen && (
        <div className="absolute top-16 right-4 mt-2 z-40 w-72 md:w-80 animate__animated animate__fadeInDown animate__faster">
          <div className="bg-background rounded-lg shadow-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                {t('header.quickPrompt', 'Quick AI Prompt')}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setPromptGeneratorOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div>
              <input
                type="text"
                placeholder={t('header.promptPlaceholder', 'Enter your prompt here...')}
                className="w-full text-sm p-2 border rounded bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary/30"
                value={miniPromptValue}
                onChange={(e) => setMiniPromptValue(e.target.value)}
                autoFocus
              />
              <div className="flex gap-1 mt-2 overflow-x-auto py-1 px-0.5 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                <Button 
                  size="sm" 
                  variant={promptType === 'text' ? 'default' : 'outline'} 
                  className={cn(
                    "text-xs h-6 whitespace-nowrap",
                    promptType === 'text' ? "bg-primary text-primary-foreground" : ""
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
                    "text-xs h-6 whitespace-nowrap",
                    promptType === 'image' ? "bg-primary text-primary-foreground" : ""
                  )}
                  onClick={() => handlePromptTypeChange('image')}
                >
                  <Image className="h-3 w-3 mr-1" alt="Image generation" />
                  Image
                </Button>
                <Button 
                  size="sm" 
                  variant={promptType === 'social' ? 'default' : 'outline'} 
                  className={cn(
                    "text-xs h-6 whitespace-nowrap",
                    promptType === 'social' ? "bg-primary text-primary-foreground" : ""
                  )}
                  onClick={() => handlePromptTypeChange('social')}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Social
                </Button>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2 h-7 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                onClick={handleMiniPromptSubmit}
                disabled={!miniPromptValue.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-ping mr-1"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-ping mr-1 animation-delay-200"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-ping mr-1 animation-delay-400"></span>
                      {t('header.generating', 'Generating...')}
                    </span>
                  </>
                ) : (
                  <>
                    {t('header.generate', 'Generate')}
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground/70 text-center mt-2">
              {t('header.promptHelp', 'Opens full generator for more options')}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
function clearUser() {
  throw new Error('Function not implemented.');
}

