'use client';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { t, i18n: i18next } = useTranslation();
  const router = useRouter();
  const { user, clearUser } = useUserStore();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    clearUser(); // ✅ يمسح الجلسة من zustand
    router.push('/auth/login');
  };

  const languageLabel = {
    en: 'English',
    ar: 'العربية',
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b bg-white">
      <h1 className="font-bold text-lg">{t('layout.dashboard')}</h1>
      <div className="flex gap-4 items-center">
        <span className="text-sm text-muted-foreground">{user?.name}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm">
              {languageLabel[i18next.language as 'en' | 'ar']}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => changeLanguage('en')}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('ar')}>
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-sm text-red-600 border-red-300"
        >
          {t('layout.logout')}
        </Button>
      </div>
    </header>
  );
}
