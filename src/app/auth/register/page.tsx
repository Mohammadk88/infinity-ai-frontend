'use client';

import { Building2, Moon, Sun, User, LaptopIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageSelector } from '@/components/ui/language-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthBackground } from '@/components/ui/auth-background';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import Logo from '@/components/layout/logo';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      <AuthBackground />
      
      {/* Logo and system name at top left */}
      <div className="absolute top-6 left-6 z-50">
        <Logo className="mb-2" />
      </div>
      
      {/* Theme toggle and language selector */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
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
          <DropdownMenuContent align="end" className="animate__animated animate__fadeInDown animate__faster">
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

      <div className="mx-auto flex min-h-screen max-w-screen-xl items-center justify-center p-4">
        <div className="w-full space-y-8">
          {/* Page header with title */}
          <div className="text-center mb-8">
            <h1 className={cn(
              "text-3xl font-extrabold tracking-tight mb-2 animate__animated animate__fadeIn",
            )}>
              {t('auth.register.title', 'Choose Account Type')}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t('auth.register.description', 'Select the account type that best suits your needs')}
            </p>
          </div>
          
          <div className="grid w-full gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.02 }}
              className="transition-shadow hover:shadow-xl"
            >
              <Card className="h-full relative overflow-hidden group">
                <CardContent className="flex h-full flex-col items-center justify-center p-8">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <User className="mb-6 h-16 w-16 text-primary" />
                  </motion.div>
                  <h2 className="mb-3 text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {t('auth.personalAccount', 'Personal Account')}
                  </h2>
                  <p className="mb-8 text-center text-muted-foreground">
                    {t('auth.personalAccountDescription', 'Perfect for individual users who want to manage their own social media and marketing.')}
                  </p>
                  <Link
                    href="/auth/register/register-personal"
                    className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground ring-offset-background transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {t('auth.getStarted', 'Get Started')}
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                delay: 0.2
              }}
              whileHover={{ scale: 1.02 }}
              className="transition-shadow hover:shadow-xl"
            >
              <Card className="h-full relative overflow-hidden">
                <CardContent className="flex h-full flex-col items-center justify-center p-8">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Building2 className="mb-6 h-16 w-16 text-primary" />
                  </motion.div>
                  <h2 className="mb-3 text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {t('auth.companyAccount', 'Company Account')}
                  </h2>
                  <p className="mb-8 text-center text-muted-foreground">
                    {t('auth.companyAccountDescription', 'Ideal for businesses and teams who need collaborative features and advanced tools.')}
                  </p>
                  <Link
                    href="/auth/register/register-company"
                    className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground ring-offset-background transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {t('auth.getStarted', 'Get Started')}
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Login link with improved styling */}
        <div className="absolute bottom-6 text-center w-full">
          <div className="bg-background/50 backdrop-blur-sm py-3 rounded-lg shadow-sm max-w-xs mx-auto">
            <p className="text-sm">
              {t('auth.alreadyHaveAccount', 'Already have an account?')}{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                {t('auth.signIn', 'Sign in')}
              </Link>
            </p>
          </div>
          
          {/* Copyright information */}
          <p className="text-xs text-muted-foreground mt-3">
            © 2025 Infinity Marketing AI. {t('auth.allRights', 'All rights reserved.')}
          </p>
        </div>
      </div>
    </div>
  );
}
