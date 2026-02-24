/**
 * 크리에이터 관련 타입 정의
 */

import type { LimitType } from '@krgeobuk/core/enum';

export interface PlatformInfo {
  platformType: 'youtube' | 'twitter';
  platformId: string;
  platformUsername?: string;
  platformUrl?: string;
}

export interface Creator {
  id: string;
  name: string;
  description?: string;
  profileImageUrl?: string;
  isActive: boolean;
  subscriberCount?: number;
  videoCount?: number;
  totalViews?: number;
  platforms?: PlatformInfo[];
  isSubscribed?: boolean;
  createdAt: Date;
}

export interface CreatorSearchParams {
  page?: number;
  limit?: number;
  name?: string;
  activeOnly?: boolean;
  platform?: 'youtube' | 'twitter';
  orderBy?: 'followers' | 'name' | 'content' | 'recent';
}

export interface CreatorListResponse {
  items: Creator[];
  pageInfo: {
    totalItems: number;
    page: number;
    limit: LimitType;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

/**
 * 크리에이터 상세 정보용 플랫폼 타입
 * GET /creators/:id/platforms 응답 타입
 */
export interface CreatorPlatform {
  id: string;
  creatorId: string;
  platformType: 'youtube' | 'twitter';
  platformId: string;
  platformUsername?: string;
  platformUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 크리에이터 연결된 사용자 정보 타입
 */
export interface CreatorUser {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

/**
 * 크리에이터 상세 정보 타입
 * GET /creators/:id 응답 타입 (플랫폼 + 사용자 정보 포함)
 */
export interface CreatorDetail extends Creator {
  userId: string;
  updatedAt: Date;
  platforms: CreatorPlatform[];
  user: CreatorUser;
}
