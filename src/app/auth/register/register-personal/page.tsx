'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, User, Mail, Lock, AlertCircle, Eye, EyeOff, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthBackground } from '@/components/ui/auth-background';
import api from '@/app/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import { Badge } from '@/components/ui/badge';

const container = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function PersonalRegistrationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setUser } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.error.passwordMismatch', 'Passwords do not match'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        ...formData,
        type: 'personal'
      });
      
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || t('register.error.general', 'Registration failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] -top-64 -left-32 animate-blob animation-delay-2000 mix-blend-multiply" />
        <div className="absolute h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[80px] top-1/2 right-0 animate-blob animation-delay-4000 mix-blend-multiply" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
        <Button
          variant="ghost"
          className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground group"
          onClick={() => router.back()}
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
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('register.personal.title', 'Personal Account')}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('register.personal.headline', 'Start your journey with Infinity AI')}
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
                      {t('register.personal.createAccount', 'Create Personal Account')}
                    </CardTitle>
                    <CardDescription>
                      {t('register.personal.subtitle', 'Enter your information to get started')}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {t('register.personal.badge', 'Personal')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('register.name', 'Full Name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-11 pl-10"
                        placeholder={t('register.namePlaceholder', 'Enter your full name')}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('register.email', 'Email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-11 pl-10"
                        placeholder={t('register.emailPlaceholder', 'you@example.com')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('register.password', 'Password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="h-11 pl-10"
                        placeholder={t('register.passwordPlaceholder', 'Create a secure password')}
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
                    <p className="text-xs text-muted-foreground">
                      {t('register.passwordRequirements', 'Password must be at least 8 characters')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {t('register.confirmPassword', 'Confirm Password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        className="h-11 pl-10"
                        placeholder={t('register.confirmPasswordPlaceholder', 'Confirm your password')}
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
                  </div>

                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2 animate-fadeIn">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  onClick={handleSubmit}
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
                        {t('register.createAccount', 'Create Account')}
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('register.termsNotice', 'By creating an account, you agree to our')} {' '}
                  <Link href="#" className="text-primary hover:text-primary/90 hover:underline">
                    {t('register.terms', 'Terms of Service')}
                  </Link> {' '}
                  {t('register.and', 'and')} {' '}
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
            </Card>
          </motion.div>
        </div>
      </div>

      <AuthBackground variant="personal" />
    </div>
  );
}