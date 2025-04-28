'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Loader2, Edit, Globe2, Languages, CreditCard, 
  Phone, Mail, MapPin, Globe, FileText, BadgeCheck,
  Building, Calendar, AlertCircle
} from 'lucide-react';
import axios from '@/app/lib/axios';
import { useCompanyStore } from '@/store/useCompanyStore';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/app/lib/axios';

// Common timezones mapping for display
const timezonesMap: Record<string, string> = {
  'UTC': 'UTC (Coordinated Universal Time)',
  'America/New_York': 'Eastern Time - US & Canada (UTC-05:00)',
  'America/Chicago': 'Central Time - US & Canada (UTC-06:00)',
  'America/Denver': 'Mountain Time - US & Canada (UTC-07:00)',
  'America/Los_Angeles': 'Pacific Time - US & Canada (UTC-08:00)',
  'Europe/London': 'London, Dublin, Lisbon (UTC+00:00)',
  'Europe/Paris': 'Paris, Madrid, Rome, Berlin (UTC+01:00)',
  'Europe/Istanbul': 'Istanbul, Helsinki, Athens (UTC+03:00)',
  'Asia/Dubai': 'Dubai, Abu Dhabi (UTC+04:00)',
  'Asia/Riyadh': 'Riyadh, Kuwait (UTC+03:00)',
  'Asia/Singapore': 'Singapore, Hong Kong (UTC+08:00)',
  'Asia/Tokyo': 'Tokyo, Seoul (UTC+09:00)',
  'Australia/Sydney': 'Sydney, Melbourne (UTC+10:00)',
};

// Languages display mapping
const languagesMap: Record<string, string> = {
  'en': 'English',
  'ar': 'العربية (Arabic)',
  'tr': 'Türkçe (Turkish)',
  'fr': 'Français (French)',
  'es': 'Español (Spanish)',
  'de': 'Deutsch (German)',
  'ru': 'Русский (Russian)',
  'fa': 'فارسی (Persian)',
  'ur': 'اردو (Urdu)'
};

// Currencies display mapping with symbols
const currenciesMap: Record<string, string> = {
  'USD': 'USD ($) - US Dollar',
  'EUR': 'EUR (€) - Euro',
  'TRY': 'TRY (₺) - Turkish Lira',
  'AED': 'AED (د.إ) - UAE Dirham',
  'SAR': 'SAR (ر.س) - Saudi Riyal',
  'GBP': 'GBP (£) - British Pound',
  'JPY': 'JPY (¥) - Japanese Yen'
};

// Country mapping - simplified version (would be expanded in a real implementation)
const countriesMap: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'TR': 'Turkey',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'DE': 'Germany',
  'FR': 'France',
  'ES': 'Spain',
  // Add more as needed
};

interface CompanyInfo {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  verified: boolean;
}

interface CompanySettings {
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  timezone: string;
  language: string;
  currency: string;
  countryId?: string;
  logoUrl?: string;
  coverImage?: string;
  defaultRoleId: string;
}

