'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ReferralLinkCopierProps {
  referralLink: string;
}

export default function ReferralLinkCopier({ referralLink }: ReferralLinkCopierProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground"
          />
        </div>
        <Button 
          onClick={copyToClipboard} 
          variant="outline" 
          size="sm" 
          className="shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              {t('copied')}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t('copy')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}