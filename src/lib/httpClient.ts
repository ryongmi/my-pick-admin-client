import { HttpClient } from '@krgeobuk/http-client';
import type {
  MultiServerConfig,
  TokenRefreshConfig,
  SecurityPolicy,
} from '@krgeobuk/http-client/types';
import type { AxiosRequestConfig } from 'axios';

// Type re-exports for compatibility
export type { ApiResponse } from '@krgeobuk/http-client/types';
export type { PaginatedResult as PaginatedResponse } from '@krgeobuk/core/interfaces';

// =============================================================================
// HTTP CLIENT CONFIGURATION
// =============================================================================

/**
 * 멀티 서버 설정
 * my-pick-admin-client는 auth-server와 my-pick-server를 사용합니다
 */
const getEnvConfig = (): MultiServerConfig => ({
  auth: {
    baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'http://krgeobuk.local:8000',
    timeout: 10000,
    withCredentials: true,
  },
  mypick: {
    baseURL: process.env.NEXT_PUBLIC_PICK_SERVER_URL || 'http://krgeobuk.local:8300',
    timeout: 10000,
    withCredentials: true,
  },
});

/**
 * 토큰 새로고침 설정
 */
const tokenRefreshConfig: TokenRefreshConfig = {
  refreshUrl: '/auth/refresh',
  refreshBeforeExpiry: 5 * 60 * 1000, // 5분 전 갱신
};

/**
 * 보안 정책 설정
 */
const getSecurityPolicy = (): Partial<SecurityPolicy> => {
  // 환경변수에서 허용된 오리진 읽기
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        'localhost',
        '127.0.0.1',
      ];

  return {
    allowedOrigins,
    enableCSRF: process.env.CSRF_PROTECTION_ENABLED !== 'false',
    enableInputValidation: true,
    enableSecurityLogging: process.env.SECURITY_LOGGING_ENABLED === 'true',
    rateLimitConfig: {
      maxAttempts: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '100'),
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    },
  };
};

// =============================================================================
// HTTP CLIENT INSTANCE
// =============================================================================

/**
 * @krgeobuk/http-client 인스턴스
 * 공통 패키지를 사용하여 일관된 HTTP 통신과 보안 정책을 제공합니다
 */
export const httpClient = new HttpClient(
  getEnvConfig(),
  tokenRefreshConfig,
  getSecurityPolicy()
);

// =============================================================================
// TOKEN MANAGER
// =============================================================================

// 토큰 매니저 접근자
export const tokenManager = httpClient.getTokenManager();

// =============================================================================
// API WRAPPERS
// =============================================================================

/**
 * Auth Server API (auth-server:8000)
 * 사용자 인증 및 관리 기능
 */
export const authApi = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    httpClient.get<T>('auth', url, config),

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.post<T>('auth', url, data, config),

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.put<T>('auth', url, data, config),

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.patch<T>('auth', url, data, config),

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    httpClient.delete<T>('auth', url, config),
};

/**
 * MyPick Server API (my-pick-server:4000)
 * 크리에이터, 콘텐츠, 플랫폼 관리 기능
 */
export const pickApi = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    httpClient.get<T>('mypick', url, config),

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.post<T>('mypick', url, data, config),

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.put<T>('mypick', url, data, config),

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.patch<T>('mypick', url, data, config),

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    httpClient.delete<T>('mypick', url, config),
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * 에러 처리 유틸리티 함수들
 */
export const errorUtils = {
  /**
   * krgeobuk 서버 에러인지 확인
   */
  isKrgeobukError(error: unknown): boolean {
    const typedError = error as { response?: { data?: { code?: unknown } } };
    return !!typedError.response?.data?.code && typeof typedError.response.data.code === 'string';
  },

  /**
   * 에러 코드 추출
   */
  getErrorCode(error: unknown): string | null {
    const typedError = error as { response?: { data?: { code?: string } } };
    return typedError.response?.data?.code || null;
  },

  /**
   * 사용자 친화적 에러 메시지 추출
   */
  getUserMessage(error: unknown): string {
    const typedError = error as { response?: { data?: { message?: string } }; message?: string };

    if (typedError.response?.data?.message) {
      return typedError.response.data.message;
    }

    if (typedError.message) {
      return typedError.message;
    }

    return '알 수 없는 오류가 발생했습니다.';
  },

  /**
   * 재시도 가능한 에러인지 확인
   */
  isRetryableError(error: unknown): boolean {
    const typedError = error as { response?: { status?: number } };
    const status = typedError.response?.status;

    // 네트워크 오류나 서버 오류는 재시도 가능
    if (!status || status >= 500) {
      return true;
    }

    // 레이트 리미트는 재시도 가능
    if (status === 429) {
      return true;
    }

    return false;
  },

  /**
   * 인증 관련 에러인지 확인
   */
  isAuthError(error: unknown): boolean {
    const typedError = error as { response?: { status?: number } };
    const status = typedError.response?.status;
    const code = this.getErrorCode(error);

    return (
      status === 401 ||
      code === 'AUTH_TOKEN_EXPIRED' ||
      code === 'JWT_EXPIRED' ||
      (code?.startsWith('AUTH_') || false)
    );
  },
};

/**
 * 보안 관리 함수
 */
export const securityManager = {
  refreshSession: (): void => {
    httpClient.refreshSession();
  },

  updateSecurityPolicy: (policy: Partial<SecurityPolicy>): void => {
    httpClient.updateSecurityPolicy(policy);
  },

  getAvailableServers: (): string[] => {
    return httpClient.getAvailableServers();
  },

  cleanup: (): void => {
    httpClient.cleanup();
  },
};

// 기본 export
export default httpClient;
