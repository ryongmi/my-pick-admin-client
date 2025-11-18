import { pickApi } from '@/lib/httpClient';

/**
 * 콘텐츠 동기화 응답 인터페이스
 */
export interface SyncResponse {
  success: boolean;
  message: string;
  syncedCount?: number;
  error?: string;
}

/**
 * 콘텐츠 동기화 관련 Service
 *
 * 플랫폼 콘텐츠 수동 동기화를 담당
 */
class SyncService {
  /**
   * 플랫폼 콘텐츠 수동 동기화 트리거
   * my-pick-server API: POST /content/sync/:platformId
   *
   * @param platformId - 동기화할 플랫폼 ID
   * @returns 동기화 결과
   */
  async triggerContentSync(platformId: string): Promise<SyncResponse> {
    const response = await pickApi.post<SyncResponse>(`/content/sync/${platformId}`, {});
    return response.data;
  }
}

// 싱글톤 인스턴스
export const syncService = new SyncService();
