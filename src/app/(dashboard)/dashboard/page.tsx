'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { user, loading } = useAuth(true);
  const { t } = useTranslation();

  if (loading) return <p className="text-center mt-10">{t('dashboard.loading')}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        {t('dashboard.welcome')}, {user?.name} 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>{t('dashboard.accounts.title')}</CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">4</p>
            <p className="text-muted-foreground text-sm">
              {t('dashboard.accounts.subtitle')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>{t('dashboard.posts.title')}</CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-muted-foreground text-sm">
              {t('dashboard.posts.subtitle')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>{t('dashboard.campaigns.title')}</CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">3</p>
            <p className="text-muted-foreground text-sm">
              {t('dashboard.campaigns.subtitle')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
