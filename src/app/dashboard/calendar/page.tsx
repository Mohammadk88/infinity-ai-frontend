'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Users,
  Building,
  User,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash,
  AlertCircle,
  Bell,
  Share2,
  Tag,
  Repeat,
  ClipboardList
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
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Types
type EventType = 'meeting' | 'deadline' | 'reminder' | 'task' | 'campaign';
type EventPriority = 'low' | 'medium' | 'high' | 'urgent';

interface EventAttendee {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  type: 'internal' | 'external';
  confirmed: boolean;
}

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  type: EventType;
  priority: EventPriority;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  location?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  attendees?: EventAttendee[];
  relatedEntityType?: 'client' | 'lead' | 'project' | 'campaign';
  relatedEntityId?: number;
  relatedEntityName?: string;
  tags: string[];
  color: string;
  notifications: {
    id: number;
    time: number;
    unit: 'minute' | 'hour' | 'day';
    sent: boolean;
  }[]
}

// Mock calendar data for the events
const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Client Meeting - TechCorp Inc.',
    description: 'Discuss website redesign project progress and next steps.',
    type: 'meeting',
    priority: 'high',
    startDate: '2025-04-15T10:00:00',
    endDate: '2025-04-15T11:30:00',
    allDay: false,
    location: 'Google Meet',
    isRecurring: true,
    recurrencePattern: 'Weekly on Tuesday',
    attendees: [
      { id: 1, name: 'John Smith', email: 'john@techcorp.com', type: 'external', confirmed: true },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', type: 'internal', confirmed: true },
      { id: 3, name: 'Alex Wong', email: 'alex@company.com', type: 'internal', confirmed: false }
    ],
    relatedEntityType: 'client',
    relatedEntityId: 1,
    relatedEntityName: 'TechCorp Inc.',
    tags: ['website', 'redesign', 'follow-up'],
    color: '#4f46e5',
    notifications: [
      { id: 101, time: 30, unit: 'minute', sent: false }
    ]
  },
  {
    id: 2,
    title: 'Project Deadline - Brand Redesign Final Deliverables',
    description: 'Final brand assets and style guide due to client.',
    type: 'deadline',
    priority: 'high',
    startDate: '2025-04-18T23:59:59',
    allDay: true,
    isRecurring: false,
    relatedEntityType: 'project',
    relatedEntityId: 7,
    relatedEntityName: 'Brand Redesign',
    tags: ['deadline', 'brand', 'deliverable'],
    color: '#ef4444',
    notifications: [
      { id: 201, time: 1, unit: 'day', sent: false },
      { id: 202, time: 3, unit: 'day', sent: true }
    ]
  },
  {
    id: 3,
    title: 'Team Standup',
    description: 'Daily team standup to discuss progress and blockers.',
    type: 'meeting',
    priority: 'medium',
    startDate: '2025-04-14T09:30:00',
    endDate: '2025-04-14T09:45:00',
    allDay: false,
    location: 'Zoom',
    isRecurring: true,
    recurrencePattern: 'Every weekday',
    tags: ['standup', 'team', 'daily'],
    color: '#8b5cf6',
    notifications: [
      { id: 301, time: 5, unit: 'minute', sent: true }
    ]
  },
  {
    id: 4,
    title: 'New Lead Follow-up - Global Retail',
    description: 'Follow up with potential client about mobile app proposal.',
    type: 'task',
    priority: 'high',
    startDate: '2025-04-16T13:00:00',
    allDay: false,
    isRecurring: false,
    relatedEntityType: 'lead',
    relatedEntityId: 2,
    relatedEntityName: 'Global Retail',
    tags: ['lead', 'follow-up', 'proposal'],
    color: '#f59e0b',
    notifications: [
      { id: 401, time: 1, unit: 'hour', sent: false }
    ]
  },
  {
    id: 5,
    title: 'Spring Sale Campaign Launch',
    description: 'Launching social media campaign for spring sale.',
    type: 'campaign',
    priority: 'high',
    startDate: '2025-04-20T08:00:00',
    allDay: true,
    isRecurring: false,
    relatedEntityType: 'campaign',
    relatedEntityId: 3,
    relatedEntityName: 'Spring Sale 2025',
    tags: ['campaign', 'social media', 'launch'],
    color: '#10b981',
    notifications: [
      { id: 501, time: 1, unit: 'day', sent: false }
    ]
  },
  {
    id: 6,
    title: 'Review Website Analytics',
    description: 'Monthly review of website performance and metrics.',
    type: 'task',
    priority: 'medium',
    startDate: '2025-04-30T14:00:00',
    endDate: '2025-04-30T15:00:00',
    allDay: false,
    isRecurring: true,
    recurrencePattern: 'Monthly on last day',
    tags: ['analytics', 'review', 'monthly'],
    color: '#0ea5e9',
    notifications: [
      { id: 601, time: 1, unit: 'day', sent: false }
    ]
  },
  {
    id: 7,
    title: 'Content Calendar Planning',
    description: 'Plan content calendar for next quarter.',
    type: 'meeting',
    priority: 'medium',
    startDate: '2025-04-25T11:00:00',
    endDate: '2025-04-25T12:30:00',
    allDay: false,
    location: 'Conference Room A',
    isRecurring: false,
    attendees: [
      { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', type: 'internal', confirmed: true },
      { id: 4, name: 'Mike Taylor', email: 'mike@company.com', type: 'internal', confirmed: true },
      { id: 5, name: 'Lisa Chen', email: 'lisa@company.com', type: 'internal', confirmed: false }
    ],
    tags: ['content', 'planning', 'quarterly'],
    color: '#ec4899',
    notifications: [
      { id: 701, time: 30, unit: 'minute', sent: false }
    ]
  },
  {
    id: 8,
    title: 'Invoice Payment Deadline',
    description: 'Client payment deadline for Project XYZ.',
    type: 'deadline',
    priority: 'urgent',
    startDate: '2025-04-22T23:59:59',
    allDay: true,
    isRecurring: false,
    relatedEntityType: 'client',
    relatedEntityId: 3,
    relatedEntityName: 'Creative Media Group',
    tags: ['invoice', 'payment', 'finance'],
    color: '#ef4444',
    notifications: [
      { id: 801, time: 1, unit: 'day', sent: false },
      { id: 802, time: 3, unit: 'day', sent: true }
    ]
  },
  {
    id: 9,
    title: 'App Demo with Client',
    description: 'Demonstrate mobile app functionality to client.',
    type: 'meeting',
    priority: 'high',
    startDate: '2025-04-17T15:00:00',
    endDate: '2025-04-17T16:00:00',
    allDay: false,
    location: 'Microsoft Teams',
    isRecurring: false,
    attendees: [
      { id: 6, name: 'Robert Johnson', email: 'robert@globalretail.com', type: 'external', confirmed: true },
      { id: 7, name: 'Emma Davis', email: 'emma@globalretail.com', type: 'external', confirmed: true },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', type: 'internal', confirmed: true },
      { id: 8, name: 'David Lee', email: 'david@company.com', type: 'internal', confirmed: true }
    ],
    relatedEntityType: 'project',
    relatedEntityId: 2,
    relatedEntityName: 'Mobile App Development',
    tags: ['demo', 'client', 'app'],
    color: '#8b5cf6',
    notifications: [
      { id: 901, time: 1, unit: 'hour', sent: false },
      { id: 902, time: 1, unit: 'day', sent: true }
    ]
  },
  {
    id: 10,
    title: 'Reminder - Send Weekly Report',
    description: 'Send weekly progress report to all clients.',
    type: 'reminder',
    priority: 'medium',
    startDate: '2025-04-18T16:00:00',
    allDay: false,
    isRecurring: true,
    recurrencePattern: 'Weekly on Friday',
    tags: ['report', 'weekly', 'clients'],
    color: '#f59e0b',
    notifications: [
      { id: 1001, time: 2, unit: 'hour', sent: false }
    ]
  }
];

