'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { triggerSync, clearSyncMessage } from '@/store/slices/syncSlice';
import { SyncConfirmDialog } from './SyncConfirmDialog';
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
 * 플랫폼 콘텐츠 동기화를 트리거하는 버튼
 * - 확인 다이얼로그 표시
 * - 동기화 상태 표시 (로딩, 성공, 실패)
 * - Toast 알림 (선택적)
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

  // 이 버튼이 현재 동기화 중인지 확인
  const isThisButtonSyncing = syncing && syncingPlatformId === platformId;

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleConfirmSync = useCallback(async () => {
    try {
      const result = await dispatch(triggerSync(platformId)).unwrap();

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
  }, [dispatch, platformId, onSyncComplete]);

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
        <Button
          onClick={handleOpenDialog}
          disabled={disabled || syncing}
          size={size}
          variant="outline"
          className="relative"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isThisButtonSyncing ? 'animate-spin' : ''}`}
          />
          {isThisButtonSyncing ? '동기화 중...' : '콘텐츠 동기화'}
        </Button>

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
        onConfirm={handleConfirmSync}
        onCancel={handleCloseDialog}
      />
    </>
  );
}
