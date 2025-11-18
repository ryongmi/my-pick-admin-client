'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCreatorById } from '@/store/slices/creatorSlice';
import { ArrowLeft, ExternalLink, Calendar, Users, Video, Eye } from 'lucide-react';
import { SyncButton } from '@/components/sync/SyncButton';

export default function CreatorDetailPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedCreator, detailLoading, error } = useAppSelector(
    (state) => state.creator
  );

  const creatorId = params.id as string;

  useEffect(() => {
    if (creatorId) {
      dispatch(fetchCreatorById(creatorId));
      // fetchCreatorPlatforms는 제거 - GET /creators/:id가 이미 platforms 정보 포함
    }
  }, [dispatch, creatorId]);

  // 안전한 이미지 URL 확인
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return ['i.ytimg.com', 'yt3.ggpht.com', 'pbs.twimg.com', 'abs.twimg.com'].includes(parsed.hostname);
    } catch {
      return false;
    }
  };

  // 숫자 포맷팅
  const formatNumber = (num?: number): string => {
    if (num === undefined || num === null) return '-';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // 날짜 포맷팅
  const formatDate = (date?: Date): string => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 플랫폼 배지 스타일
  const getPlatformBadgeClass = (platform: string): string => {
    const platformClasses: Record<string, string> = {
      youtube: 'bg-red-100 text-red-800',
      twitter: 'bg-blue-100 text-blue-800',
    };
    return platformClasses[platform] || 'bg-gray-100 text-gray-800';
  };

  // 에러 처리
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-red-800 mb-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={() => router.push('/creators')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (detailLoading || !selectedCreator) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="text-gray-500">크리에이터 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더: 뒤로가기 버튼 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/creators')}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
      </div>

      {/* 프로필 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-6">
          {/* 프로필 이미지 */}
          {isValidImageUrl(selectedCreator.profileImageUrl) ? (
            <Image
              src={selectedCreator.profileImageUrl!}
              alt={selectedCreator.name}
              width={120}
              height={120}
              className="w-30 h-30 rounded-full object-cover"
            />
          ) : (
            <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-4xl font-bold">
                {selectedCreator.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* 기본 정보 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{selectedCreator.name}</h1>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  selectedCreator.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {selectedCreator.isActive ? '활성' : '비활성'}
              </span>
            </div>

            {selectedCreator.description && (
              <p className="text-gray-600 mb-4">{selectedCreator.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>등록일: {formatDate(selectedCreator.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>사용자 ID: {selectedCreator.userId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">구독자</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(selectedCreator.subscriberCount)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">영상 수</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(selectedCreator.videoCount)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Video className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">총 조회수</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(selectedCreator.totalViews)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 연동 플랫폼 목록 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">연동 플랫폼</h2>

        {!selectedCreator.platforms || selectedCreator.platforms.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">연동된 플랫폼이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {selectedCreator.platforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getPlatformBadgeClass(
                      platform.platformType
                    )}`}
                  >
                    {platform.platformType.toUpperCase()}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {platform.platformUsername || platform.platformId}
                    </p>
                    <p className="text-sm text-gray-500">Platform ID: {platform.platformId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* 플랫폼 활성화 상태 */}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      platform.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {platform.isActive ? '활성' : '비활성'}
                  </span>

                  {/* YouTube 플랫폼인 경우에만 동기화 버튼 표시 */}
                  {platform.platformType === 'youtube' && platform.isActive && (
                    <SyncButton
                      platformId={platform.id}
                      platformName={platform.platformUsername || platform.platformId}
                      size="sm"
                      onSyncComplete={() => {
                        // 동기화 완료 후 크리에이터 정보 재조회 (선택사항)
                        dispatch(fetchCreatorById(creatorId));
                      }}
                    />
                  )}

                  {/* 플랫폼 URL 링크 */}
                  {platform.platformUrl && (
                    <a
                      href={platform.platformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 사용자 정보 */}
      {selectedCreator.user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">소유자 정보</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">사용자 ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedCreator.user.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">이메일</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedCreator.user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">이름</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedCreator.user.name}</dd>
            </div>
            {selectedCreator.user.profileImage && (
              <div>
                <dt className="text-sm font-medium text-gray-500">프로필 이미지</dt>
                <dd className="mt-1">
                  {isValidImageUrl(selectedCreator.user.profileImage) ? (
                    <Image
                      src={selectedCreator.user.profileImage}
                      alt={selectedCreator.user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* 상세 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">상세 정보</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">크리에이터 ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{selectedCreator.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">사용자 ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{selectedCreator.userId}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">등록일</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedCreator.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">수정일</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedCreator.updatedAt)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">상태</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {selectedCreator.isActive ? '활성' : '비활성'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">연동 플랫폼 수</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {selectedCreator.platforms?.length || 0}개
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