// Configuration for event type display
const eventTypeConfig = {
  'meeting': {
    label: 'Meeting',
    color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    icon: <Users className="h-4 w-4" />
  },
  'deadline': {
    label: 'Deadline',
    color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30',
    textColor: 'text-red-600 dark:text-red-400',
    icon: <Clock className="h-4 w-4" />
  },
  'reminder': {
    label: 'Reminder',
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    icon: <Bell className="h-4 w-4" />
  },
  'task': {
    label: 'Task',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    icon: <CheckCircle className="h-4 w-4" />
  },
  'campaign': {
    label: 'Campaign',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    icon: <Bell className="h-4 w-4" />
  }
};

// Configuration for priority display
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

// Helper function to get month name
function getMonthName(month: number) {
  return new Date(2000, month, 1).toLocaleString('default', { month: 'long' });
}

// Helper function to get days in month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper function to get day of week (0 = Sunday, 6 = Saturday)
function getDayOfWeek(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay();
}

// Helper function to format time
function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Helper function to format date - used in event details or can be used for future features
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Helper function to check if an event is on a specific date
function isEventOnDate(event: CalendarEvent, date: Date) {
  const eventStart = new Date(event.startDate);
  const eventStartDate = new Date(
    eventStart.getFullYear(),
    eventStart.getMonth(),
    eventStart.getDate()
  );
  
  const checkDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  
  return eventStartDate.getTime() === checkDate.getTime();
}

