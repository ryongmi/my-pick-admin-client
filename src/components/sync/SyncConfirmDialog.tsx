'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SyncConfirmDialogProps {
  isOpen: boolean;
  platformName: string;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

/**
 * 콘텐츠 동기화 확인 다이얼로그
 *
 * 플랫폼 콘텐츠 동기화를 실행하기 전에 사용자에게 확인을 받는 모달
 */
export function SyncConfirmDialog({
  isOpen,
  platformName,
  isLoading,
  onConfirm,
  onCancel,
}: SyncConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            콘텐츠 동기화 확인
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{platformName}</span>의 최신 콘텐츠를
              동기화하시겠습니까?
            </p>
            <p className="text-xs text-muted-foreground">
              이 작업은 해당 플랫폼의 최신 콘텐츠를 가져와 데이터베이스에 저장합니다. 동기화 시간은
              콘텐츠 양에 따라 다를 수 있습니다.
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
