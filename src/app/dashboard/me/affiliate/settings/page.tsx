'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  ArrowLeftCircle, 
  Copy, 
  Check, 
  Link as LinkIcon, 
  Settings,
  Wallet,
  AlertCircle,
  DollarSign,
  Bell,
  CreditCard,
  Clock
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/components/ui/use-toast';
import api from '@/app/lib/axios';
import { cn } from '@/lib/utils';

interface PaymentInfo {
  method: 'paypal' | 'bank';
  email?: string;
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
}

interface PaymentFormData {
  method: 'paypal' | 'bank';
  email: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
}

export default function AffiliateSettingsPage() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [editPaymentDialogOpen, setEditPaymentDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<PaymentFormData>>({});
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    method: 'paypal',
    email: '',
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    paymentNotifications: true,
    referralNotifications: true
  });
  const [minimumPayout, setMinimumPayout] = useState(50);

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/me/affiliate', { withCredentials: true });
      setPaymentInfo(data.paymentInfo);
      setNotificationSettings(data.notifications || {
        emailNotifications: true,
        paymentNotifications: true,
        referralNotifications: true
      });
      setMinimumPayout(data.minimumPayout || 50);
    } catch (err) {
      console.error('Failed to load settings:', err);
      toast({
        title: t('affiliate.settings.error', 'Error'),
        description: t('affiliate.settings.errorLoading', 'Failed to load settings'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<PaymentFormData> = {};
    
    if (paymentFormData.method === 'paypal') {
      if (!paymentFormData.email || !paymentFormData.email.includes('@')) {
        errors.email = t('affiliate.settings.invalidEmail', 'Please enter a valid email');
      }
    } else {
      if (!paymentFormData.bankName) {
        errors.bankName = t('affiliate.settings.required', 'This field is required');
      }
      if (!paymentFormData.accountNumber || paymentFormData.accountNumber.length < 8) {
        errors.accountNumber = t('affiliate.settings.invalidAccount', 'Please enter a valid account number');
      }
      if (!paymentFormData.routingNumber || paymentFormData.routingNumber.length < 9) {
        errors.routingNumber = t('affiliate.settings.invalidRouting', 'Please enter a valid routing number');
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await api.post('/me/affiliate/payment-info', paymentFormData);
      setPaymentInfo({
        method: paymentFormData.method,
        ...(paymentFormData.method === 'paypal' ? { email: paymentFormData.email } : {
          bankAccount: {
            bankName: paymentFormData.bankName,
            accountNumber: paymentFormData.accountNumber,
            routingNumber: paymentFormData.routingNumber
          }
        })
      });
      setEditPaymentDialogOpen(false);
      toast({
        title: t('affiliate.settings.success', 'Success'),
        description: t('affiliate.settings.paymentUpdated', 'Payment information updated successfully'),
      });
    } catch (err) {
      console.error('Failed to update payment info:', err);
      toast({
        title: t('affiliate.settings.error', 'Error'),
        description: t('affiliate.settings.errorSaving', 'Failed to update payment information'),
        variant: 'destructive'
      });
    }
  };

  const saveNotificationSettings = async () => {
    try {
      await api.post('/me/affiliate/notifications', notificationSettings);
      toast({
        title: t('affiliate.settings.success', 'Success'),
        description: t('affiliate.settings.notificationsUpdated', 'Notification settings updated successfully'),
      });
    } catch (err) {
      console.error('Failed to update notifications:', err);
      toast({
        title: t('affiliate.settings.error', 'Error'),
        description: t('affiliate.settings.errorSavingNotifications', 'Failed to update notification settings'),
        variant: 'destructive'
      });
    }
  };

  const updateMinimumPayout = async () => {
    try {
      await api.post('/me/affiliate/minimum-payout', { amount: minimumPayout });
      toast({
        title: t('affiliate.settings.success', 'Success'),
        description: t('affiliate.settings.payoutUpdated', 'Minimum payout amount updated successfully'),
      });
    } catch (err) {
      console.error('Failed to update minimum payout:', err);
      toast({
        title: t('affiliate.settings.error', 'Error'),
        description: t('affiliate.settings.errorSavingPayout', 'Failed to update minimum payout'),
        variant: 'destructive'
      });
    }
  };

  const copyReferralLink = () => {
    if (!user?.referralCode) return;
    
    const referralUrl = `${window.location.origin}/auth/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    setReferralLinkCopied(true);
    
    setTimeout(() => {
      setReferralLinkCopied(false);
    }, 2000);
  };

  const getStatusBadge = () => {
    if (!user?.affiliate) return null;

    const status = user.affiliate.status;
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
            {t('affiliate.status.active', 'Active')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30">
            {t('affiliate.status.pending', 'Pending')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
            {t('affiliate.status.rejected', 'Rejected')}
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('affiliate.settings.title', 'Affiliate Settings')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('affiliate.settings.subtitle', 'Manage your affiliate account preferences')}
          </p>
        </div>
        <Link href="/dashboard/me/affiliate">
          <Button variant="outline" size="sm">
            <ArrowLeftCircle className="h-4 w-4 mr-2" />
            {t('affiliate.backToAffiliate', 'Back to Affiliate')}
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">
            <CreditCard className="h-4 w-4 mr-2" />
            {t('affiliate.settings.tabs.account', 'Account')}
          </TabsTrigger>
          <TabsTrigger value="payments">
            <Wallet className="h-4 w-4 mr-2" />
            {t('affiliate.settings.tabs.payments', 'Payments')}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            {t('affiliate.settings.tabs.notifications', 'Notifications')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('affiliate.settings.accountStatus', 'Account Status')}</CardTitle>
                {getStatusBadge()}
              </div>
              <CardDescription>
                {t('affiliate.settings.accountStatusDesc', 'Your current affiliate program status and details')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('affiliate.settings.referralCode', 'Your Referral Code')}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input 
                      value={user?.referralCode || ''}
                      readOnly
                      className="font-mono bg-muted/50"
                    />
                  </div>
                  <Button 
                    onClick={copyReferralLink} 
                    variant={referralLinkCopied ? "outline" : "default"}
                    className={cn(
                      "min-w-[100px]",
                      referralLinkCopied && "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 hover:text-green-600"
                    )}
                  >
                    {referralLinkCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {t('affiliate.copied', 'Copied!')}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        {t('affiliate.copy', 'Copy')}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('affiliate.settings.referralLink', 'Your Referral Link')}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref=${user?.referralCode || ''}`}
                      readOnly
                      className="pl-10 font-mono bg-muted/50"
                    />
                  </div>
                  <Button 
                    onClick={copyReferralLink} 
                    variant={referralLinkCopied ? "outline" : "default"}
                    className={cn(
                      "min-w-[100px]",
                      referralLinkCopied && "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 hover:text-green-600"
                    )}
                  >
                    {referralLinkCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {t('affiliate.copied', 'Copied!')}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        {t('affiliate.copy', 'Copy')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('affiliate.settings.paymentInfo', 'Payment Information')}</CardTitle>
                  <CardDescription>
                    {t('affiliate.settings.paymentInfoDesc', 'Your payment details for receiving affiliate commissions')}
                  </CardDescription>
                </div>
                <Dialog open={editPaymentDialogOpen} onOpenChange={setEditPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      {t('affiliate.settings.editPayment', 'Edit Payment Info')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handlePaymentFormSubmit}>
                      <DialogHeader>
                        <DialogTitle>{t('affiliate.settings.editPaymentTitle', 'Edit Payment Information')}</DialogTitle>
                        <DialogDescription>
                          {t('affiliate.settings.editPaymentDesc', 'Update your payment details for receiving commissions')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>{t('affiliate.settings.paymentMethod', 'Payment Method')}</Label>
                          <Select
                            value={paymentFormData.method}
                            onValueChange={(value: 'paypal' | 'bank') => {
                              setPaymentFormData({ ...paymentFormData, method: value });
                              setFormErrors({});
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="bank">{t('affiliate.settings.bankTransfer', 'Bank Transfer')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {paymentFormData.method === 'paypal' ? (
                          <div className="grid gap-2">
                            <Label>{t('affiliate.settings.paypalEmail', 'PayPal Email')}</Label>
                            <Input
                              value={paymentFormData.email}
                              onChange={(e) => setPaymentFormData({ ...paymentFormData, email: e.target.value })}
                              placeholder="your@email.com"
                              className={formErrors.email ? 'border-red-500' : ''}
                            />
                            {formErrors.email && (
                              <p className="text-sm text-red-500">{formErrors.email}</p>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="grid gap-2">
                              <Label>{t('affiliate.settings.bankName', 'Bank Name')}</Label>
                              <Input
                                value={paymentFormData.bankName}
                                onChange={(e) => setPaymentFormData({ ...paymentFormData, bankName: e.target.value })}
                                className={formErrors.bankName ? 'border-red-500' : ''}
                              />
                              {formErrors.bankName && (
                                <p className="text-sm text-red-500">{formErrors.bankName}</p>
                              )}
                            </div>
                            <div className="grid gap-2">
                              <Label>{t('affiliate.settings.accountNumber', 'Account Number')}</Label>
                              <Input
                                value={paymentFormData.accountNumber}
                                onChange={(e) => setPaymentFormData({ ...paymentFormData, accountNumber: e.target.value })}
                                type="password"
                                className={formErrors.accountNumber ? 'border-red-500' : ''}
                              />
                              {formErrors.accountNumber && (
                                <p className="text-sm text-red-500">{formErrors.accountNumber}</p>
                              )}
                            </div>
                            <div className="grid gap-2">
                              <Label>{t('affiliate.settings.routingNumber', 'Routing Number')}</Label>
                              <Input
                                value={paymentFormData.routingNumber}
                                onChange={(e) => setPaymentFormData({ ...paymentFormData, routingNumber: e.target.value })}
                                type="password"
                                className={formErrors.routingNumber ? 'border-red-500' : ''}
                              />
                              {formErrors.routingNumber && (
                                <p className="text-sm text-red-500">{formErrors.routingNumber}</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditPaymentDialogOpen(false)}>
                          {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button type="submit">
                          {t('common.save', 'Save Changes')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              ) : paymentInfo ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">
                        {paymentInfo.method === 'paypal' ? 'PayPal Email' : 'Bank Account'}
                      </h4>
                      {paymentInfo.method === 'paypal' ? (
                        <p className="text-sm text-muted-foreground mt-1">{paymentInfo.email}</p>
                      ) : (
                        <div className="space-y-1 mt-1">
                          <p className="text-sm text-muted-foreground">Bank: {paymentInfo.bankAccount?.bankName}</p>
                          <p className="text-sm text-muted-foreground">Account: ****{paymentInfo.bankAccount?.accountNumber.slice(-4)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t('affiliate.settings.noPaymentInfo', 'No Payment Information')}</AlertTitle>
                  <AlertDescription>
                    {t('affiliate.settings.addPaymentInfo', 'Add your payment details to receive affiliate commissions')}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium">{t('affiliate.settings.minimumPayout', 'Minimum Payout Amount')}</h4>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-[200px]">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="10"
                      max="1000"
                      value={minimumPayout}
                      onChange={(e) => setMinimumPayout(Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={updateMinimumPayout} variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {t('affiliate.settings.updatePayout', 'Update')}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('affiliate.settings.minimumPayoutDesc', 'You will receive payments when your balance reaches this amount')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('affiliate.settings.notificationPreferences', 'Notification Preferences')}</CardTitle>
              <CardDescription>
                {t('affiliate.settings.notificationDesc', 'Choose how you want to be notified about your affiliate activity')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('affiliate.settings.emailNotifications', 'Email Notifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('affiliate.settings.emailNotificationsDesc', 'Receive updates about your affiliate activity via email')}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }));
                      saveNotificationSettings();
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('affiliate.settings.paymentNotifications', 'Payment Notifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('affiliate.settings.paymentNotificationsDesc', 'Get notified when you receive payments')}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentNotifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, paymentNotifications: checked }));
                      saveNotificationSettings();
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('affiliate.settings.referralNotifications', 'Referral Notifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('affiliate.settings.referralNotificationsDesc', 'Get notified about new referral sign-ups')}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.referralNotifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, referralNotifications: checked }));
                      saveNotificationSettings();
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}