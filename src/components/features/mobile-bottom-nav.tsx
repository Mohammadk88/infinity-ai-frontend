'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Home,
  BarChart2,
  MessageSquare,
  Settings,
  Plus,
  Users,
  Sparkles,
  Bell,
  Menu,
  X,
  Layers,
  Target,
  Calendar,
  Megaphone,
  TrendingUp
} from 'lucide-react';

interface MobileNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  isActive: boolean;
}

interface FloatingAction {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface MobileBottomNavProps {
  className?: string;
  onToggleSidebar?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  className,
  onToggleSidebar
}) => {
  const pathname = usePathname();
  const [showFAB, setShowFAB] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Quick actions for the floating action button
  const floatingActions: FloatingAction[] = [
    {
      title: 'New Campaign',
      icon: <Megaphone className="h-5 w-5" />,
      onClick: () => console.log('New Campaign'),
      color: 'bg-primary'
    },
    {
      title: 'Add Lead',
      icon: <Target className="h-5 w-5" />,
      onClick: () => console.log('Add Lead'),
      color: 'bg-green-500'
    },
    {
      title: 'Schedule Meeting',
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => console.log('Schedule Meeting'),
      color: 'bg-blue-500'
    },
    {
      title: 'Create Task',
      icon: <Plus className="h-5 w-5" />,
      onClick: () => console.log('Create Task'),
      color: 'bg-orange-500'
    }
  ];

  // Main navigation items for bottom bar
  const mainNavItems: MobileNavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      isActive: pathname === '/dashboard'
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart2 className="h-5 w-5" />,
      isActive: pathname?.includes('/analytics')
    },
    {
      title: 'AI Tools',
      href: '/dashboard/ai-tools',
      icon: <Sparkles className="h-5 w-5" />,
      badge: 2,
      isActive: pathname?.includes('/ai-tools')
    },
    {
      title: 'Activity',
      href: '/dashboard/lead-activities',
      icon: <MessageSquare className="h-5 w-5" />,
      isActive: pathname?.includes('/activities')
    },
    {
      title: 'Menu',
      href: '#',
      icon: <Menu className="h-5 w-5" />,
      isActive: false
    }
  ];

  // Auto-hide FAB on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      
      setShowFAB(!isScrollingDown || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40",
          "glass-card backdrop-blur-xl border-t border-border/50",
          "bg-background/95 shadow-premium",
          "safe-area-inset-bottom",
          className
        )}
      >
        <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
          {mainNavItems.map((item, index) => (
            <div key={item.href} className="relative">
              {item.title === 'Menu' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMenuClick}
                  className={cn(
                    "flex flex-col items-center space-y-1 px-3 py-2 h-auto",
                    "hover:bg-primary/10 hover:text-primary transition-premium",
                    "rounded-xl min-w-[60px]"
                  )}
                >
                  <div className="relative">
                    {item.icon}
                    {unreadNotifications > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs rounded-full animate-pulse"
                      >
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.title}</span>
                </Button>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex flex-col items-center space-y-1 px-3 py-2 h-auto",
                      "hover:bg-primary/10 hover:text-primary transition-premium",
                      "rounded-xl min-w-[60px]",
                      item.isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <div className="relative">
                      {item.icon}
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-primary text-primary-foreground rounded-full"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-medium">{item.title}</span>
                    {item.isActive && (
                      <motion.div
                        layoutId="mobile-active-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                      />
                    )}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </motion.nav>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showFAB && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="fixed bottom-20 right-4 z-50"
          >
            <div className="relative">
              <Button
                className={cn(
                  "h-14 w-14 rounded-full shadow-premium",
                  "bg-gradient-to-r from-primary to-accent text-white",
                  "hover:shadow-glow hover:scale-110 transition-premium",
                  "border-2 border-white/20"
                )}
                onClick={() => setShowFAB(false)}
              >
                <TrendingUp className="h-6 w-6" />
              </Button>

              {/* Quick Action Items */}
              <AnimatePresence>
                <div className="absolute bottom-16 right-0 space-y-2">
                  {floatingActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ scale: 0, x: 50, opacity: 0 }}
                      animate={{ scale: 1, x: 0, opacity: 1 }}
                      exit={{ scale: 0, x: 50, opacity: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring", 
                        damping: 20, 
                        stiffness: 300 
                      }}
                      className="flex items-center space-x-2"
                    >
                      <div className="glass-card px-3 py-2 rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm">
                        <span className="text-sm font-medium text-foreground whitespace-nowrap">
                          {action.title}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={action.onClick}
                        className={cn(
                          "h-10 w-10 rounded-full shadow-lg",
                          action.color || "bg-primary",
                          "hover:scale-110 transition-premium text-white"
                        )}
                      >
                        {action.icon}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB when collapsed */}
      <AnimatePresence>
        {!showFAB && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-20 right-4 z-50"
          >
            <Button
              className={cn(
                "h-14 w-14 rounded-full shadow-premium",
                "bg-gradient-to-r from-primary to-accent text-white",
                "hover:shadow-glow hover:scale-110 transition-premium",
                "border-2 border-white/20"
              )}
              onClick={() => setShowFAB(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom spacing to prevent content from being hidden */}
      <div className="h-20 w-full" />
    </>
  );
};

// Mobile-specific styles for enhanced touch targets
export const MobileStyles = () => (
  <style jsx global>{`
    @media (max-width: 768px) {
      .mobile-nav-item {
        min-height: 48px;
        padding: 12px 16px;
      }
      
      .mobile-nav-icon {
        width: 24px;
        height: 24px;
      }
      
      .mobile-sidebar-backdrop {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }
      
      .safe-area-inset-bottom {
        padding-bottom: env(safe-area-inset-bottom);
      }
      
      /* Enhanced touch targets */
      button, a {
        touch-action: manipulation;
      }
      
      /* Prevent double-tap zoom */
      * {
        touch-action: pan-x pan-y;
      }
      
      /* Smooth scrolling on mobile */
      body {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: none;
      }
    }
  `}</style>
);
