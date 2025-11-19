'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type SyncType = 'incremental' | 'full' | 'resume';

interface SyncConfirmDialogProps {
  isOpen: boolean;
  platformName: string;
  isLoading: boolean;
  syncType?: SyncType;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

/**
 * 콘텐츠 동기화 확인 다이얼로그
 *
 * 플랫폼 콘텐츠 동기화를 실행하기 전에 사용자에게 확인을 받는 모달
 * - incremental: 일반 동기화 (최신 콘텐츠만)
 * - full: 전체 동기화 (모든 콘텐츠)
 * - resume: 초기 동기화 재개
 */
export function SyncConfirmDialog({
  isOpen,
  platformName,
  isLoading,
  syncType = 'incremental',
  onConfirm,
  onCancel,
}: SyncConfirmDialogProps) {
  if (!isOpen) return null;

  const getDialogContent = () => {
    switch (syncType) {
      case 'full':
        return {
          title: '전체 콘텐츠 동기화 확인',
          description: `${platformName}의 모든 콘텐츠를 처음부터 동기화하시겠습니까?`,
          warning: '이 작업은 시간이 오래 걸릴 수 있으며, YouTube API 할당량을 많이 사용합니다. 동기화 진행 중 할당량이 90%를 초과하면 자동으로 일시 중지됩니다.',
        };
      case 'resume':
        return {
          title: '초기 동기화 재개 확인',
          description: `${platformName}의 초기 동기화를 재개하시겠습니까?`,
          warning: '마지막 중단 지점부터 동기화를 계속 진행합니다.',
        };
      default:
        return {
          title: '콘텐츠 동기화 확인',
          description: `${platformName}의 최신 콘텐츠를 동기화하시겠습니까?`,
          warning: '이 작업은 해당 플랫폼의 최신 콘텐츠를 가져와 데이터베이스에 저장합니다. 동기화 시간은 콘텐츠 양에 따라 다를 수 있습니다.',
        };
    }
  };

  const content = getDialogContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {content.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{content.description}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {content.warning}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  동기화 중...
                </>
              ) : (
                '동기화 시작'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
