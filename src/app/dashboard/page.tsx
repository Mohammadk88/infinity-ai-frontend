'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  BarChart3, 
  Bell, 
  Briefcase, 
  Building, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Plus, 
  Share2, 
  Target, 
  Users, 
  UserPlus,
  ClipboardList,
  Activity,
  User,
  CheckCircle,
  XCircle,
  PieChart,
  Sparkles
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/store/useUserStore';

// Mock data for dashboard metrics
const metrics = {
  activeClients: 24,
  activeProjects: 18,
  pendingTasks: 43,
  openLeads: 12,
  upcomingDeadlines: 8,
  totalRevenue: '$142,500',
  growth: 15.2
};

interface ActivityItem {
  id: string;
  type: 'task' | 'lead' | 'project' | 'meeting';
  title: string;
  status?: string;
  time: string;
  user: string;
}

const recentActivity: ActivityItem[] = [
  { id: '1', type: 'task', title: 'Landing page design completed', status: 'completed', time: '35m ago', user: 'Sarah Miller' },
  { id: '2', type: 'lead', title: 'New lead from TechCorp', time: '1h ago', user: 'Michael Brown' },
  { id: '3', type: 'project', title: 'Website Redesign Phase 1 started', status: 'in-progress', time: '2h ago', user: 'David Wilson' },
  { id: '4', type: 'meeting', title: 'Client onboarding call scheduled', time: '3h ago', user: 'Emma Davis' },
  { id: '5', type: 'task', title: 'Content calendar updated', status: 'completed', time: '5h ago', user: 'Sarah Miller' },
];

interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project?: string;
}

const upcomingTasks: UpcomingTask[] = [
  { id: '1', title: 'Finalize Q2 marketing strategy', dueDate: 'Apr 15', priority: 'high', project: 'Marketing Planning' },
  { id: '2', title: 'Review website design mockups', dueDate: 'Apr 16', priority: 'medium', project: 'Website Redesign' },
  { id: '3', title: 'Prepare client presentation', dueDate: 'Apr 17', priority: 'high', project: 'Client Onboarding' },
  { id: '4', title: 'Social media content approval', dueDate: 'Apr 18', priority: 'medium', project: 'Social Media Campaign' },
  { id: '5', title: 'Update product roadmap', dueDate: 'Apr 21', priority: 'low', project: 'Product Development' },
];

interface StatusCard {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  change?: number;
  indicator?: 'up' | 'down' | 'neutral';
}

const statusCards: StatusCard[] = [
  {
    title: 'Active Clients',
    value: metrics.activeClients,
    description: 'dashboard.totalActiveClients',
    icon: <UserPlus className="h-4 w-4" />,
    change: 4,
    indicator: 'up'
  },
  {
    title: 'Active Projects',
    value: metrics.activeProjects,
    description: 'dashboard.ongoingProjects',
    icon: <Briefcase className="h-4 w-4" />,
    change: 2,
    indicator: 'up'
  },
  {
    title: 'Pending Tasks',
    value: metrics.pendingTasks,
    description: 'dashboard.tasksToComplete',
    icon: <ClipboardList className="h-4 w-4" />,
    change: 12,
    indicator: 'up'
  },
  {
    title: 'Open Leads',
    value: metrics.openLeads,
    description: 'dashboard.leadsToContact',
    icon: <Target className="h-4 w-4" />,
    change: -3,
    indicator: 'down'
  },
];

// Project progress data for chart
interface ProjectProgress {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
}

const projectProgress: ProjectProgress[] = [
  { id: '1', name: 'Website Redesign', progress: 65, status: 'on-track' },
  { id: '2', name: 'Mobile App Development', progress: 42, status: 'at-risk' },
  { id: '3', name: 'Marketing Campaign', progress: 78, status: 'on-track' },
  { id: '4', name: 'CRM Integration', progress: 30, status: 'delayed' },
];

// Lead status data for chart
interface LeadStatusData {
  label: string;
  value: number;
  color: string;
}

const leadStatusData: LeadStatusData[] = [
  { label: 'New', value: 24, color: 'rgb(59, 130, 246)' },
  { label: 'Contacted', value: 35, color: 'rgb(168, 85, 247)' },
  { label: 'Qualified', value: 18, color: 'rgb(16, 185, 129)' },
  { label: 'Proposal', value: 12, color: 'rgb(245, 158, 11)' },
  { label: 'Negotiation', value: 9, color: 'rgb(239, 68, 68)' },
  { label: 'Closed Won', value: 15, color: 'rgb(22, 163, 74)' },
  { label: 'Closed Lost', value: 7, color: 'rgb(120, 113, 108)' },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render the dashboard until it's mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const getStatusColor = (status: ProjectProgress['status']) => {
    switch (status) {
      case 'on-track': return 'text-green-500';
      case 'at-risk': return 'text-amber-500';
      case 'delayed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getProgressColor = (status: ProjectProgress['status']) => {
    switch (status) {
      case 'on-track': return 'bg-green-500';
      case 'at-risk': return 'bg-amber-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  const getPriorityColor = (priority: UpcomingTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'medium': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'low': return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPriorityLabel = (priority: UpcomingTask['priority']) => {
    switch (priority) {
      case 'urgent': return t('priority.urgent', 'Urgent');
      case 'high': return t('priority.high', 'High');
      case 'medium': return t('priority.medium', 'Medium');
      case 'low': return t('priority.low', 'Low');
      default: return t('priority.medium', 'Medium');
    }
  };

  const formatChange = (change: number) => {
    return `${change > 0 ? '+' : ''}${change}%`;
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'task': return <ClipboardList className="h-4 w-4" />;
      case 'lead': return <Target className="h-4 w-4" />;
      case 'project': return <Briefcase className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('status.completed', 'Completed')}
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {t('status.inProgress', 'In Progress')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('dashboard.welcome', 'Welcome back')}, {user?.name?.split(' ')[0] || t('dashboard.user', 'User')}
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.summary', 'Here\'s a summary of your CRM activity')}
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/tasks/create')}>
          <Plus className="mr-2 h-4 w-4" /> {t('dashboard.newTask', 'New Task')}
        </Button>
      </div>

      {/* Tabs for different dashboard views */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('dashboard.tabs.overview', 'Overview')}</TabsTrigger>
          <TabsTrigger value="projects">{t('dashboard.tabs.projects', 'Projects')}</TabsTrigger>
          <TabsTrigger value="clients">{t('dashboard.tabs.clients', 'Clients')}</TabsTrigger>
          <TabsTrigger value="leads">{t('dashboard.tabs.leads', 'Leads')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusCards.map((card) => (
              <Card key={card.title} className="overflow-hidden border-muted/40">
                <CardHeader className="pb-2 pt-4">
                  <div className="flex justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t(`dashboard.metrics.${card.title.toLowerCase().replace(/\s/g, '')}`, card.title)}
                    </CardTitle>
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      {card.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(card.description, card.description)}
                  </p>
                </CardContent>
                {card.change !== undefined && (
                  <CardFooter className="pt-0 pb-4">
                    <div className={`text-xs flex items-center ${card.indicator === 'up' ? 'text-green-500' : card.indicator === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {card.indicator === 'up' ? '↑' : card.indicator === 'down' ? '↓' : '•'}
                      <span className="ml-1">{formatChange(card.change)} {t('dashboard.fromLastMonth', 'from last month')}</span>
                    </div>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Project Progress Card */}
            <Card className="border-muted/40 col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{t('dashboard.projectProgress', 'Project Progress')}</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                    {t('dashboard.viewAll', 'View all')} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectProgress.map(project => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{project.name}</div>
                        <div className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status === 'on-track' && t('project.status.onTrack', 'On Track')}
                          {project.status === 'at-risk' && t('project.status.atRisk', 'At Risk')}
                          {project.status === 'delayed' && t('project.status.delayed', 'Delayed')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(project.status)}`} 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">{project.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lead Status Card */}
            <Card className="border-muted/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{t('dashboard.leadStatus', 'Lead Status')}</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                    {t('dashboard.viewAll', 'View all')} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-[150px] w-full">
                  {/* Showing a placeholder for a pie chart - in a real app you'd use a chart library */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PieChart className="h-32 w-32 text-primary opacity-10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold">{leadStatusData.reduce((acc, item) => acc + item.value, 0)}</div>
                      <div className="text-xs text-muted-foreground">{t('dashboard.totalLeads', 'Total Leads')}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {leadStatusData.map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs">{t(`lead.status.${item.label.toLowerCase().replace(/\s/g, '')}`, item.label)}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Recent Activity Card */}
            <Card className="border-muted/40 lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{t('dashboard.recentActivity', 'Recent Activity')}</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                    {t('dashboard.viewAll', 'View all')} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentActivity.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-4">
                      <div className="mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getActivityIcon(item.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <p className="text-sm font-medium">{item.title}</p>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {item.user}
                          </div>
                          <div className="hidden sm:block">•</div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {item.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks Card */}
            <Card className="border-muted/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{t('dashboard.upcomingTasks', 'Upcoming Tasks')}</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                    {t('dashboard.viewAll', 'View all')} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {upcomingTasks.map(task => (
                    <div key={task.id} className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {task.dueDate}
                        </span>
                      </div>
                      <p className="font-medium text-sm mt-1.5">{task.title}</p>
                      {task.project && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          <Briefcase className="inline h-3 w-3 mr-1" />
                          {task.project}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CRM Module Quick Access */}
          <h2 className="mt-8 text-xl font-semibold">{t('dashboard.quickAccess', 'Quick Access')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/clients">
              <Card className="border-muted/40 transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <CardTitle>{t('dashboard.modules.clients', 'Client Management')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.modules.clientsDesc', 'Manage clients, contacts, and interactions')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link href="/dashboard/projects">
              <Card className="border-muted/40 transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <CardTitle>{t('dashboard.modules.projects', 'Projects & Sprints')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.modules.projectsDesc', 'Track projects, milestones, and deliverables')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link href="/dashboard/tasks">
              <Card className="border-muted/40 transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <CardTitle>{t('dashboard.modules.tasks', 'Tasks')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.modules.tasksDesc', 'Manage tasks with Kanban and list views')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            
            <Link href="/dashboard/leads">
              <Card className="border-muted/40 transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Target className="h-6 w-6" />
                  </div>
                  <CardTitle>{t('dashboard.modules.leads', 'Lead Management')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.modules.leadsDesc', 'Capture, track, and convert sales leads')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          {/* Projects Tab Content */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('dashboard.activeProjects', 'Active Projects')}</h2>
            <Button size="sm" onClick={() => router.push('/dashboard/projects/create')}>
              <Plus className="mr-2 h-4 w-4" /> {t('projects.createNew', 'New Project')}
            </Button>
          </div>
          
          {/* Projects content would go here */}
          <Card className="border-muted/40">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-16 w-16 text-primary opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('dashboard.projectsTabPromo', 'Enhance Your Project Management')}</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  {t('dashboard.projectsTabDescription', 'Track project progress, manage team resources, and deliver on time with our powerful project management tools.')}
                </p>
                <Button onClick={() => router.push('/dashboard/projects')}>
                  {t('dashboard.exploreProjects', 'Explore Projects')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          {/* Clients Tab Content */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('dashboard.clientOverview', 'Client Overview')}</h2>
            <Button size="sm" onClick={() => router.push('/dashboard/clients/create')}>
              <Plus className="mr-2 h-4 w-4" /> {t('clients.addClient', 'Add Client')}
            </Button>
          </div>
          
          {/* Clients content would go here */}
          <Card className="border-muted/40">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UserPlus className="h-16 w-16 text-primary opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('dashboard.clientsTabPromo', 'Centralize Client Information')}</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  {t('dashboard.clientsTabDescription', 'Keep all your client information in one place. Track interactions, manage contacts, and improve your client relationships.')}
                </p>
                <Button onClick={() => router.push('/dashboard/clients')}>
                  {t('dashboard.manageClients', 'Manage Clients')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-4">
          {/* Leads Tab Content */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('dashboard.leadGeneration', 'Lead Generation')}</h2>
            <Button size="sm" onClick={() => router.push('/dashboard/leads/create')}>
              <Plus className="mr-2 h-4 w-4" /> {t('leads.addLead', 'Add Lead')}
            </Button>
          </div>
          
          {/* Leads content would go here */}
          <Card className="border-muted/40">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-16 w-16 text-primary opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('dashboard.leadsTabPromo', 'Optimize Lead Conversion')}</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  {t('dashboard.leadsTabDescription', 'Capture, nurture, and convert leads efficiently with automated workflows and customizable pipelines.')}
                </p>
                <Button onClick={() => router.push('/dashboard/leads')}>
                  {t('dashboard.exploreLeads', 'Explore Leads')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}