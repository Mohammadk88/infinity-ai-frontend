'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Zap, LogIn, Lock, Mail, AlertCircle, Loader2, Sparkles, Moon, Sun, LaptopIcon, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useUserStore } from '@/store/useUserStore';
import api from '@/app/lib/axios';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/providers/theme-provider';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LoginPage() {
  const { t } = useTranslation();
  const { user } = useAuth(false);
  const router = useRouter();
  const { setUser } = useUserStore();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    api.get(`/auth/csrf-token`, { withCredentials: true })
      .then(res => setCsrfToken(res.data.csrfToken));
  }, []);
  
  useEffect(() => {
    setMounted(true);
    if (user) {
      router.push('/dashboard');
    }
    
    // Check if user is arriving from an invitation acceptance
    const justRegistered = searchParams.get('justRegistered') === 'true';
    if (justRegistered) {
      toast({
        title: t('login.welcomeToast.title', 'Welcome to Infinity AI!'),
        description: t('login.welcomeToast.description', 'Your account has been created successfully. Please log in to continue.'),
        variant: 'default',
        className: 'bg-green-50 border-green-200 text-green-800',
      });
    }
  }, [user, router, searchParams, toast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // In a real implementation you would call your auth API here
      await api.post('/auth/login', { email, password, _csrf: csrfToken }, { withCredentials: true });
      // After login:
      const res = await api.get('/auth/me', { withCredentials: true });
      setUser(res.data);
      console.log('User data:', res.data);
      router.push('/dashboard');

    } catch (err) {
      console.error('Login failed:', err);
      setError(t('login.error.invalidCredentials', 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Left side - Branding */}
      <div className="relative hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-background overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute h-[300px] w-[300px] rounded-full bg-primary/20 blur-3xl -top-20 -left-20 animate-blob animation-delay-2000" />
          <div className="absolute h-[250px] w-[250px] rounded-full bg-indigo-500/20 blur-3xl top-1/2 left-1/3 animate-blob animation-delay-4000" />
          <div className="absolute h-[350px] w-[350px] rounded-full bg-purple-500/20 blur-3xl -bottom-40 -right-10 animate-blob animation-delay-7000" />
        </div>

        <div className={cn(
          "relative z-10 max-w-md mx-auto text-center px-4",
          mounted && "animate-fade-in-left"
        )}>
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">Infinity</span> AI
            </h1>
            <p className="text-xl text-muted-foreground">{t('login.marketingPlatform', 'Marketing Platform')}</p>
          </div>

          <h2 className="text-2xl font-bold mb-6">{t('login.tagline', 'Revolutionize your marketing with AI')}</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <div className="bg-primary/20 p-2 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">
                {t('login.feature1', 'AI-powered content generation')}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <div className="bg-primary/20 p-2 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">
                {t('login.feature2', 'Automated social scheduling')}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <div className="bg-primary/20 p-2 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">
                {t('login.feature3', 'Lead capture & conversion')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className={cn(
        "w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 md:px-12 relative",
        mounted && "animate-fade-in-right"
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
              <CardTitle className="text-2xl font-bold tracking-tight">{t('login.welcomeBack', 'Welcome back')}</CardTitle>
              <CardDescription>
                {t('login.continueWithEmail', 'Continue with your email and password')}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('login.email', 'Email')}</Label>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t('login.password', 'Password')}
                    </Label>
                    <Link
                      href="#"
                      className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      {t('login.forgotPassword', 'Forgot password?')}
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      required
                      autoComplete="current-password"
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
                        {t('login.signingIn', 'Signing in...')}
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        {t('login.signIn', 'Sign in')}
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <span className="relative bg-card/70 backdrop-blur-md px-4 text-xs text-muted-foreground">
                    {t('login.or', 'OR')}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 relative"
                >
                  <div className="absolute left-3 flex items-center justify-center rtl:left-auto rtl:right-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 24C15.24 24 17.95 22.92 19.945 21.1L16.08 18.1C15 18.85 13.62 19.28 12 19.28C8.875 19.28 6.255 17.16 5.285 14.28L1.27 17.34C3.25 21.33 7.31 24 12 24Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 4.71997C13.77 4.71997 15.35 5.35997 16.59 6.54997L20.04 3.11997C17.9512 1.18833 15.0188 0.0606504 12 0.129971C7.31 0.129971 3.25 2.79997 1.27 6.78997L5.265 9.89497C6.255 7.01497 8.875 4.71997 12 4.71997Z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>

                  <span>{t('login.continueWithGoogle', 'Continue with Google')}</span>
                </Button>

                <div className="space-y-2">
                  <p className="text-center text-sm text-muted-foreground">
                    {t('login.dontHaveAccount', "Don't have an account?")}{' '}
                    <Link href="/auth/register" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                      {t('login.register', 'Create account')}
                    </Link>
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    {t('login.haveInvitation', "Have an invitation?")}{' '}
                    <Link href="/auth/register/register-from-invitation" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                      {t('login.registerFromInvitation', 'Register with invitation')}
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Infinity Marketing AI. {t('login.allRights', 'All rights reserved.')}
          </p>
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
