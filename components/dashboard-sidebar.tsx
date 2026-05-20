'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, BarChart3, Settings, Send, ClipboardCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const navItems = [
    { icon: BarChart3, label: 'Overview', href: '/dashboard', adminOnly: false },
    { icon: FileText, label: 'My Articles', href: '/dashboard/articles', adminOnly: false },
    // Guest: submit artikel
    { icon: Send, label: 'Submit Artikel', href: '/dashboard/submit', adminOnly: false },
    // Admin: buat artikel langsung (langsung approved)
    { icon: FileText, label: 'New Article', href: '/dashboard/articles/new', adminOnly: true },
    // Admin: review submission dari guest
    { icon: ClipboardCheck, label: 'Review Artikel', href: '/dashboard/review', adminOnly: true },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', adminOnly: false },
  ];

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 border-r bg-muted/30 h-screen sticky top-0">
      <nav className="p-4 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href}
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
