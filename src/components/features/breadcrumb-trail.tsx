'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
}

const BreadcrumbTrail = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Always start with Dashboard as home
    items.push({
      label: t('breadcrumb.dashboard', 'Dashboard'),
      href: '/dashboard',
      isActive: pathname === '/dashboard'
    });

    // If we're not on dashboard root, build the breadcrumb trail
    if (pathname !== '/dashboard') {
      let currentPath = '';
      
      pathSegments.forEach((segment, index) => {
        // Skip the 'dashboard' segment as it's already added
        if (segment === 'dashboard') return;
        
        currentPath += `/${segment}`;
        const isLast = index === pathSegments.length - 1;
        
        // Create human-readable labels for common routes
        const getLabelForSegment = (seg: string) => {
          const labelMap: Record<string, string> = {
            'users': t('breadcrumb.users', 'User Management'),
            'company': t('breadcrumb.company', 'Company'),
            'clients': t('breadcrumb.clients', 'Clients'),
            'projects': t('breadcrumb.projects', 'Projects'),
            'tasks': t('breadcrumb.tasks', 'Tasks'),
            'leads': t('breadcrumb.leads', 'Leads'),
            'campaigns': t('breadcrumb.campaigns', 'Campaigns'),
            'calendar': t('breadcrumb.calendar', 'Calendar'),
            'settings': t('breadcrumb.settings', 'Settings'),
            'ai-providers': t('breadcrumb.aiProviders', 'AI Providers'),
            'ai-tools': t('breadcrumb.aiTools', 'AI Tools'),
            'assistant': t('breadcrumb.assistant', 'AI Assistant'),
            'affiliate': t('breadcrumb.affiliate', 'Affiliate'),
            'developer': t('breadcrumb.developer', 'Developer'),
            'kanban': t('breadcrumb.kanban', 'Kanban Board'),
            'social-accounts': t('breadcrumb.socialAccounts', 'Social Accounts'),
            'posts': t('breadcrumb.posts', 'Posts'),
            'memory': t('breadcrumb.memory', 'Memory'),
            'me': t('breadcrumb.profile', 'Profile'),
            'view': t('breadcrumb.view', 'View'),
            'edit': t('breadcrumb.edit', 'Edit'),
            'create': t('breadcrumb.create', 'Create'),
            'new': t('breadcrumb.new', 'New'),
            'members': t('breadcrumb.members', 'Members'),
            'lead-activities': t('breadcrumb.leadActivities', 'Lead Activities'),
            'reminders': t('breadcrumb.reminders', 'Reminders'),
            'agent-management': t('breadcrumb.agentManagement', 'Agent Management'),
            'agent-settings': t('breadcrumb.agentSettings', 'Agent Settings')
          };
          
          // If it's a UUID or ID (contains only alphanumeric and hyphens), show as "Details"
          if (/^[a-f0-9-]+$/i.test(seg) && seg.length > 10) {
            return t('breadcrumb.details', 'Details');
          }
          
          return labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
        };

        items.push({
          label: getLabelForSegment(segment),
          href: `/dashboard${currentPath}`,
          isActive: isLast
        });
      });
    }

    return items;
  }, [pathname, t]);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on dashboard root
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center space-x-1 text-sm text-muted-foreground mb-4 animate-fade-in"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
            )}
            
            {item.isActive ? (
              <span className="font-medium text-foreground cursor-default">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "hover:text-foreground transition-premium",
                  "hover:underline underline-offset-4",
                  index === 0 && "flex items-center space-x-1"
                )}
              >
                {index === 0 && <Home className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;
