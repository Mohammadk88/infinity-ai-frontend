'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import useCompanyMembersStore from '@/store/useCompanyMembersStore';
import { ApiError } from '@/types/ApiError';

export default function CompanyMembersPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMember, setNewMember] = useState({ userId: '', roleId: '' });
  
  const {
    members,
    roles,
    isLoading,
    fetchMembers,
    fetchRoles,
    addMember,
    updateMember,
    removeMember
  } = useCompanyMembersStore();

  useEffect(() => {
    // In a real app, you'd get the company ID from context or route params
    const companyId = '1';
    fetchMembers(companyId);
    fetchRoles(companyId);
  }, [fetchMembers, fetchRoles]);

  const handleAddMember = async () => {
    try {
      await addMember('1', newMember);
      setAddMemberOpen(false);
      setNewMember({ userId: '', roleId: '' });
      toast({
        title: t('company.members.addSuccess', 'Member added successfully'),
        variant: 'default',
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: t('company.members.addError', 'Failed to add member'),
        description: apiError.response?.data?.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async (memberId: string, roleId: string) => {
    try {
      await updateMember(memberId, { roleId });
      toast({
        title: t('company.members.updateSuccess', 'Member role updated'),
        variant: 'default',
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: t('company.members.updateError', 'Failed to update member role'),
        description: apiError.response?.data?.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(memberId);
      toast({
        title: t('company.members.removeSuccess', 'Member removed successfully'),
        variant: 'default',
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: t('company.members.removeError', 'Failed to remove member'),
        description: apiError.response?.data?.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const filteredMembers = members.filter(member => 
    member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="space-y-6">
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
          <Link href="/dashboard/companies">
            <Button variant="outline">
              {t('company.members.backToCompany', 'Back to Company')}
            </Button>
          </Link>
          <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('company.members.addMember', 'Add Member')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('company.members.addNewMember', 'Add New Member')}</DialogTitle>
                <DialogDescription>
                  {t('company.members.addDescription', 'Add a new member to your company team.')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="userId" className="text-sm font-medium">
                    {t('company.members.selectUser', 'Select User')}
                  </label>
                  <Input
                    id="userId"
                    placeholder={t('company.members.userIdPlaceholder', 'Enter user ID or search')}
                    value={newMember.userId}
                    onChange={(e) => setNewMember({ ...newMember, userId: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    {t('company.members.selectRole', 'Select Role')}
                  </label>
                  <Select
                    value={newMember.roleId}
                    onValueChange={(value) => setNewMember({ ...newMember, roleId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('company.members.selectRolePlaceholder', 'Select a role')} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button onClick={handleAddMember}>
                  {t('common.add', 'Add')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t('company.members.membersList', 'Members List')}</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder={t('company.members.search', 'Search members...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
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
                {filteredMembers.map((member) => (
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
                          <DropdownMenuItem onClick={() => handleUpdateRole(member.id, member.roleId)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {t('company.members.editRole', 'Edit Role')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('company.members.remove', 'Remove')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}