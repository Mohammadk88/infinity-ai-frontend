'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { 
  Loader2, Save, Globe2, Languages, CreditCard, Upload, 
  Building2, Phone, Mail, MapPin, Globe, FileText 
} from 'lucide-react';
import axios from '@/app/lib/axios';
import { useCompanyStore } from '@/store/useCompanyStore';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CountrySelect } from '@/components/ui/country-select';
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

const companyTypes = [
  { value: 'COMPANY', label: 'Company' },
  { value: 'AGENCY', label: 'Agency' },
];

// Form schema for validations
const companyFormSchema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  type: z.enum(['COMPANY', 'AGENCY']),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  website: z.string().url({ message: "Enter a valid URL" }).or(z.literal('')),
  description: z.string().optional(),
  defaultRoleId: z.string().min(1, { message: "Default role is required" }),
  timezone: z.string().min(1, { message: "Timezone is required" }),
  language: z.string().min(2, { message: "Language is required" }),
  currency: z.string().min(3, { message: "Currency is required" }),
  countryId: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface Role {
  id: string;
  name: string;
  description?: string;
}

export default function CompanyForm({ companyId }: { companyId?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentCompany, fetchCompany } = useCompanyStore();

  // State for image uploads and previews
  const [logo, setLogo] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Get current browser timezone
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  // Initialize React Hook Form
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      type: 'COMPANY',
      email: '',
      phone: '',
      address: '',
      website: '',
      description: '',
      defaultRoleId: 'member',
      timezone: browserTimezone,
      language: 'en',
      currency: 'USD',
      countryId: '',
    }
  });

  // Fetch company data
  useEffect(() => {
    const loadCompany = async () => {
      setIsFetching(true);
      if (companyId) {
        try {
          // Use Axios directly to get complete company info
          const response = await api.get(`/companies/${companyId}`);
          const companyData = response.data;
          
          // Update form with fetched data
          form.reset({
            name: companyData.name || '',
            type: companyData.type || 'COMPANY',
            email: companyData.email || '',
            phone: companyData.phone || '',
            address: companyData.address || '',
            website: companyData.website || '',
            description: companyData.description || '',
            defaultRoleId: companyData.defaultRoleId || 'member',
            timezone: companyData.timezone || browserTimezone,
            language: companyData.language || 'en',
            currency: companyData.currency || 'USD',
            countryId: companyData.countryId || '',
          });

          // Set image previews if available
          if (companyData.logoUrl) setLogoPreview(companyData.logoUrl);
          if (companyData.coverImage) setCoverPreview(companyData.coverImage);
          
        } catch (error) {
          console.error("Error fetching company details:", error);
          toast.error(t('company.settings.fetchErrorDesc', 'Failed to load company details.'));
        } finally {
          setIsFetching(false);
        }
      } else {
        setIsFetching(false);
      }
    };

    loadCompany();
  }, [companyId, form, t, browserTimezone]);

  // Fetch available roles for the company
  useEffect(() => {
    const fetchRoles = async () => {
      if (!companyId) return;
      
      setIsLoadingRoles(true);
      try {
        const response = await axios.get(`/roles?companyId=${companyId}`);
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
  }, [companyId, t]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File size validation (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('company.settings.fileSizeLimit', 'File must be less than 5MB'));
        return;
      }
      
      setLogo(file);
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
        toast.error(t('company.settings.fileSizeLimit', 'File must be less than 5MB'));
        return;
      }
      
      setCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CompanyFormValues) => {
    if (!companyId) {
      toast.error(t('company.settings.selectCompany', 'Please select a company to update.'));
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add company basic info
      formData.append('name', data.name);
      formData.append('type', data.type);
      
      // Add company settings
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      if (data.website) formData.append('website', data.website);
      if (data.description) formData.append('description', data.description);
      formData.append('defaultRoleId', data.defaultRoleId);
      formData.append('timezone', data.timezone);
      formData.append('language', data.language);
      formData.append('currency', data.currency);
      if (data.countryId) formData.append('countryId', data.countryId);
      
      // Add file uploads if present
      if (logo) {
        formData.append('logo', logo);
      }
      
      if (cover) {
        formData.append('cover', cover);
      }
      
      // Make the API call with upload progress
      await api.put(`/companies/${companyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      
      // Refresh company data to show updated values
      if (companyId) await fetchCompany(companyId);
      
      toast.success(t('company.settings.updateSuccessDesc', 'Company settings have been updated successfully.'));
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(t('company.settings.updateErrorDesc', 'There was an error updating company settings.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basicInfo" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="basicInfo">{t('company.settings.tabs.basicInfo', 'Basic Info')}</TabsTrigger>
            <TabsTrigger value="settings">{t('company.settings.tabs.settings', 'Settings')}</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basicInfo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('company.settings.basicInfo.title', 'Company Information')}</CardTitle>
                <CardDescription>
                  {t('company.settings.basicInfo.description', 'Update your company information')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {t('company.settings.type', 'Company Type')}
                          </div>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('company.settings.selectType', 'Select company type')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                            alt="Company Logo"
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
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('company.settings.contact.title', 'Contact Information')}</CardTitle>
                <CardDescription>
                  {t('company.settings.contact.description', 'Update your company contact details')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    name="countryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <Globe2 className="h-4 w-4 text-muted-foreground" />
                            {t('company.settings.country', 'Country')}
                          </div>
                        </FormLabel>
                        <FormControl>
                          <CountrySelect 
                            value={field.value} 
                            onValueChange={field.onChange} 
                          />
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
              </CardContent>
            </Card>

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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
        
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
  );
}