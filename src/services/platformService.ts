import { httpClient } from '@/lib/httpClient';

export interface Platform {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  isActive: boolean;
  description?: string;
  apiConfig?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlatformDto {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  description?: string;
  apiConfig?: Record<string, unknown>;
}

export interface UpdatePlatformDto {
  displayName?: string;
  icon?: string;
  color?: string;
  description?: string;
  apiConfig?: Record<string, unknown>;
  isActive?: boolean;
}

class PlatformService {
  async getPlatforms(): Promise<Platform[]> {
    const response = await httpClient.pickGet<Platform[]>('/api/platforms');
    return response.data;
  }

  async getPlatformById(id: string): Promise<Platform> {
    const response = await httpClient.pickGet<Platform>(`/api/platforms/${id}`);
    return response.data;
  }

  async createPlatform(platformData: CreatePlatformDto): Promise<void> {
    await httpClient.pickPost<void>('/api/platforms', platformData);
  }

  async updatePlatform(id: string, platformData: UpdatePlatformDto): Promise<void> {
    await httpClient.pickPatch<void>(`/api/platforms/${id}`, platformData);
  }

  async deletePlatform(id: string): Promise<void> {
    await httpClient.pickDelete<void>(`/api/platforms/${id}`);
  }

  async activatePlatform(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/platforms/${id}/activate`);
  }

  async deactivatePlatform(id: string): Promise<void> {
    await httpClient.pickPatch<void>(`/api/platforms/${id}/deactivate`);
  }

  async testPlatformConnection(id: string): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.pickGet<{ success: boolean; message: string }>(`/api/platforms/${id}/test`);
    return response.data;
  }
}

export const platformService = new PlatformService();