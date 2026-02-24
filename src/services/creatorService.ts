import { pickApi } from '@/lib/httpClient';
import type { CreatorSearchParams, CreatorListResponse, CreatorDetail } from '@/types/creator';

/**
 * 크리에이터 관련 Service
 *
 * 크리에이터 조회, 검색 등을 담당
 */
class CreatorService {
  /**
   * 크리에이터 목록 조회 (페이지네이션, 필터링, 정렬 지원)
   * my-pick-server API: GET /creators
   */
  async getCreators(params: CreatorSearchParams = {}): Promise<CreatorListResponse> {
    // 빈 값이나 undefined를 제외한 쿼리 파라미터 구성
    const queryParams: Record<string, string | number | boolean> = {
      page: params.page || 1,
      limit: params.limit || 30,
    };

    // name이 빈 문자열이 아닐 때만 포함
    if (params.name && params.name.trim() !== '') {
      queryParams.name = params.name.trim();
    }

    // platform이 정의되어 있을 때만 포함
    if (params.platform) {
      queryParams.platform = params.platform;
    }

    // orderBy가 정의되어 있을 때만 포함
    if (params.orderBy) {
      queryParams.orderBy = params.orderBy;
    }

    // activeOnly가 명시적으로 true일 때만 포함
    if (params.activeOnly === true) {
      queryParams.activeOnly = true;
    }

    const response = await pickApi.get<CreatorListResponse>('/creators', {
      params: queryParams,
    });
    return response.data;
  }

  /**
   * 크리에이터 상세 조회
   * my-pick-server API: GET /creators/:id
   */
  async getCreatorById(id: string): Promise<CreatorDetail> {
    const response = await pickApi.get<CreatorDetail>(`/creators/${id}`);
    return response.data;
  }

  // getCreatorPlatforms는 제거됨 - GET /creators/:id가 이미 platforms 포함
}

// 싱글톤 인스턴스
export const creatorService = new CreatorService();