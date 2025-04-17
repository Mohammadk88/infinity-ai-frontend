'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Building,
  Shield,
  Mail,
  CheckCircle,
  Ban,
  ArrowUpDown,
  Edit,
  Trash2,
  Key,
  Users as UsersIcon,
  UserCog
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for user management
interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'client' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  organization?: string;
  department?: string;
  lastActive: string;
  createdAt: string;
  permissions: string[];
  avatar?: string;
}

interface Organization {
  id: string;
  name: string;
  type: 'agency' | 'company' | 'team';
  usersCount: number;
  subscription: 'free' | 'professional' | 'enterprise';
  status: 'active' | 'inactive';
}

const users: UserType[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'admin',
    status: 'active',
    organization: 'Marketing Pro Agency',
    department: 'Management',
    lastActive: '10 minutes ago',
    createdAt: '2024-01-15',
    permissions: ['all_access', 'billing_admin', 'user_management'],
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    role: 'manager',
    status: 'active',
    organization: 'Marketing Pro Agency',
    department: 'Creative',
    lastActive: '2 hours ago',
    createdAt: '2024-02-10',
    permissions: ['content_management', 'campaign_creation', 'analytics'],
  },
  {
    id: '3',
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'staff',
    status: 'active',
    organization: 'Marketing Pro Agency',
    department: 'Development',
    lastActive: '1 day ago',
    createdAt: '2024-03-05',
    permissions: ['content_management', 'limited_analytics'],
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@techcorp.com',
    role: 'client',
    status: 'active',
    organization: 'TechCorp Inc.',
    lastActive: '5 days ago',
    createdAt: '2024-01-20',
    permissions: ['client_dashboard', 'reports_view'],
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'staff',
    status: 'inactive',
    organization: 'Marketing Pro Agency',
    department: 'Sales',
    lastActive: '2 weeks ago',
    createdAt: '2023-11-10',
    permissions: ['sales_dashboard', 'lead_management'],
  },
  {
    id: '6',
    name: 'Jessica Smith',
    email: 'jessica@innovatetech.com',
    role: 'client',
    status: 'suspended',
    organization: 'Innovate Tech',
    lastActive: '1 month ago',
    createdAt: '2023-10-15',
    permissions: ['client_dashboard'],
  },
];

const organizations: Organization[] = [
  {
    id: '1',
    name: 'Marketing Pro Agency',
    type: 'agency',
    usersCount: 15,
    subscription: 'enterprise',
    status: 'active',
  },
  {
    id: '2',
    name: 'TechCorp Inc.',
    type: 'company',
    usersCount: 3,
    subscription: 'professional',
    status: 'active',
  },
  {
    id: '3',
    name: 'Innovate Tech',
    type: 'company',
    usersCount: 2,
    subscription: 'free',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Creative Design Team',
    type: 'team',
    usersCount: 5,
    subscription: 'professional',
    status: 'active',
  },
];

const roles = [
  {
    name: 'admin',
    description: 'Full access to all settings and features',
    permissions: ['all_access', 'billing_admin', 'user_management'],
  },
  {
    name: 'manager',
    description: 'Access to manage teams and projects',
    permissions: ['team_management', 'content_management', 'analytics'],
  },
  {
    name: 'staff',
    description: 'Basic access to assigned tasks and content',
    permissions: ['content_view', 'content_edit', 'limited_analytics'],
  },
  {
    name: 'client',
    description: 'Access to client dashboard and reports',
    permissions: ['client_dashboard', 'reports_view'],
  },
  {
    name: 'guest',
    description: 'Limited view-only access',
    permissions: ['content_view'],
  },
];

