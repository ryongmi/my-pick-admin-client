import { httpClient } from '@/lib/httpClient';

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

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.authPost<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await httpClient.authPost<void>('/api/auth/logout');
    localStorage.removeItem('token');
  }

  async getCurrentUser(): Promise<User> {
    const response = await httpClient.authGet<User>('/api/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await httpClient.authPost<{ token: string }>('/api/auth/refresh');
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await httpClient.authPatch<void>('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async updateProfile(userData: { name?: string; email?: string }): Promise<void> {
    await httpClient.authPatch<void>('/api/auth/profile', userData);
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]!));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService();