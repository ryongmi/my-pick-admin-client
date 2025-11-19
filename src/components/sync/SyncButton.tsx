'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { triggerSync, triggerFullSync, triggerResumeSync, clearSyncMessage } from '@/store/slices/syncSlice';
import { SyncConfirmDialog, type SyncType } from './SyncConfirmDialog';
import type { SyncResponse } from '@/services/syncService';

interface SyncButtonProps {
  platformId: string;
  platformName: string;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg';
  onSyncComplete?: (result: SyncResponse) => void;
}

/**
 * 콘텐츠 동기화 버튼 컴포넌트
 *
 * 플랫폼 콘텐츠 동기화를 트리거하는 드롭다운 버튼
 * - 일반 동기화: 최신 콘텐츠만 동기화
 * - 전체 동기화: 모든 콘텐츠를 처음부터 동기화
 * - 동기화 재개: 중단된 초기 동기화 재개
 * - 확인 다이얼로그 표시
 * - 동기화 상태 표시 (로딩, 성공, 실패)
 */
export function SyncButton({
  platformId,
  platformName,
  disabled = false,
  size = 'default',
  onSyncComplete,
}: SyncButtonProps) {
  const dispatch = useAppDispatch();
  const { syncing, syncingPlatformId, lastSyncResult, error, successMessage } = useAppSelector(
    (state) => state.sync
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showResultMessage, setShowResultMessage] = useState(false);
  const [syncType, setSyncType] = useState<SyncType>('incremental');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 이 버튼이 현재 동기화 중인지 확인
  const isThisButtonSyncing = syncing && syncingPlatformId === platformId;

  const handleOpenDialog = useCallback((type: SyncType) => {
    setSyncType(type);
    setIsDialogOpen(true);
    setIsDropdownOpen(false);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleConfirmSync = useCallback(async () => {
    try {
      let result: SyncResponse;

      // 동기화 타입에 따라 다른 액션 디스패치
      switch (syncType) {
        case 'full':
          result = await dispatch(triggerFullSync(platformId)).unwrap();
          break;
        case 'resume':
          result = await dispatch(triggerResumeSync(platformId)).unwrap();
          break;
        default:
          result = await dispatch(triggerSync(platformId)).unwrap();
      }

      // 다이얼로그 닫기
      setIsDialogOpen(false);

      // 결과 메시지 표시
      setShowResultMessage(true);
      setTimeout(() => {
        setShowResultMessage(false);
        dispatch(clearSyncMessage());
      }, 5000);

      // 콜백 실행
      if (onSyncComplete) {
        onSyncComplete(result);
      }
    } catch (err) {
      // 에러는 Redux에서 관리
      setIsDialogOpen(false);
      setShowResultMessage(true);
      setTimeout(() => {
        setShowResultMessage(false);
        dispatch(clearSyncMessage());
      }, 5000);
    }
  }, [dispatch, platformId, syncType, onSyncComplete]);

  // 결과 메시지 아이콘
  const getResultIcon = () => {
    if (error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (successMessage) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="relative inline-block">
          {/* 주 버튼 */}
          <div className="flex">
            <Button
              onClick={() => handleOpenDialog('incremental')}
              disabled={disabled || syncing}
              size={size}
              variant="outline"
              className="rounded-r-none border-r-0"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isThisButtonSyncing ? 'animate-spin' : ''}`}
              />
              {isThisButtonSyncing ? '동기화 중...' : '콘텐츠 동기화'}
            </Button>

            {/* 드롭다운 토글 버튼 */}
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={disabled || syncing}
              size={size}
              variant="outline"
              className="rounded-l-none px-2"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu">
                <button
                  onClick={() => handleOpenDialog('incremental')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <div className="font-medium">일반 동기화</div>
                  <div className="text-xs text-gray-500">최신 콘텐츠만 동기화</div>
                </button>
                <button
                  onClick={() => handleOpenDialog('full')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <div className="font-medium">전체 동기화</div>
                  <div className="text-xs text-gray-500">모든 콘텐츠를 처음부터 동기화</div>
                </button>
                <button
                  onClick={() => handleOpenDialog('resume')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <div className="font-medium">동기화 재개</div>
                  <div className="text-xs text-gray-500">중단된 초기 동기화 재개</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 결과 메시지 (버튼 아래 표시) */}
        {showResultMessage && (successMessage || error) && (
          <div
            className={`flex items-center gap-2 text-sm ${
              error ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {getResultIcon()}
            <span>{error || successMessage}</span>
          </div>
        )}
      </div>

      {/* 확인 다이얼로그 */}
      <SyncConfirmDialog
        isOpen={isDialogOpen}
        platformName={platformName}
        isLoading={isThisButtonSyncing}
        syncType={syncType}
        onConfirm={handleConfirmSync}
        onCancel={handleCloseDialog}
      />
    </>
  );
}
