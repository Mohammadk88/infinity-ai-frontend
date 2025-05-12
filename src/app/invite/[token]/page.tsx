'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Building2, UserCheck, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

import api from '@/app/lib/axios';

// Form validation schema
const invitationAcceptSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type InvitationAcceptFormValues = z.infer<typeof invitationAcceptSchema>;

interface InvitationData {
  email: string;
  companyName: string;
  role: string;
  expiresAt: string;
  valid: boolean;
}

export default function InvitationPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get token from URL
  const token = params?.token as string;

  const form = useForm<InvitationAcceptFormValues>({
    resolver: zodResolver(invitationAcceptSchema),
    defaultValues: {
      name: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Fetch invitation data and redirect to register page
  useEffect(() => {
    const fetchInvitationData = async () => {
      try {
        const response = await api.get(`/invitations/${token}`);
        setInvitationData(response.data);
        
        // Redirect to the register from invitation page with the token
        router.push(`/auth/register/register-from-invitation?token=${token}` as string);
      } catch (error: unknown) {
        console.error('Error fetching invitation:', error);
        if (error && typeof error === 'object' && 'response' in error) {
          const errResp = error as {response?: {data?: {message?: string}}};
          setError(errResp.response?.data?.message || 'This invitation is invalid or has expired.');
        } else {
          setError('This invitation is invalid or has expired.');
        }
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInvitationData();
    } else {
      setError('Invalid invitation link');
      setIsLoading(false);
    }
  }, [token, router]);

  const onSubmit = async (data: InvitationAcceptFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/auth/accept-invitation', {
        name: data.name,
        password: data.password,
        token: token
      } as { name: string; password: string; token: string });

      toast({
        title: t('invitation.success.title', 'Invitation Accepted'),
        description: t('invitation.success.description', 'Your account has been created successfully.'),
        variant: 'default',
        className: 'bg-green-50 border-green-200 text-green-800',
      });

      // Redirect to login page
      router.push('/auth/login');      } catch (error: unknown) {
      console.error('Error accepting invitation:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? ((error as {response: {data?: {message?: string}}}).response?.data?.message || 'Failed to accept invitation.') 
        : 'Failed to accept invitation. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show skeleton loader while fetching invitation data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
        <Card className="w-full max-w-md border-border/40 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show error if invitation is invalid or expired
  if (error || !invitationData?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
        <Card className="w-full max-w-md border-border/40 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              {t('invitation.invalid.title', 'Invalid Invitation')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('invitation.invalid.description', 'This invitation is invalid or has expired.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-destructive/10 p-4 text-destructive flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>{error || t('invitation.invalid.message', 'The invitation link you followed is no longer valid. Please contact your administrator for a new invitation.')}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/auth/login">
                {t('invitation.invalid.goToLogin', 'Go to Login')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render the accept invitation form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              {t('invitation.title', 'Accept Your Invitation')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('invitation.description', 'Complete your account setup to join {{companyName}}', { companyName: invitationData?.companyName })}
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {/* Company Information - Read Only */}
                <div className="bg-muted/50 p-4 rounded-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('invitation.company', 'Company')}</p>
                      <p className="font-medium">{invitationData?.companyName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('invitation.role', 'Role')}</p>
                      <p className="font-medium">{invitationData?.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('invitation.email', 'Email')}</p>
                      <p className="font-medium">{invitationData?.email}</p>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('invitation.form.fullName', 'Full Name')}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('invitation.form.fullNamePlaceholder', 'Enter your full name')}
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('invitation.form.password', 'Password')}
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t('invitation.form.passwordPlaceholder', 'Create a secure password')}
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-9 w-9 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormDescription>
                        {t('invitation.form.passwordDescription', 'Password must be at least 8 characters')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('invitation.form.confirmPassword', 'Confirm Password')}
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t('invitation.form.confirmPasswordPlaceholder', 'Confirm your password')}
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-9 w-9 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 group relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('invitation.form.accepting', 'Creating account...')}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        {t('invitation.form.accept', 'Accept Invitation')}
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('invitation.alreadyHaveAccount', "Already have an account?")}{' '}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:text-primary/90 font-medium hover:underline transition-colors"
                  >
                    {t('invitation.signIn', 'Sign in')}
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}