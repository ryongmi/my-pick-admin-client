/**
 * 크리에이터 신청 관련 타입 정의
 */

/**
 * 플랫폼 타입
 */
export type PlatformType = 'youtube' | 'twitter';

/**
 * 신청 상태
 */
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

/**
 * 채널 정보
 */
export interface ChannelInfo {
  platform: PlatformType;
  channelId: string;
  channelUrl: string;
  channelName: string;
  subscriberCount?: number;
  videoCount?: number;
  description?: string;
  thumbnailUrl?: string;
  customUrl?: string;
  country?: string;
  publishedAt?: string;
}

/**
 * 검토 정보
 */
export interface ReviewInfo {
  reviewerId?: string;
  reviewedAt?: string;
  reason?: string;
  comment?: string;
}

/**
 * 크리에이터 신청
 */
export interface CreatorRegistration {
  id: string;
  userId: string;
  channelInfo: ChannelInfo;
  status: RegistrationStatus;
  appliedAt: string;
  registrationMessage?: string;
  reviewInfo?: ReviewInfo;
  createdCreatorId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 신청 목록 조회 파라미터
 */
export interface RegistrationSearchParams {
  status?: RegistrationStatus;
  limit?: number;
  offset?: number;
}

/**
 * 신청 목록 응답
 */
export interface RegistrationListResponse {
  registrations: CreatorRegistration[];
  total: number;
}

/**
 * 신청 통계
 */
export interface RegistrationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

/**
 * 신청 검토 요청
 */
export interface ReviewRegistrationRequest {
  status: 'approved' | 'rejected';
  reason?: string;
  comment?: string;
  reviewerId: string;
}

/**
 * 신청 검토 응답 (승인)
 */
export interface ReviewApprovedResponse {
  creatorId: string;
  message: string;
}

/**
 * 신청 검토 응답 (거부)
 */
export interface ReviewRejectedResponse {
  message: string;
}
