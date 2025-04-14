'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  TrendingUp, 
  ChevronLeft,
  Search, 
  Filter, 
  Download, 
  Calendar, 
  RefreshCw, 
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  Settings,
  DollarSign,
  BarChart4,
  BellRing,
  ChevronRight,
  Edit,
  X,
  Check,
  Percent,
  UserCog,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Mock data for admin affiliate management
interface AffiliateUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referralCount: number;
  conversionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
  commission: number;
  lastActive: string;
  isActive: boolean;
}

interface AffiliateSummary {
  totalAffiliates: number;
  activeAffiliates: number;
  totalReferrals: number;
  totalEarnings: number;
  pendingPayouts: number;
  conversionRate: number;
  mostSuccessfulAffiliate: string;
}

const affiliateUsers: AffiliateUser[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    referralCode: 'ALEX10',
    referralCount: 28,
    conversionRate: 42,
    totalEarnings: 1245.50,
    pendingEarnings: 320.00,
    commission: 15,
    lastActive: '2025-04-12',
    isActive: true,
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    referralCode: 'SARAH20',
    referralCount: 36,
    conversionRate: 58,
    totalEarnings: 2150.75,
    pendingEarnings: 480.25,
    commission: 20,
    lastActive: '2025-04-13',
    isActive: true,
  },
  {
    id: '3',
    name: 'David Wilson',
    email: 'david@example.com',
    referralCode: 'DAVID15',
    referralCount: 14,
    conversionRate: 35,
    totalEarnings: 720.00,
    pendingEarnings: 150.00,
    commission: 10,
    lastActive: '2025-04-10',
    isActive: true,
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@example.com',
    referralCode: 'EMMA10',
    referralCount: 8,
    conversionRate: 25,
    totalEarnings: 312.50,
    pendingEarnings: 87.50,
    commission: 10,
    lastActive: '2025-04-05',
    isActive: false,
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael@example.com',
    referralCode: 'MIKE25',
    referralCount: 42,
    conversionRate: 62,
    totalEarnings: 3125.00,
    pendingEarnings: 575.00,
    commission: 25,
    lastActive: '2025-04-14',
    isActive: true,
  },
  {
    id: '6',
    name: 'Jessica Smith',
    email: 'jessica@example.com',
    referralCode: 'JESS15',
    referralCount: 17,
    conversionRate: 41,
    totalEarnings: 845.25,
    pendingEarnings: 215.75,
    commission: 15,
    lastActive: '2025-04-08',
    isActive: true,
  },
];

const affiliateSummary: AffiliateSummary = {
  totalAffiliates: 23,
  activeAffiliates: 18,
  totalReferrals: 245,
  totalEarnings: 12450.75,
  pendingPayouts: 3240.50,
  conversionRate: 48,
  mostSuccessfulAffiliate: 'Michael Brown',
};

// Mock data for performance by timeframe
interface TimeframeData {
  timeframe: string;
  referrals: number;
  conversions: number;
  earnings: number;
}

const timeframeData: TimeframeData[] = [
  { timeframe: 'Today', referrals: 3, conversions: 1, earnings: 125.00 },
  { timeframe: 'This Week', referrals: 21, conversions: 8, earnings: 840.50 },
  { timeframe: 'This Month', referrals: 87, conversions: 35, earnings: 3750.25 },
  { timeframe: 'This Quarter', referrals: 156, conversions: 62, earnings: 6840.00 },
  { timeframe: 'This Year', referrals: 245, conversions: 118, earnings: 12450.75 },
];

