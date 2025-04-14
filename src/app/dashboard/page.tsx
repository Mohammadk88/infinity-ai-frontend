'use client';

import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Briefcase, 
  ClipboardList, 
  Target, 
  Building, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  CalendarClock, 
  Bell, 
  BarChart3, 
  LineChart 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock data for the dashboard
const statCards = [
  { 
    title: 'Total Clients', 
    value: '124', 
    change: '+12.5%', 
    isIncrease: true, 
    icon: <Users className="h-5 w-5" />,
    href: '/dashboard/clients' 
  },
  { 
    title: 'Active Projects', 
    value: '42', 
    change: '+9.1%', 
    isIncrease: true, 
    icon: <Briefcase className="h-5 w-5" />,
    href: '/dashboard/projects' 
  },
  { 
    title: 'Open Tasks', 
    value: '87', 
    change: '-4.3%', 
    isIncrease: false, 
    icon: <ClipboardList className="h-5 w-5" />,
    href: '/dashboard/tasks' 
  },
  { 
    title: 'Pending Leads', 
    value: '53', 
    change: '+18.2%', 
    isIncrease: true, 
    icon: <Target className="h-5 w-5" />,
    href: '/dashboard/leads' 
  },
];

const recentActivities = [
  { 
    id: 1, 
    type: 'task-completed', 
    title: 'Website Redesign',
    description: 'Homepage redesign completed',
    time: '10 minutes ago',
    user: 'Alex Johnson',
    client: 'TechCorp Inc.',
    icon: <ClipboardList className="h-4 w-4 text-green-500" />,
  },
  { 
    id: 2, 
    type: 'client-added', 
    title: 'New Client',
    description: 'Digital Solutions Ltd. added as a client',
    time: '1 hour ago',
    user: 'Sarah Miller',
    client: 'Digital Solutions Ltd.',
    icon: <Users className="h-4 w-4 text-blue-500" />,
  },
  { 
    id: 3, 
    type: 'lead-converted', 
    title: 'Lead Converted',
    description: 'Innovate Tech converted to client',
    time: '3 hours ago',
    user: 'David Wilson',
    client: 'Innovate Tech',
    icon: <Target className="h-4 w-4 text-purple-500" />,
  },
  { 
    id: 4, 
    type: 'project-milestone', 
    title: 'Project Milestone',
    description: 'Phase 1 completed for E-commerce Integration',
    time: 'Yesterday',
    user: 'Emma Davis',
    client: 'ShopEasy',
    icon: <Briefcase className="h-4 w-4 text-amber-500" />,
  },
  { 
    id: 5, 
    type: 'reminder-due', 
    title: 'Follow-up Reminder',
    description: 'Client meeting follow-up due',
    time: 'Yesterday',
    user: 'Michael Brown',
    client: 'Media Insights',
    icon: <Bell className="h-4 w-4 text-red-500" />,
  },
];

const upcomingReminders = [
  {
    id: 1,
    title: 'Client Meeting',
    client: 'TechCorp Inc.',
    date: 'Today',
    time: '2:30 PM',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Project Deadline',
    client: 'Digital Solutions Ltd.',
    date: 'Tomorrow',
    time: '11:00 AM',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Follow-up Call',
    client: 'Innovate Tech',
    date: 'Apr 16, 2025',
    time: '9:15 AM',
    priority: 'normal',
  },
];

const topClients = [
  {
    id: 1,
    name: 'TechCorp Inc.',
    activeProjects: 3,
    revenue: '$150,500',
    status: 'active',
    logo: '🏢', // In a real app, this would be an image path
  },
  {
    id: 2,
    name: 'Digital Solutions Ltd.',
    activeProjects: 2,
    revenue: '$98,750',
    status: 'active',
    logo: '🖥️',
  },
  {
    id: 3,
    name: 'Media Insights',
    activeProjects: 1,
    revenue: '$76,200',
    status: 'active',
    logo: '📱',
  },
  {
    id: 4,
    name: 'ShopEasy',
    activeProjects: 2,
    revenue: '$62,450',
    status: 'active',
    logo: '🛒',
  },
];

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('dashboard.title', 'CRM Dashboard')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.subtitle', 'Overview of your business activities and performance.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            {t('dashboard.exportReport', 'Export Report')}
          </Button>
          <Button size="sm">
            {t('dashboard.createNew', 'Create New')}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link href={stat.href} key={index} className="block">
            <Card className="hover:shadow-md transition-all duration-300 hover:border-primary/20 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t(`dashboard.${stat.title.toLowerCase().replace(' ', '')}`, stat.title)}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <h3 className="text-3xl font-semibold tracking-tight">{stat.value}</h3>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "font-medium",
                          stat.isIncrease 
                            ? "text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30" 
                            : "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30"
                        )}
                      >
                        <span className="inline-flex items-center">
                          {stat.isIncrease ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                          {stat.change}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle>{t('dashboard.recentActivities', 'Recent Activities')}</CardTitle>
              <CardDescription>{t('dashboard.latestActions', 'Latest actions in your CRM')}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              {t('dashboard.viewAll', 'View All')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 -mt-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 py-4 border-b last:border-0">
                  <div className="flex-shrink-0 p-1.5 rounded-full bg-background border">
                    {activity.icon}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-base truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">{activity.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <Badge variant="outline" className="bg-muted/50">
                        {activity.user}
                      </Badge>
                      <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                        {activity.client}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="flex items-center justify-between">
              {t('dashboard.upcomingReminders', 'Upcoming Reminders')}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>{t('dashboard.nextDueDates', 'Next follow-ups and due dates')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-1">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="bg-muted/40 border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{reminder.title}</p>
                    <Badge 
                      className={cn(
                        "text-xs",
                        reminder.priority === 'high' && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
                        reminder.priority === 'medium' && "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
                        reminder.priority === 'normal' && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{reminder.client}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">{reminder.date}</span>
                    <span>•</span>
                    <span>{reminder.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full" variant="outline">
              {t('dashboard.viewAllReminders', 'View All Reminders')}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle>{t('dashboard.performanceMetrics', 'Performance Metrics')}</CardTitle>
              <CardDescription>{t('dashboard.revenueAndLeads', 'Revenue and lead metrics')}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Monthly
              </Button>
              <Button variant="outline" size="sm">
                Quarterly
              </Button>
              <Button variant="outline" size="sm">
                Yearly
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] flex items-center justify-center border-t pt-6">
            {/* In a real app, this would be a chart component */}
            <div className="text-center">
              <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">Performance chart will appear here</p>
              <p className="text-xs text-muted-foreground">
                Integrate a chart library like <code>recharts</code> or <code>chart.js</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader className="pb-2 space-y-0">
            <CardTitle>{t('dashboard.topClients', 'Top Clients')}</CardTitle>
            <CardDescription>{t('dashboard.highestRevenue', 'Clients by revenue')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-1">
              {topClients.map((client) => (
                <div key={client.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    {client.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{client.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {client.activeProjects} {client.activeProjects === 1 ? 'project' : 'projects'}
                      </span>
                      <span>•</span>
                      <span>{client.revenue}</span>
                    </div>
                  </div>
                  <Badge variant={client.status === 'active' ? 'outline' : 'secondary'} className="capitalize">
                    {client.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full">
              {t('dashboard.viewAllClients', 'View All Clients')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}