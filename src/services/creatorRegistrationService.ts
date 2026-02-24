import { pickApi } from '@/lib/httpClient';
import type {
  RegistrationSearchParams,
  RegistrationListResponse,
  RegistrationStats,
  CreatorRegistration,
  ReviewRegistrationRequest,
  ReviewApprovedResponse,
  ReviewRejectedResponse,
} from '@/types/creatorRegistration';

/**
 * 크리에이터 신청 관련 Service (관리자용)
 *
 * 크리에이터 신청 목록 조회, 통계 조회, 승인/거부 등을 담당
 */
class CreatorRegistrationService {
  /**
   * 신청 목록 조회
   * my-pick-server API: GET /creator-applications
   */
  async getRegistrations(params: RegistrationSearchParams = {}): Promise<RegistrationListResponse> {
    // 빈 값이나 undefined를 제외한 쿼리 파라미터 구성
    const queryParams: Record<string, string | number> = {};

    // status가 정의되어 있을 때만 포함
    if (params.status) {
      queryParams.status = params.status;
    }

    // limit가 정의되어 있을 때만 포함
    if (params.limit !== undefined) {
      queryParams.limit = params.limit;
    }

    // offset이 정의되어 있을 때만 포함 (기본값 0)
    if (params.offset !== undefined) {
      queryParams.offset = params.offset;
    }

    const response = await pickApi.get<RegistrationListResponse>('/creator-registrations', {
      params: queryParams,
    });
    return response.data;
  }

  /**
   * 신청 통계 조회
   * my-pick-server API: GET /creator-applications/stats
   */
  async getRegistrationStats(): Promise<RegistrationStats> {
    const response = await pickApi.get<RegistrationStats>('/creator-registrations/stats');
    return response.data;
  }

  /**
   * 신청 상세 조회
   * my-pick-server API: GET /creator-applications/:id
   */
  async getRegistrationById(id: string): Promise<CreatorRegistration> {
    const response = await pickApi.get<CreatorRegistration>(`/creator-applications/${id}`);
    return response.data;
  }

  /**
   * 신청 검토 - 승인/거부
   * my-pick-server API: POST /creator-applications/:id/review
   */
  async reviewRegistration(
    id: string,
    reviewData: ReviewRegistrationRequest
  ): Promise<ReviewApprovedResponse | ReviewRejectedResponse> {
    const response = await pickApi.post<ReviewApprovedResponse | ReviewRejectedResponse>(
      `/creator-applications/${id}/review`,
      reviewData
    );
    return response.data;
  }
}

// 싱글톤 인스턴스
export const creatorRegistrationService = new CreatorRegistrationService();
