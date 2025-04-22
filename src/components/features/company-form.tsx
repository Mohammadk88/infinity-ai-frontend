'use client';

import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { CompanyType } from '@/types/Company';

const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  type: z.enum(['COMPANY', 'AGENCY']),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  initialData?: Partial<CompanyFormData>;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CompanyForm({ initialData, onSubmit, isSubmitting }: CompanyFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      type: 'COMPANY',
      status: 'active',
      ...initialData,
    },
  });

  const selectedType = watch('type');

  const getTypeDescription = (type: CompanyType) => {
    return type === 'COMPANY'
      ? t('company.type.companyDesc', 'A standalone business with internal teams and client management.')
      : t('company.type.agencyDesc', 'A marketing or service agency that manages external clients and their accounts.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {t('company.form.name', 'Company Name')} *
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('name')}
                id="name"
                placeholder={t('company.form.namePlaceholder', 'Your Company Name')}
                className="pl-10"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              {t('company.form.email', 'Company Email')} *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="company@example.com"
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              {t('company.form.phone', 'Phone')}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('phone')}
                id="phone"
                placeholder="+1 (555) 000-0000"
                className="pl-10"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">
              {t('company.form.website', 'Website')}
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('website')}
                id="website"
                placeholder="https://example.com"
                className="pl-10"
              />
            </div>
            {errors.website && (
              <p className="text-sm text-destructive">{errors.website.message}</p>
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">
              {t('company.form.country', 'Country')} *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('country')}
                id="country"
                placeholder={t('company.form.countryPlaceholder', 'Country')}
                className="pl-10"
              />
            </div>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">
              {t('company.form.city', 'City')} *
            </Label>
            <Input
              {...register('city')}
              id="city"
              placeholder={t('company.form.cityPlaceholder', 'City')}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              {t('company.form.type', 'Company Type')} *
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value: CompanyType) => setValue('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMPANY">
                  {t('company.type.company', 'Company')}
                </SelectItem>
                <SelectItem value="AGENCY">
                  {t('company.type.agency', 'Agency')}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {getTypeDescription(selectedType as CompanyType)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            {t('company.form.address', 'Address')} *
          </Label>
          <Input
            {...register('address')}
            id="address"
            placeholder={t('company.form.addressPlaceholder', 'Street address')}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            {t('company.form.description', 'Description')}
          </Label>
          <Input
            {...register('description')}
            id="description"
            placeholder={t('company.form.descriptionPlaceholder', 'Brief description of your company')}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            {t('company.form.status', 'Status')} *
          </Label>
          <Select
            value={watch('status')}
            onValueChange={(value: 'active' | 'inactive') => setValue('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                {t('company.status.active', 'Active')}
              </SelectItem>
              <SelectItem value="inactive">
                {t('company.status.inactive', 'Inactive')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving', 'Saving...') : t('common.save', 'Save Changes')}
        </Button>
      </div>
    </form>
  );
}