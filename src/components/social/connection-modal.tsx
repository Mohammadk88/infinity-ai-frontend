'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Building2, Check } from 'lucide-react';
import { useSocialAccountStore, SOCIAL_PLATFORMS } from '@/store/useSocialAccountStore';

interface ConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectionModal({ open, onOpenChange }: ConnectionModalProps) {
  const { t } = useTranslation();
  const {
    selectedPlatform,
    connectableAccounts,
    isConnecting,
    connectAccount,
    setShowConnectionModal
  } = useSocialAccountStore();

  const platform = selectedPlatform ? SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform) : null;

  const handleConnect = async (accountId: string) => {
    if (!selectedPlatform) return;

    await connectAccount({
      platform: selectedPlatform,
      accessToken: '', // This would come from OAuth flow
      selectedAccountId: accountId
    });
  };

  const handleClose = () => {
    setShowConnectionModal(false);
    onOpenChange(false);
  };

  if (!platform) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${platform.color}`}>
              {/* Platform icon would go here */}
            </div>
            {t('socialAccounts.connection.selectAccount', 'Select {{platform}} Account', { platform: platform.name })}
          </DialogTitle>
          <DialogDescription>
            {t('socialAccounts.connection.selectAccountDescription', 'Choose which {{platform}} account you want to connect.', { platform: platform.name })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {connectableAccounts.map((account) => (
            <Card
              key={account.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      {account.profileImage ? (
                        <Image 
                          src={account.profileImage} 
                          alt={account.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">
                          {account.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{account.name}</h4>
                        {account.isBusinessAccount && (
                          <Badge variant="secondary" className="text-xs">
                            <Building2 className="h-3 w-3 mr-1" />
                            Business
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{account.username}</p>
                      {account.followers && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Users className="h-3 w-3" />
                          {account.followers.toLocaleString()} followers
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleConnect(account.id)}
                    disabled={isConnecting}
                    className="ml-2"
                  >
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {isConnecting ? t('common.connecting', 'Connecting...') : t('common.connect', 'Connect')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {connectableAccounts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('socialAccounts.connection.noAccountsFound', 'No {{platform}} accounts found.', { platform: platform.name })}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
