'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import PromptGenerator from '@/components/features/prompt-generator';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isRTL = i18n.dir() === 'rtl';
  // Function to handle sidebar state changes - will be passed to Sidebar component
  const handleSidebarStateChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };
  
  useEffect(() => {
    setIsMounted(true);
    const checkIfMobile = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      setIsCollapsed(mobileView);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-background/50 text-foreground antialiased">
      <Sidebar onStateChange={handleSidebarStateChange} />
      <div 
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-[70px]" : "ml-[260px]",
          isMobile && "ml-0",
          isRTL ? "rtl:ml-0 rtl:mr-0" : "",
          isCollapsed ? "rtl:mr-[70px]" : "rtl:mr-[260px]",
          isMobile && "rtl:mr-0"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 transition-all duration-300">
          <div className="mx-auto w-full max-w-[1600px] animate-fadeIn">
            {children}
          </div>
        </main>
        <footer className="border-t border-border/20 py-4 px-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Infinity AI System. All rights reserved.</p>
        </footer>
      </div>
      
      {/* AI Prompt Generator Widget */}
      <PromptGenerator />
    </div>
  );
}
