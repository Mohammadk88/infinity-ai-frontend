'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ListTodo,
  MessageSquare,
  User,
  Calendar as CalendarIcon,
  Edit2,
  Trash,
  ChevronDown,
  ArrowUpDown,
  ClipboardList,
  Briefcase,
  UserPlus,
  Target,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Types
type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type ModuleType = 'post' | 'campaign' | 'project' | 'lead' | 'client';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo: string;
  assignedToAvatar?: string;
  createdAt: string;
  moduleType?: ModuleType;
  moduleId?: string;
  moduleName?: string;
  comments: number;
}

// Mock data
const tasks: Task[] = [
  {
    id: '1',
    title: 'Create social media content plan',
    description: 'Develop a comprehensive social media content plan for Q2',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-04-20',
    assignedTo: 'Sarah Miller',
    createdAt: '2025-04-10',
    moduleType: 'campaign',
    moduleId: '101',
    moduleName: 'Summer Marketing Campaign',
    comments: 3
  },
  {
    id: '2',
    title: 'Design new landing page',
    description: 'Create wireframes and design mockups for the new product landing page',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-04-18',
    assignedTo: 'David Wilson',
    createdAt: '2025-04-09',
    moduleType: 'project',
    moduleId: '202',
    moduleName: 'Website Redesign',
    comments: 5
  },
  {
    id: '3',
    title: 'Prepare quarterly report',
    description: 'Compile analytics data and prepare the Q1 performance report',
    status: 'review',
    priority: 'medium',
    dueDate: '2025-04-16',
    assignedTo: 'Michael Brown',
    createdAt: '2025-04-08',
    comments: 2
  },
  {
    id: '4',
    title: 'Schedule client onboarding call',
    description: 'Set up and prepare materials for the introductory call with the new client',
    status: 'done',
    priority: 'high',
    dueDate: '2025-04-12',
    assignedTo: 'Emma Davis',
    createdAt: '2025-04-05',
    moduleType: 'client',
    moduleId: '303',
    moduleName: 'TechCorp Inc.',
    comments: 0
  },
  {
    id: '5',
    title: 'Fix website navigation bug',
    description: 'Address the issue with the dropdown menu in the mobile navigation',
    status: 'blocked',
    priority: 'urgent',
    dueDate: '2025-04-15',
    assignedTo: 'Alex Johnson',
    createdAt: '2025-04-11',
    moduleType: 'project',
    moduleId: '202',
    moduleName: 'Website Redesign',
    comments: 7
  },
  {
    id: '6',
    title: 'Write blog article',
    description: 'Create a blog post about the latest industry trends',
    status: 'todo',
    priority: 'low',
    dueDate: '2025-04-25',
    assignedTo: 'Sarah Miller',
    createdAt: '2025-04-12',
    moduleType: 'post',
    moduleId: '404',
    moduleName: 'Industry Trends Blog',
    comments: 1
  },
  {
    id: '7',
    title: 'Update product pricing page',
    description: 'Update the pricing information based on the new packages',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-04-17',
    assignedTo: 'David Wilson',
    createdAt: '2025-04-10',
    comments: 0
  },
  {
    id: '8',
    title: 'Follow up with potential lead',
    description: 'Send a follow-up email to the lead from the conference',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-04-19',
    assignedTo: 'Michael Brown',
    createdAt: '2025-04-13',
    moduleType: 'lead',
    moduleId: '505',
    moduleName: 'Innovate Tech',
    comments: 2
  }
];

