'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { 
  Loader2, Save, Globe2, Languages, CreditCard, Upload, 
  Phone, Mail, MapPin, Globe, FileText, X, Trash2 
} from 'lucide-react';
import axios from '@/app/lib/axios';
import { useCompanyStore } from '@/store/useCompanyStore';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CountrySelect } from '@/components/ui/country-select';
import { useTranslation } from 'react-i18next';

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
const companySettingsSchema = z.object({
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

type CompanySettingsValues = z.infer<typeof companySettingsSchema>;

interface Role {
  id: string;
  name: string;
  description?: string;
}

export default function EditCompanySettingsForm({ companyId }: { companyId: string }) {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fetchCompany } = useCompanyStore();

  // State for image uploads and previews
  const [logo, setLogo] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Store original image URLs from the server
  const [originalLogoUrl, setOriginalLogoUrl] = useState<string>('');
  const [originalCoverUrl, setOriginalCoverUrl] = useState<string>('');

  // State for tracking if images should be removed
  const [removeLogoFlag, setRemoveLogoFlag] = useState<boolean>(false);
  const [removeCoverFlag, setRemoveCoverFlag] = useState<boolean>(false);

  // Get current browser timezone
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  // Initialize React Hook Form
  const form = useForm<CompanySettingsValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
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

  // Fetch company settings data
  useEffect(() => {
    const loadCompanySettings = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`/companies/${companyId}/setting`);
        const settingsData = response.data;
        
        // Update form with fetched data
        form.reset({
          email: settingsData.email || '',
          phone: settingsData.phone || '',
          address: settingsData.address || '',
          website: settingsData.website || '',
          description: settingsData.description || '',
          defaultRoleId: settingsData.defaultRoleId || 'member',
          timezone: settingsData.timezone || browserTimezone,
          language: settingsData.language || 'en',
          currency: settingsData.currency || 'USD',
          countryId: settingsData.countryId || '',
        });

        // Set image previews if available and store original URLs
        if (settingsData.logoUrl) {
          setLogoPreview(settingsData.logoUrl);
          setOriginalLogoUrl(settingsData.logoUrl);
          setRemoveLogoFlag(false);
        }
        
        if (settingsData.coverImage) {
          setCoverPreview(settingsData.coverImage);
          setOriginalCoverUrl(settingsData.coverImage);
          setRemoveCoverFlag(false);
        }
        
      } catch (error) {
        console.error("Error fetching company settings:", error);
        toast.error(t('company.settings.fetchErrorDesc', 'Failed to load company settings.'));
      } finally {
        setIsFetching(false);
      }
    };

    if (companyId) {
      loadCompanySettings();
    }
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

  // Handler for clearing logo
  const handleClearLogo = () => {
    setLogo(null);
    setLogoPreview('');
    setRemoveLogoFlag(true);
  };

  // Handler for clearing cover
  const handleClearCover = () => {
    setCover(null);
    setCoverPreview('');
    setRemoveCoverFlag(true);
  };

  const onSubmit = async (data: CompanySettingsValues) => {
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add company settings data
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      if (data.website) formData.append('website', data.website);
      if (data.description) formData.append('description', data.description);
      formData.append('defaultRoleId', data.defaultRoleId);
      formData.append('timezone', data.timezone);
      formData.append('language', data.language);
      formData.append('currency', data.currency);
      formData.append('countryId', data.countryId || '');
      
      // Handle logo image - simplify the logic to match what the backend expects
      if (logo) {
        // New logo file uploaded
        formData.append('logo', logo);
      } else if (logoPreview && !removeLogoFlag) {
        // Keep existing logo
        formData.append('keepExistingLogo', 'true');
      }
      
      // Handle cover image - simplify the logic to match what the backend expects
      if (cover) {
        // New cover file uploaded
        formData.append('cover', cover);
      } else if (coverPreview && !removeCoverFlag) {
        // Keep existing cover
        formData.append('keepExistingCover', 'true');
      }

      // Add removal flags if images should be removed
      if (removeLogoFlag) {
        formData.append('removeLogo', 'true');
      }
      
      if (removeCoverFlag) {
        formData.append('removeCover', 'true');
      }
      
      // For debugging
      console.log('Form data values:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Make the API call with upload progress
      const response = await axios.put(`/companies/${companyId}/setting`, formData, {
       /*  headers: {
          'Content-Type': 'multipart/form-data',
        }, */
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      
      console.log('Server response:', response.data);
      
      // Refresh company data to show updated values
      if (companyId) await fetchCompany(companyId);
      
      toast.success(t('company.settings.updateSuccessDesc', 'Company settings have been updated successfully.'));
    } catch (error: any) {
      console.error("Error updating company settings:", error);
      
      // More detailed error message
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`${t('company.settings.updateErrorDesc', 'There was an error updating company settings.')} ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Contact Information Card */}
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
                        defaultValue={field.value}
                        onSelect={(country) => {
                          if (country) {
                            field.onChange(country.id);
                          } else {
                            field.onChange('');
                          }
                        }}
                        placeholder={t('company.settings.selectCountry', 'Select country')}
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

        {/* Preferences Card */}
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

        {/* Image Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('company.settings.branding.title', 'Company Branding')}</CardTitle>
            <CardDescription>
              {t('company.settings.branding.description', 'Upload your company logo and cover image')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>{t('company.settings.logo', 'Company Logo')}</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900">
                    {logoPreview ? (
                      <>
                        <Image
                          src={logoPreview}
                          alt="Company Logo"
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                        <div className="absolute top-1 right-1">
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="destructive" 
                            className="h-5 w-5 rounded-full"
                            onClick={handleClearLogo}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="h-8 w-8 text-gray-400 flex items-center justify-center">
                        <span className="font-semibold">LOGO</span>
                      </div>
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
                    {logoPreview && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center justify-center gap-1 text-destructive hover:text-destructive"
                        onClick={handleClearLogo}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{t('company.settings.clear', 'Clear')}</span>
                      </Button>
                    )}
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
                      <>
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                        <div className="absolute top-1 right-1">
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="destructive" 
                            className="h-5 w-5 rounded-full"
                            onClick={handleClearCover}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="h-8 w-8 text-gray-400 flex items-center justify-center">
                        <span className="font-semibold">COVER</span>
                      </div>
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
                    {coverPreview && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center justify-center gap-1 text-destructive hover:text-destructive"
                        onClick={handleClearCover}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{t('company.settings.clear', 'Clear')}</span>
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t('company.settings.coverRequirements', 'Recommended size: 1200x400px. Max: 5MB.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
            disabled={isSubmitting || !form.formState.isDirty && !logo && !cover} 
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
                {t('settings.save', 'Save Settings')}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}