export default function AdminAffiliatesPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<AffiliateUser[]>(affiliateUsers);
  const [selectedUser, setSelectedUser] = useState<AffiliateUser | null>(null);
  const [editCommissionOpen, setEditCommissionOpen] = useState(false);
  const [newCommission, setNewCommission] = useState('10');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (searchQuery || statusFilter) {
      let filtered = [...affiliateUsers];
      
      if (searchQuery) {
        const lowercaseQuery = searchQuery.toLowerCase();
        filtered = filtered.filter((user) =>
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.referralCode.toLowerCase().includes(lowercaseQuery)
        );
      }
      
      if (statusFilter) {
        filtered = filtered.filter((user) => 
          statusFilter === 'active' ? user.isActive : !user.isActive
        );
      }
      
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(affiliateUsers);
    }
  }, [searchQuery, statusFilter]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic handled in useEffect
  };

  const handleEditCommission = (user: AffiliateUser) => {
    setSelectedUser(user);
    setNewCommission(user.commission.toString());
    setEditCommissionOpen(true);
  };

  const saveCommission = () => {
    // In a real app, this would call an API
    console.log(`Saving new commission rate of ${newCommission}% for user ${selectedUser?.name}`);
    setEditCommissionOpen(false);
    setSelectedUser(null);
  };

  const handleStatusToggle = (userId: string, currentStatus: boolean) => {
    // In a real app, this would call an API
    console.log(`Toggling status for user ${userId} from ${currentStatus ? 'active' : 'inactive'} to ${!currentStatus ? 'active' : 'inactive'}`);
  };

  const refreshData = () => {
    setIsLoading(true);
    // In a real app, this would refresh data from the API
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
        {t('admin.affiliate.active', 'Active')}
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
        <XCircle className="h-3.5 w-3.5 mr-1" />
        {t('admin.affiliate.inactive', 'Inactive')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('admin.affiliate.title', 'Affiliate Management')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('admin.affiliate.subtitle', 'Monitor and manage your affiliate program')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/users')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('admin.affiliate.backToUsers', 'Back to Users')}
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/affiliate/logs')}>
            <Eye className="mr-2 h-4 w-4" />
            {t('admin.affiliate.viewLogs', 'View Logs')}
          </Button>
          <Button onClick={() => router.push('/dashboard/users/affiliates/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            {t('admin.affiliate.settings', 'Program Settings')}
          </Button>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart4 className="h-4 w-4 mr-2" />
            {t('admin.affiliate.tabs.overview', 'Overview')}
          </TabsTrigger>
          <TabsTrigger value="affiliates">
            <Users className="h-4 w-4 mr-2" />
            {t('admin.affiliate.tabs.affiliates', 'Affiliates')}
          </TabsTrigger>
          <TabsTrigger value="payouts">
            <DollarSign className="h-4 w-4 mr-2" />
            {t('admin.affiliate.tabs.payouts', 'Payouts')}
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            {t('admin.affiliate.tabs.settings', 'Settings')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('admin.affiliate.stats.totalAffiliates', 'Total Affiliates')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold flex items-center">
                      <Users className="h-5 w-5 mr-1 text-blue-500" />
                      {affiliateSummary.totalAffiliates}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span className="text-green-500 font-medium">{affiliateSummary.activeAffiliates}</span> {t('admin.affiliate.stats.active', 'active')}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('admin.affiliate.stats.totalReferrals', 'Total Referrals')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold flex items-center">
                      <TrendingUp className="h-5 w-5 mr-1 text-purple-500" />
                      {affiliateSummary.totalReferrals}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">+12%</span> {t('admin.affiliate.stats.fromLastMonth', 'from last month')}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('admin.affiliate.stats.totalEarnings', 'Total Earnings')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold flex items-center">
                      <DollarSign className="h-5 w-5 mr-1 text-green-500" />
                      {formatCurrency(affiliateSummary.totalEarnings).replace('$', '')}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">+8.5%</span> {t('admin.affiliate.stats.fromLastMonth', 'from last month')}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('admin.affiliate.stats.pendingPayouts', 'Pending Payouts')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold flex items-center">
                      <DollarSign className="h-5 w-5 mr-1 text-amber-500" />
                      {formatCurrency(affiliateSummary.pendingPayouts).replace('$', '')}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      {t('admin.affiliate.stats.toBePaid', 'To be paid this month')}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance by Timeframe */}
          <Card className="border-muted/40">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {t('admin.affiliate.performanceMetrics', 'Performance Metrics')}
              </CardTitle>
              <CardDescription>
                {t('admin.affiliate.performanceDescription', 'Affiliate program performance across different timeframes')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.affiliate.timeframe', 'Timeframe')}</TableHead>
                      <TableHead className="text-center">{t('admin.affiliate.referrals', 'Referrals')}</TableHead>
                      <TableHead className="text-center">{t('admin.affiliate.conversions', 'Conversions')}</TableHead>
                      <TableHead className="text-center">{t('admin.affiliate.conversionRate', 'Conversion Rate')}</TableHead>
                      <TableHead className="text-right">{t('admin.affiliate.earnings', 'Earnings')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeframeData.map((data) => (
                      <TableRow key={data.timeframe}>
                        <TableCell className="font-medium">{t(`admin.affiliate.timeframes.${data.timeframe.toLowerCase().replace(/\s/g, '')}`, data.timeframe)}</TableCell>
                        <TableCell className="text-center">{data.referrals}</TableCell>
                        <TableCell className="text-center">{data.conversions}</TableCell>
                        <TableCell className="text-center">
                          {Math.round((data.conversions / data.referrals) * 100)}%
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(data.earnings)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="border-muted/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('admin.affiliate.topPerformers', 'Top Performing Affiliates')}</CardTitle>
                  <CardDescription>
                    {t('admin.affiliate.topPerformersDesc', 'Your most successful affiliate partners')}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('affiliates')}>
                  {t('admin.affiliate.viewAll', 'View All')} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.affiliate.affiliate', 'Affiliate')}</TableHead>
                      <TableHead className="text-center">{t('admin.affiliate.referrals', 'Referrals')}</TableHead>
                      <TableHead className="text-center">{t('admin.affiliate.conversionRate', 'Conv. Rate')}</TableHead>
                      <TableHead className="text-right">{t('admin.affiliate.earnings', 'Earnings')}</TableHead>
                      <TableHead className="text-right">{t('admin.affiliate.commission', 'Commission')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sort by earnings and take top 5 */}
                    {[...affiliateUsers]
                      .sort((a, b) => b.totalEarnings - a.totalEarnings)
                      .slice(0, 5)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.referralCode}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{user.referralCount}</TableCell>
                          <TableCell className="text-center">{user.conversionRate}%</TableCell>
                          <TableCell className="text-right">{formatCurrency(user.totalEarnings)}</TableCell>
                          <TableCell className="text-right">{user.commission}%</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-4">
          {/* Search and Filter Bar */}
          <Card className="border-muted/40">
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('admin.affiliate.searchPlaceholder', 'Search by name, email or code...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </form>

                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="min-w-[120px]">
                        <Filter className="h-4 w-4 mr-2" />
                        {statusFilter ? 
                          statusFilter === 'active' ? 
                            t('admin.affiliate.statusActive', 'Active') : 
                            t('admin.affiliate.statusInactive', 'Inactive') : 
                          t('admin.affiliate.filterStatus', 'Status')}
                        <ChevronDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                        {t('admin.affiliate.allStatuses', 'All Statuses')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                        {t('admin.affiliate.statusActive', 'Active')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                        {t('admin.affiliate.statusInactive', 'Inactive')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={refreshData}
                    disabled={isLoading}
                    className="h-10 w-10"
                  >
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                  </Button>
                </div>

                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {t('admin.affiliate.export', 'Export')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Affiliates Table */}
          <Card className="border-muted/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{t('admin.affiliate.affiliatesList', 'Affiliates List')}</CardTitle>
                <Button>
                  <UserCog className="mr-2 h-4 w-4" />
                  {t('admin.affiliate.inviteAffiliate', 'Invite Affiliate')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {t('admin.affiliate.noAffiliatesFound', 'No affiliates match your criteria')}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">{t('admin.affiliate.affiliate', 'Affiliate')}</TableHead>
                      <TableHead className="text-center">{t('admin.affiliate.referralCode', 'Referral Code')}</TableHead>
                      <TableHead className="text-center hidden md:table-cell">{t('admin.affiliate.referrals', 'Referrals')}</TableHead>
                      <TableHead className="text-center hidden md:table-cell">{t('admin.affiliate.conversionRate', 'Conv. Rate')}</TableHead>
                      <TableHead className="text-right hidden md:table-cell">{t('admin.affiliate.earnings', 'Earnings')}</TableHead>
                      <TableHead className="text-center">{t('admin.affiliate.commission', 'Commission')}</TableHead>
                      <TableHead className="text-center">{t('admin.affiliate.status', 'Status')}</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm">{user.referralCode}</TableCell>
                        <TableCell className="text-center hidden md:table-cell">{user.referralCount}</TableCell>
                        <TableCell className="text-center hidden md:table-cell">{user.conversionRate}%</TableCell>
                        <TableCell className="text-right hidden md:table-cell">{formatCurrency(user.totalEarnings)}</TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 px-2 hover:bg-muted"
                            onClick={() => handleEditCommission(user)}
                          >
                            {user.commission}% <Edit className="ml-1 h-3 w-3 opacity-50" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(user.isActive)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <span className="sr-only">
                                  {t('admin.affiliate.openMenu', 'Open menu')}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t('admin.affiliate.viewProfile', 'View Profile')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditCommission(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t('admin.affiliate.editCommission', 'Edit Commission')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusToggle(user.id, user.isActive)}>
                                {user.isActive ? (
                                  <>
                                    <X className="h-4 w-4 mr-2" />
                                    {t('admin.affiliate.deactivate', 'Deactivate')}
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    {t('admin.affiliate.activate', 'Activate')}
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="py-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {t('admin.affiliate.totalCount', 'Showing {count} of {total} affiliates', {
                  count: filteredUsers.length,
                  total: affiliateUsers.length
                })}
              </div>
              
              {/* Could add pagination here if needed */}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card className="border-muted/40">
            <CardHeader className="pb-3">
              <CardTitle>{t('admin.affiliate.payoutsManagement', 'Payouts Management')}</CardTitle>
              <CardDescription>
                {t('admin.affiliate.payoutsDescription', 'Process and track affiliate commission payouts')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-8 text-center">
                {t('admin.affiliate.payoutsComingSoon', 'Payout management features are coming soon.')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-muted/40">
            <CardHeader>
              <CardTitle>{t('admin.affiliate.programSettings', 'Program Settings')}</CardTitle>
              <CardDescription>
                {t('admin.affiliate.programSettingsDesc', 'Configure your affiliate program parameters')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-8 text-center">
                {t('admin.affiliate.settingsRedirect', 'For detailed settings, please use the Program Settings page.')}
              </p>
              <div className="flex justify-center">
                <Button onClick={() => router.push('/dashboard/users/affiliates/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t('admin.affiliate.goToSettings', 'Go to Settings')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Commission Dialog */}
      <Dialog open={editCommissionOpen} onOpenChange={setEditCommissionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t('admin.affiliate.editCommissionTitle', 'Edit Commission Rate')}
            </DialogTitle>
            <DialogDescription>
              {selectedUser && t('admin.affiliate.editCommissionDesc', 'Update commission rate for {{name}}', { name: selectedUser.name })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="commission" className="text-right text-sm font-medium">
                {t('admin.affiliate.commissionRate', 'Rate')}
              </label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="commission"
                  value={newCommission}
                  onChange={(e) => setNewCommission(e.target.value)}
                  className="max-w-[80px]"
                />
                <Percent className="ml-2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCommissionOpen(false)}>
              {t('admin.affiliate.cancel', 'Cancel')}
            </Button>
            <Button onClick={saveCommission} type="submit">
              {t('admin.affiliate.save', 'Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}