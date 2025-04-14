'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  Phone, 
  Mail, 
  CalendarClock, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Edit, 
  Trash, 
  Download, 
  User,
  BarChart,
  Building,
  ArrowRight,
  MessageSquare,
  FileText
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Types
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'event' | 'other';
type LeadPriority = 'low' | 'medium' | 'high';

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  assignedTo: string;
  avatar?: string;
  value: number;
  lastActivity?: string;
  nextFollowUp?: string;
  notes: number;
  createdAt: string;
}

// Mock lead data
const leads: Lead[] = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Acme Corporation',
    email: 'john@acme.com',
    phone: '+1 (555) 123-4567',
    status: 'new',
    source: 'website',
    priority: 'medium',
    assignedTo: 'Sarah Miller',
    value: 15000,
    lastActivity: '2025-04-10T14:30:00',
    notes: 2,
    createdAt: '2025-04-08T10:15:00'
  },
  {
    id: 2,
    name: 'Lisa Johnson',
    company: 'Tech Innovations',
    email: 'lisa@techinnovations.com',
    phone: '+1 (555) 234-5678',
    status: 'contacted',
    source: 'referral',
    priority: 'high',
    assignedTo: 'David Wilson',
    value: 28000,
    lastActivity: '2025-04-12T11:20:00',
    nextFollowUp: '2025-04-16T14:00:00',
    notes: 3,
    createdAt: '2025-04-05T15:45:00'
  },
  {
    id: 3,
    name: 'Michael Chen',
    company: 'Global Solutions',
    email: 'michael@globalsolutions.com',
    phone: '+1 (555) 345-6789',
    status: 'qualified',
    source: 'social',
    priority: 'high',
    assignedTo: 'Emma Davis',
    value: 45000,
    lastActivity: '2025-04-11T09:15:00',
    nextFollowUp: '2025-04-18T10:30:00',
    notes: 5,
    createdAt: '2025-04-03T08:20:00'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    company: 'Digital Marketing Co.',
    email: 'sarah@digitalmarketing.com',
    phone: '+1 (555) 456-7890',
    status: 'proposal',
    source: 'email',
    priority: 'medium',
    assignedTo: 'Alex Johnson',
    value: 22000,
    lastActivity: '2025-04-09T16:40:00',
    nextFollowUp: '2025-04-17T11:00:00',
    notes: 4,
    createdAt: '2025-04-01T14:10:00'
  },
  {
    id: 5,
    name: 'Robert Taylor',
    company: 'Innovative Designs',
    email: 'robert@innovativedesigns.com',
    phone: '+1 (555) 567-8901',
    status: 'negotiation',
    source: 'event',
    priority: 'high',
    assignedTo: 'Michael Brown',
    value: 68000,
    lastActivity: '2025-04-13T13:25:00',
    nextFollowUp: '2025-04-15T15:30:00',
    notes: 6,
    createdAt: '2025-03-28T09:30:00'
  },
  {
    id: 6,
    name: 'Emily Davis',
    company: 'Creative Solutions',
    email: 'emily@creativesolutions.com',
    phone: '+1 (555) 678-9012',
    status: 'won',
    source: 'website',
    priority: 'medium',
    assignedTo: 'Sarah Miller',
    value: 35000,
    lastActivity: '2025-04-07T10:50:00',
    notes: 3,
    createdAt: '2025-03-20T11:40:00'
  },
  {
    id: 7,
    name: 'James Wilson',
    company: 'Strategic Consulting',
    email: 'james@strategicconsulting.com',
    phone: '+1 (555) 789-0123',
    status: 'lost',
    source: 'referral',
    priority: 'low',
    assignedTo: 'David Wilson',
    value: 18000,
    lastActivity: '2025-04-02T14:15:00',
    notes: 2,
    createdAt: '2025-03-25T16:20:00'
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    company: 'Premier Services',
    email: 'jennifer@premierservices.com',
    phone: '+1 (555) 890-1234',
    status: 'new',
    source: 'social',
    priority: 'low',
    assignedTo: 'Emma Davis',
    value: 12000,
    lastActivity: '2025-04-13T09:30:00',
    nextFollowUp: '2025-04-20T13:00:00',
    notes: 1,
    createdAt: '2025-04-12T08:45:00'
  }
];