export default function ViewCompanyForm({ companyId }: { companyId: string }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch company info first
        const companyResponse = await api.get(`/companies/${companyId}`);
        setCompanyInfo(companyResponse.data);
        
        try {
          // If company info succeeds, try to fetch settings
          const settingsResponse = await api.get(`/companies/${companyId}/setting`);
          setCompanySettings(settingsResponse.data);
        } catch (settingsErr: any) {
          console.error('Error fetching company settings:', settingsErr);
          
          // Still set the company info, but show warning about settings
          const errorMessage = settingsErr.response?.data?.message || 
            settingsErr.message || 
            t('company.view.settingsError', 'Settings information could not be loaded.');
          
          // We don't set the main error since we have the basic company info
          // Just log it for now and show partial data
          console.warn('Company settings error:', errorMessage);
        }
      } catch (companyErr: any) {
        console.error('Error fetching company data:', companyErr);
        
        // This is a critical error - we can't show the company at all
        const errorCode = companyErr.response?.status;
        const errorMessage = companyErr.response?.data?.message || companyErr.message;
        
        let userFriendlyError;
        if (errorCode === 404) {
          userFriendlyError = t('company.view.notFound', 'Company not found. It may have been deleted or you may not have permission to view it.');
        } else if (errorCode === 403) {
          userFriendlyError = t('company.view.forbidden', 'You don\'t have permission to view this company.');
        } else if (errorCode === 401) {
          userFriendlyError = t('company.view.unauthorized', 'Your session may have expired. Please log in again.');
        } else {
          userFriendlyError = t('company.view.fetchError', 'Failed to load company data. Please try again.');
        }
        
        setError(`${userFriendlyError} (${errorCode || 'Error'}: ${errorMessage || 'Unknown error'})`);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId, t]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">{t('company.view.loading', 'Loading company data...')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium">{t('company.view.error', 'Error')}</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => window.location.reload()}
            >
              {t('company.view.retry', 'Retry')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render company view
  return (
    <div className="space-y-6">
      {/* Company Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{t('company.view.basicInfo', 'Company Informat ion')}</CardTitle>
            <CardDescription>
              {t('company.view.basicInfoDesc', 'Basic details about your company')}
            </CardDescription>
          </div>
          <Link href={`/dashboard/company/${companyId}/edit-basic-info`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              <span>{t('company.view.edit', 'Edit')}</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company name */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t('company.view.name', 'Company Name')}</p>
              <p className="text-lg font-semibold">{companyInfo?.name || '-'}</p>
            </div>

            {/* Company type */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t('company.view.type', 'Company Type')}</p>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{companyInfo?.type || '-'}</p>
              </div>
            </div>

            {/* Status and verification */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex flex-wrap gap-2">
                {companyInfo?.isActive ? (
                  <Badge variant="default" className="px-2 py-1">
                    {t('company.view.active', 'Active')}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="px-2 py-1 bg-gray-200 dark:bg-gray-700">
                    {t('company.view.inactive', 'Inactive')}
                  </Badge>
                )}

                {companyInfo?.verified ? (
                  <Badge variant="outline" className="px-2 py-1 border-green-500 text-green-500 flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    {t('company.view.verified', 'Verified')}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="px-2 py-1 border-orange-500 text-orange-500">
                    {t('company.view.notVerified', 'Not Verified')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('company.view.profileInfo', 'Company Profile')}</CardTitle>
          <CardDescription>
            {t('company.view.profileInfoDesc', 'Detailed information about your company')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
            {/* Email */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                {t('company.settings.email', 'Email')}
              </div>
              <p>{companySettings?.email || '-'}</p>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Phone className="h-4 w-4" />
                {t('company.settings.phone', 'Phone')}
              </div>
              <p>{companySettings?.phone || '-'}</p>
            </div>

            {/* Website */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Globe className="h-4 w-4" />
                {t('company.settings.website', 'Website')}
              </div>
              {companySettings?.website ? (
                <a 
                  href={companySettings.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {companySettings.website}
                </a>
              ) : (
                <p>-</p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Globe2 className="h-4 w-4" />
                {t('company.settings.country', 'Country')}
              </div>
              <p>
                {companySettings?.countryId ? 
                  countriesMap[companySettings.countryId] || companySettings.countryId 
                  : '-'}
              </p>
            </div>

            {/* Address - full width */}
            <div className="space-y-1 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {t('company.settings.address', 'Address')}
              </div>
              <p>{companySettings?.address || '-'}</p>
            </div>

            {/* Description - full width */}
            <div className="space-y-1 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                {t('company.settings.description', 'Description')}
              </div>
              <p className="whitespace-pre-wrap">{companySettings?.description || '-'}</p>
            </div>

            {/* Timezone */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Globe2 className="h-4 w-4" />
                {t('settings.timezone', 'Timezone')}
              </div>
              <p>{companySettings?.timezone ? 
                (timezonesMap[companySettings.timezone] || companySettings.timezone)
                : '-'}
              </p>
            </div>

            {/* Language */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Languages className="h-4 w-4" />
                {t('settings.language', 'Language')}
              </div>
              <p>{companySettings?.language ? 
                (languagesMap[companySettings.language] || companySettings.language)
                : '-'}
              </p>
            </div>

            {/* Currency */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                {t('settings.currency', 'Currency')}
              </div>
              <p>{companySettings?.currency ? 
                (currenciesMap[companySettings.currency] || companySettings.currency)
                : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Branding Images */}
      <Card>
        <CardHeader>
          <CardTitle>{t('company.settings.branding.title', 'Company Branding')}</CardTitle>
          <CardDescription>
            {t('company.settings.branding.description', 'Company logo and cover image')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">{t('company.settings.logo', 'Company Logo')}</h3>
              <div className="h-40 w-40 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900">
                {companySettings?.logoUrl ? (
                  <Image
                    src={companySettings.logoUrl}
                    alt="Company Logo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 160px, 160px"
                  />
                ) : (
                  <div className="h-16 w-16 text-gray-400 flex items-center justify-center">
                    <span className="font-semibold text-lg">LOGO</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">{t('company.settings.cover', 'Cover Image')}</h3>
              <div className="h-40 w-full rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900">
                {companySettings?.coverImage ? (
                  <Image
                    src={companySettings.coverImage}
                    alt="Cover Image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 384px"
                  />
                ) : (
                  <div className="h-16 w-16 text-gray-400 flex items-center justify-center">
                    <span className="font-semibold text-lg">COVER</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link href={`/dashboard/company/${companyId}/setting`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {t('company.view.editCompany', 'Edit Company')}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}