'use client';

import { useState, useEffect } from 'react';
import { useCompanyStore } from '@/store/useCompanyStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import EditCompanyForm from '@/components/forms/EditCompanyForm';
import EditCompanySettingsForm from '@/components/forms/EditCompanySettingsForm';

export default function CompanySettingsPage() {
  const { t } = useTranslation();
  const { currentCompany } = useCompanyStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for company information to load
    if (currentCompany !== undefined) {
      setIsLoading(false);
    }
  }, [currentCompany]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="basic">{t('company.settings.tabs.basic', 'Basic Info')}</TabsTrigger>
          <TabsTrigger value="settings">{t('company.settings.tabs.settings', 'Settings')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          {currentCompany?.id && <EditCompanyForm companyId={currentCompany.id} />}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          {currentCompany?.id && <EditCompanySettingsForm companyId={currentCompany.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}