// Configuration for status display
const statusConfig = {
  'new': {
    label: 'New',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    icon: <UserPlus className="h-4 w-4" />
  },
  'contacted': {
    label: 'Contacted',
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    icon: <Phone className="h-4 w-4" />
  },
  'qualified': {
    label: 'Qualified',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    icon: <CheckCircle className="h-4 w-4" />
  },
  'proposal': {
    label: 'Proposal',
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    icon: <FileText className="h-4 w-4" />
  },
  'negotiation': {
    label: 'Negotiation',
    color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    icon: <MessageSquare className="h-4 w-4" />
  },
  'won': {
    label: 'Won',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30',
    textColor: 'text-green-600 dark:text-green-400',
    icon: <CheckCircle className="h-4 w-4" />
  },
  'lost': {
    label: 'Lost',
    color: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    textColor: 'text-slate-600 dark:text-slate-400',
    icon: <AlertCircle className="h-4 w-4" />
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
  }
};

// Configuration for source display
const sourceConfig = {
  'website': {
    label: 'Website',
    icon: <Building className="h-3 w-3" />
  },
  'referral': {
    label: 'Referral',
    icon: <User className="h-3 w-3" />
  },
  'social': {
    label: 'Social Media',
    icon: <MessageSquare className="h-3 w-3" />
  },
  'email': {
    label: 'Email',
    icon: <Mail className="h-3 w-3" />
  },
  'event': {
    label: 'Event',
    icon: <CalendarClock className="h-3 w-3" />
  },
  'other': {
    label: 'Other',
    icon: <AlertCircle className="h-3 w-3" />
  }
};

// Summary statistics
const leadStats = [
  {
    title: 'Total Leads',
    value: leads.length,
    change: '+12%',
    isIncrease: true,
    icon: <User className="h-5 w-5" />
  },
  {
    title: 'Qualified Leads',
    value: leads.filter(lead => ['qualified', 'proposal', 'negotiation'].includes(lead.status)).length,
    change: '+8%',
    isIncrease: true,
    icon: <CheckCircle className="h-5 w-5" />
  },
  {
    title: 'Conversion Rate',
    value: '24%',
    change: '+3%',
    isIncrease: true,
    icon: <BarChart className="h-5 w-5" />
  },
  {
    title: 'Avg Deal Size',
    value: `$${Math.round(leads.reduce((sum, lead) => sum + lead.value, 0) / leads.length).toLocaleString()}`,
    change: '+5%',
    isIncrease: true,
    icon: <Building className="h-5 w-5" />
  }
];

