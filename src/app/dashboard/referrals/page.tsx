'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  Share,
  Gift,
  Calendar,
  ExternalLink,
  Download,
  Eye
} from 'lucide-react';

export default function ReferralsPage() {
  const { t } = useTranslation();
  const [referralCode] = useState('INF-AI-2025');
  const [referralLink] = useState('https://infinityai.com/ref/INF-AI-2025');

  const stats = {
    totalReferrals: 24,
    activeReferrals: 18,
    totalEarnings: 1240.50,
    pendingEarnings: 180.25,
    thisMonthEarnings: 320.75,
    conversionRate: 15.2
  };

  const recentReferrals = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 's.johnson@email.com',
      signupDate: new Date(2025, 4, 28),
      status: 'active',
      plan: 'Small Business',
      commission: 75.00,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'm.chen@email.com',
      signupDate: new Date(2025, 4, 25),
      status: 'trial',
      plan: 'Freelancer',
      commission: 25.00,
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'e.rodriguez@email.com',
      signupDate: new Date(2025, 4, 22),
      status: 'active',
      plan: 'Agency',
      commission: 199.50,
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'd.wilson@email.com',
      signupDate: new Date(2025, 4, 20),
      status: 'cancelled',
      plan: 'Freelancer',
      commission: 0,
      avatar: 'DW'
    }
  ];

  const commissionTiers = [
    { plan: 'Freelancer', commission: '50%', monthlyValue: '$24.50' },
    { plan: 'Small Business', commission: '50%', monthlyValue: '$74.50' },
    { plan: 'Agency', commission: '50%', monthlyValue: '$199.50' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You would typically show a toast notification here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            {t('referrals.title', 'Affiliate Program')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('referrals.description', 'Earn 50% commission for every successful referral')}
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          💰 50% Commission
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                <p className="text-xs text-green-600">+3 this month</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Referrals</p>
                <p className="text-2xl font-bold">{stats.activeReferrals}</p>
                <p className="text-xs text-green-600">{stats.conversionRate}% conversion</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-green-600">+${stats.thisMonthEarnings} this month</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
                <p className="text-2xl font-bold">${stats.pendingEarnings.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Next payout: June 30</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Gift className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this link to earn 50% commission on every successful signup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Referral Code</label>
                <div className="flex gap-2">
                  <Input value={referralCode} readOnly className="font-mono" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(referralCode)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Referral URL</label>
                <div className="flex gap-2">
                  <Input value={referralLink} readOnly className="font-mono text-sm" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(referralLink)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1">
                  <Share className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Page
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Referrals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Referrals</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReferrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-sm">
                        {referral.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{referral.name}</p>
                        <p className="text-xs text-muted-foreground">{referral.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {referral.signupDate.toLocaleDateString()} • {referral.plan}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={getStatusColor(referral.status)}>
                        {referral.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        ${referral.commission.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Commission Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Commission Structure</CardTitle>
              <CardDescription>Earn 50% recurring commission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {commissionTiers.map((tier) => (
                <div key={tier.plan} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{tier.plan}</p>
                    <p className="text-xs text-muted-foreground">{tier.commission} commission</p>
                  </div>
                  <p className="font-medium text-sm">{tier.monthlyValue}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Program Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Program Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commission Rate</span>
                <span className="font-medium">50%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cookie Duration</span>
                <span className="font-medium">30 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minimum Payout</span>
                <span className="font-medium">$50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Schedule</span>
                <span className="font-medium">Monthly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">PayPal</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Marketing Materials
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Media Kit
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Program Guidelines
              </Button>
            </CardContent>
          </Card>

          {/* Next Payout */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-primary">${stats.pendingEarnings.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Available for payout</p>
                <p className="text-xs text-muted-foreground">Next payment: June 30, 2025</p>
                <Button size="sm" className="w-full mt-3">
                  Request Payout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
