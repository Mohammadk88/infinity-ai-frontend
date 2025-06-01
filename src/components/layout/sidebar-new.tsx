'use client';

import { useState, useEffect, JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  LogOut,
  Share2,
  Sparkles,
  Layers,
  Bell,
  Award,
  Gift,
  Clock,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/useUserStore';

interface SidebarProps {
  className?: string;
  onStateChange?: (isCollapsed: boolean) => void;
  mobileSidebarToggle?: number; // Counter to trigger mobile sidebar toggle
}

export default function Sidebar({ className, onStateChange, mobileSidebarToggle }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isRTL = i18n.dir() === 'rtl';
  const { user } = useUserStore();
  
  // Check if user is an active affiliate
  const isActiveAffiliate = user?.affiliate && user?.affiliate.status === 'approved' && user?.affiliate.isActive;

  // Handle mobile sidebar toggle from parent
  useEffect(() => {
    if (mobileSidebarToggle && mobileSidebarToggle > 0 && isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  }, [mobileSidebarToggle, isMobile, isCollapsed]);

  // Check if current device is mobile and handle responsive behavior
  useEffect(() => {
    setIsMounted(true);
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      const wasMobile = isMobile;
      setIsMobile(isMobileView);
      
      // Auto-collapse on mobile for better UX
      if (isMobileView && !wasMobile) {
        setIsCollapsed(true);
      }
      // Auto-expand when switching from mobile to desktop if sidebar was collapsed only due to mobile
      else if (!isMobileView && wasMobile && isCollapsed) {
        setIsCollapsed(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [isMobile, isCollapsed]);

  // Apply RTL styling to document body when component mounts
  useEffect(() => {
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl-layout');
      
      const sidebarWidth = isCollapsed ? '70px' : '260px';
      document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl-layout');
    }
    
    return () => {
      document.documentElement.style.removeProperty('--sidebar-width');
    };
  }, [isRTL, isCollapsed]);

  // Notify parent component when sidebar state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(isCollapsed);
    }
  }, [isCollapsed, onStateChange]);

  // MVP Navigation items - Only essential features
  type NavItem = {
    title: string;
    href: string;
    icon: JSX.Element;
    isActive: boolean;
    submenu?: {
      title: string;
      href: string;
      icon: JSX.Element;
      isActive: boolean;
    }[];
    badge?: string;
    hidden?: boolean;
  };

  const navItems: NavItem[] = [
    {
      title: t('sidebar.dashboard', 'Dashboard'),
      href: '/dashboard',
      icon: <Home className="h-4 w-4" />,
      isActive: pathname === '/dashboard',
    },
    {
      title: t('sidebar.posts', 'Posts'),
      href: '/dashboard/posts',
      icon: <Share2 className="h-4 w-4" />,
      isActive: pathname?.includes('/posts'),
    },
    {
      title: t('sidebar.socialAccounts', 'Social Accounts'),
      href: '/dashboard/social-accounts',
      icon: <Globe className="h-4 w-4" />,
      isActive: pathname?.includes('/social-accounts'),
    },
    {
      title: t('sidebar.aiGenerator', 'AI Content Generator'),
      href: '/dashboard/ai-tools',
      icon: <Sparkles className="h-4 w-4" />,
      isActive: pathname?.includes('/ai-tools') && !pathname?.includes('/ai-providers'),
      badge: 'New'
    },
    {
      title: t('sidebar.scheduler', 'Scheduler'),
      href: '/dashboard/scheduler',
      icon: <Clock className="h-4 w-4" />,
      isActive: pathname?.includes('/scheduler'),
    },
    {
      title: t('sidebar.rewards', 'Points & Rewards'),
      href: '/dashboard/points',
      icon: <Gift className="h-4 w-4" />,
      isActive: pathname?.includes('/points') || pathname?.includes('/rewards'),
    },
    {
      title: t('sidebar.notifications', 'Notifications'),
      href: '/dashboard/notifications',
      icon: <Bell className="h-4 w-4" />,
      isActive: pathname?.includes('/notifications'),
    },
  ];

  // Add referrals for active affiliates
  if (isActiveAffiliate) {
    navItems.push({
      title: t('sidebar.referrals', 'Referrals'),
      href: '/dashboard/referrals',
      icon: <Award className="h-4 w-4" />,
      isActive: pathname?.includes('/referrals'),
    });
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Don't render anything until mounted to prevent hydration errors
  if (!isMounted) return null;

  return (
    <>
      <aside 
        className={cn(
          "fixed flex flex-col transition-all duration-300 ease-in-out",
          "glass-card backdrop-blur-xl border-r border-border/50",
          "shadow-premium bg-background/80 dark:bg-background/90",
          // Z-index: Higher on mobile for overlay, standard on desktop
          isMobile ? "z-50" : "z-30",
          // Mobile: Full height with responsive positioning
          isMobile 
            ? "top-0 h-screen w-[280px] md:w-[260px]" 
            : "top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]",
          // Width and collapse behavior
          !isMobile && (isCollapsed ? "w-[70px]" : "w-[260px]"),
          // Transform for mobile overlay
          isMobile && isCollapsed ? "translate-x-[-100%]" : "translate-x-0",
          // RTL support
          isRTL ? "right-0 border-l border-r-0" : "left-0",
          isRTL && isMobile && isCollapsed ? "translate-x-[100%]" : "",
          className
        )}
      >
        {/* Mobile Header - Only shown on mobile */}
        {isMobile && (
          <div className="flex h-16 md:h-20 items-center justify-between border-b border-border/20 px-4 bg-background/95 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-foreground">
                  {user?.name || 'Infinity AI'}
                </span>
                <span className="text-xs text-muted-foreground">
                  Personal Account
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
              onClick={toggleSidebar}
              aria-label="Close menu"
            >
              {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
        )}

        {/* Desktop Header Context - Hidden on mobile */}
        {!isMobile && (
          <div className="flex h-16 justify-between items-center border-b border-border/20 px-3">
          {isCollapsed ? (
            <div className="flex w-full justify-center">
              <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20 hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:scale-105">
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1 w-full">
              <div className="glass-card p-3 rounded-lg border border-border/30">
                <p className="text-xs font-medium text-muted-foreground/70 mb-1">Welcome</p>
                <h3 className="font-semibold text-sm text-foreground truncate">{user?.name || 'User'}</h3>
                <p className="text-xs text-muted-foreground/60 truncate">Personal Account</p>
              </div>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 hover:shadow-md",
              !isCollapsed && (isRTL ? "mr-auto ml-2" : "ml-2"),
              isCollapsed && "mt-2",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
            )}
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={isCollapsed ? "false" : "true"}
          >
            {isCollapsed ? (
              isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        )}
        
        {/* Navigation Content */}
        <div className={cn(
          "flex-1 flex flex-col justify-between overflow-y-auto",
          isMobile ? "py-4 px-4" : "py-4 px-3"
        )}>
          {/* Main Navigation */}
          <nav className={cn(
            "space-y-1",
            isMobile && "space-y-2"
          )}>
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 transition-all duration-200 relative rounded-lg",
                  "hover:bg-background/50 hover:shadow-sm active:scale-[0.98]",
                  // Mobile-optimized padding and spacing
                  isMobile ? "px-4 py-4 min-h-[48px]" : "px-3 py-3",
                  item.isActive 
                    ? "bg-primary/5 text-primary font-medium border-l-4 border-primary ml-0 pl-3" 
                    : "text-muted-foreground/80 hover:text-foreground border-l-4 border-transparent hover:border-muted/30",
                  isCollapsed ? "justify-center" : "",
                  isRTL && item.isActive ? "border-l-0 border-r-4 border-primary mr-0 pr-3" : "",
                  isRTL && !item.isActive ? "border-l-0 border-r-4 border-transparent hover:border-muted/30" : ""
                )}
                style={{ 
                  animationDelay: `${index * 50}ms`
                }}
                aria-label={item.title}
              >
                <div className={cn(
                  "flex items-center justify-center transition-all duration-200",
                  // Mobile-optimized icon sizing
                  isMobile ? "h-6 w-6" : "h-5 w-5",
                  item.isActive ? "text-primary scale-110" : "text-muted-foreground/80 group-hover:text-foreground group-hover:scale-110"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-all duration-200 font-medium",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {item.badge && !isCollapsed && (
                  <Badge variant="outline" className={cn(
                    "ml-auto bg-primary/10 text-primary border-primary/30 text-[10px] h-5 px-1.5 rounded-lg shadow-sm",
                    "rtl:ml-0 rtl:mr-auto",
                    "animate-in fade-in duration-300"
                  )}>
                    {item.badge}
                  </Badge>
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-xl glass-card px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 whitespace-nowrap border border-white/10",
                    isRTL ? "right-16" : "left-16",
                    "animate-in fade-in slide-in-from-left-2 duration-200"
                  )}>
                    {item.title}
                    {item.badge && (
                      <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/20 text-primary px-1.5 text-[9px]">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
                
                {/* Active indicator */}
                {item.isActive && (
                  <span className={cn(
                    "absolute inset-y-0 w-1 bg-gradient-to-b from-primary to-accent rounded-full",
                    isRTL ? "right-0" : "left-0"
                  )} />
                )}
              </Link>
            ))}
          </nav>
          
          {/* Bottom Section - Logout */}
          <div className="mt-auto pt-4 space-y-2 border-t border-border/20">
            <button 
              className={cn(
                "group flex w-full items-center gap-3 px-3 py-3 transition-all duration-200 relative",
                "text-muted-foreground/80 hover:bg-destructive/5 hover:text-destructive hover:shadow-sm",
                "border-l-4 border-transparent hover:border-destructive/30 rounded-lg",
                isCollapsed ? "justify-center" : "",
                isRTL ? "border-l-0 border-r-4 border-transparent hover:border-destructive/30" : ""
              )}
              aria-label={t('sidebar.logout', 'Logout')}
            >
              <div className="flex h-5 w-5 items-center justify-center text-muted-foreground/80 group-hover:text-destructive transition-all duration-200 group-hover:scale-110">
                <LogOut className="h-4 w-4" />
              </div>
              <span className={cn(
                "text-sm transition-all duration-200 font-medium",
                isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                isRTL && "mr-1"
              )}>
                {t('sidebar.logout', 'Logout')}
              </span>
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <span className={cn(
                  "absolute z-50 rounded-xl bg-destructive/10 text-destructive px-3 py-2 text-xs font-medium opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 whitespace-nowrap border border-destructive/20",
                  isRTL ? "right-16" : "left-16",
                  "animate-in fade-in slide-in-from-left-2 duration-200"
                )}>
                  {t('sidebar.logout', 'Logout')}
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Enhanced Mobile overlay with better backdrop */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Enhanced Mobile toggle button with better positioning and accessibility */}
      {isMobile && isCollapsed && (
        <button 
          className={cn(
            "fixed z-60 flex items-center justify-center rounded-xl",
            "bg-gradient-to-br from-primary to-accent text-white shadow-lg",
            "hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95",
            "h-12 w-12 md:h-14 md:w-14",
            "bottom-6 md:bottom-8",
            isRTL ? "left-auto right-4 md:right-6" : "left-4 md:left-6 right-auto",
            "animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
          )}
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          aria-expanded="false"
        >
          <Layers className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}
    </>
  );
}
