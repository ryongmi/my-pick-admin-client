import { httpClient } from '@/lib/httpClient';

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: Array<{ id: string; name: string }>;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  isActive?: boolean;
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface SearchParams extends UserFilters {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

class UserService {
  async getUsers(params: SearchParams = {}): Promise<PaginatedResponse<User>> {
    const response = await httpClient.authGet<PaginatedResponse<User>>('/api/users', params);
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await httpClient.authGet<User>(`/api/users/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserDto): Promise<void> {
    await httpClient.authPost<void>('/api/users', userData);
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<void> {
    await httpClient.authPatch<void>(`/api/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<void> {
    await httpClient.authDelete<void>(`/api/users/${id}`);
  }

  async activateUser(id: string): Promise<void> {
    await httpClient.authPatch<void>(`/api/users/${id}/activate`);
  }

  async deactivateUser(id: string): Promise<void> {
    await httpClient.authPatch<void>(`/api/users/${id}/deactivate`);
  }
}

export const userService = new UserService();