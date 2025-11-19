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
 * 전체 콘텐츠 동기화 응답 인터페이스
 */
export interface FullSyncResponse {
  success: boolean;
  message: string;
  totalCount?: number;
  estimatedQuotaUsage?: number;
  error?: string;
}

/**
 * 초기 동기화 재개 응답 인터페이스
 */
export interface ResumeSyncResponse {
  success: boolean;
  message: string;
  resumedCount?: number;
  error?: string;
}

/**
 * 콘텐츠 동기화 관련 Service
 *
 * 플랫폼 콘텐츠 수동 동기화를 담당
 */
class SyncService {
  /**
   * 플랫폼 콘텐츠 수동 동기화 트리거 (증분 동기화)
   * my-pick-server API: POST /content/sync/:platformId
   *
   * @param platformId - 동기화할 플랫폼 ID
   * @returns 동기화 결과
   */
  async triggerContentSync(platformId: string): Promise<SyncResponse> {
    const response = await pickApi.post<SyncResponse>(`/content/sync/${platformId}`, {});
    return response.data;
  }

  /**
   * 플랫폼 전체 콘텐츠 동기화 트리거
   * my-pick-server API: POST /content/sync/:platformId/full
   *
   * @param platformId - 동기화할 플랫폼 ID
   * @returns 전체 동기화 결과
   */
  async triggerFullSync(platformId: string): Promise<FullSyncResponse> {
    const response = await pickApi.post<FullSyncResponse>(`/content/sync/${platformId}/full`, {});
    return response.data;
  }

  /**
   * 초기 동기화 재개
   * my-pick-server API: POST /content/sync/:platformId/resume
   *
   * @param platformId - 재개할 플랫폼 ID
   * @returns 재개 결과
   */
  async resumeInitialSync(platformId: string): Promise<ResumeSyncResponse> {
    const response = await pickApi.post<ResumeSyncResponse>(`/content/sync/${platformId}/resume`, {});
    return response.data;
  }
}

// 싱글톤 인스턴스
export const syncService = new SyncService();
