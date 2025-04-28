import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/app/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Company } from '../../types/Company';

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, { message: 'Company name is required' }),
  type: z.enum(['COMPANY', 'AGENCY'], {
    required_error: 'Company type is required',
  }),
  isActive: z.boolean(),
  verified: z.boolean(),
});

// Define the typed interface for our form values
type FormValues = z.infer<typeof formSchema>;

// Define the company data interface
interface CompanyData {
  id: string;
  name: string;
  type: 'COMPANY' | 'AGENCY';
  isActive: boolean;
  verified: boolean;
}

interface EditCompanyBasicInfoFormProps {
  companyId: string;
  initialData: CompanyData | null;
  isLoading: boolean;
  onUpdateSuccess?: (updatedData: CompanyData) => void;
}

export const EditCompanyBasicInfoForm = ({ 
  companyId, 
  initialData, 
  isLoading,
  onUpdateSuccess 
}: EditCompanyBasicInfoFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [optimisticData, setOptimisticData] = useState<FormValues | null>(null);

  // Initialize the form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'COMPANY',
      isActive: true,
      verified: false,
    },
    mode: 'onChange', // Validate on change for better UX
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        type: initialData.type,
        isActive: initialData.isActive,
        verified: initialData.verified,
      });
    }
  }, [initialData, form]);

  // Handle form submission with optimistic updates
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true);
      
      // Set optimistic data for immediate UI feedback
      setOptimisticData(data);
      
      // Make the API call to update the company
      const response = await api.put(`/companies/${companyId}`, data);
      
      // Show success animation
      setShowSuccessAnimation(true);
      
      // Notify parent component of successful update if callback provided
      if (onUpdateSuccess && response.data) {
        onUpdateSuccess(response.data);
      }
      
      // Show success toast
      toast({
        title: 'Success',
        description: 'Company information updated successfully',
        variant: 'default',
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
      
      // Reset optimistic data after successful update
      setTimeout(() => {
        setOptimisticData(null);
      }, 1000);
      
      // Reset animation after delay
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 1500);
      
    } catch (error: any) {
      // Reset optimistic data on error
      setOptimisticData(null);
      
      // Show error toast with more details
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update company information. Please try again.',
        variant: 'destructive',
        action: (
          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        ),
      });
      console.error('Error updating company:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle going back to company dashboard
  const handleGoBack = () => {
    router.push('/dashboard/company');
  };

  // Show loading skeleton when data is being fetched
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  // Display current values or optimistic updates
  const displayData = optimisticData || form.getValues();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Company Information</CardTitle>
        <CardDescription>
          Update your company's basic details and status
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit(data as FormValues))}>
          <CardContent className="space-y-6">
            {/* Company Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Type Field */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="COMPANY">Company</SelectItem>
                      <SelectItem value="AGENCY">Agency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Active Switch */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Determine if this company is active in the system
                    </div>
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

            {/* Verified Switch */}
            <FormField
              control={form.control}
              name="verified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Verification Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Mark this company as verified
                    </div>
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
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGoBack}
            >
              Go Back
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || !form.formState.isValid}
              className="relative min-w-[120px]"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
              <AnimatePresence>
                {showSuccessAnimation && (
                  <motion.div
                    className="absolute inset-0 bg-green-500 rounded-md flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg 
                      className="h-6 w-6 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default EditCompanyBasicInfoForm;