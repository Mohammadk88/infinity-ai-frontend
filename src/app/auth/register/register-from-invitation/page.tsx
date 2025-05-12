'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ArrowLeft, Building2, UserCheck, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AuthBackground } from '@/components/ui/auth-background';

import api from '@/app/lib/axios';
import { useUserStore } from '@/store/useUserStore';

// Animation variants
const container = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// Form validation schema
const invitationRegisterSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type InvitationRegisterFormValues = z.infer<typeof invitationRegisterSchema>;

interface InvitationData {
  email: string;
  companyName: string;
  roleName: string;
  expiresAt: string;
  valid: boolean;
}

export default function RegisterFromInvitationPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useUserStore();
  
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get token from URL query parameter
  const token = searchParams?.get('token') as string;
  const form = useForm<InvitationRegisterFormValues>({
    resolver: zodResolver(invitationRegisterSchema),
    defaultValues: {
      name: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Fetch invitation data on page load
  useEffect(() => {
    const fetchInvitationData = async () => {
      try {
        const response = await api.get(`/invitations/${token}`);
        setInvitationData(response.data);
      } catch (error: any) {
        console.error('Error fetching invitation:', error);
        setError(error.response?.data?.message || 'This invitation is invalid or has expired.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInvitationData();
    } else {
      setError('Invalid invitation link');
      setIsLoading(false);
    }
  }, [token]);

  const onSubmit = async (data: InvitationRegisterFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/auth/register-from-invitation', {
        name: data.name,
        password: data.password,
        token: token
      });

      setUser(response.data.user);
      
      toast({
        title: t('invitation.success.title', 'Registration Successful'),
        description: t('invitation.success.description', 'Your account has been created successfully.'),
        variant: 'default',
        className: 'bg-green-50 border-green-200 text-green-800',
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Error registering from invitation:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error.response as any)?.data?.message 
        : 'Failed to complete registration. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show skeleton loader while fetching invitation data
  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
        <AuthBackground variant="personal" />
        <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card className="border-border/40 shadow-lg bg-background/80 backdrop-blur-md">
              <CardHeader className="space-y-1 pb-4">
                <Skeleton className="h-8 w-3/4 mx-auto" />
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
        </div>
      </div>
    );
  }

  // Show error if invitation is invalid or expired
  if (error || !invitationData?.valid) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
        <AuthBackground variant="personal" />
        <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card className="border-border/40 shadow-lg bg-background/80 backdrop-blur-md">
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
        </div>
      </div>
    );
  }

  // Render the registration from invitation form
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      <AuthBackground variant="company" />

      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
        <Button
          variant="ghost"
          className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground group"
          onClick={() => router.push('/auth/login')}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {t('common.back', 'Back')}
        </Button>

        <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('register.invitation.title', 'Join Your Team')}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('register.invitation.headline', 'Complete your account setup to get started')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
          >
            <Card className="border-border/40 shadow-lg bg-background/80 backdrop-blur-md">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                      {t('register.invitation.createAccount', 'Complete Registration')}
                    </CardTitle>
                    <CardDescription>
                      {t('register.invitation.subtitle', 'You\'ve been invited to join {{companyName}}', { companyName: invitationData?.companyName })}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    {t('register.invitation.badge', 'Invitation')}
                  </Badge>
                </div>
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
                          <p className="font-medium">{invitationData?.roleName}</p>
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
                            {t('register.name', 'Full Name')} *
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder={t('register.namePlaceholder', 'Enter your full name')}
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                          </div>
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
                            {t('register.password', 'Password')} *
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={t('register.passwordPlaceholder', 'Create a secure password')}
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
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('register.passwordRequirements', 'Password must be at least 8 characters')}
                          </p>
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
                            {t('register.confirmPassword', 'Confirm Password')} *
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t('register.confirmPasswordPlaceholder', 'Confirm your password')}
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
                      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2 animate-fadeIn">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
                    <Button 
                      type="submit" 
                      className="w-full h-11 group relative overflow-hidden"
                      disabled={isSubmitting}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('register.registering', 'Creating account...')}
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            {t('register.invitation.complete', 'Complete Registration')}
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>

                    <div className="relative flex items-center justify-center py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <span className="relative bg-background px-4 text-xs text-muted-foreground">
                        {t('register.or', 'OR')}
                      </span>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                      {t('register.haveAccount', 'Already have an account?')}{' '}
                      <Link
                        href="/auth/login"
                        className="text-primary hover:text-primary/90 font-medium hover:underline transition-colors"
                      >
                        {t('register.signIn', 'Sign in')}
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
