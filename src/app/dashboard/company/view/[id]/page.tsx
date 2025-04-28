'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ViewCompanyForm from '@/components/forms/ViewCompanyForm';

export default function ViewCompanyPage() {
  const { t } = useTranslation();
  const params = useParams();
  const companyId = params.id as string;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('company.view.title', 'Company Information')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('company.view.subtitle', 'View detailed company information and settings')}
          </p>
        </div>
        <Link href="/dashboard/company">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back', 'Back')}
          </Button>
        </Link>
      </div>

      {/* Company information form */}
      <ViewCompanyForm companyId={companyId} />
    </div>
  );
}