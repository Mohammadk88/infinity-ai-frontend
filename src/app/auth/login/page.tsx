'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Zap, LogIn, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
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
  
  // Animation background circles
  const circles = Array.from({ length: 10 }).map((_, i) => ({
    size: Math.floor(Math.random() * 120) + 40,
    left: Math.floor(Math.random() * 100),
    top: Math.floor(Math.random() * 100),
    animationDuration: Math.floor(Math.random() * 20) + 15,
    animationDelay: Math.floor(Math.random() * 5),
  }));

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
      
      // Show success state
      // Redirect to dashboard
    } catch (err) {
      console.error('Login failed:', err);
      setError(t('login.error.invalidCredentials', 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-background to-background/95 p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {circles.map((circle, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-primary/5 dark:bg-primary/10"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              animationDuration: `${circle.animationDuration}s`,
              animationDelay: `${circle.animationDelay}s`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      
      {/* Logo */}
      <div className="absolute left-8 top-8 flex items-center gap-2 animate__animated animate__fadeIn">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-primary/70 opacity-75 blur-sm" />
          <span className="relative z-10 text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold leading-none tracking-tight">
            Infinity<span className="text-primary">AI</span>
          </span>
          <span className="text-[10px] text-muted-foreground">
            {t('login.marketing', 'Marketing Platform')}
          </span>
        </div>
      </div>
      
      {/* Login card */}
      <div className="w-full max-w-md animate__animated animate__fadeInUp">
        <Card className="border-border/40 bg-card/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl animate__animated animate__fadeIn">
              {t('login.title', 'Welcome back')}
            </CardTitle>
            <CardDescription className="animate__animated animate__fadeIn animate__delay-1s">
              {t('login.description', 'Sign in to access your account')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t('login.email', 'Email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
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
                    className="text-xs text-primary hover:underline"
                  >
                    {t('login.forgotPassword', 'Forgot password?')}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
              
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive animate__animated animate__fadeIn">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button 
                type="submit" 
                className="w-full group" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('login.signingIn', 'Signing in...')}
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    {t('login.signIn', 'Sign in')}
                  </>
                )}
              </Button>
              
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <span className="relative bg-card px-4 text-xs text-muted-foreground">
                  {t('login.or', 'OR')}
                </span>
              </div>
              
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
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
                <Link href="/auth/register" className="text-primary hover:underline">
                  {t('login.register', 'Create account')}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Infinity Marketing AI. {t('login.allRights', 'All rights reserved.')}
          </p>
        </div>
      </div>
      
      {/* Language selector (bottom right) */}
      <div className="absolute bottom-6 right-6 animate__animated animate__fadeIn animate__delay-2s">
        <LanguageSelector />
      </div>
    </div>
  );
}
