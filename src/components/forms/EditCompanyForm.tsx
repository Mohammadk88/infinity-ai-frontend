'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Loader2, Save, Building2 } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

// Form schema for validations
const companyFormSchema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  type: z.enum(['COMPANY', 'AGENCY']),
  isActive: z.boolean(),
  verified: z.boolean()
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

const companyTypes = [
  { value: 'COMPANY', label: 'Company' },
  { value: 'AGENCY', label: 'Agency' },
];

export default function EditCompanyForm({ companyId }: { companyId: string }) {
  const { t } = useTranslation();
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchCompany } = useCompanyStore();

  // Initialize React Hook Form
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      type: 'COMPANY',
      isActive: true,
      verified: false
    }
  });

  // Fetch company data
  useEffect(() => {
    const loadCompany = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`/companies/${companyId}`);
        const companyData = response.data;
        
        // Update form with fetched data
        form.reset({
          name: companyData.name || '',
          type: companyData.type || 'COMPANY',
          isActive: companyData.isActive || true,
          verified: companyData.verified || false
        });
      } catch (error) {
        console.error("Error fetching company details:", error);
        toast.error(t('company.settings.fetchErrorDesc', 'Failed to load company details.'));
      } finally {
        setIsFetching(false);
      }
    };

    if (companyId) {
      loadCompany();
    }
  }, [companyId, form, t]);

  const onSubmit = async (data: CompanyFormValues) => {
    setIsSubmitting(true);
    
    try {
      await axios.put(`/companies/${companyId}`, {
        name: data.name,
        type: data.type,
        isActive: data.isActive,
        verified: data.verified
      });
      
      // Refresh company data to show updated values
      await fetchCompany(companyId);
      
      toast.success(t('company.settings.updateSuccessDesc', 'Company information has been updated successfully.'));
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(t('company.settings.updateErrorDesc', 'There was an error updating company information.'));
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('company.basicInfo.title', 'Basic Company Information')}</CardTitle>
        <CardDescription>
          {t('company.basicInfo.description', 'Update your company profile information')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('company.settings.isActive', 'Company Status')}
                    </FormLabel>
                    <FormDescription>
                      {t('company.settings.isActiveDescription', 'Set whether this company is active or inactive.')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('company.settings.verified', 'Verified Company')}
                    </FormLabel>
                    <FormDescription>
                      {t('company.settings.verifiedDescription', 'Set whether this company is verified.')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
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
      </CardContent>
    </Card>
  );
}