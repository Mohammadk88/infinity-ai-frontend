'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  ClipboardList,
  Users,
  Calendar as CalendarIcon,
  ArrowRightLeft,
  PlayCircle,
  PauseCircle,
  Flag,
  Settings,
  Share2,
  ListChecks,
  Eye,
  Edit,
  Trash,
  BarChart3,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

// Types
type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'canceled';
type ProjectType = 'internal' | 'external';
type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  completedTasks: number;
  totalTasks: number;
}

interface Project {
  id: number;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  dueDate: string;
  clientId?: number;
  clientName?: string;
  teamMembers: number;
  progress: number;
  description: string;
  sprints: Sprint[];
  tasksCount: number;
  tasksCompleted: number;
}

// Mock project data
const projects: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    type: 'external',
    status: 'active',
    priority: 'high',
    startDate: '2025-02-15',
    dueDate: '2025-06-30',
    clientId: 1,
    clientName: 'TechCorp Inc.',
    teamMembers: 5,
    progress: 40,
    description: 'Complete redesign of the client website with new branding and improved UX.',
    sprints: [
      {
        id: 101,
        name: 'Design Sprint',
        startDate: '2025-02-15',
        endDate: '2025-03-01',
        status: 'completed',
        completedTasks: 12,
        totalTasks: 12
      },
      {
        id: 102,
        name: 'Frontend Development',
        startDate: '2025-03-02',
        endDate: '2025-04-15',
        status: 'completed',
        completedTasks: 15,
        totalTasks: 15
      },
      {
        id: 103,
        name: 'Backend Integration',
        startDate: '2025-04-16',
        endDate: '2025-05-30',
        status: 'active',
        completedTasks: 8,
        totalTasks: 20
      },
      {
        id: 104,
        name: 'Testing & Launch',
        startDate: '2025-06-01',
        endDate: '2025-06-30',
        status: 'planned',
        completedTasks: 0,
        totalTasks: 15
      }
    ],
    tasksCount: 62,
    tasksCompleted: 35
  },
  {
    id: 2,
    name: 'Mobile App Development',
    type: 'external',
    status: 'active',
    priority: 'high',
    startDate: '2025-03-01',
    dueDate: '2025-07-15',
    clientId: 4,
    clientName: 'Global Retail',
    teamMembers: 7,
    progress: 30,
    description: 'Develop a new mobile app for iOS and Android to improve the shopping experience.',
    sprints: [
      {
        id: 201,
        name: 'Requirements Gathering',
        startDate: '2025-03-01',
        endDate: '2025-03-15',
        status: 'completed',
        completedTasks: 10,
        totalTasks: 10
      },
      {
        id: 202,
        name: 'UI/UX Design',
        startDate: '2025-03-16',
        endDate: '2025-04-15',
        status: 'completed',
        completedTasks: 15,
        totalTasks: 15
      },
      {
        id: 203,
        name: 'Core Features',
        startDate: '2025-04-16',
        endDate: '2025-06-01',
        status: 'active',
        completedTasks: 12,
        totalTasks: 30
      }
    ],
    tasksCount: 75,
    tasksCompleted: 37
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    type: 'external',
    status: 'planning',
    priority: 'medium',
    startDate: '2025-05-01',
    dueDate: '2025-07-31',
    clientId: 2,
    clientName: 'Digital Solutions Ltd.',
    teamMembers: 4,
    progress: 10,
    description: 'Plan and execute a comprehensive digital marketing campaign.',
    sprints: [
      {
        id: 301,
        name: 'Strategy Planning',
        startDate: '2025-05-01',
        endDate: '2025-05-15',
        status: 'planned',
        completedTasks: 5,
        totalTasks: 12
      }
    ],
    tasksCount: 35,
    tasksCompleted: 5
  },
  {
    id: 4,
    name: 'CRM Implementation',
    type: 'internal',
    status: 'active',
    priority: 'urgent',
    startDate: '2025-01-15',
    dueDate: '2025-05-30',
    teamMembers: 6,
    progress: 65,
    description: 'Implement and customize a new CRM system for internal use and client management.',
    sprints: [
      {
        id: 401,
        name: 'Requirements & Planning',
        startDate: '2025-01-15',
        endDate: '2025-02-15',
        status: 'completed',
        completedTasks: 18,
        totalTasks: 18
      },
      {
        id: 402,
        name: 'Core Setup',
        startDate: '2025-02-16',
        endDate: '2025-03-31',
        status: 'completed',
        completedTasks: 25,
        totalTasks: 25
      },
      {
        id: 403,
        name: 'Custom Development',
        startDate: '2025-04-01',
        endDate: '2025-04-30',
        status: 'active',
        completedTasks: 15,
        totalTasks: 20
      }
    ],
    tasksCount: 83,
    tasksCompleted: 58
  },
  {
    id: 5,
    name: 'Product Launch',
    type: 'internal',
    status: 'on-hold',
    priority: 'high',
    startDate: '2025-03-10',
    dueDate: '2025-06-15',
    teamMembers: 8,
    progress: 25,
    description: 'Plan and coordinate the launch of our new flagship product.',
    sprints: [
      {
        id: 501,
        name: 'Pre-launch Marketing',
        startDate: '2025-03-10',
        endDate: '2025-04-15',
        status: 'completed',
        completedTasks: 15,
        totalTasks: 15
      },
      {
        id: 502,
        name: 'Event Planning',
        startDate: '2025-04-16',
        endDate: '2025-05-15',
        status: 'on-hold',
        completedTasks: 5,
        totalTasks: 20
      }
    ],
    tasksCount: 45,
    tasksCompleted: 20
  },
  {
    id: 6,
    name: 'Infrastructure Upgrade',
    type: 'internal',
    status: 'planning',
    priority: 'medium',
    startDate: '2025-05-15',
    dueDate: '2025-08-15',
    teamMembers: 3,
    progress: 5,
    description: 'Upgrade server infrastructure and migrate to new cloud platform.',
    sprints: [
      {
        id: 601,
        name: 'Audit & Planning',
        startDate: '2025-05-15',
        endDate: '2025-06-15',
        status: 'planned',
        completedTasks: 3,
        totalTasks: 15
      }
    ],
    tasksCount: 30,
    tasksCompleted: 3
  },
  {
    id: 7,
    name: 'Brand Redesign',
    type: 'external',
    status: 'completed',
    priority: 'medium',
    startDate: '2024-12-01',
    dueDate: '2025-03-01',
    clientId: 3,
    clientName: 'Creative Media Group',
    teamMembers: 4,
    progress: 100,
    description: 'Complete brand overhaul including logo, style guide, and brand voice.',
    sprints: [
      {
        id: 701,
        name: 'Research & Discovery',
        startDate: '2024-12-01',
        endDate: '2024-12-15',
        status: 'completed',
        completedTasks: 10,
        totalTasks: 10
      },
      {
        id: 702,
        name: 'Conceptualization',
        startDate: '2024-12-16',
        endDate: '2025-01-15',
        status: 'completed',
        completedTasks: 15,
        totalTasks: 15
      },
      {
        id: 703,
        name: 'Finalization & Delivery',
        startDate: '2025-01-16',
        endDate: '2025-03-01',
        status: 'completed',
        completedTasks: 25,
        totalTasks: 25
      }
    ],
    tasksCount: 50,
    tasksCompleted: 50
  },
  {
    id: 8,
    name: 'Content Strategy',
    type: 'external',
    status: 'canceled',
    priority: 'low',
    startDate: '2025-01-10',
    dueDate: '2025-04-10',
    clientId: 5,
    clientName: 'Innovative Designs',
    teamMembers: 2,
    progress: 15,
    description: 'Develop comprehensive content strategy and calendar for social media and blog.',
    sprints: [
      {
        id: 801,
        name: 'Audit & Analysis',
        startDate: '2025-01-10',
        endDate: '2025-01-31',
        status: 'completed',
        completedTasks: 8,
        totalTasks: 8
      },
      {
        id: 802,
        name: 'Strategy Development',
        startDate: '2025-02-01',
        endDate: '2025-03-01',
        status: 'canceled',
        completedTasks: 3,
        totalTasks: 12
      }
    ],
    tasksCount: 25,
    tasksCompleted: 11
  }
];

