'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Download, 
  Calendar, 
  RefreshCw, 
  AlertCircle,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';

import { useAffiliateStore } from '@/store/useAffiliateStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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

export default function ReferralLogsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logs, stats, isLoading, error, fetchLogs, fetchStats } = useAffiliateStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<string>('registrationDate');
  const [mounted, setMounted] = useState(false);
  
  // For demo purposes - normally this would come from API pagination
  const totalItems = 35; 
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setMounted(true);
    fetchStats();
    fetchLogs(currentPage, itemsPerPage, searchQuery);
  }, [fetchLogs, fetchStats, currentPage, itemsPerPage, searchQuery]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(1, itemsPerPage, searchQuery);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchLogs(page, itemsPerPage, searchQuery);
  };

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    // In a real app, you would call the API with the sort parameters
    // For demo, we'll just console log
    console.log(`Sorting by ${field} in ${newOrder} order`);
  };

  // Generate page numbers array for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If there are few pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of pages to show
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust start and end if we're near the edges
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push('ellipsis1');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pageNumbers.push('ellipsis2');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const renderPageNumber = (page: number | string, index: number) => {
    if (page === 'ellipsis1' || page === 'ellipsis2') {
      return <span key={`ellipsis${index}`} className="mx-1">...</span>;
    }
    
    return (
      <Button
        key={`page${page}`}
        variant={currentPage === page ? "default" : "outline"}
        size="icon"
        className="h-8 w-8"
        onClick={() => handlePageChange(page as number)}
      >
        {page}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('affiliate.logs.title', 'Referral Logs')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('affiliate.logs.subtitle', 'Track and manage your referral activity')}
          </p>
        </div>
        <Link href="/dashboard/affiliate">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('affiliate.logs.backToDashboard', 'Back to Dashboard')}
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-muted/40">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('affiliate.logs.searchPlaceholder', 'Search by email or referral code...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
              <Button type="submit" variant="ghost" size="sm" className="absolute right-1 top-1">
                {t('affiliate.logs.search', 'Search')}
              </Button>
            </form>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter ? 
                      statusFilter === 'converted' ? 
                        t('affiliate.status.converted', 'Converted') : 
                        t('affiliate.status.pending', 'Pending') : 
                      t('affiliate.logs.filterStatus', 'Status')}
                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    {t('affiliate.logs.allStatuses', 'All Statuses')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('converted')}>
                    {t('affiliate.status.converted', 'Converted')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    {t('affiliate.status.pending', 'Pending')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateFilter || t('affiliate.logs.filterDate', 'Date')}
                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDateFilter(null)}>
                    {t('affiliate.logs.allTime', 'All Time')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter('today')}>
                    {t('affiliate.logs.today', 'Today')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter('week')}>
                    {t('affiliate.logs.thisWeek', 'This Week')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter('month')}>
                    {t('affiliate.logs.thisMonth', 'This Month')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter('quarter')}>
                    {t('affiliate.logs.thisQuarter', 'This Quarter')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => fetchLogs(currentPage, itemsPerPage, searchQuery)}
                disabled={isLoading}
                className="h-10 w-10"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </div>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('affiliate.logs.export', 'Export')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Logs Table */}
      <Card className="border-muted/40">
        <CardHeader className="pb-3">
          <CardTitle>{t('affiliate.logs.referralsList', 'Referrals List')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="p-6">
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{t('affiliate.logs.error', 'Error loading referral logs')}</span>
                </div>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead className="w-[250px]">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('referredEmail')}
                    >
                      {t('affiliate.logs.email', 'Referred Email')}
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      {t('affiliate.logs.status', 'Status')}
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('registrationDate')}
                    >
                      {t('affiliate.logs.registrationDate', 'Registration Date')}
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-right">
                    <div 
                      className="flex items-center justify-end cursor-pointer"
                      onClick={() => handleSort('commission')}
                    >
                      {t('affiliate.logs.commission', 'Commission')}
                      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && logs.length === 0 ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-muted-foreground">
                          {t('affiliate.logs.noReferrals', 'No referrals found')}
                        </p>
                        <Link href="/dashboard/affiliate">
                          <Button variant="outline" className="mt-2">
                            {t('affiliate.logs.viewDashboard', 'View Dashboard')}
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, index) => (
                    <TableRow key={log.id}>
                      <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {log.referredEmail}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            log.status === 'converted'
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          )}
                        >
                          {log.status === 'converted'
                            ? t('affiliate.status.converted', 'Converted')
                            : t('affiliate.status.pending', 'Pending')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(log.registrationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {log.commission 
                          ? `${log.commission.toFixed(2)} ${stats?.currency || 'USD'}`
                          : log.status === 'pending'
                            ? t('affiliate.logs.pendingCommission', 'Pending')
                            : '0.00'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {/* Pagination */}
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
          <div className="flex items-center text-sm text-muted-foreground">
            {t('affiliate.logs.showing', 'Showing')} 
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(v) => {
                setItemsPerPage(parseInt(v));
                setCurrentPage(1);
                fetchLogs(1, parseInt(v), searchQuery);
              }}
            >
              <SelectTrigger className="h-8 w-[70px] mx-2 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="center">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            {t('affiliate.logs.of', 'of')} {totalItems} {t('affiliate.logs.entries', 'entries')}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{t('affiliate.logs.previous', 'Previous page')}</span>
            </Button>
            
            {getPageNumbers().map(renderPageNumber)}
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">{t('affiliate.logs.next', 'Next page')}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}