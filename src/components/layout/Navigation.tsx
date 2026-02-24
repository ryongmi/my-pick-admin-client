'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  VideoIcon,
  Crown,
  Settings,
  Monitor,
  ChevronDown,
  ChevronRight,
  FileText,
  LucideIcon
} from 'lucide-react';

interface SubNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  subItems?: SubNavItem[];
}

const navigation: NavItem[] = [
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
    subItems: [
      {
        name: '크리에이터 목록',
        href: '/creators',
        icon: Crown,
      },
      {
        name: '신청 현황',
        href: '/creators/registrations',
        icon: FileText,
      },
    ],
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // 현재 경로가 포함된 메뉴는 자동으로 펼치기
  const isSubItemActive = (item: NavItem): boolean => {
    if (!item.subItems) return false;
    return item.subItems.some((subItem) => pathname === subItem.href || pathname.startsWith(subItem.href + '/'));
  };

  const toggleExpand = (itemName: string): void => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  // 초기 렌더링 시 활성 메뉴 펼치기
  const isExpanded = (item: NavItem): boolean => {
    return expandedItems.includes(item.name) || isSubItemActive(item);
  };

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href && !item.subItems;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const expanded = hasSubItems && isExpanded(item);

        return (
          <div key={item.name}>
            {hasSubItems ? (
              <>
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isSubItemActive(item)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                  {expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems?.map((subItem) => {
                      // 정확한 경로 매칭: 정확히 일치하는 경우만 활성화
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                            isSubActive
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <subItem.icon className="mr-3 h-3 w-3" />
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <Link
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
            )}
          </div>
        );
      })}
    </nav>
  );
}
