'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  Trash,
  Building,
  Mail,
  Phone,
  MapPin,
  User,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Briefcase,
  Settings,
  ArrowRightLeft,
  BarChart3
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
type ClientStatus = 'active' | 'inactive' | 'onboarding' | 'pending';
type ClientType = 'agency' | 'business' | 'individual' | 'enterprise';

interface Client {
  id: number;
  name: string;
  type: ClientType;
  email: string;
  phone: string;
  address: string;
  status: ClientStatus;
  contactPerson: string;
  contactPersonRole: string;
  contractValue: number;
  joinDate: string;
  lastContact: string;
  projects: number;
  logo?: string;
}

// Mock client data
const clients: Client[] = [
  {
    id: 1,
    name: 'TechCorp Inc.',
    type: 'enterprise',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Blvd, San Francisco, CA 94105',
    status: 'active',
    contactPerson: 'John Smith',
    contactPersonRole: 'CTO',
    contractValue: 120000,
    joinDate: '2024-01-15',
    lastContact: '2025-04-10',
    projects: 3,
    logo: '🏢'
  },
  {
    id: 2,
    name: 'Digital Solutions Ltd.',
    type: 'agency',
    email: 'info@digitalsolutions.com',
    phone: '+1 (555) 234-5678',
    address: '456 Innovation Way, Austin, TX 78701',
    status: 'active',
    contactPerson: 'Lisa Johnson',
    contactPersonRole: 'CEO',
    contractValue: 85000,
    joinDate: '2024-02-23',
    lastContact: '2025-04-08',
    projects: 2,
    logo: '🖥️'
  },
  {
    id: 3,
    name: 'Creative Media Group',
    type: 'business',
    email: 'hello@creativemedia.com',
    phone: '+1 (555) 345-6789',
    address: '789 Design St, New York, NY 10012',
    status: 'onboarding',
    contactPerson: 'Michael Chen',
    contactPersonRole: 'Marketing Director',
    contractValue: 45000,
    joinDate: '2025-03-30',
    lastContact: '2025-04-12',
    projects: 1,
    logo: '🎨'
  },
  {
    id: 4,
    name: 'Global Retail',
    type: 'enterprise',
    email: 'support@globalretail.com',
    phone: '+1 (555) 456-7890',
    address: '101 Commerce Park, Chicago, IL 60607',
    status: 'active',
    contactPerson: 'Sarah Williams',
    contactPersonRole: 'CMO',
    contractValue: 200000,
    joinDate: '2023-10-05',
    lastContact: '2025-04-05',
    projects: 4,
    logo: '🛒'
  },
  {
    id: 5,
    name: 'Innovative Designs',
    type: 'business',
    email: 'contact@innovativedesigns.com',
    phone: '+1 (555) 567-8901',
    address: '234 Creative Lane, Portland, OR 97205',
    status: 'inactive',
    contactPerson: 'Robert Taylor',
    contactPersonRole: 'Design Lead',
    contractValue: 30000,
    joinDate: '2023-12-10',
    lastContact: '2025-03-01',
    projects: 1,
    logo: '🎭'
  },
  {
    id: 6,
    name: 'EcoFriendly Products',
    type: 'business',
    email: 'info@ecofriendly.com',
    phone: '+1 (555) 678-9012',
    address: '567 Green St, Seattle, WA 98101',
    status: 'active',
    contactPerson: 'Emily Davis',
    contactPersonRole: 'Sustainability Manager',
    contractValue: 75000,
    joinDate: '2024-01-20',
    lastContact: '2025-04-09',
    projects: 2,
    logo: '🌱'
  },
  {
    id: 7,
    name: 'James Wilson Consulting',
    type: 'individual',
    email: 'james@wilsonconsulting.com',
    phone: '+1 (555) 789-0123',
    address: '890 Consulting Ave, Boston, MA 02110',
    status: 'pending',
    contactPerson: 'James Wilson',
    contactPersonRole: 'Principal',
    contractValue: 15000,
    joinDate: '2025-04-01',
    lastContact: '2025-04-13',
    projects: 0,
    logo: '👤'
  },
  {
    id: 8,
    name: 'Smart Home Tech',
    type: 'business',
    email: 'contact@smarthometech.com',
    phone: '+1 (555) 890-1234',
    address: '432 Smart Blvd, Denver, CO 80202',
    status: 'active',
    contactPerson: 'Jennifer Martinez',
    contactPersonRole: 'Product Manager',
    contractValue: 60000,
    joinDate: '2024-02-15',
    lastContact: '2025-04-11',
    projects: 1,
    logo: '🏠'
  }
];

// Configuration for client status display
const clientStatusConfig = {
  'active': {
    label: 'Active',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    icon: <CheckCircle className="h-4 w-4" />
  },
  'inactive': {
    label: 'Inactive',
    color: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    textColor: 'text-slate-600 dark:text-slate-400',
    icon: <AlertCircle className="h-4 w-4" />
  },
  'onboarding': {
    label: 'Onboarding',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    icon: <ArrowRightLeft className="h-4 w-4" />
  },
  'pending': {
    label: 'Pending',
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    icon: <Clock className="h-4 w-4" />
  }
};

