'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import axios from '@/app/lib/axios';
import EditCompanySettingsForm from '@/components/forms/EditCompanySettingsForm';
import type { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

export default function CompanySettingsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [companyExists, setCompanyExists] = useState(false);
  const companyId = params.id;

  // Verify that the company exists and user has access
  const verifyCompanyAccess = useCallback(async () => {
    if (!companyId) return;
    
    try {
      await axios.get(`/companies/${companyId}`);
      setCompanyExists(true);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast({
        title: 'Error',
        description: axiosError.response?.data?.message || 'Company not found or you do not have access',
        variant: 'destructive',
      });
      // Redirect back if company doesn't exist or user doesn't have access
      router.push('/dashboard/company');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, router]);

  useEffect(() => {
    verifyCompanyAccess();
  }, [verifyCompanyAccess]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 mr-4" />
          <div>
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div className="flex flex-col space-y-4">
        <Button 
          variant="ghost" 
          className="w-fit flex items-center" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back', 'Back')}
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('company.settings.title', 'Company Settings')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('company.settings.description', 'Manage your company profile and preferences')}
          </p>
        </div>
      </div>
      
      {companyExists && <EditCompanySettingsForm companyId={companyId} />}
    </div>
  );
}