// Helper function to get events for a specific date
function getEventsForDate(events: CalendarEvent[], date: Date) {
  return events.filter(event => isEventOnDate(event, date));
}

export default function CalendarPage() {
  const { t } = useTranslation();
  const today = new Date();
  
  // State for current month and year
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [selectedDate, setSelectedDate] = useState(today);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(calendarEvents);

  // Get current month details
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getDayOfWeek(currentYear, currentMonth, 1);
  
  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Navigate to today
  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Filter events based on search query
    if (value) {
      const searchLower = value.toLowerCase();
      setFilteredEvents(
        calendarEvents.filter(event => 
          event.title.toLowerCase().includes(searchLower) || 
          event.description.toLowerCase().includes(searchLower) || 
          event.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          (event.relatedEntityName && event.relatedEntityName.toLowerCase().includes(searchLower))
        )
      );
    } else {
      setFilteredEvents(calendarEvents);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('calendar.title', 'Calendar & Events')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('calendar.subtitle', 'Manage all your important dates, meetings, and deadlines')}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1.5" />
          {t('calendar.newEvent', 'New Event')}
        </Button>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            {t('calendar.today', 'Today')}
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{t('calendar.previousMonth', 'Previous Month')}</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">{t('calendar.nextMonth', 'Next Month')}</span>
            </Button>
          </div>
          <h2 className="text-lg font-medium">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('calendar.searchEvents', 'Search events...')}
              className="pl-9 w-full md:w-[250px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <Tabs defaultValue="month" className="w-auto" onValueChange={(value) => setCurrentView(value as 'month' | 'week' | 'day' | 'list')}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
                <span className="sr-only">{t('calendar.filter', 'Filter')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('calendar.filterBy', 'Filter By')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('calendar.meetings', 'Meetings')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('calendar.deadlines', 'Deadlines')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('calendar.tasks', 'Tasks')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('calendar.highPriority', 'High Priority')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('calendar.clearFilters', 'Clear Filters')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Calendar Month View */}
      {currentView === 'month' && (
        <Card className="shadow-sm">
          <CardContent className="p-4">
            {/* Calendar Header (Day Names) */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {t(`calendar.${day.toLowerCase()}`, day)}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the 1st of the month */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="h-28 border bg-muted/20 rounded-md p-1"
                />
              ))}
              
              {/* Actual days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(currentYear, currentMonth, day);
                const isToday = date.toDateString() === today.toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const dayEvents = getEventsForDate(filteredEvents, date);
                
                return (
                  <div
                    key={`day-${day}`}
                    className={cn(
                      "h-28 border rounded-md p-1 overflow-hidden",
                      isToday ? "bg-primary/5 border-primary/20" : "",
                      isSelected ? "ring-2 ring-primary ring-offset-0" : ""
                    )}
                    onClick={() => handleDateSelect(date)}
                  >
                    <div className={cn(
                      "flex justify-center items-center w-6 h-6 rounded-full text-sm font-medium mb-1",
                      isToday ? "bg-primary text-primary-foreground" : ""
                    )}>
                      {day}
                    </div>
                    
                    {/* Events for this day */}
                    <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className="px-1.5 py-0.5 text-xs truncate rounded-sm"
                          style={{ backgroundColor: `${event.color}20`, borderLeft: `3px solid ${event.color}` }}
                        >
                          {event.allDay ? '📅 ' : '🕒 '}
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-center text-muted-foreground">
                          + {dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Day View */}
      {currentView === 'day' && (
        <Card className="shadow-sm">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {
                  const prevDay = new Date(selectedDate);
                  prevDay.setDate(prevDay.getDate() - 1);
                  setSelectedDate(prevDay);
                }}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-medium">
                  {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {
                  const nextDay = new Date(selectedDate);
                  nextDay.setDate(nextDay.getDate() + 1);
                  setSelectedDate(nextDay);
                }}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* All-day events */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">{t('calendar.allDayEvents', 'All-day')}</h4>
              <div className="space-y-2">
                {getEventsForDate(filteredEvents, selectedDate)
                  .filter(event => event.allDay)
                  .map(event => (
                    <div
                      key={event.id}
                      className="p-2 rounded-md shadow-sm"
                      style={{ backgroundColor: `${event.color}10`, borderLeft: `4px solid ${event.color}` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {eventTypeConfig[event.type].icon}
                          <span className="font-medium">{event.title}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            priorityConfig[event.priority].color,
                            priorityConfig[event.priority].textColor
                          )}
                        >
                          {priorityConfig[event.priority].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  ))}
                {getEventsForDate(filteredEvents, selectedDate)
                  .filter(event => event.allDay).length === 0 && (
                  <div className="text-sm text-muted-foreground p-2">No all-day events</div>
                )}
              </div>
            </div>
            
            {/* Time-based events */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium mb-2">{t('calendar.scheduledEvents', 'Scheduled')}</h4>
              {getEventsForDate(filteredEvents, selectedDate)
                .filter(event => !event.allDay)
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .map(event => (
                  <div
                    key={event.id}
                    className="p-2 rounded-md shadow-sm"
                    style={{ backgroundColor: `${event.color}10`, borderLeft: `4px solid ${event.color}` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {eventTypeConfig[event.type].icon}
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 inline mr-1" />
                          {formatTime(event.startDate)} - {event.endDate ? formatTime(event.endDate) : 'N/A'}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            priorityConfig[event.priority].color,
                            priorityConfig[event.priority].textColor
                          )}
                        >
                          {priorityConfig[event.priority].label}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    {event.location && (
                      <div className="text-xs text-muted-foreground mt-2">
                        📍 {event.location}
                      </div>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Attendees:</div>
                        <div className="flex flex-wrap gap-1">
                          {event.attendees.map((attendee) => (
                            <Badge 
                              key={attendee.id} 
                              variant="outline" 
                              className={cn(
                                attendee.type === 'external' 
                                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                                attendee.confirmed ? '' : 'opacity-60'
                              )}
                            >
                              {attendee.type === 'external' ? <Building className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                              {attendee.name}
                              {!attendee.confirmed && ' (Pending)'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              {getEventsForDate(filteredEvents, selectedDate)
                .filter(event => !event.allDay).length === 0 && (
                <div className="text-sm text-muted-foreground p-2">No scheduled events</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Calendar List View */}
      {currentView === 'list' && (
        <Card className="shadow-sm">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle>
              {t('calendar.upcomingEvents', 'Upcoming Events')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              {/* Group events by date */}
              {Array.from(new Set(filteredEvents
                .map(event => new Date(event.startDate).toDateString())))
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                .map(dateString => {
                  const date = new Date(dateString);
                  const eventsOnDate = filteredEvents.filter(
                    event => new Date(event.startDate).toDateString() === dateString
                  );
                  
                  return (
                    <div key={dateString}>
                      <h3 className="text-base font-medium mb-3 sticky top-0 bg-background py-2 flex items-center">
                        {date.toDateString() === today.toDateString() ? (
                          <Badge variant="default" className="mr-2">Today</Badge>
                        ) : (
                          date.getTime() - today.getTime() < 24 * 60 * 60 * 1000 && 
                          date.getTime() > today.getTime() && (
                            <Badge variant="outline" className="mr-2">Tomorrow</Badge>
                          )
                        )}
                        {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h3>
                      <div className="space-y-3">
                        {eventsOnDate
                          .sort((a, b) => {
                            // Sort all-day events first
                            if (a.allDay && !b.allDay) return -1;
                            if (!a.allDay && b.allDay) return 1;
                            // Then sort by time
                            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                          })
                          .map(event => (
                            <div 
                              key={event.id} 
                              className="flex flex-col sm:flex-row gap-4 p-4 rounded-md border"
                              style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
                            >
                              <div className="sm:w-36">
                                {event.allDay ? (
                                  <Badge variant="secondary">All Day</Badge>
                                ) : (
                                  <div className="text-sm font-medium">
                                    {formatTime(event.startDate)}
                                    {event.endDate && (
                                      <>
                                        <span className="mx-1">-</span>
                                        {formatTime(event.endDate)}
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "flex items-center gap-1 px-1.5",
                                        eventTypeConfig[event.type].color,
                                        eventTypeConfig[event.type].textColor
                                      )}
                                    >
                                      {eventTypeConfig[event.type].icon}
                                      <span>{eventTypeConfig[event.type].label}</span>
                                    </Badge>
                                    <h4 className="text-base font-medium">{event.title}</h4>
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      priorityConfig[event.priority].color,
                                      priorityConfig[event.priority].textColor
                                    )}
                                  >
                                    {priorityConfig[event.priority].label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 mt-3">
                                  {event.location && (
                                    <div className="text-xs text-muted-foreground flex items-center">
                                      📍 {event.location}
                                    </div>
                                  )}
                                  {event.isRecurring && (
                                    <div className="text-xs text-muted-foreground flex items-center">
                                      <Repeat className="h-3.5 w-3.5 mr-1" />
                                      {event.recurrencePattern}
                                    </div>
                                  )}
                                  {event.relatedEntityName && (
                                    <div className="text-xs text-muted-foreground flex items-center">
                                      {event.relatedEntityType === 'client' && <Building className="h-3.5 w-3.5 mr-1" />}
                                      {event.relatedEntityType === 'project' && <ClipboardList className="h-3.5 w-3.5 mr-1" />}
                                      {event.relatedEntityType === 'lead' && <User className="h-3.5 w-3.5 mr-1" />}
                                      {event.relatedEntityType === 'campaign' && <Bell className="h-3.5 w-3.5 mr-1" />}
                                      {event.relatedEntityName}
                                    </div>
                                  )}
                                </div>
                                
                                {(event.tags.length > 0 || event.attendees) && (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {event.tags.map(tag => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        #{tag}
                                      </Badge>
                                    ))}
                                    {event.attendees && (
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                          {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex sm:flex-col items-center gap-2 sm:gap-1 mt-2 sm:mt-0 ml-auto sm:ml-0">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
                
                {filteredEvents.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-2 text-muted-foreground">
                      {searchQuery 
                        ? t('calendar.noEventsFound', 'No events found matching your search') 
                        : t('calendar.noEvents', 'No upcoming events')}
                    </p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-1.5" />
                      {t('calendar.createEvent', 'Create Event')}
                    </Button>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}