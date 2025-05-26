'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { ReferralLinkBanner } from '@/components/features/referral-link-banner';
import AffiliateStatusAlert from '@/components/features/affiliate-status-alert';
import PromptGenerator from '@/components/features/prompt-generator';
import AIAssistantPanel from '@/components/features/ai-assistant-panel';
// import { ThemeCustomizer } from '@/components/features/theme-customizer';
import { MobileBottomNav } from '@/components/features/mobile-bottom-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const { user, isLoading } = useUserStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [mobileSidebarToggle, setMobileSidebarToggle] = useState(0); // Counter to trigger sidebar toggle
  const isRTL = i18n.dir() === 'rtl';
  
  // Function to handle mobile sidebar toggle
  const handleMobileSidebarToggle = () => {
    // Increment counter to trigger sidebar toggle
    setMobileSidebarToggle(prev => prev + 1);
  };
  
  
  // Redirect to login if not authenticated or error


  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className={cn(
      "flex min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50/30 to-indigo-50/20 dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-800/20",
      "transition-premium",
      isRTL && "rtl-layout"
    )}>
      {/* Fixed Header - positioned above sidebar */}
      <Header />
      
      {/* Sidebar positioned below header */}
      <Sidebar
        onStateChange={(collapsed) => setSidebarCollapsed(collapsed)}
        mobileSidebarToggle={mobileSidebarToggle}
      />
      
      <div
        className={cn(
          "flex flex-1 flex-col transition-premium pt-16 min-h-screen", // Reduced header spacing for mobile
          "ml-0", // No margin on mobile - sidebar overlays
          // Desktop spacing
          sidebarCollapsed ? "md:ml-[70px] md:pt-20" : "md:ml-[260px] md:pt-20",
          // RTL adjustments
          isRTL && (sidebarCollapsed ? "md:mr-[70px] md:ml-0" : "md:mr-[260px] md:ml-0"),
        )}
      >
        {/* Content area with improved mobile spacing */}
        <div className="flex flex-col space-y-2 md:space-y-4 px-2 md:px-0">
          {/* Affiliate Status Alert - responsive spacing */}
          <AffiliateStatusAlert status={user?.affiliate?.status} />
          
          {/* Referral Link Banner - responsive design */}
          <ReferralLinkBanner />
          
          {/* Prompt Generator - always show, component handles responsive behavior internally */}
          <div className="hidden md:block">
            <PromptGenerator />
          </div>
         
        </div>
        
        <main className={cn(
          "flex-1 space-y-4 md:space-y-6 page-transition",
          "p-3 md:p-4 lg:p-6", // Responsive padding
          "pb-safe" // Safe area for mobile browsers
        )}>
          {children}
        </main>
        
        {/* Mobile Bottom Navigation - Only show on mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
          <MobileBottomNav onToggleSidebar={handleMobileSidebarToggle} />
        </div>
        
        {/* Floating Action Buttons Stack */}
        <div className="fixed bottom-20 right-4 z-50 flex-col-reverse gap-4 hidden md:flex md:bottom-8 md:right-6">
          {/* AI Assistant Panel with built-in trigger - positioned at bottom */}
          {/* <AIAssistantPanel /> */}
          
          {/* Theme Customizer Button - positioned at top */}
          {/* <Button
            size="icon"
            onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
            className={cn(
              "h-12 w-12 rounded-full shadow-premium",
              "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
              "text-white border-0 hover:scale-105 active:scale-95",
              "transition-all duration-300"
            )}
          >
            <Palette className="h-5 w-5" />
          </Button> */}
        </div>
        
        {/* Theme Customizer Panel */}
        {/* <ThemeCustomizer 
          isOpen={showThemeCustomizer} 
          onClose={() => setShowThemeCustomizer(false)} 
        /> */}
      </div>
    </div>
  );
}
