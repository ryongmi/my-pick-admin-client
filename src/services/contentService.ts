import { httpClient } from '@/lib/httpClient';

export interface Content {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  url: string;
  platform: string;
  creatorId: string;
  creatorName: string;
  isApproved: boolean;
  isActive: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentDto {
  title: string;
  description?: string;
  thumbnail?: string;
  url: string;
  platform: string;
  creatorId: string;
  publishedAt?: string;
}

export interface UpdateContentDto {
  title?: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  isActive?: boolean;
}

export interface ContentFilters {
  search?: string;
  platform?: string;
  creatorId?: string;
  isApproved?: boolean;
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

export interface SearchParams extends ContentFilters {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

class ContentService {
  async getContents(params: SearchParams = {}): Promise<PaginatedResponse<Content>> {
    const response = await httpClient.pickGet<PaginatedResponse<Content>>('/api/contents', params);
    return response.data;
  }

  async getContentById(id: string): Promise<Content> {
    const response = await httpClient.pickGet<Content>(`/api/contents/${id}`);
    return response.data;
  }

  async createContent(contentData: CreateContentDto): Promise<void> {
    await httpClient.pickPost<void>('/api/contents', contentData);
  }

  async updateContent(id: string, contentData: UpdateContentDto): Promise<void> {
    await httpClient.pickPatch<void>(`/api/contents/${id}`, contentData);
  }

  async deleteContent(id: string): Promise<void> {
    await httpClient.pickDelete<void>(`/api/contents/${id}`);
  }

  async approveContent(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/contents/${id}/approve`);
  }

  async rejectContent(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/contents/${id}/reject`);
  }

  async activateContent(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/contents/${id}/activate`);
  }

  async deactivateContent(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/contents/${id}/deactivate`);
  }

  async getPendingContents(params: SearchParams = {}): Promise<PaginatedResponse<Content>> {
    const response = await httpClient.pickGet<PaginatedResponse<Content>>('/api/contents/pending', params);
    return response.data;
  }
}

export const contentService = new ContentService();