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
  BarChart2,
  MessageSquare,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Share2,
  Sparkles,
  Megaphone,
  Layers,
  Users,
  Building,
  Briefcase,
  ClipboardList,
  UserPlus,
  Bell,
  Target,
  Award,
  Gift,
  Eye,
  Settings2,
  UserCog,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/useUserStore';
import { useCompanyStore } from '@/store/useCompanyStore';

interface SidebarProps {
  className?: string;
  onStateChange?: (isCollapsed: boolean) => void;
}

export default function Sidebar({ className, onStateChange }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isRTL = i18n.dir() === 'rtl';
  const { user } = useUserStore();
  const { currentCompany } = useCompanyStore();
  
  // Check if user is an active affiliate
  const isActiveAffiliate = user?.affiliate && user?.affiliate.status === 'approved' && user?.affiliate.isActive;

  // Check if current device is mobile and handle responsive behavior
  useEffect(() => {
    setIsMounted(true);
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // Auto-collapse on mobile for better UX
      if (isMobileView) {
        setIsCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Apply RTL styling to document body when component mounts
  useEffect(() => {
    if (isRTL) {
      // Add a custom attribute to help style the layout correctly
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl-layout');
      
      // Add specific style for RTL layout to prevent content going under sidebar
      const sidebarWidth = isCollapsed ? '70px' : '260px';
      document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl-layout');
    }
    
    return () => {
      // Cleanup if component unmounts
      document.documentElement.style.removeProperty('--sidebar-width');
    };
  }, [isRTL, isCollapsed]);

  // Notify parent component when sidebar state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(isCollapsed);
    }
  }, [isCollapsed, onStateChange]);

  // CRM Navigation items
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
      title: t('sidebar.userManagement', 'User Management'),
      href: '/dashboard/users',
      icon: <Users className="h-4 w-4" />,
      isActive: pathname?.includes('/users'),
    },
    {
      title: t('sidebar.companyAgency', 'Company/Agency'),
      href: '/dashboard/company',
      icon: <Building className="h-4 w-4" />,
      isActive: pathname?.includes('/company') && !pathname?.includes('/settings') && !pathname?.includes('/members') && !pathname?.includes('/view'),
      submenu: currentCompany ? [
        {
          title: t('sidebar.companyView', 'View Company'),
          href: currentCompany.id ? `/dashboard/company/view/${currentCompany.id}` : '/dashboard/company',
          icon: <Eye className="h-4 w-4" />,
          isActive: pathname?.includes('/company/view'),
        },
        {
          title: t('sidebar.companyMembers', 'Company Members'),
          href: '/dashboard/company/members',
          icon: <UserCog className="h-4 w-4" />,
          isActive: pathname?.includes('/company/members'),
        },
        {
          title: t('sidebar.companySettings', 'Settings'),
          href: currentCompany.id ? `/dashboard/company/${currentCompany.id}/setting` : '/dashboard/company/settings',
          icon: <Settings2 className="h-4 w-4" />,
          isActive: pathname?.includes('/company/settings') || pathname?.includes('/company/') && pathname?.includes('/setting'),
        },
      ] : [],
    },
    {
      title: t('sidebar.clients', 'Client Management'),
      href: '/dashboard/clients',
      icon: <UserPlus className="h-4 w-4" />,
      isActive: pathname?.includes('/clients'),
    },
    {
      title: t('sidebar.projects', 'Projects & Sprints'),
      href: '/dashboard/projects',
      icon: <Briefcase className="h-4 w-4" />,
      isActive: pathname?.includes('/projects'),
    },
    {
      title: t('sidebar.tasks', 'Tasks'),
      href: '/dashboard/tasks',
      icon: <ClipboardList className="h-4 w-4" />,
      isActive: pathname?.includes('/tasks'),
    },
    {
      title: t('sidebar.leads', 'Lead Management'),
      href: '/dashboard/leads',
      icon: <Target className="h-4 w-4" />,
      isActive: pathname?.includes('/leads'),
    },
    {
      title: t('sidebar.leadActivities', 'Lead Activities'),
      href: '/dashboard/lead-activities',
      icon: <MessageSquare className="h-4 w-4" />,
      isActive: pathname?.includes('/lead-activities'),
    },
    {
      title: t('sidebar.reminders', 'Reminders'),
      href: '/dashboard/reminders',
      icon: <Bell className="h-4 w-4" />,
      isActive: pathname?.includes('/reminders'),
    },
    {
      title: t('sidebar.campaigns', 'Campaigns'),
      href: '/dashboard/campaigns',
      icon: <Megaphone className="h-4 w-4" />,
      isActive: pathname?.includes('/campaigns'),
    },
    {
      title: t('sidebar.posts', 'Posts'),
      href: '/dashboard/posts',
      icon: <Share2 className="h-4 w-4" />,
      isActive: pathname?.includes('/posts'),
    },
    {
      title: t('sidebar.aiTools', 'AI Tools'),
      href: '/dashboard/ai-tools',
      icon: <Sparkles className="h-4 w-4" />,
      isActive: pathname?.includes('/ai-tools') && !pathname?.includes('/ai-providers'),
      badge: 'New'
    },
    {
      title: t('sidebar.aiProviders', 'AI Providers'),
      href: '/dashboard/ai-providers',
      icon: <Cpu className="h-4 w-4" />,
      isActive: pathname?.includes('/ai-providers'),
       badge: 'New'
      // Only visible for admin or developer roles
      // hidden: user?.role !== 'admin' && user?.role !== 'developer' && user?.role !== 'owner',
    },
    {
      title: t('sidebar.rewards', 'Rewards'),
      href: '/dashboard/me/rewards/points',
      icon: <Gift className="h-4 w-4" />,
      isActive: pathname?.includes('/rewards'),
    },
    {
      title: t('sidebar.analytics', 'Analytics'),
      href: '/dashboard/analytics',
      icon: <BarChart2 className="h-4 w-4" />,
      isActive: pathname?.includes('/analytics'),
    },
    {
      title: t('sidebar.calendar', 'Calendar'),
      href: '/dashboard/calendar',
      icon: <Calendar className="h-4 w-4" />,
      isActive: pathname?.includes('/calendar'),
    },
  ];

  // Affiliate section item - only shown for active affiliates
  const affiliateItems = [
    {
      title: t('sidebar.affiliateCenter', 'Affiliate Center'),
      href: '/dashboard/me/affiliate',
      icon: <Award className="h-4 w-4" />,
      isActive: pathname?.includes('/affiliate'),
    }
  ];

  // Utility navigation items (bottom)
  const utilityNavItems = [
    {
      title: t('sidebar.settings', 'Settings'),
      href: '/dashboard/settings',
      icon: <Settings className="h-4 w-4" />,
      isActive: pathname?.includes('/settings'),
    },
    {
      title: t('sidebar.help', 'Help & Support'),
      href: '/dashboard/help',
      icon: <HelpCircle className="h-4 w-4" />,
      isActive: pathname?.includes('/help'),
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Don't render anything until mounted to prevent hydration errors
  if (!isMounted) return null;

  return (
    <>
      <aside 
        className={cn(
          "fixed z-30 flex flex-col transition-premium",
          "glass-card backdrop-blur-xl border-r border-border/50",
          "shadow-premium bg-background/80 dark:bg-background/90",
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
          "page-transition",
          className
        )}
        style={{
          // Force the correct position based on RTL
          [isRTL ? 'right' : 'left']: 0,
          [isRTL ? 'left' : 'right']: 'auto',
        }}
      >
        {/* Mobile Header - Only shown on mobile */}
        {isMobile && (
          <div className="flex h-16 md:h-20 items-center justify-between border-b border-border/20 px-4 bg-background/95 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-glow"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-foreground">
                  {currentCompany?.name || user?.name || 'Infinity AI'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {currentCompany ? 'Business Account' : 'Personal Account'}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-premium hover:scale-105"
              onClick={toggleSidebar}
              aria-label="Close menu"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Desktop Header Context - Hidden on mobile */}
        {!isMobile && (
          <div className="flex h-40 justify-between items-center border-b border-border/20 px-3">
          {isCollapsed ? (
            <div className="flex w-full justify-center">
              <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20 hover:border-primary/30 transition-premium hover:shadow-premium hover:scale-105">
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse-glow"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1 w-full">
              {currentCompany ? (
                <div className="glass-card p-3 rounded-lg border border-border/30">
                  <p className="text-xs font-medium text-muted-foreground/70 mb-1">Organization</p>
                  <h3 className="font-semibold text-sm text-foreground truncate">{currentCompany.name}</h3>
                  <p className="text-xs text-muted-foreground/60 truncate">
                    {currentCompany.description || 'Business Account'}
                  </p>
                </div>
              ) : (
                <div className="glass-card p-3 rounded-lg border border-border/30">
                  <p className="text-xs font-medium text-muted-foreground/70 mb-1">Welcome</p>
                  <h3 className="font-semibold text-sm text-foreground truncate">{user?.name}</h3>
                  <p className="text-xs text-muted-foreground/60 truncate">Personal Account</p>
                </div>
              )}
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-premium hover:scale-105 hover:shadow-glow",
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
        
        <div className={cn(
          "scrollable-y flex flex-col justify-between h-full",
          isMobile ? "py-4 px-4" : "py-4 px-3" // Increased padding on mobile
        )}>
          <nav className="space-y-2">
            {/* Section: Main */}
            <div className={cn(
              "mb-3 px-2 text-xs font-semibold text-muted-foreground/80 tracking-wide-text",
              isCollapsed ? "sr-only" : "flex"
            )}>
              {t('sidebar.main', 'Main')}
            </div>
            
            {/* Main nav items */}
            {navItems.slice(0, 2).map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 transition-premium relative",
                  "hover:bg-background/50 hover:shadow-sm",
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
                  "flex h-5 w-5 items-center justify-center transition-premium",
                  item.isActive ? "text-primary scale-110" : "text-muted-foreground/80 group-hover:text-foreground group-hover:scale-110"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-premium font-medium tracking-text",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {item.badge && !isCollapsed && (
                  <Badge variant="outline" className={cn(
                    "ml-auto bg-primary/10 text-primary border-primary/30 text-[10px] h-5 px-1.5 rounded-lg shadow-sm",
                    "rtl:ml-0 rtl:mr-auto",
                    "animate-fade-in"
                  )}>
                    {item.badge}
                  </Badge>
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-xl glass-card px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-premium transition-premium group-hover:opacity-100 whitespace-nowrap border border-white/10",
                    isRTL ? "right-16" : "left-16",
                    "animate-fade-in"
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

            {/* Section: Organization */}
            <div className={cn(
              "mt-6 mb-3 px-2 text-xs font-semibold text-muted-foreground/80 tracking-wide-text",
              isCollapsed ? "sr-only" : "flex"
            )}>
              {t('sidebar.organization', 'Organization')}
            </div>
            
            {/* Render Company/Agency with submenu if available */}
            {navItems.slice(2, 3).map((item, index) => (
              <div key={item.href} className="flex flex-col space-y-1">
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-3 transition-premium relative",
                    "hover:bg-background/50 hover:shadow-sm",
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
                    "flex h-5 w-5 items-center justify-center transition-premium",
                    item.isActive ? "text-primary scale-110" : "text-muted-foreground/80 group-hover:text-foreground group-hover:scale-110"
                  )}>
                    {item.icon}
                  </div>
                  
                  <span className={cn(
                    "text-sm transition-premium font-medium tracking-text",
                    isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                    isRTL && "mr-1"
                  )}>
                    {item.title}
                  </span>
                  
                  {item.badge && !isCollapsed && (
                    <Badge variant="outline" className={cn(
                      "ml-auto bg-primary/10 text-primary border-primary/30 text-[10px] h-5 px-1.5 rounded-lg shadow-sm",
                      "rtl:ml-0 rtl:mr-auto",
                      "animate-fade-in"
                    )}>
                      {item.badge}
                    </Badge>
                  )}
                  
                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <span className={cn(
                      "absolute z-50 rounded-xl glass-card px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-premium transition-premium group-hover:opacity-100 whitespace-nowrap border border-white/10",
                      isRTL ? "right-16" : "left-16",
                      "animate-fade-in"
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

                {/* Render submenu for Company */}
                {!isCollapsed && item.submenu && item.submenu.length > 0 && (
                  <div className="pl-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "group flex items-center gap-2 rounded-lg px-3 py-2 transition-premium relative text-sm",
                          "hover:bg-white/5 hover:shadow-glow hover:scale-[1.01]",
                          subItem.isActive 
                            ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-medium border border-primary/20" 
                            : "text-muted-foreground/70 hover:text-foreground"
                        )}
                        aria-label={subItem.title}
                      >
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center transition-premium",
                          subItem.isActive ? "text-primary scale-105" : "text-muted-foreground/70 group-hover:text-foreground group-hover:scale-105"
                        )}>
                          {subItem.icon}
                        </div>
                        <span className="tracking-text">{subItem.title}</span>
                        
                        {/* Active indicator for submenu */}
                        {subItem.isActive && (
                          <span className={cn(
                            "absolute inset-y-0 w-0.5 bg-gradient-to-b from-primary to-accent rounded-full opacity-70",
                            isRTL ? "right-0" : "left-0"
                          )} />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Other Organization items */}
            {navItems.slice(3, 6).map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 transition-premium relative",
                  "hover:bg-background/50 hover:shadow-sm",
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
                  "flex h-5 w-5 items-center justify-center transition-premium",
                  item.isActive ? "text-primary scale-110" : "text-muted-foreground/80 group-hover:text-foreground group-hover:scale-110"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-premium font-medium tracking-text",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {item.badge && !isCollapsed && (
                  <Badge variant="outline" className={cn(
                    "ml-auto bg-primary/10 text-primary border-primary/30 text-[10px] h-5 px-1.5 rounded-lg shadow-sm",
                    "rtl:ml-0 rtl:mr-auto",
                    "animate-fade-in"
                  )}>
                    {item.badge}
                  </Badge>
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-xl glass-card px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-premium transition-premium group-hover:opacity-100 whitespace-nowrap border border-white/10",
                    isRTL ? "right-16" : "left-16",
                    "animate-fade-in"
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

            {/* Section: Sales */}
            <div className={cn(
              "mt-6 mb-3 px-2 text-xs font-semibold text-muted-foreground/80 tracking-wide-text",
              isCollapsed ? "sr-only" : "flex"
            )}>
              {t('sidebar.sales', 'Sales')}
            </div>
            
            {navItems.slice(6, 9).map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 transition-premium relative",
                  "hover:bg-background/50 hover:shadow-sm",
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
                  "flex h-5 w-5 items-center justify-center transition-premium",
                  item.isActive ? "text-primary scale-110" : "text-muted-foreground/80 group-hover:text-foreground group-hover:scale-110"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-premium font-medium tracking-text",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {item.badge && !isCollapsed && (
                  <Badge variant="outline" className={cn(
                    "ml-auto bg-primary/10 text-primary border-primary/30 text-[10px] h-5 px-1.5 rounded-lg shadow-sm",
                    "rtl:ml-0 rtl:mr-auto",
                    "animate-fade-in"
                  )}>
                    {item.badge}
                  </Badge>
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-xl glass-card px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-premium transition-premium group-hover:opacity-100 whitespace-nowrap border border-white/10",
                    isRTL ? "right-16" : "left-16",
                    "animate-fade-in"
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
            
            {/* Section: Affiliate - Only shown for active affiliates */}
            {isActiveAffiliate && (
              <>
                <div className={cn(
                  "mt-6 mb-3 px-2 text-xs font-semibold text-muted-foreground/80 tracking-wide-text",
                  isCollapsed ? "sr-only" : "flex"
                )}>
                  {t('sidebar.affiliate', 'Affiliate')}
                </div>
                
                {affiliateItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-3 transition-premium relative",
                      "hover:bg-background/50 hover:shadow-sm",
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
                      "flex h-5 w-5 items-center justify-center transition-premium",
                      item.isActive ? "text-primary scale-110" : "text-muted-foreground/80 group-hover:text-foreground group-hover:scale-110"
                    )}>
                      {item.icon}
                    </div>
                    
                    <span className={cn(
                      "text-sm transition-premium font-medium tracking-text",
                      isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                      isRTL && "mr-1"
                    )}>
                      {item.title}
                    </span>
                    
                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && (
                      <span className={cn(
                        "absolute z-50 rounded-xl glass-card px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-premium transition-premium group-hover:opacity-100 whitespace-nowrap border border-white/10",
                        isRTL ? "right-16" : "left-16",
                        "animate-fade-in"
                      )}>
                        {item.title}
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
              </>
            )}

            {/* Section: Marketing */}
            <div className={cn(
              "mt-6 mb-3 px-2 text-xs font-semibold text-muted-foreground/80 tracking-wide-text",
              isCollapsed ? "sr-only" : "flex"
            )}>
              {t('sidebar.marketing', 'Marketing')}
            </div>
            
            {navItems.slice(9).filter(item => !item.hidden).map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 transition-premium relative",
                  "hover:bg-background/50 hover:shadow-sm",
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
                  "flex h-5 w-5 items-center justify-center transition-premium",
                  item.isActive ? "text-primary scale-110" : "text-muted-foreground/80 group-hover:text-foreground group-hover:scale-110"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-premium font-medium tracking-text",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {item.badge && !isCollapsed && (
                  <Badge variant="outline" className={cn(
                    "ml-auto bg-primary/10 text-primary border-primary/30 text-[10px] h-5 px-1.5 rounded-lg shadow-sm",
                    "rtl:ml-0 rtl:mr-auto",
                    "animate-fade-in"
                  )}>
                    {item.badge}
                  </Badge>
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-xl glass-card px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-premium transition-premium group-hover:opacity-100 whitespace-nowrap border border-white/10",
                    isRTL ? "right-16" : "left-16",
                    "animate-fade-in"
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
          
          <div className="mt-auto pt-4 space-y-2 border-t border-border/20">
            {utilityNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 transition-premium relative",
                  "hover:bg-background/50 hover:shadow-sm",
                  item.isActive 
                    ? "bg-primary/5 text-primary font-medium border-l-4 border-primary ml-0 pl-3" 
                    : "text-muted-foreground/80 hover:text-foreground border-l-4 border-transparent hover:border-muted/30",
                  isCollapsed ? "justify-center" : "",
                  isRTL && item.isActive ? "border-l-0 border-r-4 border-primary mr-0 pr-3" : "",
                  isRTL && !item.isActive ? "border-l-0 border-r-4 border-transparent hover:border-muted/30" : ""
                )}
                aria-label={item.title}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center transition-premium",
                  item.isActive ? "text-primary scale-110" : "text-muted-foreground/80 group-hover:text-foreground group-hover:scale-110"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-premium font-medium tracking-text",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-xl glass-card px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-premium transition-premium group-hover:opacity-100 whitespace-nowrap border border-white/10",
                    isRTL ? "right-16" : "left-16",
                    "animate-fade-in"
                  )}>
                    {item.title}
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
            
            <button 
              className={cn(
                "group flex w-full items-center gap-3 px-3 py-3 transition-premium relative",
                "text-muted-foreground/80 hover:bg-destructive/5 hover:text-destructive hover:shadow-sm",
                "border-l-4 border-transparent hover:border-destructive/30",
                isCollapsed ? "justify-center" : "",
                isRTL ? "border-l-0 border-r-4 border-transparent hover:border-destructive/30" : ""
              )}
              aria-label={t('sidebar.logout', 'Logout')}
            >
              <div className="flex h-5 w-5 items-center justify-center text-muted-foreground/80 group-hover:text-destructive transition-premium group-hover:scale-110">
                <LogOut className="h-4 w-4" />
              </div>
              <span className={cn(
                "text-sm transition-premium font-medium tracking-text",
                isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                isRTL && "mr-1"
              )}>
                {t('sidebar.logout', 'Logout')}
              </span>
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <span className={cn(
                  "absolute z-50 rounded-xl bg-destructive/10 text-destructive px-3 py-2 text-xs font-medium opacity-0 shadow-premium transition-premium group-hover:opacity-100 whitespace-nowrap border border-destructive/20",
                  isRTL ? "right-16" : "left-16",
                  "animate-fade-in"
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
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-md animate-fade-in" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Enhanced Mobile toggle button with better positioning and accessibility */}
      {isMobile && isCollapsed && (
        <button 
          className={cn(
            "fixed z-40 flex items-center justify-center rounded-xl",
            "bg-gradient-to-br from-primary to-accent text-white shadow-premium",
            "hover:shadow-glow hover:scale-105 transition-premium active:scale-95",
            "h-12 w-12 md:h-14 md:w-14", // Responsive sizing
            "bottom-6 md:bottom-8", // Responsive bottom positioning
            isRTL ? "left-auto right-4 md:right-6" : "left-4 md:left-6 right-auto", // Responsive side positioning
            "animate-fade-in-up",
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
