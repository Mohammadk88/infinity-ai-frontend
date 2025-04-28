'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import api from '@/app/lib/axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import EditCompanyBasicInfoForm from '@/components/forms/EditCompanyBasicInfoForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface CompanyData {
  id: string;
  name: string;
  type: 'BUSINESS' | 'AGENCY';
  isActive: boolean;
  verified: boolean;
}

const EditCompanyBasicInfoPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/companies/${companyId}`);
        setCompany(response.data);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching company data:', error);
        
        // More detailed error handling
        const statusCode = error.response?.status;
        if (statusCode === 404) {
          setError(t('company.error.notFound', 'Company not found. It may have been deleted or you do not have access to it.'));
        } else if (statusCode === 403) {
          setError(t('company.error.forbidden', 'You do not have permission to view this company.'));
        } else if (statusCode === 401) {
          setError(t('company.error.unauthorized', 'Your session may have expired. Please log in again.'));
          // Redirect to login page after a delay
          setTimeout(() => router.push('/auth/login'), 3000);
        } else {
          setError(t('company.error.general', 'Failed to load company information. Please try again later.'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId, router, t]);

  // Handle successful update
  const handleUpdateSuccess = (updatedData: CompanyData) => {
    // Update the local state for optimistic UI
    setCompany(updatedData);
  };

  // Handle retry on error
  const handleRetry = () => {
    // Reset error state and trigger refetch
    setError(null);
    setIsLoading(true);
    
    // Re-fetch data
    const fetchData = async () => {
      try {
        const response = await api.get(`/companies/${companyId}`);
        setCompany(response.data);
      } catch (error: any) {
        console.error('Error on retry:', error);
        setError(t('company.error.general', 'Failed to load company information. Please try again later.'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  };

  // Loading state with skeleton
  if (isLoading && !company) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        
        <div className="w-full max-w-2xl mx-auto">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('company.edit.title', 'Edit Company Info')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('company.edit.description', 'Update your company\'s basic information')}
        </p>
      </div>

      {/* Error display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('company.error.title', 'Error')}</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-fit"
              onClick={handleRetry}
            >
              {t('common.retry', 'Retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Form component */}
      <EditCompanyBasicInfoForm 
        companyId={companyId}
        initialData={company}
        isLoading={isLoading} 
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default EditCompanyBasicInfoPage;