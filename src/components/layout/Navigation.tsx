'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  VideoIcon, 
  Crown, 
  Settings,
  Monitor
} from 'lucide-react';

const navigation = [
  {
    name: '대시보드',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: '사용자 관리',
    href: '/users',
    icon: Users,
  },
  {
    name: '크리에이터 관리',
    href: '/creators',
    icon: Crown,
  },
  {
    name: '콘텐츠 관리',
    href: '/contents',
    icon: VideoIcon,
  },
  {
    name: '플랫폼 관리',
    href: '/platforms',
    icon: Monitor,
  },
  {
    name: '설정',
    href: '/settings',
    icon: Settings,
  },
];

export function Navigation(): JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}