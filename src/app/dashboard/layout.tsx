'use client';

import {  useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { ReferralLinkBanner } from '@/components/features/referral-link-banner';
import AffiliateStatusAlert from '@/components/features/affiliate-status-alert';
import PromptGenerator from '@/components/features/prompt-generator';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {  i18n } = useTranslation();
  const { user, isLoading } = useUserStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isRTL = i18n.dir() === 'rtl';
  
  
  // Redirect to login if not authenticated or error


  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className={cn("flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30", isRTL && "rtl-layout")}>
      <Sidebar
        onStateChange={(collapsed) => setSidebarCollapsed(collapsed)}
      />
      
      {/* Fixed Header */}
      <Header />
      
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out pt-[80px]", // Added top padding for fixed header
          sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[260px]",
          isRTL && (sidebarCollapsed ? "md:mr-[70px] md:ml-0" : "md:mr-[260px] md:ml-0"),
        )}
      >
        {/* Content area with proper spacing for floating header */}
        <div className="flex flex-col space-y-4">
          {/* Affiliate Status Alert - shown on all pages when affiliate status is pending */}
          <AffiliateStatusAlert status={user?.affiliate?.status} />
          
          {/* Referral Link Banner - only for active affiliates */}
          <ReferralLinkBanner />
          
          <PromptGenerator />
        </div>
        
        <main className="flex-1 p-4 md:p-6 space-y-6 page-transition">
          {children}
        </main>
      </div>
    </div>
  );
}
