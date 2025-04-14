'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  Users,
  ShieldCheck,
  Building,
  Settings,
  Edit,
  Trash2,
  Mail,
  Key,
  Eye,
  UserCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Mock users data
const users = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Admin',
    company: 'TechCorp Inc.',
    status: 'active',
    lastActive: '2 hours ago',
    avatarUrl: null,
  },
  {
    id: 2,
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    role: 'Manager',
    company: 'TechCorp Inc.',
    status: 'active',
    lastActive: '5 hours ago',
    avatarUrl: null,
  },
  {
    id: 3,
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'Editor',
    company: 'Digital Solutions Ltd.',
    status: 'inactive',
    lastActive: '2 days ago',
    avatarUrl: null,
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma@example.com',
    role: 'Viewer',
    company: 'Media Insights',
    status: 'pending',
    lastActive: 'Never',
    avatarUrl: null,
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'Manager',
    company: 'Digital Solutions Ltd.',
    status: 'active',
    lastActive: '1 day ago',
    avatarUrl: null,
  },
];

// Mock roles data
const roles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full access to all system features',
    users: 2,
    permissions: 'Full Access',
    createdAt: '2023-06-15',
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Can manage users and content, but cannot change system settings',
    users: 5,
    permissions: 'Medium',
    createdAt: '2023-06-15',
  },
  {
    id: 3,
    name: 'Editor',
    description: 'Can create and edit content, but cannot manage users',
    users: 8,
    permissions: 'Limited',
    createdAt: '2023-06-18',
  },
  {
    id: 4,
    name: 'Viewer',
    description: 'Read-only access to content',
    users: 12,
    permissions: 'Read-only',
    createdAt: '2023-06-20',
  },
];

// Mock companies data
const companies = [
  {
    id: 1,
    name: 'TechCorp Inc.',
    type: 'Agency',
    users: 15,
    subscription: 'Enterprise',
    status: 'active',
    logo: '🏢',
  },
  {
    id: 2,
    name: 'Digital Solutions Ltd.',
    type: 'Client',
    users: 8,
    subscription: 'Professional',
    status: 'active',
    logo: '🖥️',
  },
  {
    id: 3,
    name: 'Media Insights',
    type: 'Agency',
    users: 6,
    subscription: 'Professional',
    status: 'active',
    logo: '📱',
  },
  {
    id: 4,
    name: 'ShopEasy',
    type: 'Client',
    users: 3,
    subscription: 'Starter',
    status: 'inactive',
    logo: '🛒',
  },
];

