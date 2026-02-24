/**
 * 공통 타입 정의
 */

export interface SearchFilters {
  [key: string]: string | number | boolean | undefined;
}

// creator 타입 re-export
export type { Creator, CreatorSearchParams, CreatorListResponse, PlatformInfo } from './creator';

// creatorRegistration 타입 re-export
export type {
  PlatformType,
  RegistrationStatus,
  ChannelInfo,
  ReviewInfo,
  CreatorRegistration,
  RegistrationSearchParams,
  RegistrationListResponse,
  RegistrationStats,
  ReviewRegistrationRequest,
  ReviewApprovedResponse,
  ReviewRejectedResponse,
} from './creatorRegistration';
