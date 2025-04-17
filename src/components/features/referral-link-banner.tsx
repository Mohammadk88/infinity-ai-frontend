'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Share2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import { t } from 'i18next';

interface ReferralLinkBannerProps {
  className?: string;
}

export function ReferralLinkBanner({ className }: ReferralLinkBannerProps) {
    const { user } = useUserStore()
    const { stats, fetchStats } = useAffiliateStore()
    const [referralLink, setReferralLink] = useState('')
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)

 
    useEffect(() => {
        setMounted(true)
        fetchStats()
      }, [fetchStats])
    
      useEffect(() => {
        if (!mounted || !user) return
        console.log('User:', user);
        console.log('User Referral Code:', user.referralCode);
        if (!user.affiliate) {
          console.log("Affiliate data not ready yet");
          return;
        }
        if (user.referralCode && user.affiliate && user.affiliate.status === 'approved') {
          const link = `${window.location.origin}/auth/register?ref=${user.referralCode}`
          console.log('Link:', link);
          setReferralLink(link)
        }
      }, [user?.referralCode, mounted, user])// Include all dependencies
  
  // Don't render anything on server side
  if (!mounted || !user?.affiliate) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('affiliate.shareTitle', 'Join me on Infinity AI System'),
          text: t('affiliate.shareText', 'Use my referral link to sign up for Infinity AI System:'),
          url: referralLink
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy if Web Share API is not available
      handleCopyLink();
    }
  };

  return (
    <Card className={cn("border-b p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30", className)}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{t('affiliate.yourReferralLink', 'Your Affiliate Link')}</h3>
            <p className="text-sm text-muted-foreground">
              {stats ? t('affiliate.earningsInfo', 'You\'ve earned {{amount}} from {{count}} referrals', { 
                amount: `${stats.currency} ${stats.totalEarnings.toFixed(2)}`, 
                count: stats.referralCount 
              }) : t('affiliate.shareToEarn', 'Share to start earning')}
            </p>
          </div>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <div className="flex h-9 w-full sm:w-[260px] overflow-hidden rounded-md border bg-background px-3 py-1 text-sm">
              <span className="overflow-x-scroll whitespace-nowrap scrollbar-hide self-center">
                {referralLink || t('affiliate.loading', 'Loading...')}
              </span>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="h-9 w-9"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t('common.copy', 'Copy')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleShareLink}
                  className="h-9 w-9"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t('common.share', 'Share')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
}

