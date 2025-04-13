'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  GlobeLock, 
  MessageSquare, 
  Calendar, 
  Settings,
  ChevronRight,
  Menu,
  X,
  SparklesIcon,
  UsersIcon,
  BarChart3,
  CreditCard
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { 
      href: '/dashboard', 
      label: t('layout.dashboard'), 
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    { 
      href: '/dashboard/social-accounts', 
      label: t('layout.socialAccounts'), 
      icon: <GlobeLock className="h-4 w-4" />
    },
    { 
      href: '/dashboard/posts', 
      label: t('layout.posts'), 
      icon: <MessageSquare className="h-4 w-4" />
    },
    { 
      href: '/dashboard/campaigns', 
      label: t('layout.campaigns'), 
      icon: <Calendar className="h-4 w-4" />
    },
    { 
      href: '/dashboard/ai-tools', 
      label: t('layout.aiTools'), 
      icon: <SparklesIcon className="h-4 w-4" />
    },
    { 
      href: '/dashboard/clients', 
      label: t('layout.clients'), 
      icon: <UsersIcon className="h-4 w-4" />
    },
    { 
      href: '/dashboard/analytics', 
      label: t('layout.analytics'), 
      icon: <BarChart3 className="h-4 w-4" />
    },
    { 
      href: '/dashboard/payments', 
      label: t('layout.payments'), 
      icon: <CreditCard className="h-4 w-4" />
    },
    { 
      href: '/dashboard/settings', 
      label: t('layout.settings'), 
      icon: <Settings className="h-4 w-4" />
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="fixed z-50 top-3 left-3 md:hidden h-9 w-9"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside 
        className={cn(
          "h-screen bg-background border-r border-border/40 transition-all duration-300 ease-in-out flex flex-col z-50",
          collapsed ? "w-[70px]" : "w-64",
          mobileOpen ? "fixed left-0 top-0" : "fixed -left-full top-0 md:left-0 md:static"
        )}
      >
        <div className={cn(
          "flex items-center h-16 border-b border-border/40 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center">
              <span className="text-primary font-bold text-xl">Infinity</span>
              <span className="font-medium ml-1">AI</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-full hidden md:flex"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              collapsed ? "" : "rotate-180"
            )} />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-auto py-4 px-2">
          <div className="space-y-1">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                >
                  <div
                    className={cn(
                      "group flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                      collapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <div className={cn("mr-2", collapsed && "mr-0")}>
                      {link.icon}
                    </div>
                    {!collapsed && <span>{link.label}</span>}
                    {collapsed && (
                      <div className="absolute left-full ml-2 rounded bg-background px-2 py-1 text-xs opacity-0 shadow-md transition-opacity group-hover:opacity-100 border border-border/40 whitespace-nowrap z-50">
                        {link.label}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
        
        {!collapsed && (
          <div className="border-t border-border/40 p-4 mt-auto">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-3 text-sm">
              <div className="flex items-center mb-2">
                <SparklesIcon className="h-4 w-4 text-primary mr-2" />
                <span className="font-semibold">{t('layout.proTip')}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t('layout.aiTip')}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
