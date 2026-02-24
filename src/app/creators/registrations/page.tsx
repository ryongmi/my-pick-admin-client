'use client';

import { useEffect, ReactNode, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchRegistrations,
  fetchRegistrationStats,
  reviewRegistration,
  setFilters,
} from '@/store/slices/creatorRegistrationSlice';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import type {
  CreatorRegistration,
  RegistrationStatus,
  RegistrationSearchParams,
} from '@/types/creatorRegistration';

// 테이블 컬럼 타입
interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export default function CreatorRegistrationsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { registrations, stats, loading, error, total, filters } = useAppSelector(
    (state) => state.creatorRegistration
  );

  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    dispatch(fetchRegistrations(filters));
    dispatch(fetchRegistrationStats());
  }, [dispatch, filters]);

  // 상태 배지 렌더링
  const renderStatusBadge = (status: RegistrationStatus): ReactNode => {
    const statusConfig: Record<
      RegistrationStatus,
      { label: string; className: string }
    > = {
      pending: { label: '검토 대기', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: '승인됨', className: 'bg-green-100 text-green-800' },
      rejected: { label: '거부됨', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  // 플랫폼 배지 렌더링
  const renderPlatformBadge = (platform: string): ReactNode => {
    const platformConfig: Record<string, { label: string; className: string }> = {
      youtube: { label: 'YouTube', className: 'bg-red-100 text-red-800' },
      twitter: { label: 'Twitter', className: 'bg-blue-100 text-blue-800' },
    };

    const config = platformConfig[platform] || {
      label: platform,
      className: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  // 숫자 포맷팅
  const formatNumber = (num?: number): string => {
    if (num === undefined || num === null) return '-';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  // 테이블 컬럼 정의
  const columns: Column<CreatorRegistration>[] = [
    {
      key: 'channelInfo',
      label: '채널 정보',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {isValidImageUrl(row.channelInfo.thumbnailUrl) ? (
            <Image
              src={row.channelInfo.thumbnailUrl!}
              alt={row.channelInfo.channelName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs font-bold">
                {row.channelInfo.channelName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">
              {row.channelInfo.channelName}
            </div>
            <div className="text-sm text-gray-500">
              {renderPlatformBadge(row.channelInfo.platform)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'channelInfo',
      label: '구독자/영상',
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-gray-900">
            구독자: {formatNumber(row.channelInfo.subscriberCount)}
          </div>
          <div className="text-gray-500">
            영상: {formatNumber(row.channelInfo.videoCount)}
          </div>
        </div>
      ),
    },
    {
      key: 'appliedAt',
      label: '신청일',
      render: (value) => (
        <div className="text-sm text-gray-900">{formatDate(value as string)}</div>
      ),
    },
    {
      key: 'status',
      label: '상태',
      render: (value) => renderStatusBadge(value as RegistrationStatus),
    },
    {
      key: 'id',
      label: '액션',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && (
            <>
              <Button
                onClick={() => handleApprove(row.id)}
                variant="primary"
                className="text-xs px-3 py-1"
                disabled={reviewingId === row.id}
              >
                승인
              </Button>
              <Button
                onClick={() => handleRejectClick(row.id)}
                variant="secondary"
                className="text-xs px-3 py-1"
                disabled={reviewingId === row.id}
              >
                거부
              </Button>
            </>
          )}
          {row.status === 'approved' && (
            <span className="text-xs text-green-600">
              ✓ 크리에이터 생성됨
            </span>
          )}
          {row.status === 'rejected' && row.reviewInfo?.reason && (
            <span className="text-xs text-red-600" title={row.reviewInfo.reason}>
              거부 사유: {row.reviewInfo.reason.substring(0, 20)}...
            </span>
          )}
        </div>
      ),
    },
  ];

  // 승인 처리
  const handleApprove = async (id: string): Promise<void> => {
    if (!confirm('이 신청을 승인하시겠습니까?')) return;

    setReviewingId(id);
    try {
      await dispatch(
        reviewRegistration({
          id,
          reviewData: {
            status: 'approved',
            reviewerId: 'admin-temp-id', // TODO: 실제 관리자 ID로 교체
          },
        })
      ).unwrap();

      // 성공 시 목록 새로고침
      dispatch(fetchRegistrations(filters));
      dispatch(fetchRegistrationStats());
    } catch {
      alert('승인 처리 중 오류가 발생했습니다.');
    } finally {
      setReviewingId(null);
    }
  };

  // 거부 모달 열기
  const handleRejectClick = (id: string): void => {
    setReviewingId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // 거부 처리
  const handleReject = async (): Promise<void> => {
    if (!reviewingId) return;
    if (!rejectReason.trim()) {
      alert('거부 사유를 입력해주세요.');
      return;
    }

    try {
      await dispatch(
        reviewRegistration({
          id: reviewingId,
          reviewData: {
            status: 'rejected',
            reason: rejectReason,
            reviewerId: 'admin-temp-id', // TODO: 실제 관리자 ID로 교체
          },
        })
      ).unwrap();

      // 성공 시 목록 새로고침 및 모달 닫기
      dispatch(fetchRegistrations(filters));
      dispatch(fetchRegistrationStats());
      setShowRejectModal(false);
      setReviewingId(null);
      setRejectReason('');
    } catch {
      alert('거부 처리 중 오류가 발생했습니다.');
    }
  };

  // 상태 필터 변경
  const handleStatusFilter = (status?: RegistrationStatus): void => {
    const newFilters: RegistrationSearchParams = {
      limit: filters.limit || 20,
      offset: 0,
    };

    if (status) {
      newFilters.status = status;
    }

    dispatch(setFilters(newFilters));
  };

  // 페이지 변경
  const handlePageChange = (page: number): void => {
    const offset = (page - 1) * (filters.limit || 20);
    const newFilters: RegistrationSearchParams = {
      limit: filters.limit || 20,
      offset,
    };

    if (filters.status) {
      newFilters.status = filters.status;
    }

    dispatch(setFilters(newFilters));
  };

  // 에러 처리
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={() => dispatch(fetchRegistrations(filters))}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const currentPage = Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1;
  const totalPages = Math.ceil(total / (filters.limit || 20));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            크리에이터 신청 현황
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            크리에이터 신청을 검토하고 승인/거부를 처리합니다.
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleStatusFilter()}
            className={`p-4 rounded-lg border-2 transition-all ${
              !filters.status
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-sm text-gray-600">전체</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </button>
          <button
            onClick={() => handleStatusFilter('pending')}
            className={`p-4 rounded-lg border-2 transition-all ${
              filters.status === 'pending'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-sm text-gray-600">검토 대기</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </button>
          <button
            onClick={() => handleStatusFilter('approved')}
            className={`p-4 rounded-lg border-2 transition-all ${
              filters.status === 'approved'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-sm text-gray-600">승인됨</div>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </button>
          <button
            onClick={() => handleStatusFilter('rejected')}
            className={`p-4 rounded-lg border-2 transition-all ${
              filters.status === 'rejected'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-sm text-gray-600">거부됨</div>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </button>
        </div>
      )}

      {/* 신청 테이블 */}
      <Table<CreatorRegistration>
        data={registrations}
        columns={columns}
        loading={loading}
        emptyMessage="신청 내역이 없습니다."
      />

      {/* 페이지네이션 */}
      {!loading && registrations.length > 0 && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
          >
            이전
          </Button>
          <span className="px-4 py-2 text-sm text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
          >
            다음
          </Button>
        </div>
      )}

      {/* 거부 사유 모달 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">신청 거부</h2>
            <div className="mb-4">
              <label
                htmlFor="rejectReason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                거부 사유 (필수)
              </label>
              <textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="신청을 거부하는 사유를 입력해주세요..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setReviewingId(null);
                  setRejectReason('');
                }}
                variant="secondary"
              >
                취소
              </Button>
              <Button onClick={handleReject} variant="primary">
                거부 확정
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
