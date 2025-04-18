'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Lock, Mail, Check, AlertCircle, Moon, Sun, LaptopIcon, User, UserPlus, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/ui/language-selector';
import api from '@/app/lib/axios';
import { useAuth } from '@/hooks/useAuth';
import { parseReferralFromUrl, getReferralCodeFromCookie } from '@/lib/referral-utils';
import { useTheme } from '@/components/providers/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (user) {
      router.push('/dashboard');
    }
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
  }, [searchParams, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Simple form validation
    if (password !== confirmPassword) {
      setError(t('register.error.passwordMismatch', 'Passwords do not match'));
      return;
    }
    
    if (password.length < 8) {
      setError(t('register.error.passwordLength', 'Password must be at least 8 characters long'));
      return;
    }

    setIsLoading(true);

    try {
      // Prepare request payload
      const payload: {
        name: string; 
        email: string; 
        password: string;
        isAffiliate: boolean;
        referralCode?: string;
      } = {
        name,
        email,
        password,
        isAffiliate
      };

      // Only include referral code if it's provided
      if (referralCode.trim()) {
        payload.referralCode = referralCode.trim();
      }
      
      // Send registration request to API
      await api.post('/auth/register', payload, { withCredentials: true });
      
      // After registration, log the user in
      // const res = await api.get('/auth/me', { withCredentials: true });
      // setUser(res.data);
      
      router.push('/auth/login');
      
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      if (typeof err === 'object' && err !== null && 'response' in err && 
          typeof err.response === 'object' && err.response !== null && 
          'data' in err.response && typeof err.response.data === 'object' && 
          err.response.data !== null && 'message' in err.response.data) {
        setError(err.response.data.message as string);
      } else {
        setError(t('register.error.general', 'Registration failed. Please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Left side - Registration form */}
      <div className={cn(
        "w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 md:px-12 relative",
        mounted && "animate-fade-in-left"
      )}>
        {/* Mobile logo (visible only on small screens) */}
        <div className="md:hidden flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Infinity</span> AI
          </h1>
        </div>
        
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {t('register.createAccount', 'Create an account')}
              </CardTitle>
              <CardDescription>
                {t('register.enterDetails', 'Enter your details to create your account')}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('register.name', 'Full Name')}</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('register.namePlaceholder', 'John Doe')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('register.email', 'Email')}</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('register.password', 'Password')}</Label>
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
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('register.confirmPassword', 'Confirm Password')}</Label>
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
                  <Label htmlFor="referralCode" className="flex items-center">
                    <span>{t('register.referralCode', 'Referral Code')}</span>
                    <span className="ml-1 text-xs text-muted-foreground">{t('register.optional', '(optional)')}</span>
                  </Label>
                  <Input
                    id="referralCode"
                    type="text"
                    placeholder={t('register.referralPlaceholder', 'Enter referral code')}
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                    autoComplete="off"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="affiliate" 
                    checked={isAffiliate}
                    onCheckedChange={(checked) => setIsAffiliate(checked as boolean)} 
                  />
                  <label
                    htmlFor="affiliate"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                  >
                    <span>{t('register.joinAffiliate', 'I want to join the Affiliate Program')}</span>
                    <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                  </label>
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
                        {t('register.registering', 'Registering...')}
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        {t('register.createAccount', 'Create account')}
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  {t('register.alreadyHaveAccount', 'Already have an account?')}{' '}
                  <Link href="/auth/login" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                    {t('register.login', 'Sign in')}
                  </Link>
                </p>
                
                <div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  <p>
                    {t('register.disclaimer', 'By creating an account, you agree to our Terms of Service and Privacy Policy.')}
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Infinity Marketing AI. {t('register.allRights', 'All rights reserved.')}
          </p>
        </div>
      </div>
      
      {/* Right side - Features */}
      <div className="relative hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-background overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-3xl -top-20 -right-20 animate-blob animation-delay-2000" />
          <div className="absolute h-[250px] w-[250px] rounded-full bg-primary/20 blur-3xl top-1/2 right-1/3 animate-blob animation-delay-4000" />
          <div className="absolute h-[350px] w-[350px] rounded-full bg-purple-500/20 blur-3xl -bottom-40 -left-10 animate-blob animation-delay-7000" />
        </div>
        
        <div className={cn(
          "relative z-10 max-w-md mx-auto text-center px-4",
          mounted && "animate-fade-in-right"
        )}>
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">Infinity</span> AI
            </h1>
            <p className="text-xl text-muted-foreground">{t('register.unlockPotential', 'Unlock the potential of AI marketing')}</p>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">{t('register.whyJoin', 'Why join Infinity AI?')}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-card/30 backdrop-blur-sm p-4 rounded-lg shadow-sm text-left">
              <div className="bg-primary/20 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{t('register.benefit1.title', 'AI-Powered Tools')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('register.benefit1.desc', 'Generate marketing content in seconds with advanced AI')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-card/30 backdrop-blur-sm p-4 rounded-lg shadow-sm text-left">
              <div className="bg-primary/20 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{t('register.benefit2.title', 'Multi-Channel Management')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('register.benefit2.desc', 'Manage all your social accounts from one dashboard')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-card/30 backdrop-blur-sm p-4 rounded-lg shadow-sm text-left">
              <div className="bg-primary/20 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{t('register.benefit3.title', 'Analytics & Insights')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('register.benefit3.desc', 'Detailed analytics to optimize your marketing strategy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-card/30 backdrop-blur-sm p-4 rounded-lg shadow-sm text-left">
              <div className="bg-primary/20 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{t('register.benefit4.title', 'Affiliate Program')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('register.benefit4.desc', 'Earn rewards by referring new users to our platform')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Theme toggle and language selector fixed to bottom right for better accessibility */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="bg-background/80 backdrop-blur-md p-2 rounded-full shadow-md hover:shadow-lg transition-all"
              aria-label="Theme options"
            >
              {theme === 'dark' && <Moon className="h-5 w-5 text-foreground" />}
              {theme === 'light' && <Sun className="h-5 w-5 text-foreground" />}
              {theme === 'system' && <LaptopIcon className="h-5 w-5 text-foreground" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4" />
              <span>{t('theme.light', 'Light')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
              <Moon className="mr-2 h-4 w-4" />
              <span>{t('theme.dark', 'Dark')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
              <LaptopIcon className="mr-2 h-4 w-4" />
              <span>{t('theme.system', 'System')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="bg-background/80 backdrop-blur-md rounded-md shadow-md p-1 hover:shadow-lg transition-all">
          <LanguageSelector variant="minimal" />
        </div>
      </div>
    </div>
  );
}
