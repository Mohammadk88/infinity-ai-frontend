'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Zap, UserPlus, Lock, Mail, User, AlertCircle, Loader2, Check, Sparkles, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/ui/language-selector';
import api from '@/app/lib/axios';
import { parseReferralFromUrl, getReferralCodeFromCookie, clearReferralCode } from '@/lib/referral-utils';
import { Badge } from '@/components/ui/badge';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Process referral code from URL and detect theme
  useEffect(() => {
    setMounted(true);
    // Check URL for referral code param
    if (searchParams?.has('ref')) {
      const refCode = searchParams.get('ref')!;
      parseReferralFromUrl(window.location.href);
      setReferralCode(refCode);
    } else {
      // Check if referral code is in cookie from previous visit
      const storedRefCode = getReferralCodeFromCookie();
      if (storedRefCode) {
        setReferralCode(storedRefCode);
      }
    }

    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    }
  }, [searchParams]);

  // Toggle theme function
  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Simple validation
    if (password !== confirmPassword) {
      setError(t('register.error.passwordMatch', 'Passwords do not match'));
      return;
    }
    
    setIsLoading(true);

    try {
      // Fake registration for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the referral code if it exists
      const referrer = getReferralCodeFromCookie();
      
      // In a real implementation you would call your auth API here with the referral code
      await api.post('/auth/register', { 
        name, 
        email, 
        password,
        referralCode // Send the referralCode directly from state
      });
      
      // Clear the referral code after successful registration
      if (referrer) {
        clearReferralCode();
      }
      
      // Show success state
      setSuccess(true);
      
      // Redirect after success message display
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      console.log('Registration failed:', err);
      setError(t('register.error.' + err.response?.data?.message || 'register.error.general'));
      // setError(t('register.error.general', 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Left side - Branding (same as login for consistency) */}
      <div className="relative hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-background overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute h-[300px] w-[300px] rounded-full bg-primary/20 blur-3xl -top-20 -left-20 animate-blob animation-delay-2000" />
          <div className="absolute h-[250px] w-[250px] rounded-full bg-indigo-500/20 blur-3xl top-1/2 left-1/3 animate-blob animation-delay-4000" />
          <div className="absolute h-[350px] w-[350px] rounded-full bg-purple-500/20 blur-3xl bottom-0 right-0 animate-blob animation-delay-3000" />
        </div>
        
        {/* Main logo and branding */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 animate-float">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-6 shadow-lg">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-primary/70 opacity-75 blur-lg" />
            <span className="relative z-10 text-primary-foreground">
              <Sparkles className="h-12 w-12" />
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Infinity<span className="text-primary">AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-md">
            {t('register.tagline', 'Join the AI revolution in marketing automation')}
          </p>
          <div className="space-y-4 w-full max-w-xs">
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <div className="bg-primary/20 p-2 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">
                {t('register.feature1', 'AI-powered content creation')}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <div className="bg-primary/20 p-2 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">
                {t('register.feature2', 'Multi-channel campaign management')}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <div className="bg-primary/20 p-2 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">
                {t('register.feature3', 'Advanced analytics & reporting')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form (same layout as login) */}
      <div className={cn(
        "w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 md:px-12 relative",
        mounted && "animate-fade-in-right"
      )}>
        {/* Mobile logo (visible only on small screens) */}
        <div className="md:hidden flex items-center gap-3 mb-8">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-primary/70 opacity-75 blur-sm" />
            <span className="relative z-10 text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold tracking-tight">
              Infinity<span className="text-primary">AI</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {t('register.marketing', 'Marketing Platform')}
            </span>
          </div>
        </div>
        
        {/* Register card */}
        <div className="w-full max-w-md">
          {success ? (
            <Card className={cn(
              "border-border/40 bg-card/70 backdrop-blur-md shadow-xl",
              mounted && "animate-fade-in-up"
            )}>
              <CardHeader className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="mt-4 text-2xl">
                  {t('register.success.title', 'Registration Successful!')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('register.success.description', 'Your account has been created. You will be redirected to login shortly.')}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full h-11 group relative overflow-hidden transition-all hover:shadow-md hover:shadow-primary/20" 
                  onClick={() => router.push('/auth/login')}
                >
                  <span className="relative z-10">
                    {t('register.success.login', 'Log in now')}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className={cn(
              "border-border/40 bg-card/70 backdrop-blur-md shadow-xl",
              mounted && "animate-fade-in-up"
            )}>
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">
                  {t('register.title', 'Create an account')}
                </CardTitle>
                <CardDescription>
                  {t('register.description', 'Enter your information to get started')}
                </CardDescription>
                {referralCode && (
                  <div className="mt-2 flex justify-center">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs py-1.5 px-2.5">
                      {t('register.referredBy', 'Referred by')}: {referralCode}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {t('register.name', 'Full Name')}
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t('register.email', 'Email')}
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t('register.password', 'Password')}
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        required
                        minLength={8}
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('register.passwordHint', 'Must be at least 8 characters')}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      {t('register.confirmPassword', 'Confirm Password')}
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referralCode" className="text-sm font-medium">
                      {t('register.referralCode', 'Referral Code (optional)')}
                    </Label>
                    <div className="relative group">
                      <Zap className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="referralCode"
                        type="text"
                        placeholder="ABC123"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="pl-10 h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-fade-in">
                      <div className="flex gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-5 pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-11 group relative overflow-hidden transition-all hover:shadow-md hover:shadow-primary/20" 
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('register.registering', 'Creating account...')}
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                          {t('register.register', 'Create account')}
                        </>
                      )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    {t('register.haveAccount', 'Already have an account?')}{' '}
                    <Link href="/auth/login" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                      {t('register.login', 'Log in')}
                    </Link>
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    {t('register.termsText', 'By creating an account, you agree to our')}{' '}
                    <Link href="/terms" className="text-primary hover:text-primary/80 hover:underline transition-colors">
                      {t('register.terms', 'Terms of Service')}
                    </Link>{' '}
                    {t('register.and', 'and')}{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary/80 hover:underline transition-colors">
                      {t('register.privacy', 'Privacy Policy')}
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
        
        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Infinity Marketing AI. {t('register.allRights', 'All rights reserved.')}
          </p>
        </div>
      </div>
      
      {/* Theme toggle and language selector fixed to bottom right for better accessibility */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3 z-50">
        <button 
          onClick={toggleTheme}
          className="bg-background/80 backdrop-blur-md p-2 rounded-full shadow-md hover:shadow-lg transition-all"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-foreground" />
          )}
        </button>
        <div className="bg-background/80 backdrop-blur-md rounded-md shadow-md p-1 hover:shadow-lg transition-all">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}
