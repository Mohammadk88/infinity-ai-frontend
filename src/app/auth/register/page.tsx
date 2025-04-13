'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/app/lib/axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      await api.post('/auth/register', data);
      alert(t('register.success'));
    } catch (err) {
      alert(t('register.failed'));
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4"
    >
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">{t('register.title')}</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('register.name')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="email">{t('register.email')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="password">{t('register.password')}</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('register.loading') : t('register.button')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
