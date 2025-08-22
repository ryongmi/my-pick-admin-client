'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContents } from '@/store/slices/contentSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ContentsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { contents, loading, error, pagination } = useAppSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContents({}));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchContents({}))}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">콘텐츠 관리</h1>
          <p className="text-muted-foreground">
            등록된 모든 콘텐츠를 관리하고 승인 상태를 확인하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            승인 대기 목록
          </Button>
          <Button>
            콘텐츠 등록
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">등록된 콘텐츠가 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          contents.map((content) => (
            <Card key={content.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg line-clamp-1">{content.title}</CardTitle>
                  <div className="flex gap-1">
                    {content.isApproved && (
                      <Badge variant="default" className="text-xs">
                        승인
                      </Badge>
                    )}
                    <Badge variant={content.isActive ? 'default' : 'secondary'}>
                      {content.isActive ? '활성' : '비활성'}
                    </Badge>
                  </div>
                </div>
                {content.description && (
                  <CardDescription className="line-clamp-2">
                    {content.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">크리에이터</span>
                    <span className="font-medium">{content.creatorName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">플랫폼</span>
                    <Badge variant="outline" className="text-xs">
                      {content.platform}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">조회수</span>
                      <span>{content.viewCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">좋아요</span>
                      <span>{content.likeCount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>게시일</span>
                    <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {!content.isApproved && (
                    <Button size="sm" variant="default">
                      승인
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    보기
                  </Button>
                  <Button size="sm" variant="outline">
                    수정
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === 1}
            >
              이전
            </Button>
            <span className="text-sm">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}