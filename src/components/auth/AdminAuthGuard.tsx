'use client';

import { useEffect, ReactNode } from 'react';
import { useAppSelector } from '@/store/hooks';

interface AdminAuthGuardProps {
  children: ReactNode;
}

interface User {
  id: string;
  email: string;
  name: string;
  roles?: Array<{ name: string; id: string }>;
  isActive: boolean;
}

const ADMIN_ROLE_NAMES = ['super-admin', 'system-admin', 'portal-admin', 'admin'];

function hasAdminRole(user: User | null): boolean {
  if (!user) return false;
  
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.some((role: { name?: string }) => 
      ADMIN_ROLE_NAMES.includes(role.name?.toLowerCase() || '')
    );
  }
  
  // 개발 환경에서 임시 바이패스 (운영에서는 제거)
  if (process.env.NODE_ENV === 'development' && user.id) {
    return true;
  }
  
  return false;
}

function PageLoader({ message }: { message: string }): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps): JSX.Element {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // 비로그인 사용자 → 로그인 페이지
      const currentUrl = window.location.href;
      const redirectUri = encodeURIComponent(currentUrl);
      const loginUrl = `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/login?redirect_uri=${redirectUri}`;
      window.location.href = loginUrl;
    }
    
    if (isAuthenticated && user && !hasAdminRole(user)) {
      // 일반 사용자 → 포탈 클라이언트로 리다이렉트
      window.location.href = process.env.NEXT_PUBLIC_PORTAL_CLIENT_URL || 'http://localhost:3200';
    }
  }, [isAuthenticated, user, loading]);

  // 로딩 또는 권한 검증 중
  if (loading || !isAuthenticated || !hasAdminRole(user)) {
    return <PageLoader message="관리자 권한을 확인하는 중..." />;
  }

  return <>{children}</>;
}