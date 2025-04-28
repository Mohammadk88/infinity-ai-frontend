'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { 
  Loader2, Save, Globe2, Languages, CreditCard, Upload, 
  Building2, Trash2, AlertTriangle, Phone, Mail, MapPin, Globe, FileText 
} from 'lucide-react';
import axios from '@/app/lib/axios';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useToast } from '@/components/ui/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import api from '@/app/lib/axios';

// Common timezones
const commonTimezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time - US & Canada (UTC-05:00)' },
  { value: 'America/Chicago', label: 'Central Time - US & Canada (UTC-06:00)' },
  { value: 'America/Denver', label: 'Mountain Time - US & Canada (UTC-07:00)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time - US & Canada (UTC-08:00)' },
  { value: 'Europe/London', label: 'London, Dublin, Lisbon (UTC+00:00)' },
  { value: 'Europe/Paris', label: 'Paris, Madrid, Rome, Berlin (UTC+01:00)' },
  { value: 'Europe/Istanbul', label: 'Istanbul, Helsinki, Athens (UTC+03:00)' },
  { value: 'Asia/Dubai', label: 'Dubai, Abu Dhabi (UTC+04:00)' },
  { value: 'Asia/Riyadh', label: 'Riyadh, Kuwait (UTC+03:00)' },
  { value: 'Asia/Singapore', label: 'Singapore, Hong Kong (UTC+08:00)' },
  { value: 'Asia/Tokyo', label: 'Tokyo, Seoul (UTC+09:00)' },
  { value: 'Australia/Sydney', label: 'Sydney, Melbourne (UTC+10:00)' },
];

// Languages available in the system
const availableLanguages = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية (Arabic)' },
  { value: 'tr', label: 'Türkçe (Turkish)' },
  { value: 'fr', label: 'Français (French)' },
  { value: 'es', label: 'Español (Spanish)' },
  { value: 'de', label: 'Deutsch (German)' },
  { value: 'ru', label: 'Русский (Russian)' },
  { value: 'fa', label: 'فارسی (Persian)' },
  { value: 'ur', label: 'اردو (Urdu)' }
];

// Currencies with symbols
const availableCurrencies = [
  { value: 'USD', label: 'USD ($) - US Dollar' },
  { value: 'EUR', label: 'EUR (€) - Euro' },
  { value: 'TRY', label: 'TRY (₺) - Turkish Lira' },
  { value: 'AED', label: 'AED (د.إ) - UAE Dirham' },
  { value: 'SAR', label: 'SAR (ر.س) - Saudi Riyal' },
  { value: 'GBP', label: 'GBP (£) - British Pound' },
  { value: 'JPY', label: 'JPY (¥) - Japanese Yen' }
];

// Form schema for validations
const companyFormSchema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  logoUrl: z.string().optional(),
  coverImage: z.string().optional(),
  website: z.string().url({ message: "Enter a valid URL" }).or(z.literal('')),
  description: z.string().optional(),
  isActive: z.boolean(),
  defaultRoleId: z.string().min(1, { message: "Default role is required" }),
  timezone: z.string().min(1, { message: "Timezone is required" }),
  language: z.string().min(2, { message: "Language is required" }),
  currency: z.string().min(3, { message: "Currency is required" }),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface Role {
  id: string;
  name: string;
  description?: string;
}

