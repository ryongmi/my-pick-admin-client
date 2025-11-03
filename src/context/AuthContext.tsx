'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';
import type { UserProfile } from '@krgeobuk/user/interfaces';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, isInitialized } = useAppSelector(
    (state) => state.auth
  );
  const initializeRef = useRef(false);

  // 초기 인증 상태 확인 (쿠키 기반)
  useEffect(() => {
    const checkInitialAuth = async (): Promise<void> => {
      // 이미 초기화되었거나 진행 중이면 스킵 (StrictMode 대응)
      if (isInitialized || initializeRef.current) {
        return;
      }

      initializeRef.current = true;

      try {
        await dispatch(initializeAuth()).unwrap();
      } catch (_error) {
        // 인증되지 않은 사용자
      } finally {
        // 초기화 완료 후 플래그 해제
        initializeRef.current = false;
      }
    };

    // 초기 인증 확인
    checkInitialAuth();
  }, [dispatch, isInitialized]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    error,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