// Configuration for project status display
const statusConfig = {
  'planning': {
    label: 'Planning',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    icon: <ClipboardList className="h-4 w-4" />
  },
  'active': {
    label: 'Active',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    icon: <PlayCircle className="h-4 w-4" />
  },
  'on-hold': {
    label: 'On Hold',
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    icon: <PauseCircle className="h-4 w-4" />
  },
  'completed': {
    label: 'Completed',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30',
    textColor: 'text-green-600 dark:text-green-400',
    icon: <CheckCircle className="h-4 w-4" />
  },
  'canceled': {
    label: 'Canceled',
    color: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    textColor: 'text-slate-600 dark:text-slate-400',
    icon: <AlertCircle className="h-4 w-4" />
  }
};

// Configuration for project priority display
const priorityConfig = {
  'low': {
    label: 'Low',
    color: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    textColor: 'text-slate-600 dark:text-slate-400'
  },
  'medium': {
    label: 'Medium',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  'high': {
    label: 'High',
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400'
  },
  'urgent': {
    label: 'Urgent',
    color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30',
    textColor: 'text-red-600 dark:text-red-400'
  }
};

// Configuration for project types
const typeConfig = {
  'internal': {
    label: 'Internal',
    color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    icon: <Settings className="h-3 w-3" />
  },
  'external': {
    label: 'External',
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    icon: <Building className="h-3 w-3" />
  }
};

// Summary statistics
const projectStats = [
  {
    title: 'Total Projects',
    value: projects.length,
    icon: <ClipboardList className="h-5 w-5" />
  },
  {
    title: 'Active Projects',
    value: projects.filter(project => project.status === 'active').length,
    icon: <PlayCircle className="h-5 w-5" />
  },
  {
    title: 'Client Projects',
    value: projects.filter(project => project.type === 'external').length,
    icon: <Building className="h-5 w-5" />
  },
  {
    title: 'Completion Rate',
    value: `${Math.round((projects.filter(project => project.status === 'completed').length / projects.length) * 100)}%`,
    icon: <BarChart3 className="h-5 w-5" />
  }
];

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Filter projects based on search query
    if (value) {
      setFilteredProjects(
        projects.filter(project => 
          project.name.toLowerCase().includes(value.toLowerCase()) || 
          (project.clientName && project.clientName.toLowerCase().includes(value.toLowerCase())) ||
          project.description.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      filterProjectsByTab(activeTab);
    }
  };

  // Filter projects based on selected tab
  const filterProjectsByTab = (tabValue: string) => {
    if (tabValue === 'all') {
      setFilteredProjects(projects);
    } else if (tabValue === 'internal') {
      setFilteredProjects(projects.filter(project => project.type === 'internal'));
    } else if (tabValue === 'external') {
      setFilteredProjects(projects.filter(project => project.type === 'external'));
    } else {
      setFilteredProjects(projects.filter(project => project.status === tabValue));
    }
    setActiveTab(tabValue);
  };

  const handleTabChange = (value: string) => {
    filterProjectsByTab(value);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('projects.title', 'Projects & Sprints')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('projects.subtitle', 'Manage your internal and client projects')}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1.5" />
          {t('projects.newProject', 'New Project')}
        </Button>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projectStats.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t(`projects.${stat.title.toLowerCase().replace(/\s+/g, '')}`, stat.title)}
                  </p>
                  <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                </div>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('projects.searchProjects', 'Search projects...')}
              className="pl-9 w-full md:w-[250px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter className="h-4 w-4" />
                <span className="sr-only">{t('projects.filter', 'Filter')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('projects.filterBy', 'Filter By')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('projects.highPriority', 'High Priority')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('projects.upcomingDeadlines', 'Upcoming Deadlines')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('projects.myProjects', 'My Projects')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('projects.clearFilters', 'Clear Filters')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="internal">Internal</TabsTrigger>
            <TabsTrigger value="external">Client</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Projects List */}
      <div className="grid gap-6">
        {filteredProjects.map(project => (
          <Card key={project.id} className="shadow-sm overflow-hidden">
            <div className={cn(
              "h-1.5",
              project.priority === 'urgent' ? 'bg-red-500' :
              project.priority === 'high' ? 'bg-amber-500' :
              project.priority === 'medium' ? 'bg-blue-500' :
              'bg-slate-500'
            )} />
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "flex items-center gap-1 px-1.5",
                        typeConfig[project.type].color,
                        typeConfig[project.type].textColor
                      )}
                    >
                      {typeConfig[project.type].icon}
                      <span>{typeConfig[project.type].label}</span>
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "flex items-center gap-1 px-1.5",
                        statusConfig[project.status].color,
                        statusConfig[project.status].textColor
                      )}
                    >
                      {statusConfig[project.status].icon}
                      <span>{statusConfig[project.status].label}</span>
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        priorityConfig[project.priority].color,
                        priorityConfig[project.priority].textColor
                      )}
                    >
                      {priorityConfig[project.priority].label} Priority
                    </Badge>
                    
                    {project.clientName && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Building className="h-3 w-3 mr-1" />
                        <span>{project.clientName}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    {t('projects.viewDetails', 'View Details')}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t('projects.moreOptions', 'More Options')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        {t('projects.editProject', 'Edit Project')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('projects.addSprint', 'Add Sprint')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <ListChecks className="h-4 w-4 mr-2" />
                        {t('projects.manageTasks', 'Manage Tasks')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {t('projects.manageTeam', 'Manage Team')}
                      </DropdownMenuItem>
                      {project.type === 'external' && (
                        <DropdownMenuItem className="flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          {t('projects.clientDetails', 'Client Details')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="flex items-center">
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('projects.shareProject', 'Share Project')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center text-destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        {t('projects.deleteProject', 'Delete Project')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-1">
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{formatDate(project.startDate)} - {formatDate(project.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{project.teamMembers} team members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ListChecks className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{project.tasksCompleted} / {project.tasksCount} tasks</span>
                  </div>
                </div>
                <div className="min-w-[120px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{t('projects.progress', 'Progress')}</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        project.progress < 25 ? "bg-red-500" :
                        project.progress < 50 ? "bg-amber-500" :
                        project.progress < 75 ? "bg-blue-500" :
                        "bg-emerald-500"
                      )} 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Sprints */}
              {project.sprints.length > 0 && (
                <div className="border rounded-md mt-4">
                  <div className="p-3 border-b bg-muted/30">
                    <h4 className="font-medium">{t('projects.sprints', 'Sprints')}</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('projects.sprintName', 'Sprint')}</TableHead>
                          <TableHead>{t('projects.status', 'Status')}</TableHead>
                          <TableHead>{t('projects.timeline', 'Timeline')}</TableHead>
                          <TableHead>{t('projects.tasks', 'Tasks')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {project.sprints.map(sprint => (
                          <TableRow key={sprint.id}>
                            <TableCell className="font-medium">{sprint.name}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "px-1.5",
                                  sprint.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30' :
                                  sprint.status === 'active' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30' :
                                  'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30'
                                )}
                              >
                                {sprint.status === 'completed' ? 'Completed' : 
                                 sprint.status === 'active' ? 'Active' : 'Planned'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-1 text-xs">
                                  <span>{sprint.completedTasks}/{sprint.totalTasks}</span>
                                  <span>{Math.round((sprint.completedTasks / sprint.totalTasks) * 100)}%</span>
                                </div>
                                <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full",
                                      sprint.status === 'completed' ? "bg-emerald-500" :
                                      "bg-amber-500"
                                    )} 
                                    style={{ width: `${(sprint.completedTasks / sprint.totalTasks) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-2 text-muted-foreground">{t('projects.noProjectsFound', 'No projects found')}</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-1.5" />
                {t('projects.createProject', 'Create Project')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}