// Status configuration with colors and icons
const statusConfig = {
  'todo': {
    label: 'To Do',
    icon: <ListTodo className="h-4 w-4" />,
    color: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    textColor: 'text-slate-600 dark:text-slate-300'
  },
  'in-progress': {
    label: 'In Progress',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  'review': {
    label: 'In Review',
    icon: <Calendar className="h-4 w-4" />,
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400'
  },
  'done': {
    label: 'Done',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400'
  },
  'blocked': {
    label: 'Blocked',
    icon: <XCircle className="h-4 w-4" />,
    color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30',
    textColor: 'text-red-600 dark:text-red-400'
  }
};

// Priority configuration with colors
const priorityConfig = {
  'low': {
    label: 'Low',
    color: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    textColor: 'text-slate-600 dark:text-slate-300'
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

// Module type configuration with colors and icons
const moduleConfig = {
  'post': {
    label: 'Post',
    icon: <MessageSquare className="h-3 w-3" />,
    color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/30',
    textColor: 'text-indigo-600 dark:text-indigo-400'
  },
  'campaign': {
    label: 'Campaign',
    icon: <Calendar className="h-3 w-3" />,
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  'project': {
    label: 'Project',
    icon: <ListTodo className="h-3 w-3" />,
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400'
  },
  'lead': {
    label: 'Lead',
    icon: <User className="h-3 w-3" />,
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400'
  },
  'client': {
    label: 'Client',
    icon: <User className="h-3 w-3" />,
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400'
  }
};

export default function TasksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  // Group tasks by status for stats
  const tasksByStatus = useMemo(() => {
    const groupedTasks: Record<TaskStatus, Task[]> = {
      'todo': [],
      'in-progress': [],
      'review': [],
      'done': [],
      'blocked': []
    };
    
    filteredTasks.forEach(task => {
      groupedTasks[task.status].push(task);
    });
    
    return groupedTasks;
  }, [filteredTasks]);
  
  // Handlers for task actions
  const handleAddTask = useCallback(() => {
    console.log('Add task');
    // Implementation would go here
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    console.log('Edit task', task);
    // Implementation would go here
  }, []);

  const handleDeleteTask = useCallback((task: Task) => {
    console.log('Delete task', task);
    // Implementation would go here
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Filter tasks based on search query
    if (value) {
      setFilteredTasks(
        tasks.filter(task => 
          task.title.toLowerCase().includes(value.toLowerCase()) || 
          task.description.toLowerCase().includes(value.toLowerCase()) ||
          task.assignedTo.toLowerCase().includes(value.toLowerCase()) ||
          (task.moduleName && task.moduleName.toLowerCase().includes(value.toLowerCase()))
        )
      );
    } else {
      setFilteredTasks(tasks);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('tasks.title', 'Tasks')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('tasks.subtitle', 'Manage and organize your team tasks')}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/kanban">
            <Button variant="outline" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              {t('tasks.kanbanBoard', 'Kanban Board')}
            </Button>
          </Link>
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-1.5" />
            {t('tasks.addTask', 'Add Task')}
          </Button>
        </div>
      </div>

      {/* Task Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <Card key={status} className={cn("shadow-sm", statusConfig[status as TaskStatus].color)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {statusConfig[status as TaskStatus].icon}
                  <h3 className={cn("font-medium text-sm", statusConfig[status as TaskStatus].textColor)}>
                    {statusConfig[status as TaskStatus].label}
                  </h3>
                </div>
                <Badge variant="outline" className={cn("bg-background/60", statusConfig[status as TaskStatus].textColor)}>
                  {statusTasks.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Banner to highlight Kanban view option */}
      <Card className="border border-primary/10 bg-primary/5 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{t('tasks.preferKanban', 'Prefer a visual workflow?')}</h3>
              <p className="text-sm text-muted-foreground">{t('tasks.kanbanDescription', 'Try our Kanban board view for drag-and-drop task management')}</p>
            </div>
          </div>
          <Link href="/dashboard/kanban">
            <Button className="gap-2">
              {t('tasks.openKanban', 'Open Kanban Board')}
              <ChevronDown className="h-4 w-4 rotate-[270deg]" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('tasks.searchTasks', 'Search tasks...')}
              className="pl-9 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter className="h-4 w-4" />
                <span className="sr-only">{t('tasks.filter', 'Filter')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('tasks.filterBy', 'Filter By')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{t('tasks.status', 'Status')}</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(statusConfig).map(([key, status]) => (
                    <Button 
                      key={key} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start h-7 px-2 font-normal"
                    >
                      {status.icon}
                      <span className="ml-1.5 text-xs">{status.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{t('tasks.priority', 'Priority')}</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(priorityConfig).map(([key, priority]) => (
                    <Button 
                      key={key} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start h-7 px-2 font-normal"
                    >
                      <span className={cn("h-2 w-2 rounded-full mr-1.5", priority.color)} />
                      <span className="text-xs">{priority.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{t('tasks.assignedTo', 'Assigned To')}</p>
                <Input 
                  placeholder={t('tasks.searchUser', 'Search user...')} 
                  className="h-7 text-xs mb-1"
                />
                <div className="max-h-32 overflow-y-auto">
                  {['Alex Johnson', 'Sarah Miller', 'David Wilson', 'Emma Davis', 'Michael Brown'].map((user) => (
                    <Button 
                      key={user} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start w-full h-7 px-2 font-normal mb-1"
                    >
                      <User className="h-3 w-3 mr-1.5" />
                      <span className="text-xs">{user}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button variant="ghost" className="w-full justify-center text-xs h-7">
                  {t('tasks.clearFilters', 'Clear Filters')}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5" />
            {t('tasks.sort', 'Sort')}
            <ChevronDown className="h-3.5 w-3.5 ml-0.5" />
          </Button>
        </div>
        
        <Link href="/dashboard/kanban" className="hidden sm:flex">
          <Button variant="outline" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            {t('tasks.viewKanban', 'View as Kanban')}
          </Button>
        </Link>
      </div>

      {/* List View */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t('tasks.allTasks', 'All Tasks')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-1">
            {filteredTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center border-b last:border-0 p-3 hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{task.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] h-5 px-1.5 flex items-center",
                        statusConfig[task.status].color,
                        statusConfig[task.status].textColor
                      )}
                    >
                      {statusConfig[task.status].icon}
                      <span className="ml-1">{statusConfig[task.status].label}</span>
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] h-5 px-1.5",
                        priorityConfig[task.priority].color,
                        priorityConfig[task.priority].textColor
                      )}
                    >
                      {priorityConfig[task.priority].label}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{task.description}</p>
                  
                  <div className="flex items-center gap-4 mt-1.5 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{task.assignedTo}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    
                    {task.moduleType && (
                      <div className="flex items-center gap-1">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] h-4 px-1 flex items-center w-fit",
                            moduleConfig[task.moduleType].color,
                            moduleConfig[task.moduleType].textColor
                          )}
                        >
                          {moduleConfig[task.moduleType].icon}
                          <span className="ml-1">{task.moduleName}</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleEditTask(task)}
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">{t('tasks.edit', 'Edit')}</span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t('tasks.moreOptions', 'More Options')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditTask(task)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        {t('tasks.editTask', 'Edit Task')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteTask(task)} 
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        {t('tasks.deleteTask', 'Delete Task')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <ClipboardList className="h-12 w-12 text-muted-foreground opacity-30" />
                <p className="mt-2 text-muted-foreground">{t('tasks.noTasksFound', 'No tasks found')}</p>
                <Button className="mt-4" onClick={handleAddTask} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  {t('tasks.addTask', 'Add Task')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add integration with other modules */}
      <div className="fixed bottom-6 right-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-2 mb-2" align="end">
            <DropdownMenuItem onClick={handleAddTask} className="cursor-pointer">
              <ClipboardList className="h-4 w-4 mr-2" />
              <span>{t('tasks.createTask', 'Create Task')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/kanban')} className="cursor-pointer">
              <LayoutGrid className="h-4 w-4 mr-2" />
              <span>{t('tasks.viewKanban', 'View as Kanban')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/projects')} className="cursor-pointer">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>{t('tasks.linkToProject', 'Link to Project')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/clients')} className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              <span>{t('tasks.linkToClient', 'Link to Client')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/leads')} className="cursor-pointer">
              <Target className="h-4 w-4 mr-2" />
              <span>{t('tasks.linkToLead', 'Link to Lead')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}