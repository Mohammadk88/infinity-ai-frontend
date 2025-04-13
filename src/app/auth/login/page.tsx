'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/app/lib/axios';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ChevronRight, Globe, SparklesIcon } from 'lucide-react';
import Image from 'next/image';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  type FormData = z.infer<typeof schema>;
  
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/auth/login', data, { withCredentials: true });
      const res = await api.get('/auth/me', { withCredentials: true });
      setUser(res.data);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Language toggle handler
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 p-4 md:p-8"
    >
      {/* Language toggle */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleLanguage} 
        className="fixed top-4 right-4 text-xs flex items-center gap-1"
      >
        <Globe className="h-3.5 w-3.5" />
        {i18n.language === 'en' ? 'عربي' : 'English'}
      </Button>
      
      <div className="w-full max-w-md animate__animated animate__fadeIn">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-2">
            <div className="bg-primary/10 p-3 rounded-xl">
              <SparklesIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">
            <span className="text-primary">Infinity</span> AI
          </h1>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            {t('login.welcome')}
          </p>
        </div>
        
        <Card className="w-full border rounded-xl shadow-lg animate__animated animate__fadeInUp animate__delay-100ms overflow-hidden bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <h1 className="text-xl font-semibold text-center">{t('login.title')}</h1>
            <p className="text-muted-foreground text-sm text-center">{t('login.subtitle')}</p>
          </CardHeader>
          
          <CardContent className="pb-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">
                  {t('login.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    className="pl-10 bg-background/50" 
                    placeholder={t('login.emailPlaceholder')}
                    {...register('email')} 
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs">{errors.email.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium">
                  {t('login.password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className="pl-10 pr-10 bg-background/50"
                    placeholder={t('login.passwordPlaceholder')}
                    {...register('password')} 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password.message as string}</p>
                )}
              </div>
              
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  {t('login.forgotPassword')}
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full group transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                    <span>{t('login.loading')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 group-hover:gap-2 transition-all duration-200">
                    <span>{t('login.button')}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col pt-2 pb-4">
            <div className="text-xs text-center text-muted-foreground mt-4">
              {t('login.noAccount')}{' '}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                {t('login.register')}
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        {/* Decorative elements */}
        <div className="fixed left-20 top-40 w-32 h-32 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="fixed right-20 bottom-20 w-56 h-56 bg-blue-500/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="fixed left-1/3 bottom-1/3 w-40 h-40 bg-purple-500/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}
