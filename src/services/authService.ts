import { authApi, tokenManager } from '@/lib/httpClient';
import type { UserProfile } from '@krgeobuk/user/interfaces';

export interface User {
  id: string;
  email: string;
  name: string;
  roles?: Array<{ name: string; id: string }>;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface InitializeResponse {
  accessToken: string;
  user: UserProfile;
  isLogin: boolean;
}

/**
 * 인증 관련 Service
 *
 * 사용자 인증, 로그아웃, 토큰 관리 등을 담당
 */
export class AuthService {
  /**
   * 앱 초기화 - RefreshToken으로 AccessToken + 사용자 정보 조회
   */
  async initialize(): Promise<InitializeResponse> {
    const response = await authApi.post<{ accessToken: string; user: UserProfile }>(
      '/auth/initialize'
    );

    const { accessToken, user } = response.data;
    const { isLogin } = response;

    // AccessToken을 TokenManager에 저장
    tokenManager.setAccessToken(accessToken);

    return { accessToken, user, isLogin };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await authApi.post<void>('/auth/logout');
    tokenManager.clearAccessToken();
  }

  async getCurrentUser(): Promise<User> {
    const response = await authApi.get<User>('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await authApi.post<{ token: string }>('/auth/refresh');
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await authApi.patch<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async updateProfile(userData: { name?: string; email?: string }): Promise<void> {
    await authApi.patch<void>('/auth/profile', userData);
  }

  isTokenValid(): boolean {
    const token = tokenManager.getAccessToken();
    if (!token) return false;
    return tokenManager.isValidToken(token);
  }

  getStoredToken(): string | null {
    return tokenManager.getAccessToken();
  }

  setToken(token: string): void {
    tokenManager.setAccessToken(token);
  }

  removeToken(): void {
    tokenManager.clearAccessToken();
  }
}

// 싱글톤 인스턴스
export const authService = new AuthService();
