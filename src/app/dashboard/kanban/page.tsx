'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  ChevronLeft, 
  Clock, 
  Users, 
  Moon,
  Sun,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignees?: string[];
  dueDate?: Date;
  tags?: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
  color: string;
}

export default function KanbanPage() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);
  const [dragSourceColumn, setDragSourceColumn] = useState<string | null>(null);
  
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { 
      id: 'backlog', 
      title: t('kanban.columns.backlog', 'Backlog'), 
      color: 'bg-slate-200 dark:bg-slate-800',
      tasks: [
        { 
          id: '1', 
          title: 'Research competitor marketing strategies',
          description: 'Analyze top 5 competitors and their social media presence',
          priority: 'medium',
          dueDate: new Date('2025-05-01'),
          tags: ['research', 'marketing']
        },
        { 
          id: '2', 
          title: 'Draft Q3 marketing plan',
          priority: 'high',
          tags: ['planning', 'q3']
        }
      ] 
    },
    { 
      id: 'todo', 
      title: t('kanban.columns.todo', 'To Do'), 
      color: 'bg-blue-200 dark:bg-blue-900',
      tasks: [
        { 
          id: '3', 
          title: 'Create social media content calendar',
          description: 'Plan out posts for the next two weeks',
          priority: 'high',
          dueDate: new Date('2025-04-25'),
          tags: ['content', 'planning']
        },
        { 
          id: '4', 
          title: 'Design new email templates',
          priority: 'medium',
          assignees: ['Sarah K'],
          tags: ['design', 'email']
        }
      ] 
    },
    { 
      id: 'in-progress', 
      title: t('kanban.columns.inProgress', 'In Progress'), 
      color: 'bg-amber-200 dark:bg-amber-900',
      tasks: [
        { 
          id: '5', 
          title: 'Write blog post about AI trends',
          priority: 'medium',
          dueDate: new Date('2025-04-20'),
          assignees: ['John D'],
          tags: ['content', 'ai']
        }
      ] 
    },
    { 
      id: 'review', 
      title: t('kanban.columns.review', 'Review'), 
      color: 'bg-purple-200 dark:bg-purple-900',
      tasks: [
        { 
          id: '6', 
          title: 'Review landing page copy',
          priority: 'high',
          dueDate: new Date('2025-04-18'),
          tags: ['copy', 'website']
        }
      ] 
    },
    { 
      id: 'done', 
      title: t('kanban.columns.done', 'Done'), 
      color: 'bg-green-200 dark:bg-green-900',
      tasks: [
        { 
          id: '7', 
          title: 'SEO keyword research',
          priority: 'medium',
          tags: ['seo', 'research']
        },
        { 
          id: '8', 
          title: 'Update team meeting agenda',
          priority: 'low',
          tags: ['internal']
        }
      ] 
    }
  ]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(newMode));
  };

  // Check system or saved preference for dark mode
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Drag and drop handlers
  const handleDragStart = (task: KanbanTask, columnId: string) => {
    setIsDragging(true);
    setDraggedTask(task);
    setDragSourceColumn(columnId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedTask(null);
    setDragSourceColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (!draggedTask || !dragSourceColumn || dragSourceColumn === columnId) return;
    
    // Make a copy of the columns
    const updatedColumns = [...columns];
    
    // Find source and destination column indexes
    const sourceColumnIndex = updatedColumns.findIndex(col => col.id === dragSourceColumn);
    const destColumnIndex = updatedColumns.findIndex(col => col.id === columnId);
    
    if (sourceColumnIndex < 0 || destColumnIndex < 0) return;
    
    // Remove task from source column
    const sourceColumn = updatedColumns[sourceColumnIndex];
    const taskIndex = sourceColumn.tasks.findIndex(t => t.id === draggedTask.id);
    
    if (taskIndex < 0) return;
    
    const [removedTask] = sourceColumn.tasks.splice(taskIndex, 1);
    
    // Add task to destination column
    updatedColumns[destColumnIndex].tasks.push(removedTask);
    
    // Update state
    setColumns(updatedColumns);
    handleDragEnd();
  };

  // Function to get priority badge
  const getPriorityBadge = (priority: KanbanTask['priority']) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800">{t('kanban.priority.high', 'High')}</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">{t('kanban.priority.medium', 'Medium')}</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800">{t('kanban.priority.low', 'Low')}</Badge>;
      default:
        return null;
    }
  };

  // Format date to display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Kanban header with back button and controls */}
      <div className="flex items-center justify-between p-4 border-b bg-background z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">
            {t('kanban.title', 'Project Kanban Board')}
          </h1>
          <Button variant="outline" size="sm" className="ml-4 h-7">
            <Users className="h-3.5 w-3.5 mr-1" />
            {t('kanban.team', 'Team')}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
            <input 
              className="h-8 rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              placeholder={t('kanban.search', 'Search tasks...')}
            />
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button variant="default" size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            {t('kanban.newTask', 'New Task')}
          </Button>
        </div>
      </div>
      
      {/* Main kanban board area */}
      <div className="flex-1 overflow-auto p-4 bg-muted/30">
        <div className="flex gap-4 h-full">
          {/* Kanban columns */}
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="flex-shrink-0 w-72"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column header */}
              <div className={cn("px-3 py-2 rounded-t-md", column.color)}>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{column.title} <span className="text-muted-foreground ml-1">({column.tasks.length})</span></h3>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Column tasks container */}
              <div 
                className="bg-background rounded-b-md p-2 min-h-[calc(100vh-150px)] max-h-[calc(100vh-150px)] overflow-y-auto flex flex-col gap-2 border-x border-b"
              >
                {column.tasks.map((task) => (
                  <Card 
                    key={task.id} 
                    className={cn(
                      "bg-card shadow-sm hover:shadow-md transition-all border cursor-move",
                      isDragging && draggedTask?.id === task.id ? "opacity-50" : "opacity-100"
                    )}
                    draggable="true"
                    onDragStart={() => handleDragStart(task, column.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <CardContent className="p-3">
                      <div className="mb-2">
                        {getPriorityBadge(task.priority)}
                      </div>
                      <h4 className="font-medium mb-1">{task.title}</h4>
                      {task.description && (
                        <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(task.dueDate)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          {task.tags?.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-muted text-xs rounded-sm">{tag}</span>
                          ))}
                        </div>
                      </div>
                      {task.assignees && task.assignees.length > 0 && (
                        <div className="flex items-center mt-2">
                          {task.assignees.map((assignee) => (
                            <div 
                              key={assignee} 
                              className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center"
                              title={assignee}
                            >
                              {assignee.charAt(0)}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {column.tasks.length === 0 && (
                  <div className="flex items-center justify-center h-20 border border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground">
                      {t('kanban.noTasks', 'No tasks yet')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Add column button */}
          <div className="flex-shrink-0 w-72 h-10">
            <Button variant="outline" className="h-10 w-full border-dashed">
              <Plus className="h-4 w-4 mr-1" />
              {t('kanban.addColumn', 'Add Column')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}