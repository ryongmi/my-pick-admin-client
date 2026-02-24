'use client';

import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';

export function Header(): JSX.Element {
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = (): void => {
    // TODO: 로그아웃 구현
  };

  // 안전한 이미지 URL 확인
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      // 신뢰할 수 있는 도메인 체크 (필요시 추가)
      return true;
    } catch {
      return false;
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">MyPick Admin</h1>
          <Badge variant="secondary" className="text-xs">
            관리자 포털
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                {user?.profileImageUrl && isValidImageUrl(user.profileImageUrl) ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src={user.profileImageUrl}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                프로필
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                설정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}