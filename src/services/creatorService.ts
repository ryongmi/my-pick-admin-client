import { pickApi } from '@/lib/httpClient';

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
  isSubscribed?: boolean;
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
    const response = await pickApi.get<PaginatedResponse<Creator>>('/api/creators', { params });
    return response.data;
  }

  async getCreatorById(id: string): Promise<Creator> {
    const response = await pickApi.get<Creator>(`/api/creators/${id}`);
    return response.data;
  }

  async createCreator(creatorData: CreateCreatorDto): Promise<void> {
    await pickApi.post<void>('/api/creators', creatorData);
  }

  async updateCreator(id: string, creatorData: UpdateCreatorDto): Promise<void> {
    await pickApi.patch<void>(`/api/creators/${id}`, creatorData);
  }

  async deleteCreator(id: string): Promise<void> {
    await pickApi.delete<void>(`/api/creators/${id}`);
  }

  async verifyCreator(id: string): Promise<void> {
    await pickApi.patch<void>(`/api/creators/${id}/verify`);
  }

  async unverifyCreator(id: string): Promise<void> {
    await pickApi.patch<void>(`/api/creators/${id}/unverify`);
  }

  async activateCreator(id: string): Promise<void> {
    await pickApi.patch<void>(`/api/creators/${id}/activate`);
  }

  async deactivateCreator(id: string): Promise<void> {
    await pickApi.patch<void>(`/api/creators/${id}/deactivate`);
  }

  // ==================== 구독 관련 메서드 ====================

  /**
   * 크리에이터 구독
   */
  async subscribeToCreator(creatorId: string): Promise<void> {
    await pickApi.post<void>('/subscriptions', {
      creatorId,
      notificationEnabled: true,
    });
  }

  /**
   * 크리에이터 구독 취소
   */
  async unsubscribeFromCreator(creatorId: string): Promise<void> {
    await pickApi.delete<void>(`/subscriptions/${creatorId}`);
  }

  /**
   * 구독 여부 확인
   */
  async checkSubscription(creatorId: string): Promise<boolean> {
    const response = await pickApi.get<{ isSubscribed: boolean }>(
      `/subscriptions/${creatorId}/check`
    );
    return response.data.isSubscribed;
  }

  /**
   * 내가 구독한 크리에이터 목록 조회
   */
  async getMySubscriptions(): Promise<string[]> {
    const response = await pickApi.get<string[]>('/subscriptions');
    return response.data;
  }
}

export const creatorService = new CreatorService();