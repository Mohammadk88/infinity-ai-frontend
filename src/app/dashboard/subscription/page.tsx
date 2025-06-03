'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Settings, CreditCard, Users, Calendar, Zap } from 'lucide-react';
import Link from 'next/link';
import SubscriptionManagement from '@/components/features/SubscriptionManagement';

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard/plans">
              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plans
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Subscription Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your subscription, billing, and payment methods
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-emerald-700 font-medium">AI Generations</div>
                  <div className="text-lg font-bold text-emerald-800">Unlimited</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-violet-700 font-medium">Scheduled Posts</div>
                  <div className="text-lg font-bold text-violet-800">Unlimited</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-blue-700 font-medium">Social Accounts</div>
                  <div className="text-lg font-bold text-blue-800">Unlimited</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-amber-700 font-medium">Next Billing</div>
                  <div className="text-lg font-bold text-amber-800">Jan 15</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Subscription Management */}
        <SubscriptionManagement />

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing History</CardTitle>
              <CardDescription>View your past invoices and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">December 2024</div>
                    <div className="text-sm text-muted-foreground">Small Business Plan</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$59.00</div>
                    <Badge variant="secondary" className="text-xs">Paid</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">November 2024</div>
                    <div className="text-sm text-muted-foreground">Small Business Plan</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$59.00</div>
                    <Badge variant="secondary" className="text-xs">Paid</Badge>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Invoices
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support & Help</CardTitle>
              <CardDescription>Get help with your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule a Call
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  View FAQ
                </Button>
              </div>
              
              <Separator />
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Need immediate help?</p>
                <p>Email: support@infinityai.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
