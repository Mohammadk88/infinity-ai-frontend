'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Mail, Info, User, Lock, Check, AlertCircle, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/useUserStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { AuthBackground } from '@/components/ui/auth-background';
import api from '@/app/lib/axios';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CountrySelector } from '@/components/ui/country-select';

// Form validation schema
const companySchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(2, 'Country is required'),
  companyType: z.enum(['COMPANY', 'AGENCY']),
  ownerName: z.string().min(2, 'Owner name is required'),
  ownerEmail: z.string().email('Invalid owner email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CompanyFormData = z.infer<typeof companySchema>;

const container = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function RegisterCompanyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useUserStore();
  const { setCurrentCompany } = useCompanyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyType: 'COMPANY',
      country: ''
    }
  });

  const companyType = watch('companyType');

  const onSubmit = async (data: CompanyFormData) => {
    console.log("Form data being submitted:", data);
    console.log("Selected country:", selectedCountry);
    
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register-company', data);
      
      setUser(response.data.user);
      setCurrentCompany(response.data.company);
      
      toast({
        title: t('register.success.title', 'Success!'),
        description: t('register.success.company', 'Your company account has been created successfully.'),
      });

      router.push('/dashboard');
    } catch (error: unknown) {
      console.error("Registration error:", error);
      interface ErrorResponse {
        data?: {
          message?: string;
        };
      }
      
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? ((error.response as ErrorResponse)?.data?.message || t('register.error.general', 'Something went wrong. Please try again.'))
        : t('register.error.general', 'Something went wrong. Please try again.');
      
      toast({
        variant: "destructive",
        title: t('register.error.title', 'Registration failed'),
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For manual form submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  const getCompanyTypeDescription = (type: 'COMPANY' | 'AGENCY') => {
    return type === 'COMPANY'
      ? t('register.company.typeCompany', "A standalone business with internal teams and client management.")
      : t('register.company.typeAgency', "A marketing or service agency that manages external clients and their accounts.");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px] -top-64 -right-32 animate-blob animation-delay-2000 mix-blend-multiply" />
        <div className="absolute h-[500px] w-[500px] rounded-full bg-fuchsia-500/5 blur-[100px] top-1/2 -left-32 animate-blob animation-delay-4000 mix-blend-multiply" />
      </div>

      <AuthBackground variant="company" />

      <div className="flex flex-col items-center justify-center p-4 relative w-full">
        <Button
          variant="ghost"
          className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground group"
          onClick={() => router.push('/auth/register')}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {t('register.back', 'Back')}
        </Button>

        <motion.div 
          className="text-center mb-8 mt-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('register.company.title', 'Business Account')}
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('register.company.headline', 'Empower your business with Infinity AI')}
          </p>
        </motion.div>

        <motion.div 
          className="w-full max-w-3xl"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <Card className="border-border/40 shadow-lg bg-background/80 backdrop-blur-md mb-8">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    {t('register.company.createAccount', 'Create Business Account')}
                  </CardTitle>
                  <CardDescription>
                    {t('register.company.subtitle', 'Set up your company profile and get started')}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  {companyType === 'AGENCY' 
                    ? t('register.company.agencyBadge', 'Agency') 
                    : t('register.company.companyBadge', 'Business')}
                </Badge>
              </div>
            </CardHeader>

            <form onSubmit={handleManualSubmit}>
              <CardContent className="space-y-6">
                {/* Company Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    {t('register.company.companyInfoSection', 'Company Information')}
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{t('register.company.companyName', 'Company Name')} *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...register('companyName')}
                          id="companyName"
                          placeholder={t('register.company.companyNamePlaceholder', 'Enter company name')}
                          className="pl-9 h-11"
                        />
                      </div>
                      {errors.companyName && (
                        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('register.company.email', 'Company Email')} *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...register('email')}
                          id="email"
                          type="email"
                          placeholder={t('register.company.emailPlaceholder', 'company@example.com')}
                          className="pl-9 h-11"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">{t('register.company.country', 'Country')} *</Label>
                      <CountrySelector
                        placeholder={t('register.company.countryPlaceholder', 'Select your country')}
                        onSelect={(country) => {
                          if (country) {
                            setValue('country', country.id);
                            setSelectedCountry(country.name);
                          }
                        }}
                        error={errors.country?.message}
                      />
                      {errors.country && (
                        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyType">{t('register.company.companyType', 'Company Type')} *</Label>
                      <Select
                        onValueChange={(value) => {
                          setValue('companyType', value as 'COMPANY' | 'AGENCY');
                        }}
                        defaultValue="COMPANY"
                      >
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder={t('register.company.selectType', 'Select company type')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COMPANY">{t('register.company.typeCompanyOption', 'Business')}</SelectItem>
                          <SelectItem value="AGENCY">{t('register.company.typeAgencyOption', 'Agency')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="mt-2 text-sm text-muted-foreground flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{getCompanyTypeDescription(companyType as 'COMPANY' | 'AGENCY')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Owner Information Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    {t('register.company.ownerInfoSection', 'Owner Information')}
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">{t('register.company.ownerName', 'Full Name')} *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...register('ownerName')}
                          id="ownerName"
                          placeholder={t('register.company.ownerNamePlaceholder', 'Enter your full name')}
                          className="pl-9 h-11"
                        />
                      </div>
                      {errors.ownerName && (
                        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.ownerName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerEmail">{t('register.company.ownerEmail', 'Owner Email')} *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...register('ownerEmail')}
                          id="ownerEmail"
                          type="email"
                          placeholder={t('register.company.ownerEmailPlaceholder', 'you@example.com')}
                          className="pl-9 h-11"
                        />
                      </div>
                      {errors.ownerEmail && (
                        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.ownerEmail.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t('register.password', 'Password')} *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...register('password')}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('register.passwordPlaceholder', 'Create a secure password')}
                          className="pl-9 h-11"
                        />
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
                      {errors.password && (
                        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.password.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {t('register.passwordRequirements', 'Password must be at least 8 characters')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('register.confirmPassword', 'Confirm Password')} *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...register('confirmPassword')}
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t('register.confirmPasswordPlaceholder', 'Confirm your password')}
                          className="pl-9 h-11"
                        />
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
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
                <Button 
                  type="submit" 
                  className="w-full h-11 group relative overflow-hidden"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('register.registering', 'Creating account...')}
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        {t('register.createCompanyAccount', 'Create Company Account')}
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('register.termsNotice', 'By creating an account, you agree to our')}{' '}
                  <Link href="#" className="text-primary hover:text-primary/90 hover:underline">
                    {t('register.terms', 'Terms of Service')}
                  </Link>{' '}
                  {t('register.and', 'and')}{' '}
                  <Link href="#" className="text-primary hover:text-primary/90 hover:underline">
                    {t('register.privacy', 'Privacy Policy')}
                  </Link>.
                </p>

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
          </Card>
        </motion.div>
      </div>
    </div>
  );
}