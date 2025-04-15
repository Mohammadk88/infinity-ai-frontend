'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Zap, LogIn, Lock, Mail, AlertCircle, Loader2, Sparkles, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useUserStore } from '@/store/useUserStore';
import api from '@/app/lib/axios';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setUser } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    setMounted(true);
    
    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

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
    setIsLoading(true);

    try {
      // Fake login for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation you would call your auth API here
      const response = await api.post('/auth/login', { email, password });
      // بعد تسجيل الدخول:
      const res = await api.get('/auth/me', { withCredentials: true });
      setUser(res.data);
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
            {t('login.tagline', 'AI-powered marketing automation to scale your business')}
          </p>
          <div className="space-y-4 w-full max-w-xs">
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <div className="bg-primary/20 p-2 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium">
                {t('login.feature1', 'Smart AI content generation')}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <div className="bg-primary/20 p-2 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
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
              {t('login.marketing', 'Marketing Platform')}
            </span>
          </div>
        </div>
        
        {/* Login card */}
        <div className="w-full max-w-md">
          <Card className={cn(
            "border-border/40 bg-card/70 backdrop-blur-md shadow-xl",
            mounted && "animate-fade-in-up"
          )}>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {t('login.title', 'Welcome back')}
              </CardTitle>
              <CardDescription>
                {t('login.description', 'Sign in to access your account')}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('login.email', 'Email')}
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
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      required
                      autoComplete="current-password"
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
                  className="w-full h-11 border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  {t('login.continueWithGoogle', 'Continue with Google')}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  {t('login.noAccount', 'Don\'t have an account?')}{' '}
                  <Link href="/auth/register" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                    {t('login.register', 'Create account')}
                  </Link>
                </p>
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