export default function UserManagementPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all-users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>(users);
  const [mounted, setMounted] = useState(false);
  const [inviteUserOpen, setInviteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          (user.organization && user.organization.toLowerCase().includes(lowercaseQuery))
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const getRoleBadge = (role: UserType['role']) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            {t('user.role.admin', 'Admin')}
          </Badge>
        );
      case 'manager':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            {t('user.role.manager', 'Manager')}
          </Badge>
        );
      case 'staff':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            {t('user.role.staff', 'Staff')}
          </Badge>
        );
      case 'client':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            {t('user.role.client', 'Client')}
          </Badge>
        );
      case 'guest':
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">
            {t('user.role.guest', 'Guest')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {role}
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: UserType['status']) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-xs text-muted-foreground">{t('user.status.active', 'Active')}</span>
          </div>
        );
      case 'inactive':
        return (
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
            <span className="text-xs text-muted-foreground">{t('user.status.inactive', 'Inactive')}</span>
          </div>
        );
      case 'suspended':
        return (
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
            <span className="text-xs text-muted-foreground">{t('user.status.suspended', 'Suspended')}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-slate-500 mr-2"></span>
            <span className="text-xs text-muted-foreground">{status}</span>
          </div>
        );
    }
  };

  const getSubscriptionBadge = (subscription: Organization['subscription']) => {
    switch (subscription) {
      case 'enterprise':
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            {t('organization.subscription.enterprise', 'Enterprise')}
          </Badge>
        );
      case 'professional':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            {t('organization.subscription.professional', 'Professional')}
          </Badge>
        );
      case 'free':
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">
            {t('organization.subscription.free', 'Free')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {subscription}
          </Badge>
        );
    }
  };

  const getOrganizationTypeBadge = (type: Organization['type']) => {
    switch (type) {
      case 'agency':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            {t('organization.type.agency', 'Agency')}
          </Badge>
        );
      case 'company':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            {t('organization.type.company', 'Company')}
          </Badge>
        );
      case 'team':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            {t('organization.type.team', 'Team')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {type}
          </Badge>
        );
    }
  };

  const handleUserSelect = (user: UserType) => {
    setSelectedUser(user);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('userManagement.title', 'User Management')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('userManagement.subtitle', 'Manage accounts, permissions, and teams')}
          </p>
        </div>
        <Button onClick={() => setInviteUserOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t('userManagement.inviteUser', 'Invite User')}
        </Button>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="all-users" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList className="mb-2 sm:mb-0">
            <TabsTrigger value="all-users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UsersIcon className="h-4 w-4 mr-2" />
              {t('userManagement.tabs.allUsers', 'All Users')}
            </TabsTrigger>
            <TabsTrigger value="organizations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building className="h-4 w-4 mr-2" />
              {t('userManagement.tabs.organizations', 'Organizations')}
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4 mr-2" />
              {t('userManagement.tabs.roles', 'Roles')}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('userManagement.search', 'Search users...')}
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">{t('userManagement.filter', 'Filter')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('userManagement.filterBy', 'Filter By')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">{t('userManagement.role', 'Role')}</p>
                  <div className="space-y-1">
                    {roles.map((role) => (
                      <div key={role.name} className="flex items-center">
                        <input type="checkbox" id={`role-${role.name}`} className="mr-2" />
                        <label htmlFor={`role-${role.name}`} className="text-sm cursor-pointer">
                          {t(`user.role.${role.name}`, role.name)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">{t('userManagement.status', 'Status')}</p>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input type="checkbox" id="status-active" className="mr-2" />
                      <label htmlFor="status-active" className="text-sm cursor-pointer">
                        {t('user.status.active', 'Active')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="status-inactive" className="mr-2" />
                      <label htmlFor="status-inactive" className="text-sm cursor-pointer">
                        {t('user.status.inactive', 'Inactive')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="status-suspended" className="mr-2" />
                      <label htmlFor="status-suspended" className="text-sm cursor-pointer">
                        {t('user.status.suspended', 'Suspended')}
                      </label>
                    </div>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="outline" size="sm" className="w-full">
                    {t('userManagement.applyFilters', 'Apply Filters')}
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="all-users" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <div className="flex items-center">
                        {t('userManagement.nameEmail', 'Name / Email')}
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>{t('userManagement.role', 'Role')}</TableHead>
                    <TableHead>{t('userManagement.organization', 'Organization')}</TableHead>
                    <TableHead>{t('userManagement.status', 'Status')}</TableHead>
                    <TableHead>{t('userManagement.lastActive', 'Last Active')}</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <Image src={user.avatar} alt={user.name} width={36} height={36} className="h-full w-full rounded-full object-cover" />
                            ) : (
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                            )}
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.organization ? user.organization : <span className="text-muted-foreground text-sm">—</span>}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.lastActive}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t('userManagement.actions', 'Actions')}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUserSelect(user)}>
                              <User className="mr-2 h-4 w-4" />
                              <span>{t('userManagement.viewProfile', 'View Profile')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>{t('userManagement.editUser', 'Edit User')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Key className="mr-2 h-4 w-4" />
                              <span>{t('userManagement.resetPassword', 'Reset Password')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{t('userManagement.deleteUser', 'Delete User')}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-muted-foreground">
                            {searchQuery 
                              ? t('userManagement.noUsersFound', 'No users match your search')
                              : t('userManagement.noUsers', 'No users available')
                            }
                          </p>
                          <Button variant="outline" className="mt-2" onClick={() => setInviteUserOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('userManagement.inviteUser', 'Invite User')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{t('userManagement.organizations', 'Organizations & Teams')}</h3>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> {t('userManagement.createOrganization', 'Create Organization')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map(org => (
              <Card key={org.id} className="overflow-hidden border-muted/40 transition-all hover:border-primary/40">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{org.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getOrganizationTypeBadge(org.type)}
                        {getStatusBadge(org.status)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Building className="mr-2 h-4 w-4" />
                          <span>{t('userManagement.viewOrganization', 'View Details')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>{t('userManagement.editOrganization', 'Edit')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>{t('userManagement.deleteOrganization', 'Delete')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {org.usersCount} {t('userManagement.users', 'users')}
                    </span>
                  </div>
                  <div className="mt-2">
                    {getSubscriptionBadge(org.subscription)}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-3 flex justify-between">
                  <Button variant="outline" size="sm">
                    <UsersIcon className="h-3.5 w-3.5 mr-1.5" />
                    {t('userManagement.manageUsers', 'Manage Users')}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <UserCog className="h-3.5 w-3.5 mr-1.5" />
                    {t('userManagement.settings', 'Settings')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{t('userManagement.roles', 'Roles & Permissions')}</h3>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> {t('userManagement.createRole', 'Create Role')}
              </Button>
            </div>
            
            <div className="space-y-4">
              {roles.map((role) => (
                <Card key={role.name} className="overflow-hidden border-muted/40">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="capitalize">{t(`user.role.${role.name}`, role.name)}</CardTitle>
                      <Button variant="ghost" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        {t('userManagement.edit', 'Edit')}
                      </Button>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <h4 className="text-sm font-medium mb-2">{t('userManagement.permissions', 'Permissions')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="capitalize">
                          {t(`user.permission.${permission.replace(/_/g, '.')}`, permission.replace(/_/g, ' '))}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </TabsContent>
      </Tabs>

      {/* Invite User Dialog */}
      <Dialog open={inviteUserOpen} onOpenChange={setInviteUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('userManagement.inviteUser', 'Invite User')}</DialogTitle>
            <DialogDescription>
              {t('userManagement.inviteUserDescription', 'Send an invitation to join your organization.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('userManagement.emailAddress', 'Email Address')}
              </label>
              <Input
                id="email"
                placeholder="email@example.com"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                {t('userManagement.role', 'Role')}
              </label>
              <select 
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {roles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {t(`user.role.${role.name}`, role.name)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="organization" className="text-sm font-medium">
                {t('userManagement.organization', 'Organization')}
              </label>
              <select 
                id="organization"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="send-email" className="mr-2" />
                <label htmlFor="send-email" className="text-sm">
                  {t('userManagement.sendInviteEmail', 'Send invite email')}
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="add-welcome-message" className="mr-2" />
                <label htmlFor="add-welcome-message" className="text-sm">
                  {t('userManagement.addPersonalMessage', 'Add personal welcome message')}
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteUserOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={() => setInviteUserOpen(false)}>
              {t('userManagement.sendInvite', 'Send Invite')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Profile Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('userManagement.userProfile', 'User Profile')}</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-medium">
                  {selectedUser.avatar ? (
                    <Image src={selectedUser.avatar} alt={selectedUser.name} width={64} height={64} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                    <div>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">{t('userManagement.accountDetails', 'Account Details')}</h4>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">{t('userManagement.status', 'Status')}</div>
                        <div>{getStatusBadge(selectedUser.status)}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">{t('userManagement.createdAt', 'Created')}</div>
                        <div className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">{t('userManagement.lastActive', 'Last Active')}</div>
                        <div className="text-sm">{selectedUser.lastActive}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">{t('userManagement.organization', 'Organization')}</div>
                        <div className="text-sm">{selectedUser.organization || '—'}</div>
                      </div>
                      {selectedUser.department && (
                        <div className="flex justify-between">
                          <div className="text-sm text-muted-foreground">{t('userManagement.department', 'Department')}</div>
                          <div className="text-sm">{selectedUser.department}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">{t('userManagement.permissions', 'Permissions')}</h4>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedUser.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="capitalize">
                            {t(`user.permission.${permission.replace(/_/g, '.')}`, permission.replace(/_/g, ' '))}
                          </Badge>
                        ))}
                      </div>
                      <div className="pt-2 border-t">
                        <Button variant="outline" size="sm" className="w-full">
                          <Shield className="h-3.5 w-3.5 mr-1.5" />
                          {t('userManagement.managePermissions', 'Manage Permissions')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium mb-2">{t('userManagement.actions', 'Actions')}</h4>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    {t('userManagement.editUser', 'Edit User')}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Key className="h-3.5 w-3.5 mr-1.5" />
                    {t('userManagement.resetPassword', 'Reset Password')}
                  </Button>
                  {selectedUser.status === 'active' ? (
                    <Button size="sm" variant="outline" className="text-amber-500 hover:text-amber-600">
                      <Ban className="h-3.5 w-3.5 mr-1.5" />
                      {t('userManagement.suspendUser', 'Suspend User')}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-green-500 hover:text-green-600">
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      {t('userManagement.activateUser', 'Activate User')}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    {t('userManagement.deleteUser', 'Delete User')}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}