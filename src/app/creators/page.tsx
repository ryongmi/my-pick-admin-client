'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCreators, setFilters, clearFilters } from '@/store/slices/creatorSlice';
import Table from '@/components/common/Table';
import Pagination from '@/components/common/Pagination';
import SearchFilters from '@/components/common/SearchFilters';
import type { Creator, CreatorSearchParams } from '@/types/creator';

// 테이블 컬럼 타입
interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

// 필터 필드 타입
interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'boolean';
  options?: Array<{ value: string | boolean; label: string }>;
  placeholder?: string;
}

export default function CreatorsPage(): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { creators, loading, error, pageInfo, filters } = useAppSelector(
    (state) => state.creator
  );

  // 초기 데이터 로드
  useEffect(() => {
    dispatch(fetchCreators(filters));
  }, [dispatch, filters]);

  // 행 클릭 핸들러 - 상세 페이지로 이동
  const handleRowClick = (creator: Creator): void => {
    router.push(`/creators/${creator.id}`);
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
  const columns: Column<Creator>[] = [
    {
      key: 'name',
      label: '크리에이터',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {isValidImageUrl(row.profileImageUrl) ? (
            <Image
              src={row.profileImageUrl!}
              alt={row.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs font-bold">
                {row.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            {row.description && (
              <div className="text-sm text-gray-500 line-clamp-1 max-w-md">
                {row.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'platforms',
      label: '플랫폼',
      render: (_value, row) => (
        <div className="flex gap-1 flex-wrap">
          {row.platforms?.map((platform, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md"
            >
              {platform.platformType}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'subscriberCount',
      label: '구독자',
      sortable: true,
      render: (value) => (
        <div className="text-right">{formatNumber(value as number)}</div>
      ),
    },
    {
      key: 'videoCount',
      label: '영상 수',
      render: (value) => (
        <div className="text-right">{formatNumber(value as number)}</div>
      ),
    },
    {
      key: 'totalViews',
      label: '총 조회수',
      render: (value) => (
        <div className="text-right">{formatNumber(value as number)}</div>
      ),
    },
    {
      key: 'isActive',
      label: '상태',
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value ? '활성' : '비활성'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: '등록일',
      render: (value) => new Date(value as Date).toLocaleDateString('ko-KR'),
    },
  ];

  // 필터 필드 정의
  const filterFields: FilterField[] = [
    {
      key: 'name',
      label: '이름',
      type: 'text',
      placeholder: '크리에이터 이름 검색...',
    },
    {
      key: 'platform',
      label: '플랫폼',
      type: 'select',
      options: [
        { value: 'youtube', label: 'YouTube' },
        { value: 'twitter', label: 'Twitter' },
      ],
    },
    {
      key: 'orderBy',
      label: '정렬',
      type: 'select',
      options: [
        { value: 'recent', label: '최신순' },
        { value: 'followers', label: '구독자순' },
        { value: 'name', label: '이름순' },
        { value: 'content', label: '콘텐츠순' },
      ],
    },
    {
      key: 'activeOnly',
      label: '활성화만',
      type: 'boolean',
    },
  ];

  // 필터 변경 핸들러
  const handleFiltersChange = (newFilters: Record<string, string | number | boolean | undefined>): void => {
    const searchParams: CreatorSearchParams = {
      page: 1,
      limit: filters.limit || 30,
    };

    // name이 빈 문자열이 아닐 때만 포함
    if (newFilters.name && typeof newFilters.name === 'string' && newFilters.name.trim() !== '') {
      searchParams.name = newFilters.name.trim();
    }

    // platform이 빈 문자열('')이 아닐 때만 포함 (셀렉트 박스의 '전체' 제외)
    if (newFilters.platform && typeof newFilters.platform === 'string' && newFilters.platform !== '') {
      searchParams.platform = newFilters.platform as 'youtube' | 'twitter';
    }

    // orderBy가 빈 문자열('')이 아닐 때만 포함 (셀렉트 박스의 '전체' 제외)
    if (newFilters.orderBy && typeof newFilters.orderBy === 'string' && newFilters.orderBy !== '') {
      searchParams.orderBy = newFilters.orderBy as 'followers' | 'name' | 'content' | 'recent';
    }

    // activeOnly가 명시적으로 true일 때만 포함
    if (newFilters.activeOnly === true) {
      searchParams.activeOnly = true;
    }

    dispatch(setFilters(searchParams));
  };

  // 필터 초기화 핸들러
  const handleReset = (): void => {
    dispatch(clearFilters());
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number): void => {
    dispatch(setFilters({ ...filters, page }));
  };

  // 페이지당 항목 수 변경 핸들러
  const handleLimitChange = (limit: number): void => {
    dispatch(setFilters({ ...filters, page: 1, limit }));
  };

  // 숫자 포맷팅 함수
  const formatNumber = (num?: number): string => {
    if (num === undefined || num === null) return '-';

    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  // 에러 처리
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-red-800 mb-4">
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
            onClick={() => dispatch(fetchCreators(filters))}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">크리에이터 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            등록된 크리에이터 목록을 조회하고 관리합니다.
          </p>
        </div>
      </div>

      {/* 검색 필터 */}
      <SearchFilters
        fields={filterFields}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      {/* 크리에이터 테이블 */}
      <Table<Creator>
        data={creators}
        columns={columns}
        loading={loading}
        emptyMessage="등록된 크리에이터가 없습니다."
        onRowClick={handleRowClick}
      />

      {/* 페이지네이션 */}
      {!loading && creators.length > 0 && (
        <Pagination
          pageInfo={pageInfo}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
}