export default function CompanySettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { currentCompany, fetchCompany } = useCompanyStore();

  // State for image uploads and previews
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  // Get current browser timezone
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  // Initialize React Hook Form
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      logoUrl: '',
      coverImage: '',
      description: '',
      isActive: true,
      defaultRoleId: 'member',
      timezone: browserTimezone,
      language: 'en',
      currency: 'USD',
    }
  });

  // Fetch company data
  useEffect(() => {
    const loadCompany = async () => {
      setIsFetching(true);
      if (currentCompany?.id) {
        try {
          // Use Axios directly to get complete company info
          const response = await api.get(`/companies/${currentCompany.id}`);
          const companyData = response.data;
          
          // Update form with fetched data
          form.reset({
            name: companyData.name || '',
            email: companyData.email || '',
            phone: companyData.phone || '',
            address: companyData.address || '',
            website: companyData.website || '',
            description: companyData.description || '',
            logoUrl: companyData.logoUrl || '',
            coverImage: companyData.coverImage || '',
            isActive: companyData.isActive ?? true,
            defaultRoleId: companyData.defaultRoleId || 'member',
            timezone: companyData.timezone || browserTimezone,
            language: companyData.language || 'en',
            currency: companyData.currency || 'USD',
          });

          // Set image previews if available
          if (companyData.logoUrl) setLogoPreview(companyData.logoUrl);
          if (companyData.coverImage) setCoverPreview(companyData.coverImage);
          
        } catch (error) {
          console.error("Error fetching company details:", error);
          toast({
            variant: 'destructive',
            title: t('company.settings.fetchError', 'Error'),
            description: t('company.settings.fetchErrorDesc', 'Failed to load company details.'),
          });
          
          // Fall back to using the store data if API fails
          if (currentCompany) {
            form.reset({
              name: currentCompany.name || '',
              email: currentCompany.email || '',
              phone: currentCompany.phone || '',
              address: currentCompany.address || '',
              website: currentCompany.website || '',
              description: currentCompany.description || '',
              logoUrl: currentCompany.logoUrl || '',
              coverImage: currentCompany.coverImage || '',  
              isActive: currentCompany.isActive ?? true,
              defaultRoleId: currentCompany.defaultRole || 'member',
              timezone: browserTimezone,
              language: 'en',
              currency: 'USD',
            });
            
            if (currentCompany.logoUrl) setLogoPreview(currentCompany.logoUrl);
            if (currentCompany.coverImage) setCoverPreview(currentCompany.coverImage);
          }
        } finally {
          setIsFetching(false);
        }
      } else {
        setIsFetching(false);
      }
    };

    loadCompany();
  }, [currentCompany?.id, form, t, browserTimezone, currentCompany, toast]);

  // Fetch available roles for the company
  useEffect(() => {
    const fetchRoles = async () => {
      if (!currentCompany?.id) return;
      
      setIsLoadingRoles(true);
      try {
        const response = await axios.get(`/roles?companyId=${currentCompany.id}`);
        setRoles(response.data || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
        // Fallback to static roles if API fails
        setRoles([
          { id: 'admin', name: t('company.roles.admin', 'Administrator') },
          { id: 'manager', name: t('company.roles.manager', 'Manager') },
          { id: 'member', name: t('company.roles.member', 'Member') },
          { id: 'guest', name: t('company.roles.guest', 'Guest') }
        ]);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [currentCompany?.id, t]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File size validation (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: t('company.settings.fileTooLarge', 'File Too Large'),
          description: t('company.settings.fileSizeLimit', 'File must be less than 5MB'),
        });
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File size validation (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: t('company.settings.fileTooLarge', 'File Too Large'),
          description: t('company.settings.fileSizeLimit', 'File must be less than 5MB'),
        });
        return;
      }
      
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CompanyFormValues) => {
    if (!currentCompany?.id) {
      toast({
        variant: 'destructive',
        title: t('company.settings.noCompany', 'No Company Selected'),
        description: t('company.settings.selectCompany', 'Please select a company to update.'),
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== 'logoUrl' && key !== 'coverImage') {
          formData.append(key, value.toString());
        }
      });
      
      // Add file uploads if present
      if (logoFile) {
        formData.append('logo', logoFile);
      } else if (data.logoUrl) {
        formData.append('logoUrl', data.logoUrl);
      }      
      
      
      if (coverFile) {
        formData.append('cover', coverFile);
      } else if (data.coverImage) {
        formData.append('coverImage', data.coverImage);
      }
      
      // Make the API call
      await axios.put(`/companies/${currentCompany.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh company data to show updated values
      await fetchCompany(currentCompany.id);
      
      toast({
        title: t('company.settings.updateSuccess', 'Settings Updated'),
        description: t('company.settings.updateSuccessDesc', 'Company settings have been updated successfully.'),
      });
    } catch (error) {
      console.error("Error updating company:", error);
      toast({
        variant: 'destructive',
        title: t('company.settings.updateError', 'Update Failed'),
        description: t('company.settings.updateErrorDesc', 'There was an error updating company settings.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentCompany?.id) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/companies/${currentCompany.id}`);
      
      toast({
        title: t('company.settings.deleteSuccess', 'Company Deleted'),
        description: t('company.settings.deleteSuccessDesc', 'Company has been deleted successfully.'),
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error("Error deleting company:", error);
      toast({
        variant: 'destructive',
        title: t('company.settings.deleteError', 'Delete Failed'),
        description: t('company.settings.deleteErrorDesc', 'There was an error deleting the company.'),
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto p-6 max-w-4xl space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('company.settings.title', 'Company Settings')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('company.settings.description', 'Manage your company profile and preferences')}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="profile">{t('company.settings.tabs.profile', 'Profile')}</TabsTrigger>
              <TabsTrigger value="preferences">{t('company.settings.tabs.preferences', 'Preferences')}</TabsTrigger>
              <TabsTrigger value="regional">{t('company.settings.tabs.regional', 'Regional')}</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('company.settings.profile.title', 'Company Profile')}</CardTitle>
                  <CardDescription>
                    {t('company.settings.profile.description', 'Update your company information and branding')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {t('company.settings.name', 'Company Name')}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('company.settings.namePlaceholder', 'Enter company name')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {t('company.settings.email', 'Email')}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="company@example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {t('company.settings.phone', 'Phone')}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+1 (555) 000-0000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              {t('company.settings.website', 'Website')}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {t('company.settings.address', 'Address')}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('company.settings.addressPlaceholder', 'Enter company address')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {t('company.settings.description', 'Description')}
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder={t('company.settings.descriptionPlaceholder', 'Enter company description')}
                              className="min-h-[100px]" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-4">
                      <Label>{t('company.settings.logo', 'Company Logo')}</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900">
                          {logoPreview ? (
                            <Image
                              src={logoPreview}
                              alt="logoUrl"
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          ) : (
                            <Building2 className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            name="logo"
                            accept="image/*"
                            className="hidden"
                            id="logo-upload"
                            onChange={handleLogoChange}
                          />
                          <Label htmlFor="logo-upload" className="cursor-pointer">
                            <div className="flex items-center gap-2 p-2 px-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <Upload className="h-4 w-4" />
                              <span>{t('company.settings.uploadLogo', 'Upload Logo')}</span>
                            </div>
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {t('company.settings.logoRequirements', 'Recommended size: 400x400px. Max: 5MB.')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>{t('company.settings.cover', 'Cover Image')}</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-24 w-40 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900">
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
                        <div className="space-y-2">
                          <Input
                            type="file"
                            name="cover"
                            accept="image/*"
                            className="hidden"
                            id="cover-upload"
                            onChange={handleCoverChange}
                          />
                          <Label htmlFor="cover-upload" className="cursor-pointer">
                            <div className="flex items-center gap-2 p-2 px-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <Upload className="h-4 w-4" />
                              <span>{t('company.settings.uploadCover', 'Upload Cover')}</span>
                            </div>
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {t('company.settings.coverRequirements', 'Recommended size: 1200x400px. Max: 5MB.')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('company.settings.preferences.title', 'Preferences')}</CardTitle>
                  <CardDescription>
                    {t('company.settings.preferences.description', 'Configure company-wide settings and defaults')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>{t('company.settings.active', 'Company Status')}</FormLabel>
                          <FormDescription>
                            {t('company.settings.activeDescription', 'Toggle company active status')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultRoleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('company.settings.defaultRole', 'Default Member Role')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoadingRoles}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('company.settings.selectRole', 'Select default role')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingRoles ? (
                              <SelectItem value="loading" disabled>
                                {t('company.settings.loadingRoles', 'Loading roles...')}
                              </SelectItem>
                            ) : (
                              roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t('company.settings.defaultRoleDescription', 'Set the default role for new company members')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="font-medium">{t('company.settings.deleteConfirm.warning', 'Warning')}</p>
                              <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>{t('company.settings.deleteConfirm.warning1', 'All company data will be deleted')}</li>
                                <li>{t('company.settings.deleteConfirm.warning2', 'All team members will lose access')}</li>
                                <li>{t('company.settings.deleteConfirm.warning3', 'All associated projects will be removed')}</li>
                                <li>{t('company.settings.deleteConfirm.warning4', 'This action is permanent and cannot be recovered')}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="mt-4">
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            {t('company.settings.cancel', 'Cancel')}
                          </Button>
                          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('company.settings.deleting', 'Deleting...')}
                              </>
                            ) : (
                              t('company.settings.confirmDelete', 'Yes, delete company')
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Regional Tab */}
            <TabsContent value="regional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.general.title', 'Regional Settings')}</CardTitle>
                  <CardDescription>
                    {t('settings.general.description', 'Configure your company timezone, language, and currency')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Globe2 className="h-4 w-4 text-muted-foreground" />
                              {t('settings.timezone', 'Timezone')}
                            </div>
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('settings.selectTimezone', 'Select timezone')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              <SelectGroup>
                                <SelectLabel>Common Timezones</SelectLabel>
                                {commonTimezones.map((timezone) => (
                                  <SelectItem key={timezone.value} value={timezone.value}>
                                    {timezone.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t('settings.timezoneDescription', 'Your current timezone: ')} {browserTimezone}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <Languages className="h-4 w-4 text-muted-foreground" />
                              {t('settings.language', 'Language')}
                            </div>
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('settings.selectLanguage', 'Select language')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                  {language.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t('settings.languageDescription', 'The language used throughout the platform')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              {t('settings.currency', 'Currency')}
                            </div>
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('settings.selectCurrency', 'Select currency')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableCurrencies.map((currency) => (
                                <SelectItem key={currency.value} value={currency.value}>
                                  {currency.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t('settings.currencyDescription', 'Used for all financial transactions')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || !form.formState.isDirty} 
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('settings.saving', 'Saving...')}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t('settings.save', 'Save Changes')}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}