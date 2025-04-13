'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const links = [
    { href: '/dashboard', label: t('layout.dashboard') },
    { href: '/dashboard/social-accounts', label: t('layout.socialAccounts') },
    { href: '/dashboard/posts', label: t('layout.posts') },
    { href: '/dashboard/campaigns', label: t('layout.campaigns') },
    { href: '/dashboard/settings', label: t('layout.settings') },
  ];

  return (
    <aside className="w-64 bg-white border-r p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6">{t('layout.title')}</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              pathname.startsWith(link.href)
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
