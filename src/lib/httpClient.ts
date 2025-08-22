import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

class HttpClient {
  private authClient: AxiosInstance;
  private pickClient: AxiosInstance;

  constructor() {
    // auth-server 클라이언트
    this.authClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'http://localhost:8000',
      timeout: 10000,
      withCredentials: true,
    });

    // my-pick-server 클라이언트
    this.pickClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_PICK_SERVER_URL || 'http://localhost:4000',
      timeout: 10000,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 요청 인터셉터
    const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };

    // 응답 인터셉터
    const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
      return response;
    };

    const errorInterceptor = (error: unknown): Promise<never> => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    };

    // 모든 클라이언트에 인터셉터 적용
    [this.authClient, this.pickClient].forEach(client => {
      client.interceptors.request.use(requestInterceptor);
      client.interceptors.response.use(responseInterceptor, errorInterceptor);
    });
  }

  // Auth Server API
  async authGet<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.authClient.get(url, { params });
    return response.data;
  }

  async authPost<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.authClient.post(url, data);
    return response.data;
  }

  async authPatch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.authClient.patch(url, data);
    return response.data;
  }

  async authDelete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.authClient.delete(url);
    return response.data;
  }

  // Pick Server API
  async pickGet<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.pickClient.get(url, { params });
    return response.data;
  }

  async pickPost<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.pickClient.post(url, data);
    return response.data;
  }

  async pickPatch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.pickClient.patch(url, data);
    return response.data;
  }

  async pickDelete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.pickClient.delete(url);
    return response.data;
  }
}

export const httpClient = new HttpClient();