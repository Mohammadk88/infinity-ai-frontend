'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Zap, UserPlus, Lock, Mail, User, AlertCircle, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/ui/language-selector';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    
    // Simple validation
    if (password !== confirmPassword) {
      setError(t('register.error.passwordMatch', 'Passwords do not match'));
      return;
    }
    
    setIsLoading(true);

    try {
      // Fake registration for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation you would call your auth API here
      // const response = await api.post('/auth/register', { name, email, password });
      
      // Show success state
      setSuccess(true);
      
      // Redirect after success message display
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(t('register.error.general', 'Registration failed. Please try again.'));
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
            {t('register.marketing', 'Marketing Platform')}
          </span>
        </div>
      </div>
      
      {/* Register card */}
      <div className="w-full max-w-md animate__animated animate__fadeInUp">
        {success ? (
          <Card className="border-border/40 bg-card/90 backdrop-blur-sm animate__animated animate__fadeIn">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="mt-4 text-2xl">
                {t('register.success.title', 'Registration Successful!')}
              </CardTitle>
              <CardDescription>
                {t('register.success.description', 'Your account has been created. You will be redirected to login shortly.')}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => router.push('/auth/login')}
              >
                {t('register.success.login', 'Log in now')}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-border/40 bg-card/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl animate__animated animate__fadeIn">
                {t('register.title', 'Create an account')}
              </CardTitle>
              <CardDescription className="animate__animated animate__fadeIn animate__delay-1s">
                {t('register.description', 'Enter your information to get started')}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t('register.name', 'Full Name')}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('register.email', 'Email')}
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
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t('register.password', 'Password')}
                  </Label>
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
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      autoComplete="new-password"
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
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full group" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('register.registering', 'Creating account...')}
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                      {t('register.register', 'Create account')}
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {t('register.haveAccount', 'Already have an account?')}{' '}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    {t('register.login', 'Log in')}
                  </Link>
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  {t('register.termsText', 'By creating an account, you agree to our')}{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    {t('register.terms', 'Terms of Service')}
                  </Link>{' '}
                  {t('register.and', 'and')}{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    {t('register.privacy', 'Privacy Policy')}
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Infinity Marketing AI. {t('register.allRights', 'All rights reserved.')}
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
