'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserSquare2,
  MessageSquare,
  Calendar,
  Settings,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from '@/app/lib/axios';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useToast } from '@/components/ui/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define types for our API responses
interface Member {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
}

interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
}

interface Interaction {
  id: string;
  type: string;
  client: string;
  clientId: string;
  date: string;
  member: string;
  memberId: string;
  notes?: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  assigneeId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

interface CompanyStats {
  totalMembers: number;
  totalClients: number;
  totalInteractions: number;
  upcomingTasks: Task[];
  latestInteractions: Interaction[];
}

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function CompanyDashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { currentCompany } = useCompanyStore();
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{
    members?: boolean;
    clients?: boolean;
    interactions?: boolean;
    tasks?: boolean;
  }>({});

  useEffect(() => {
    if (currentCompany?.id) {
      fetchCompanyStats();
    }
  }, [currentCompany?.id]);

  const fetchCompanyStats = async () => {
    if (!currentCompany?.id) {
      toast({
        title: t('company.dashboard.noCompany', 'No company selected'),
        description: t('company.dashboard.selectCompany', 'Please select a company first'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    const newErrors: {
      members?: boolean;
      clients?: boolean;
      interactions?: boolean;
      tasks?: boolean;
    } = {};
    
    try {
      // Fetch all data in parallel
      const [membersRes, clientsRes, interactionsRes, tasksRes] = await Promise.allSettled([
        axios.get(`/company-members?companyId=${currentCompany.id}`),
        axios.get(`/clients?companyId=${currentCompany.id}`),
        axios.get(`/interactions?companyId=${currentCompany.id}`),
        axios.get(`/tasks/upcoming?companyId=${currentCompany.id}`)
      ]);
      
      // Process members data
      let totalMembers = 0;
      if (membersRes.status === 'fulfilled') {
        totalMembers = membersRes.value.data.total;
      } else {
        newErrors.members = true;
        console.error('Error fetching members:', membersRes.reason);
      }
      
      // Process clients data
      let totalClients = 0;
      if (clientsRes.status === 'fulfilled') {
        totalClients = clientsRes.value.data.total;
      } else {
        newErrors.clients = true;
        console.error('Error fetching clients:', clientsRes.reason);
      }
      
      // Process interactions data
      let totalInteractions = 0;
      let latestInteractions: Interaction[] = [];
      if (interactionsRes.status === 'fulfilled') {
        totalInteractions = interactionsRes.value.data.total;
        latestInteractions = interactionsRes.value.data.latest.slice(0, 5);
      } else {
        newErrors.interactions = true;
        console.error('Error fetching interactions:', interactionsRes.reason);
      }
      
      // Process tasks data
      let upcomingTasks: Task[] = [];
      if (tasksRes.status === 'fulfilled') {
        upcomingTasks = tasksRes.value.data.tasks.slice(0, 5);
      } else {
        newErrors.tasks = true;
        console.error('Error fetching tasks:', tasksRes.reason);
      }
      
      // Update state with fetched data
      setStats({
        totalMembers,
        totalClients,
        totalInteractions,
        latestInteractions,
        upcomingTasks
      });
      
      // Show error toasts for any failed requests
      const errorCount = Object.values(newErrors).filter(Boolean).length;
      if (errorCount > 0) {
        toast({
          title: t('company.dashboard.fetchError', 'Data fetch issues'),
          description: t('company.dashboard.partialData', `${errorCount} data ${errorCount === 1 ? 'source' : 'sources'} couldn't be loaded`),
          variant: 'destructive',
        });
        setErrors(newErrors);
      } else {
        toast({
          title: t('company.dashboard.dataLoaded', 'Dashboard updated'),
          description: t('company.dashboard.dataLoadedDesc', 'Latest company data has been loaded'),
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error fetching company stats:', error);
      toast({
        title: t('company.dashboard.fetchError', 'Error loading data'),
        description: t('company.dashboard.tryAgain', 'Please try again later'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFormattedDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('company.dashboard.title', 'Company Dashboard')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentCompany?.name 
              ? t('company.dashboard.welcomeCompany', 'Welcome to {{company}}', { company: currentCompany.name })
              : t('company.dashboard.subtitle', 'Monitor your company performance and activity')
            }
          </p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={fetchCompanyStats} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading 
                    ? t('company.dashboard.loading', 'Loading...') 
                    : t('company.dashboard.refresh', 'Refresh')
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('company.dashboard.refreshTooltip', 'Reload all dashboard data')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Link href="/dashboard/company/settings">
            <Button variant="default">
              <Settings className="h-4 w-4 mr-2" />
              {t('company.dashboard.settings', 'Settings')}
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="border-muted/40 hover:border-primary/40 hover:shadow-sm transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('company.dashboard.totalMembers', 'Total Members')}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading || errors.members ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {errors.members 
                  ? <span className="text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> 
                      {t('company.dashboard.loadError', 'Failed to load')}
                    </span>
                  : t('company.dashboard.activeTeam', 'Active team members')
                }
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/dashboard/company/members" className="text-xs text-primary flex items-center hover:underline">
                {t('company.dashboard.manageMembers', 'Manage Members')}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-muted/40 hover:border-primary/40 hover:shadow-sm transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('company.dashboard.totalClients', 'Total Clients')}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserSquare2 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading || errors.clients ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {errors.clients 
                  ? <span className="text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> 
                      {t('company.dashboard.loadError', 'Failed to load')}
                    </span>
                  : t('company.dashboard.managedClients', 'Clients being managed')
                }
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/dashboard/clients" className="text-xs text-primary flex items-center hover:underline">
                {t('company.dashboard.viewClients', 'View Clients')}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-muted/40 hover:border-primary/40 hover:shadow-sm transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('company.dashboard.totalInteractions', 'Total Interactions')}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading || errors.interactions ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats?.totalInteractions || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {errors.interactions 
                  ? <span className="text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> 
                      {t('company.dashboard.loadError', 'Failed to load')}
                    </span>
                  : t('company.dashboard.clientTouchpoints', 'Client touchpoints tracked')
                }
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/dashboard/interactions" className="text-xs text-primary flex items-center hover:underline">
                {t('company.dashboard.viewInteractions', 'View Interactions')}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-muted/40 hover:border-primary/40 hover:shadow-sm transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('company.dashboard.upcomingTasks', 'Upcoming Tasks')}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading || errors.tasks ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats?.upcomingTasks?.length || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {errors.tasks 
                  ? <span className="text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> 
                      {t('company.dashboard.loadError', 'Failed to load')}
                    </span>
                  : t('company.dashboard.pendingTasks', 'Tasks pending completion')
                }
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/dashboard/tasks" className="text-xs text-primary flex items-center hover:underline">
                {t('company.dashboard.viewTasks', 'View Tasks')}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Latest Activity */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="border-muted/40 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('company.dashboard.latestInteractions', 'Latest Interactions')}</CardTitle>
                  <CardDescription>
                    {t('company.dashboard.recentInteractions', 'Most recent client interactions')}
                  </CardDescription>
                </div>
                <Link href="/dashboard/interactions">
                  <Button variant="ghost" className="gap-1">
                    <span className="hidden sm:inline">{t('company.dashboard.viewAll', 'View All')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : errors.interactions ? (
                <div className="py-8 text-center">
                  <AlertCircle className="h-10 w-10 mx-auto text-destructive mb-2 opacity-80" />
                  <p className="text-sm text-muted-foreground">
                    {t('company.dashboard.errorFetchingInteractions', 'Error loading interaction data')}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={fetchCompanyStats}>
                    {t('company.dashboard.tryAgain', 'Try Again')}
                  </Button>
                </div>
              ) : stats?.latestInteractions && stats.latestInteractions.length > 0 ? (
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">{t('company.dashboard.type', 'Type')}</TableHead>
                        <TableHead>{t('company.dashboard.client', 'Client')}</TableHead>
                        <TableHead className="hidden md:table-cell">{t('company.dashboard.member', 'Member')}</TableHead>
                        <TableHead className="text-right">{t('company.dashboard.date', 'Date')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.latestInteractions.map((interaction) => (
                        <TableRow key={interaction.id}>
                          <TableCell className="font-medium">
                            <Badge variant="outline" className="capitalize">
                              {interaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">{interaction.client}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-[120px] truncate">{interaction.member}</TableCell>
                          <TableCell className="text-right text-muted-foreground text-sm">
                            {getFormattedDate(interaction.date)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2 opacity-60" />
                  <p className="text-sm text-muted-foreground">
                    {t('company.dashboard.noInteractions', 'No recent interactions found')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-muted/40 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('company.dashboard.upcomingTasks', 'Upcoming Tasks')}</CardTitle>
                  <CardDescription>
                    {t('company.dashboard.nextTasks', 'Tasks due soon')}
                  </CardDescription>
                </div>
                <Link href="/dashboard/tasks">
                  <Button variant="ghost" className="gap-1">
                    <span className="hidden sm:inline">{t('company.dashboard.viewAll', 'View All')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : errors.tasks ? (
                <div className="py-8 text-center">
                  <AlertCircle className="h-10 w-10 mx-auto text-destructive mb-2 opacity-80" />
                  <p className="text-sm text-muted-foreground">
                    {t('company.dashboard.errorFetchingTasks', 'Error loading task data')}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={fetchCompanyStats}>
                    {t('company.dashboard.tryAgain', 'Try Again')}
                  </Button>
                </div>
              ) : stats?.upcomingTasks && stats.upcomingTasks.length > 0 ? (
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('company.dashboard.task', 'Task')}</TableHead>
                        <TableHead className="hidden md:table-cell">{t('company.dashboard.assignedTo', 'Assigned To')}</TableHead>
                        <TableHead className="text-right">{t('company.dashboard.dueDate', 'Due Date')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.upcomingTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium max-w-[180px] truncate">
                            {task.title}
                            <div className="mt-1">
                              <Badge 
                                variant={
                                  task.priority === 'high' ? 'destructive' : 
                                  task.priority === 'medium' ? 'default' : 
                                  'outline'
                                }
                                className="text-[10px]"
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-[120px] truncate">
                            {task.assignedTo}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-sm">
                            {getFormattedDate(task.dueDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <CheckCircle2 className="h-10 w-10 mx-auto text-muted-foreground mb-2 opacity-60" />
                  <p className="text-sm text-muted-foreground">
                    {t('company.dashboard.noTasks', 'No upcoming tasks found')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Access Navigation */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Link href="/dashboard/company/settings">
            <Card className="border-muted/40 transition-all hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Settings className="h-6 w-6" />
                </div>
                <CardTitle>{t('company.nav.settings', 'Company Settings')}</CardTitle>
                <CardDescription>{t('company.nav.settingsDesc', 'Manage company preferences')}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/dashboard/company/members">
            <Card className="border-muted/40 transition-all hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>{t('company.nav.members', 'Members')}</CardTitle>
                <CardDescription>{t('company.nav.membersDesc', 'Manage team members')}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/dashboard/clients">
            <Card className="border-muted/40 transition-all hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <UserSquare2 className="h-6 w-6" />
                </div>
                <CardTitle>{t('company.nav.clients', 'Clients')}</CardTitle>
                <CardDescription>{t('company.nav.clientsDesc', 'Manage client accounts')}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/dashboard/tasks">
            <Card className="border-muted/40 transition-all hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle>{t('company.nav.tasks', 'Tasks')}</CardTitle>
                <CardDescription>{t('company.nav.tasksDesc', 'View and manage tasks')}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}