export default function LeadsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filteredLeads, setFilteredLeads] = useState(leads);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Filter leads based on search query
    if (value) {
      setFilteredLeads(
        leads.filter(lead => 
          lead.name.toLowerCase().includes(value.toLowerCase()) || 
          lead.company.toLowerCase().includes(value.toLowerCase()) ||
          lead.email.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      filterLeadsByTab(activeTab);
    }
  };

  // Filter leads based on selected tab
  const filterLeadsByTab = (tabValue: string) => {
    if (tabValue === 'all') {
      setFilteredLeads(leads);
    } else if (tabValue === 'followup') {
      setFilteredLeads(leads.filter(lead => lead.nextFollowUp));
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === tabValue));
    }
    setActiveTab(tabValue);
  };

  const handleTabChange = (value: string) => {
    filterLeadsByTab(value);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const leadDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // If the date is today
    if (leadDate.getTime() === today.getTime()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If the date is yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (leadDate.getTime() === yesterday.getTime()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If the date is in the next 7 days
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    if (leadDate > today && leadDate <= nextWeek) {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleString(undefined, options);
    }
    
    // Otherwise, show the full date
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('leads.title', 'Lead Management')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('leads.subtitle', 'Track and manage leads through your sales pipeline')}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1.5" />
          {t('leads.addLead', 'Add Lead')}
        </Button>
      </div>

      {/* Lead Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leadStats.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t(`leads.${stat.title.toLowerCase().replace(/\s+/g, '')}`, stat.title)}
                  </p>
                  <div className="mt-1 flex items-baseline">
                    <h3 className="text-2xl font-semibold">{stat.value}</h3>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "ml-2 font-medium",
                        stat.isIncrease 
                          ? "text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30" 
                          : "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30"
                      )}
                    >
                      {stat.change}
                    </Badge>
                  </div>
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
              placeholder={t('leads.searchLeads', 'Search leads...')}
              className="pl-9 w-full md:w-[250px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter className="h-4 w-4" />
                <span className="sr-only">{t('leads.filter', 'Filter')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('leads.filterBy', 'Filter By')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('leads.assignedToMe', 'Assigned to Me')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('leads.highValue', 'High Value')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('leads.recentlyAdded', 'Recently Added')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('leads.clearFilters', 'Clear Filters')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5">
                <Download className="h-4 w-4" />
                {t('leads.export', 'Export')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                {t('leads.exportCsv', 'Export as CSV')}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                {t('leads.exportXlsx', 'Export as XLSX')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Leads</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="qualified">Qualified</TabsTrigger>
            <TabsTrigger value="followup">Needs Follow-up</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Lead Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">{t('leads.nameColumn', 'Name / Company')}</TableHead>
                <TableHead>{t('leads.contactColumn', 'Contact')}</TableHead>
                <TableHead>{t('leads.statusColumn', 'Status')}</TableHead>
                <TableHead>{t('leads.priorityColumn', 'Priority')}</TableHead>
                <TableHead>{t('leads.valueColumn', 'Value')}</TableHead>
                <TableHead>{t('leads.activityColumn', 'Last Activity')}</TableHead>
                <TableHead>{t('leads.followUpColumn', 'Next Follow-up')}</TableHead>
                <TableHead className="text-right">{t('leads.actionsColumn', 'Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-xs text-muted-foreground">{lead.company}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge 
                          variant="outline" 
                          className="text-[10px] h-4 px-1 bg-background/80 flex items-center gap-1"
                        >
                          {sourceConfig[lead.source].icon}
                          <span>{sourceConfig[lead.source].label}</span>
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "flex items-center gap-1 px-2",
                        statusConfig[lead.status].color,
                        statusConfig[lead.status].textColor
                      )}
                    >
                      {statusConfig[lead.status].icon}
                      <span>{statusConfig[lead.status].label}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        priorityConfig[lead.priority].color,
                        priorityConfig[lead.priority].textColor
                      )}
                    >
                      {priorityConfig[lead.priority].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${lead.value.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(lead.lastActivity)}</div>
                  </TableCell>
                  <TableCell>
                    {lead.nextFollowUp ? (
                      <div className="text-sm">{formatDate(lead.nextFollowUp)}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{t('leads.viewDetails', 'View Details')}</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t('leads.moreOptions', 'More Options')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            {t('leads.editLead', 'Edit Lead')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            {t('leads.moveStage', 'Move to Next Stage')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {t('leads.addNote', 'Add Note')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <CalendarClock className="h-4 w-4 mr-2" />
                            {t('leads.scheduleFollowUp', 'Schedule Follow-up')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {t('leads.convertToClient', 'Convert to Client')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            {t('leads.deleteLead', 'Delete Lead')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <User className="h-10 w-10 text-muted-foreground/30" />
                      <p className="mt-2 text-muted-foreground">{t('leads.noLeadsFound', 'No leads found')}</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="h-4 w-4 mr-1.5" />
                        {t('leads.addLead', 'Add Lead')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}