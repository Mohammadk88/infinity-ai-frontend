'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Building2, Upload, Trash2, Save, AlertTriangle } from 'lucide-react';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useToast } from '@/components/ui/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CompanyFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  logo?: File;
  coverImage?: File;
  isActive: boolean;
  defaultRole: string;
}

export default function CompanySettingsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { currentCompany, isLoading, fetchCompany, updateCompany, deleteCompany } = useCompanyStore();

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    isActive: true,
    defaultRole: 'member'
  });

  // State for image previews
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  useEffect(() => {
    if (params.id) {
      fetchCompany(params.id as string);
    }
  }, [params.id, fetchCompany]);

  useEffect(() => {
    if (currentCompany) {
      setFormData({
        name: currentCompany.name,
        email: currentCompany.email,
        phone: currentCompany.phone,
        address: currentCompany.address,
        website: currentCompany.website,
        description: currentCompany.description,
        isActive: currentCompany.isActive,
        defaultRole: currentCompany.defaultRole
      });
      if (currentCompany.logo) setLogoPreview(currentCompany.logo);
      if (currentCompany.coverImage) setCoverPreview(currentCompany.coverImage);
    }
  }, [currentCompany]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogoPreview(reader.result as string);
          setFormData(prev => ({ ...prev, logo: file }));
        } else {
          setCoverPreview(reader.result as string);
          setFormData(prev => ({ ...prev, coverImage: file }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.id) return;

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'boolean') {
            formDataToSend.append(key, value.toString());
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      await updateCompany(params.id as string, formDataToSend);
      toast({
        title: t('company.settings.updateSuccess', 'Settings Updated'),
        description: t('company.settings.updateSuccessDesc', 'Company settings have been updated successfully.'),
      });
    } catch {
      toast({
        variant: 'destructive',
        title: t('company.settings.updateError', 'Update Failed'),
        description: t('company.settings.updateErrorDesc', 'There was an error updating company settings.'),
      });
    }
  };

  const handleDelete = async () => {
    if (!params.id) return;

    try {
      await deleteCompany(params.id as string);
      toast({
        title: t('company.settings.deleteSuccess', 'Company Deleted'),
        description: t('company.settings.deleteSuccessDesc', 'Company has been deleted successfully.'),
      });
      // Redirect to companies list or dashboard
      window.location.href = '/dashboard/companies';
    } catch {
      toast({
        variant: 'destructive',
        title: t('company.settings.deleteError', 'Delete Failed'),
        description: t('company.settings.deleteErrorDesc', 'There was an error deleting the company.'),
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('company.settings.title', 'Company Settings')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('company.settings.description', 'Manage your company profile and preferences')}
          </p>
        </div>
        <Button variant="outline" disabled={isLoading} onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {t('company.settings.saveChanges', 'Save Changes')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('company.settings.profile.title', 'Company Profile')}</CardTitle>
            <CardDescription>
              {t('company.settings.profile.description', 'Update your company information and branding')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('company.settings.name', 'Company Name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('company.settings.email', 'Email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="company@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('company.settings.phone', 'Phone')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">{t('company.settings.website', 'Website')}</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">{t('company.settings.address', 'Address')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter company address"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">{t('company.settings.description', 'Description')}</Label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter company description"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>{t('company.settings.logo', 'Company Logo')}</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                      onChange={(e) => handleFileChange(e, 'logo')}
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <div>
                          <Upload className="h-4 w-4 mr-2" />
                          {t('company.settings.uploadLogo', 'Upload Logo')}
                        </div>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>{t('company.settings.cover', 'Cover Image')}</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-40 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                    {coverPreview ? (
                      <Image
                        src={coverPreview}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="cover-upload"
                      onChange={(e) => handleFileChange(e, 'cover')}
                    />
                    <Label htmlFor="cover-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <div>
                          <Upload className="h-4 w-4 mr-2" />
                          {t('company.settings.uploadCover', 'Upload Cover')}
                        </div>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('company.settings.preferences.title', 'Preferences')}</CardTitle>
            <CardDescription>
              {t('company.settings.preferences.description', 'Configure company-wide settings and defaults')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('company.settings.active', 'Company Status')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('company.settings.activeDescription', 'Toggle company active status')}
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('company.settings.defaultRole', 'Default Member Role')}</Label>
              <Select
                value={formData.defaultRole}
                onValueChange={(value) => setFormData(prev => ({ ...prev, defaultRole: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('company.settings.selectRole', 'Select default role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('company.roles.admin', 'Administrator')}</SelectItem>
                  <SelectItem value="manager">{t('company.roles.manager', 'Manager')}</SelectItem>
                  <SelectItem value="member">{t('company.roles.member', 'Member')}</SelectItem>
                  <SelectItem value="guest">{t('company.roles.guest', 'Guest')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                {t('company.settings.defaultRoleDescription', 'Set the default role for new company members')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">{t('company.settings.dangerZone.title', 'Danger Zone')}</CardTitle>
            <CardDescription>
              {t('company.settings.dangerZone.description', 'Irreversible actions that affect your company')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-medium">{t('company.settings.deleteCompany', 'Delete Company')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('company.settings.deleteDescription', 'Permanently delete your company and all its data')}
                </p>
              </div>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('company.settings.delete', 'Delete Company')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('company.settings.deleteConfirm.title', 'Delete Company?')}</DialogTitle>
                    <DialogDescription>
                      {t('company.settings.deleteConfirm.description', 'This action cannot be undone. This will permanently delete your company account and remove your data from our servers.')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
                    <div className="flex gap-3 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      <div className="text-sm">
                        <p className="font-medium">{t('company.settings.deleteConfirm.warning', 'Warning')}</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>{t('company.settings.deleteConfirm.warning1', 'All company data will be deleted')}</li>
                          <li>{t('company.settings.deleteConfirm.warning2', 'All team members will lose access')}</li>
                          <li>{t('company.settings.deleteConfirm.warning3', 'All associated projects will be removed')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      {t('company.settings.cancel', 'Cancel')}
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                      {t('company.settings.confirmDelete', 'Yes, delete company')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}