export default function UsersPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('users.title', 'User Management')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('users.subtitle', 'Manage users, roles, and company accounts')}
          </p>
        </div>
        <Button className="gap-1.5">
          <UserPlus className="h-4 w-4" />
          {t('users.addUser', 'Add User')}
        </Button>
      </div>

      <Tabs defaultValue="users" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList className="mb-2 sm:mb-0">
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="h-4 w-4" />
              {t('users.usersTab', 'Users')}
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {t('users.rolesTab', 'Roles')}
            </TabsTrigger>
            <TabsTrigger value="companies" className="gap-1.5">
              <Building className="h-4 w-4" />
              {t('users.companiesTab', 'Companies')}
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeTab}...`}
                className="pl-9 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('users.filterBy', 'Filter By')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {t('users.activeOnly', 'Active Only')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {t('users.inactiveOnly', 'Inactive Only')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {t('users.clearFilters', 'Clear Filters')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5">
                  <Download className="h-4 w-4" />
                  {t('users.export', 'Export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  {t('users.exportCSV', 'Export as CSV')}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  {t('users.exportXLSX', 'Export as XLSX')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t('users.nameColumn', 'Name')}</TableHead>
                    <TableHead className="w-[200px]">{t('users.emailColumn', 'Email')}</TableHead>
                    <TableHead>{t('users.roleColumn', 'Role')}</TableHead>
                    <TableHead>{t('users.companyColumn', 'Company')}</TableHead>
                    <TableHead>{t('users.statusColumn', 'Status')}</TableHead>
                    <TableHead>{t('users.lastActiveColumn', 'Last Active')}</TableHead>
                    <TableHead className="text-right">{t('users.actionsColumn', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {user.avatarUrl ? (
                              <img 
                                src={user.avatarUrl} 
                                alt={user.name} 
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <UserCircle2 className="h-5 w-5" />
                            )}
                          </div>
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "bg-primary/5 text-primary border-primary/20",
                            user.role === "Admin" && "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
                            user.role === "Manager" && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
                            user.role === "Editor" && "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/40", 
                            user.role === "Viewer" && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                          )}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.company}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            user.status === 'active' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40",
                            user.status === 'inactive' && "bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-900/50",
                            user.status === 'pending' && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                          )}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t('users.openMenu', 'Open menu')}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('users.userActions', 'User Actions')}</DropdownMenuLabel>
                            <DropdownMenuItem className="flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              {t('users.viewProfile', 'View Profile')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Edit className="h-4 w-4 mr-2" />
                              {t('users.editUser', 'Edit User')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Key className="h-4 w-4 mr-2" />
                              {t('users.resetPassword', 'Reset Password')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center text-red-600 dark:text-red-400">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('users.deleteUser', 'Delete User')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 space-y-0">
              <div>
                <CardTitle>{t('users.rolesTitle', 'User Roles')}</CardTitle>
                <CardDescription>
                  {t('users.rolesDescription', 'Define roles and permissions for users')}
                </CardDescription>
              </div>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                {t('users.addRole', 'Add Role')}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">{t('users.roleNameColumn', 'Role Name')}</TableHead>
                    <TableHead className="w-[300px]">{t('users.descriptionColumn', 'Description')}</TableHead>
                    <TableHead>{t('users.usersCountColumn', 'Users')}</TableHead>
                    <TableHead>{t('users.permissionsColumn', 'Permissions')}</TableHead>
                    <TableHead>{t('users.createdAtColumn', 'Created At')}</TableHead>
                    <TableHead className="text-right">{t('users.actionsColumn', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "bg-primary/5 text-primary border-primary/20",
                            role.name === "Admin" && "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
                            role.name === "Manager" && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
                            role.name === "Editor" && "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/40", 
                            role.name === "Viewer" && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                          )}
                        >
                          {role.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>{role.users}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            role.permissions === 'Full Access' && "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
                            role.permissions === 'Medium' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
                            role.permissions === 'Limited' && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40",
                            role.permissions === 'Read-only' && "bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-900/50"
                          )}
                        >
                          {role.permissions}
                        </Badge>
                      </TableCell>
                      <TableCell>{role.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t('users.openMenu', 'Open menu')}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('users.roleActions', 'Role Actions')}</DropdownMenuLabel>
                            <DropdownMenuItem className="flex items-center">
                              <Edit className="h-4 w-4 mr-2" />
                              {t('users.editRole', 'Edit Role')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {t('users.viewUsers', 'View Users')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center text-red-600 dark:text-red-400">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('users.deleteRole', 'Delete Role')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="companies" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 space-y-0">
              <div>
                <CardTitle>{t('users.companiesTitle', 'Companies & Agencies')}</CardTitle>
                <CardDescription>
                  {t('users.companiesDescription', 'Manage company and agency accounts')}
                </CardDescription>
              </div>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                {t('users.addCompany', 'Add Company')}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t('users.companyNameColumn', 'Company Name')}</TableHead>
                    <TableHead>{t('users.typeColumn', 'Type')}</TableHead>
                    <TableHead>{t('users.usersCountColumn', 'Users')}</TableHead>
                    <TableHead>{t('users.subscriptionColumn', 'Subscription')}</TableHead>
                    <TableHead>{t('users.statusColumn', 'Status')}</TableHead>
                    <TableHead className="text-right">{t('users.actionsColumn', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                            {company.logo}
                          </div>
                          {company.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            company.type === 'Agency' && "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900/40",
                            company.type === 'Client' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40"
                          )}
                        >
                          {company.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{company.users}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            company.subscription === 'Enterprise' && "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
                            company.subscription === 'Professional' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
                            company.subscription === 'Starter' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40"
                          )}
                        >
                          {company.subscription}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            company.status === 'active' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40",
                            company.status === 'inactive' && "bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-900/50"
                          )}
                        >
                          {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t('users.openMenu', 'Open menu')}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('users.companyActions', 'Company Actions')}</DropdownMenuLabel>
                            <DropdownMenuItem className="flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              {t('users.viewCompany', 'View Company')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Edit className="h-4 w-4 mr-2" />
                              {t('users.editCompany', 'Edit Company')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {t('users.manageUsers', 'Manage Users')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Settings className="h-4 w-4 mr-2" />
                              {t('users.companySettings', 'Company Settings')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center text-red-600 dark:text-red-400">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('users.deleteCompany', 'Delete Company')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}