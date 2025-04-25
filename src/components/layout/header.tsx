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
  Menu,
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
import Image from 'next/image';

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
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "shadow-sm animate__animated animate__fadeIn animate__faster"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <CompanySwitcher />
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
              <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                {/* Use a fallback icon since logo.svg might not exist */}
                <Sparkles className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
              </div>
              <h1 className="font-bold text-lg tracking-tight text-foreground hidden md:block">
                <span className="text-primary bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Infinity</span> AI System
              </h1>
            </Link>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center max-w-2xl mx-4">
          <div className={cn(
            "relative transition-all duration-300 ease-in-out",
            mobileSearchVisible ? "flex w-full animate__animated animate__fadeIn" : "hidden md:flex md:w-auto"
          )}>
            <form onSubmit={handleSearchSubmit} className={cn("w-full", !searchFocused && "md:w-44")}>
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
                  placeholder={searchFocused ? t('header.search', 'Search files, actions, or tools...') : t('header.searchShort', 'Search...')} 
                  className={cn(
                    "py-2 pl-10 pr-4 text-sm bg-muted/50 border rounded-lg outline-none",
                    "transition-all duration-300 ease-in-out",
                    searchFocused 
                      ? "border-primary ring-1 ring-primary/30 shadow-sm w-full md:w-[400px]" 
                      : "border-border/30 hover:border-border/70 w-full md:w-[200px]",
                    "focus:border-primary",
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
        </div>
        
        <div className="flex items-center gap-2">
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
                className="h-9 w-9 rounded-full transition-transform hover:scale-105 focus-visible:ring-1 focus-visible:ring-primary"
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

          <LanguageSelector variant="minimal" />

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
                  className="h-6 w-6 p-0 rounded-full hover:bg-muted"
                  onClick={() => setPromptGeneratorOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div>
                <input
                  type="text"
                  placeholder={t('header.promptPlaceholder', 'Enter your prompt here...')}
                  className="w-full text-sm p-2 border rounded bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
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
                    <ImageIcon className="h-3 w-3 mr-1" />
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
      </div>
    </header>
  );
}

export default Header;

