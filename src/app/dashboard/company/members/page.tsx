'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Trash2, 
  Loader2, 
  Check,
  UserPlus,
  Search,
  AlertTriangle,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useCompanyStore } from '@/store/useCompanyStore';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

// Form Components and Custom Components
import AddCompanyMemberForm from '@/components/forms/AddCompanyMemberForm';

// Api and Types
import useCompanyMembersStore from '@/store/useCompanyMembersStore';
import { ApiError } from '@/types/ApiError';
import { CompanyMember } from '@/types/CompanyMember';

// Form schema for adding/editing company members
const memberFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  roleId: z.string().min(1, 'Role is required'),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

export default function ManageCompanyMembersPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { currentCompany } = useCompanyStore();
  
  // State
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<CompanyMember | null>(null);
  
  // Form setup for editing member role
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: '',
    }
  });
  
  // Company members store
  const {
    members,
    roles,
    isLoading,
    selectedMember,
    fetchMembers,
    fetchRoles,
    addMember,
    updateMember,
    removeMember,
    setSelectedMember
  } = useCompanyMembersStore();

  // Get company ID safely
  const companyId = currentCompany?.id || '';

  // Initialize data on component mount
  useEffect(() => {
    if (companyId) {
      fetchMembers(companyId);
      fetchRoles(companyId);
    }
  }, [fetchMembers, fetchRoles, companyId]);

  // Update form when selected member changes (for editing)
  useEffect(() => {
    if (selectedMember && isEditMode) {
      form.reset({
        name: selectedMember.user.name,
        email: selectedMember.user.email,
        roleId: selectedMember.roleId,
      });
    }
  }, [selectedMember, form, isEditMode]);

  // Filtered members based on search query
  const filteredMembers = members.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.user.name.toLowerCase().includes(searchLower) ||
      member.user.email.toLowerCase().includes(searchLower) ||
      member.role.name.toLowerCase().includes(searchLower)
    );
  });

  // Handle opening the add member dialog
  const handleAddMember = () => {
    setIsEditMode(false);
    setSelectedMember(null);
    setAddMemberOpen(true);
  };

  // Handle opening the edit member dialog
  const handleEditMember = (member: CompanyMember) => {
    setIsEditMode(true);
    setSelectedMember(member);
    form.reset({
      name: member.user.name,
      email: member.user.email,
      roleId: member.roleId,
    });
    setAddMemberOpen(true);
  };

  // Handle showing the delete confirmation dialog
  const handleShowDeleteDialog = (member: CompanyMember) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  // Handle successful member addition
  const handleMemberAddSuccess = () => {
    setAddMemberOpen(false);
    fetchMembers(companyId);
  };

  // Handle role update form submission
  const handleRoleUpdate = async (values: MemberFormValues) => {
    if (!selectedMember) return;
    
    try {
      // Update existing member's role
      await updateMember(selectedMember.id, { roleId: values.roleId });
      
      toast({
        title: t('company.members.updateSuccess', 'Rol actualizado exitosamente'),
        description: `El rol de ${selectedMember.user.name} ha sido actualizado.`,
        variant: 'default',
      });
      
      setAddMemberOpen(false);
      fetchMembers(companyId);
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: t('company.members.updateError', 'Error al actualizar el rol'),
        description: apiError.response?.data?.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  // Handle member deletion with confirmation
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    try {
      await removeMember(memberToDelete.id);
      toast({
        title: t('company.members.removeSuccess', 'Miembro eliminado exitosamente'),
        description: `${memberToDelete.user.name} ha sido eliminado de la empresa.`,
        variant: 'default',
      });
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
      fetchMembers(companyId);
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: t('company.members.removeError', 'Error al eliminar el miembro'),
        description: apiError.response?.data?.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  // Update member role directly from the dropdown in the table
  const handleUpdateRole = async (memberId: string, roleId: string) => {
    try {
      // Update in the backend
      await updateMember(memberId, { roleId });
      
      toast({
        title: t('company.members.updateSuccess', 'Rol actualizado'),
        variant: 'default',
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: t('company.members.updateError', 'Error al actualizar el rol'),
        description: apiError.response?.data?.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
      // Refresh the list to get accurate data after failure
      fetchMembers(companyId);
    }
  };

  // Render status badges with appropriate colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
            {t('company.members.status.active', 'Active')}
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
            {t('company.members.status.suspended', 'Suspended')}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('company.members.title', 'Company Members')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('company.members.subtitle', 'Manage your company team members')}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/company">
            <Button variant="outline">
              {t('company.members.backToCompany', 'Back to Company')}
            </Button>
          </Link>
          <Button onClick={handleAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            {t('company.members.addMember', 'Add Member')}
          </Button>
        </div>
      </div>

      {/* Search box */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('company.members.search', 'Search members by name, email or role...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Members list card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t('company.members.membersList', 'Members List')}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('company.members.memberName', 'Member Name')}</TableHead>
                  <TableHead>{t('company.members.email', 'Email')}</TableHead>
                  <TableHead>{t('company.members.role', 'Role')}</TableHead>
                  <TableHead>{t('company.members.status', 'Status')}</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <UserPlus className="h-8 w-8 mb-2 opacity-50" />
                        <p>
                          {searchQuery 
                            ? t('company.members.noResultsFound', 'No members match your search.')
                            : t('company.members.noMembersYet', 'No members found. Add your first team member.')}
                        </p>
                        {searchQuery && (
                          <Button 
                            variant="link" 
                            onClick={() => setSearchQuery('')} 
                            className="mt-2"
                          >
                            {t('company.members.clearSearch', 'Clear search')}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.user.name}</TableCell>
                      <TableCell>{member.user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={member.roleId}
                          onValueChange={(value) => handleUpdateRole(member.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue>{member.role.name}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">
                                {t('company.members.openMenu', 'Open menu')}
                              </span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditMember(member)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t('company.members.editMember', 'Edit Member')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleShowDeleteDialog(member)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('company.members.remove', 'Remove Member')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Member Dialog with React Hook Form */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? t('company.members.editMember', 'Edit Member')
                : t('company.members.addNewMember', 'Add New Member')}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? t('company.members.editDescription', 'Edit the member details below.')
                : t('company.members.addDescription', 'Add a new member to your company team.')}
            </DialogDescription>
          </DialogHeader>
          
          {isEditMode ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRoleUpdate)} className="space-y-4">
                {/* Name field (disabled in edit mode) */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('company.members.name', 'Name')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('company.members.namePlaceholder', 'Enter member name')}
                          {...field}
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email field (disabled in edit mode) */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('company.members.email', 'Email')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('company.members.emailPlaceholder', 'Enter email address')}
                          {...field}
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role field */}
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('company.members.role', 'Role')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue 
                              placeholder={t('company.members.selectRolePlaceholder', 'Select a role')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t('company.members.roleDescription', 'This determines what permissions the member will have.')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="mt-6">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setAddMemberOpen(false)}
                  >
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button type="submit">
                    <Check className="mr-2 h-4 w-4" />
                    {t('common.update', 'Update')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <AddCompanyMemberForm onSuccess={handleMemberAddSuccess} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t('company.members.confirmRemoval', 'Confirm Member Removal')}
            </DialogTitle>
            <DialogDescription>
              {t('company.members.removeWarning', 'This action cannot be undone. The member will lose access to your company.')}
            </DialogDescription>
          </DialogHeader>
          
          {memberToDelete && (
            <div className="my-4">
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="font-medium text-lg">{memberToDelete.user.name}</div>
                <div className="text-muted-foreground">{memberToDelete.user.email}</div>
                <div className="mt-2">
                  <Badge variant="outline" className="mt-2">
                    {memberToDelete.role.name}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteMember}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('company.members.removeConfirm', 'Yes, Remove Member')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}