// Configuration for client type display
const clientTypeConfig = {
  'agency': {
    label: 'Agency',
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  'business': {
    label: 'Business',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  'individual': {
    label: 'Individual',
    color: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    textColor: 'text-slate-600 dark:text-slate-400'
  },
  'enterprise': {
    label: 'Enterprise',
    color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/30',
    textColor: 'text-indigo-600 dark:text-indigo-400'
  }
};

// Summary statistics
const clientStats = [
  {
    title: 'Total Clients',
    value: clients.length,
    change: '+3',
    isIncrease: true,
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Active Clients',
    value: clients.filter(client => client.status === 'active').length,
    change: '+2',
    isIncrease: true,
    icon: <CheckCircle className="h-5 w-5" />
  },
  {
    title: 'Projects',
    value: clients.reduce((total, client) => total + client.projects, 0),
    change: '+5',
    isIncrease: true,
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    title: 'Total Value',
    value: `$${clients.reduce((total, client) => total + client.contractValue, 0).toLocaleString()}`,
    change: '+8%',
    isIncrease: true,
    icon: <BarChart3 className="h-5 w-5" />
  }
];

export default function ClientsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filteredClients, setFilteredClients] = useState(clients);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Filter clients based on search query
    if (value) {
      setFilteredClients(
        clients.filter(client => 
          client.name.toLowerCase().includes(value.toLowerCase()) || 
          client.contactPerson.toLowerCase().includes(value.toLowerCase()) ||
          client.email.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      filterClientsByTab(activeTab);
    }
  };

  // Filter clients based on selected tab
  const filterClientsByTab = (tabValue: string) => {
    if (tabValue === 'all') {
      setFilteredClients(clients);
    } else {
      setFilteredClients(clients.filter(client => client.status === tabValue));
    }
    setActiveTab(tabValue);
  };

  const handleTabChange = (value: string) => {
    filterClientsByTab(value);
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
            {t('clients.title', 'Client Management')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('clients.subtitle', 'Manage your clients, projects, and relationships')}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1.5" />
          {t('clients.addClient', 'Add Client')}
        </Button>
      </div>

      {/* Client Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {clientStats.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t(`clients.${stat.title.toLowerCase().replace(/\s+/g, '')}`, stat.title)}
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
              placeholder={t('clients.searchClients', 'Search clients...')}
              className="pl-9 w-full md:w-[250px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter className="h-4 w-4" />
                <span className="sr-only">{t('clients.filter', 'Filter')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('clients.filterBy', 'Filter By')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('clients.highValue', 'High Value')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('clients.recentlyAdded', 'Recently Added')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('clients.myClients', 'My Clients')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('clients.clearFilters', 'Clear Filters')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5">
                <Download className="h-4 w-4" />
                {t('clients.export', 'Export')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                {t('clients.exportCsv', 'Export as CSV')}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                {t('clients.exportXlsx', 'Export as XLSX')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Client Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">{t('clients.nameColumn', 'Client Name')}</TableHead>
                <TableHead>{t('clients.contactPersonColumn', 'Contact Person')}</TableHead>
                <TableHead>{t('clients.typeColumn', 'Type')}</TableHead>
                <TableHead>{t('clients.statusColumn', 'Status')}</TableHead>
                <TableHead>{t('clients.valueColumn', 'Contract Value')}</TableHead>
                <TableHead>{t('clients.joinDateColumn', 'Join Date')}</TableHead>
                <TableHead>{t('clients.projectsColumn', 'Projects')}</TableHead>
                <TableHead className="text-right">{t('clients.actionsColumn', 'Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                        {client.logo || <Building className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" />
                          <span>{client.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{client.contactPerson}</div>
                      <div className="text-xs text-muted-foreground">{client.contactPersonRole}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        clientTypeConfig[client.type].color,
                        clientTypeConfig[client.type].textColor
                      )}
                    >
                      {clientTypeConfig[client.type].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "flex items-center gap-1 px-1.5",
                        clientStatusConfig[client.status].color,
                        clientStatusConfig[client.status].textColor
                      )}
                    >
                      {clientStatusConfig[client.status].icon}
                      <span>{clientStatusConfig[client.status].label}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${client.contractValue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {formatDate(client.joinDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      {client.projects}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{t('clients.viewDetails', 'View Details')}</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t('clients.moreOptions', 'More Options')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            {t('clients.editClient', 'Edit Client')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            {t('clients.manageProjects', 'Manage Projects')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            {t('clients.viewContracts', 'View Contracts')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            {t('clients.viewAnalytics', 'View Analytics')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            {t('clients.clientSettings', 'Client Settings')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            {t('clients.deleteClient', 'Delete Client')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <Building className="h-10 w-10 text-muted-foreground/30" />
                      <p className="mt-2 text-muted-foreground">{t('clients.noClientsFound', 'No clients found')}</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="h-4 w-4 mr-1.5" />
                        {t('clients.addClient', 'Add Client')}
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