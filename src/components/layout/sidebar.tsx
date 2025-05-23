'use client';

import { useState, useEffect } from 'react';
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
import Logo from '@/components/layout/logo';
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

  // Check if current device is mobile
  useEffect(() => {
    setIsMounted(true);
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
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
  const navItems = [
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
          "fixed top-0 z-30 flex h-screen flex-col border-r bg-background/70 backdrop-blur-xl transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[260px]",
          isMobile && isCollapsed ? "translate-x-[-100%]" : "translate-x-0",
          isRTL ? "right-0 border-l border-r-0" : "left-0",
          isRTL && isMobile && isCollapsed ? "translate-x-[100%]" : "",
          "animate__animated animate__fadeIn animate__faster",
          className
        )}
        style={{
          // Force the correct position based on RTL
          [isRTL ? 'right' : 'left']: 0,
          [isRTL ? 'left' : 'right']: 'auto',
        }}
      >
        <div className="flex h-16 items-center border-b px-3">
          <Link 
            href="/dashboard" 
            className={cn(
              "flex items-center transition-all duration-300 hover:opacity-80",
              isCollapsed ? "justify-center w-full" : "overflow-hidden w-[180px]"
            )}
          >
            <div className={cn(
              "relative flex items-center justify-center transition-all duration-300",
              isCollapsed ? "w-9 h-9" : "w-[180px]"
            )}>
              {isCollapsed ? (
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              ) : (
                <Logo />
              )}
            </div>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary animate__animated animate__fadeIn",
              !isCollapsed && (isRTL ? "mr-auto" : "ml-auto"),
              "hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
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
        
        <div className="scrollable-y flex flex-col justify-between py-3 px-2 h-full">
          <nav className="space-y-1.5">
            {/* Section: Main */}
            <div className={cn(
              "mb-2 px-3 text-xs font-semibold text-muted-foreground",
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
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all relative",
                  item.isActive 
                    ? "bg-primary/10 text-primary font-medium animate__animated animate__pulse animate__faster" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isCollapsed ? "justify-center" : "",
                )}
                style={{ 
                  animationDelay: `${index * 50}ms`
                }}
                aria-label={item.title}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center transition-colors",
                  item.isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  item.isActive && "animate__animated animate__tada"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-all duration-300",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {item.badge && !isCollapsed && (
                  <Badge variant="outline" className={cn(
                    "ml-auto bg-primary/10 text-primary border-primary/20 text-[10px] h-5 px-1.5",
                    "rtl:ml-0 rtl:mr-auto",
                    "animate__animated animate__fadeInDown animate__faster"
                  )}>
                    {item.badge}
                  </Badge>
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-md bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap border",
                    isRTL ? "right-14" : "left-14",
                    "animate__animated animate__fadeIn animate__faster"
                  )}>
                    {item.title}
                    {item.badge && (
                      <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-1.5 text-[9px]">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
                
                {/* Active indicator */}
                {item.isActive && (
                  <span className={cn(
                    "absolute inset-y-0 w-0.5 bg-primary rounded-full",
                    isRTL ? "right-0" : "left-0"
                  )} />
                )}
              </Link>
            ))}

            {/* Section: Organization */}
            <div className={cn(
              "mt-6 mb-2 px-3 text-xs font-semibold text-muted-foreground",
              isCollapsed ? "sr-only" : "flex"
            )}>
              {t('sidebar.organization', 'Organization')}
            </div>
            
            {/* Render Company/Agency with submenu if available */}
            {navItems.slice(2, 3).map((item, index) => (
              <div key={item.href} className="flex flex-col">
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all relative",
                    item.isActive 
                      ? "bg-primary/10 text-primary font-medium animate__animated animate__pulse animate__faster" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    isCollapsed ? "justify-center" : "",
                  )}
                  style={{ 
                    animationDelay: `${index * 50}ms`
                  }}
                  aria-label={item.title}
                >
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center transition-colors",
                    item.isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    item.isActive && "animate__animated animate__tada"
                  )}>
                    {item.icon}
                  </div>
                  
                  <span className={cn(
                    "text-sm transition-all duration-300",
                    isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                    isRTL && "mr-1"
                  )}>
                    {item.title}
                  </span>
                  
                  {item.badge && !isCollapsed && (
                    <Badge variant="outline" className={cn(
                      "ml-auto bg-primary/10 text-primary border-primary/20 text-[10px] h-5 px-1.5",
                      "rtl:ml-0 rtl:mr-auto",
                      "animate__animated animate__fadeInDown animate__faster"
                    )}>
                      {item.badge}
                    </Badge>
                  )}
                  
                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <span className={cn(
                      "absolute z-50 rounded-md bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap border",
                      isRTL ? "right-14" : "left-14",
                      "animate__animated animate__fadeIn animate__faster"
                    )}>
                      {item.title}
                      {item.badge && (
                        <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-1.5 text-[9px]">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {item.isActive && (
                    <span className={cn(
                      "absolute inset-y-0 w-0.5 bg-primary rounded-full",
                      isRTL ? "right-0" : "left-0"
                    )} />
                  )}
                </Link>

                {/* Render submenu for Company */}
                {!isCollapsed && item.submenu && item.submenu.length > 0 && (
                  <div className="pl-6 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "group flex items-center gap-2 rounded-md px-3 py-2 transition-all relative text-sm",
                          subItem.isActive 
                            ? "bg-primary/5 text-primary font-medium" 
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                        aria-label={subItem.title}
                      >
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center transition-colors",
                          subItem.isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {subItem.icon}
                        </div>
                        <span>{subItem.title}</span>
                        
                        {/* Active indicator for submenu */}
                        {subItem.isActive && (
                          <span className={cn(
                            "absolute inset-y-0 w-0.5 bg-primary rounded-full opacity-70",
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
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all relative",
                  item.isActive 
                    ? "bg-primary/10 text-primary font-medium animate__animated animate__pulse animate__faster" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isCollapsed ? "justify-center" : "",
                )}
                style={{ 
                  animationDelay: `${index * 50}ms`
                }}
                aria-label={item.title}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center transition-colors",
                  item.isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  item.isActive && "animate__animated animate__tada"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-all duration-300",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {item.badge && !isCollapsed && (
                  <Badge variant="outline" className={cn(
                    "ml-auto bg-primary/10 text-primary border-primary/20 text-[10px] h-5 px-1.5",
                    "rtl:ml-0 rtl:mr-auto",
                    "animate__animated animate__fadeInDown animate__faster"
                  )}>
                    {item.badge}
                  </Badge>
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-md bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap border",
                    isRTL ? "right-14" : "left-14",
                    "animate__animated animate__fadeIn animate__faster"
                  )}>
                    {item.title}
                    {item.badge && (
                      <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-1.5 text-[9px]">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
                
                {/* Active indicator */}
                {item.isActive && (
                  <span className={cn(
                    "absolute inset-y-0 w-0.5 bg-primary rounded-full",
                    isRTL ? "right-0" : "left-0"
                  )} />
                )}
              </Link>
            ))}

            {/* Section: Sales */}
            <div className={cn(
              "mt-6 mb-2 px-3 text-xs font-semibold text-muted-foreground",
              isCollapsed ? "sr-only" : "flex"
            )}>
              {t('sidebar.sales', 'Sales')}
            </div>
            
            {navItems.slice(6, 9).map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all relative",
                  item.isActive 
                    ? "bg-primary/10 text-primary font-medium animate__animated animate__pulse animate__faster" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isCollapsed ? "justify-center" : "",
                )}
                style={{ 
                  animationDelay: `${index * 50}ms`
                }}
                aria-label={item.title}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center transition-colors",
                  item.isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  item.isActive && "animate__animated animate__tada"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-all duration-300",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {item.badge && !isCollapsed && (
                  <Badge variant="outline" className={cn(
                    "ml-auto bg-primary/10 text-primary border-primary/20 text-[10px] h-5 px-1.5",
                    "rtl:ml-0 rtl:mr-auto",
                    "animate__animated animate__fadeInDown animate__faster"
                  )}>
                    {item.badge}
                  </Badge>
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-md bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap border",
                    isRTL ? "right-14" : "left-14",
                    "animate__animated animate__fadeIn animate__faster"
                  )}>
                    {item.title}
                    {item.badge && (
                      <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-1.5 text-[9px]">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
                
                {/* Active indicator */}
                {item.isActive && (
                  <span className={cn(
                    "absolute inset-y-0 w-0.5 bg-primary rounded-full",
                    isRTL ? "right-0" : "left-0"
                  )} />
                )}
              </Link>
            ))}
            
            {/* Section: Affiliate - Only shown for active affiliates */}
            {isActiveAffiliate && (
              <>
                <div className={cn(
                  "mt-6 mb-2 px-3 text-xs font-semibold text-muted-foreground",
                  isCollapsed ? "sr-only" : "flex"
                )}>
                  {t('sidebar.affiliate', 'Affiliate')}
                </div>
                
                {affiliateItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all relative",
                      item.isActive 
                        ? "bg-primary/10 text-primary font-medium animate__animated animate__pulse animate__faster" 
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      isCollapsed ? "justify-center" : "",
                    )}
                    style={{ 
                      animationDelay: `${index * 50}ms`
                    }}
                    aria-label={item.title}
                  >
                    <div className={cn(
                      "flex h-5 w-5 items-center justify-center transition-colors",
                      item.isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      item.isActive && "animate__animated animate__tada"
                    )}>
                      {item.icon}
                    </div>
                    
                    <span className={cn(
                      "text-sm transition-all duration-300",
                      isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                      isRTL && "mr-1"
                    )}>
                      {item.title}
                    </span>
                    
                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && (
                      <span className={cn(
                        "absolute z-50 rounded-md bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap border",
                        isRTL ? "right-14" : "left-14",
                        "animate__animated animate__fadeIn animate__faster"
                      )}>
                        {item.title}
                      </span>
                    )}
                    
                    {/* Active indicator */}
                    {item.isActive && (
                      <span className={cn(
                        "absolute inset-y-0 w-0.5 bg-primary rounded-full",
                        isRTL ? "right-0" : "left-0"
                      )} />
                    )}
                  </Link>
                ))}
              </>
            )}

            {/* Section: Marketing */}
            <div className={cn(
              "mt-6 mb-2 px-3 text-xs font-semibold text-muted-foreground",
              isCollapsed ? "sr-only" : "flex"
            )}>
              {t('sidebar.marketing', 'Marketing')}
            </div>
            
            {navItems.slice(9).filter(item => !item.hidden).map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all relative",
                  item.isActive 
                    ? "bg-primary/10 text-primary font-medium animate__animated animate__pulse animate__faster" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isCollapsed ? "justify-center" : "",
                )}
                style={{ 
                  animationDelay: `${index * 50}ms`
                }}
                aria-label={item.title}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center transition-colors",
                  item.isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  item.isActive && "animate__animated animate__tada"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-all duration-300",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {item.badge && !isCollapsed && (
                  <Badge variant="outline" className={cn(
                    "ml-auto bg-primary/10 text-primary border-primary/20 text-[10px] h-5 px-1.5",
                    "rtl:ml-0 rtl:mr-auto",
                    "animate__animated animate__fadeInDown animate__faster"
                  )}>
                    {item.badge}
                  </Badge>
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-md bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap border",
                    isRTL ? "right-14" : "left-14",
                    "animate__animated animate__fadeIn animate__faster"
                  )}>
                    {item.title}
                    {item.badge && (
                      <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-1.5 text-[9px]">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
                
                {/* Active indicator */}
                {item.isActive && (
                  <span className={cn(
                    "absolute inset-y-0 w-0.5 bg-primary rounded-full",
                    isRTL ? "right-0" : "left-0"
                  )} />
                )}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-3 space-y-1.5 border-t">
            {utilityNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all relative",
                  item.isActive ? "bg-accent/60 text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isCollapsed ? "justify-center" : "",
                )}
                aria-label={item.title}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center",
                  item.isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.icon}
                </div>
                
                <span className={cn(
                  "text-sm transition-all duration-300",
                  isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                  isRTL && "mr-1"
                )}>
                  {item.title}
                </span>
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <span className={cn(
                    "absolute z-50 rounded-md bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap border",
                    isRTL ? "right-14" : "left-14",
                    "animate__animated animate__fadeIn animate__faster"
                  )}>
                    {item.title}
                  </span>
                )}
              </Link>
            ))}
            
            <button 
              className={cn(
                "group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive relative",
                isCollapsed ? "justify-center" : "",
              )}
              aria-label={t('sidebar.logout', 'Logout')}
            >
              <div className="flex h-5 w-5 items-center justify-center text-muted-foreground group-hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </div>
              <span className={cn(
                "text-sm transition-all duration-300",
                isCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100",
                isRTL && "mr-1"
              )}>
                {t('sidebar.logout', 'Logout')}
              </span>
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <span className={cn(
                  "absolute z-50 rounded-md bg-destructive/10 text-destructive px-2.5 py-1.5 text-xs font-medium opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap border border-destructive/10",
                  isRTL ? "right-14" : "left-14",
                  "animate__animated animate__fadeIn animate__faster"
                )}>
                  {t('sidebar.logout', 'Logout')}
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm animate__animated animate__fadeIn animate__faster" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile toggle button */}
      {isMobile && isCollapsed && (
        <button 
          className={cn(
            "fixed bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform hover:scale-105",
            isRTL ? "left-auto right-6" : "left-6 right-auto",
            "animate__animated animate__fadeInUp animate__faster"
          )}
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Layers className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
