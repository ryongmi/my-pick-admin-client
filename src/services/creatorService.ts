import { httpClient } from '@/lib/httpClient';

export interface Creator {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  platforms: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface CreateCreatorDto {
  name: string;
  description?: string;
  avatar?: string;
  platforms: string[];
  userId?: string;
}

export interface UpdateCreatorDto {
  name?: string;
  description?: string;
  avatar?: string;
  platforms?: string[];
  isActive?: boolean;
}

export interface CreatorFilters {
  search?: string;
  platform?: string;
  isVerified?: boolean;
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

export interface SearchParams extends CreatorFilters {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

class CreatorService {
  async getCreators(params: SearchParams = {}): Promise<PaginatedResponse<Creator>> {
    const response = await httpClient.pickGet<PaginatedResponse<Creator>>('/api/creators', params);
    return response.data;
  }

  async getCreatorById(id: string): Promise<Creator> {
    const response = await httpClient.pickGet<Creator>(`/api/creators/${id}`);
    return response.data;
  }

  async createCreator(creatorData: CreateCreatorDto): Promise<void> {
    await httpClient.pickPost<void>('/api/creators', creatorData);
  }

  async updateCreator(id: string, creatorData: UpdateCreatorDto): Promise<void> {
    await httpClient.pickPatch<void>(`/api/creators/${id}`, creatorData);
  }

  async deleteCreator(id: string): Promise<void> {
    await httpClient.pickDelete<void>(`/api/creators/${id}`);
  }

  async verifyCreator(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/creators/${id}/verify`);
  }

  async unverifyCreator(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/creators/${id}/unverify`);
  }

  async activateCreator(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/creators/${id}/activate`);
  }

  async deactivateCreator(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/creators/${id}/deactivate`);
  }
}

export const creatorService = new CreatorService();