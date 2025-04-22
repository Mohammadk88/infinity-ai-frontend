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
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/app/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

interface CompanyStats {
  totalMembers: number;
  totalClients: number;
  totalInteractions: number;
  upcomingTasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    assignedTo: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  latestInteractions: Array<{
    id: string;
    type: string;
    client: string;
    date: string;
    member: string;
  }>;
}

export default function CompanyDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompanyStats();
  }, []);

  const fetchCompanyStats = async () => {
    try {
      setIsLoading(true);
      const [membersRes, clientsRes, interactionsRes, tasksRes] = await Promise.all([
        api.get('/company-members?companyId=1'),
        api.get('/clients?companyId=1'),
        api.get('/interactions?companyId=1'),
        api.get('/tasks/upcoming?companyId=1')
      ]);

      setStats({
        totalMembers: membersRes.data.total,
        totalClients: clientsRes.data.total,
        totalInteractions: interactionsRes.data.total,
        upcomingTasks: tasksRes.data.tasks,
        latestInteractions: interactionsRes.data.latest
      });
    } catch (error) {
      console.error('Error fetching company stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('company.dashboard.title', 'Company Dashboard')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('company.dashboard.subtitle', 'Monitor your company performance and activity')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCompanyStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('company.dashboard.refresh', 'Refresh')}
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            {t('company.dashboard.settings', 'Settings')}
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-muted/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('company.dashboard.totalMembers', 'Total Members')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-muted/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('company.dashboard.totalClients', 'Total Clients')}
            </CardTitle>
            <UserSquare2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-muted/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('company.dashboard.totalInteractions', 'Total Interactions')}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalInteractions || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-muted/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('company.dashboard.upcomingTasks', 'Upcoming Tasks')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.upcomingTasks?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-muted/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('company.dashboard.latestInteractions', 'Latest Interactions')}</CardTitle>
                <CardDescription>
                  {t('company.dashboard.recentInteractions', 'Most recent client interactions')}
                </CardDescription>
              </div>
              <Link href="/dashboard/interactions">
                <Button variant="ghost" className="gap-2">
                  {t('company.dashboard.viewAll', 'View All')}
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
            ) : stats?.latestInteractions && stats.latestInteractions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('company.dashboard.type', 'Type')}</TableHead>
                    <TableHead>{t('company.dashboard.client', 'Client')}</TableHead>
                    <TableHead>{t('company.dashboard.member', 'Member')}</TableHead>
                    <TableHead>{t('company.dashboard.date', 'Date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.latestInteractions.map((interaction) => (
                    <TableRow key={interaction.id}>
                      <TableCell className="font-medium">{interaction.type}</TableCell>
                      <TableCell>{interaction.client}</TableCell>
                      <TableCell>{interaction.member}</TableCell>
                      <TableCell>{new Date(interaction.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t('company.dashboard.noInteractions', 'No recent interactions found')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-muted/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('company.dashboard.upcomingTasks', 'Upcoming Tasks')}</CardTitle>
                <CardDescription>
                  {t('company.dashboard.nextTasks', 'Tasks due soon')}
                </CardDescription>
              </div>
              <Link href="/dashboard/tasks">
                <Button variant="ghost" className="gap-2">
                  {t('company.dashboard.viewAll', 'View All')}
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
            ) : stats?.upcomingTasks && stats.upcomingTasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('company.dashboard.task', 'Task')}</TableHead>
                    <TableHead>{t('company.dashboard.assignedTo', 'Assigned To')}</TableHead>
                    <TableHead>{t('company.dashboard.dueDate', 'Due Date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.upcomingTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t('company.dashboard.noTasks', 'No upcoming tasks found')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Navigation */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </div>
  );
}