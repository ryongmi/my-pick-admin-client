'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCreators } from '@/store/slices/creatorSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CreatorsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { creators, loading, error, pagination } = useAppSelector((state) => state.creator);

  useEffect(() => {
    dispatch(fetchCreators({}));
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
          <Button onClick={() => dispatch(fetchCreators({}))}>
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
          <h1 className="text-3xl font-bold tracking-tight">크리에이터 관리</h1>
          <p className="text-muted-foreground">
            등록된 크리에이터들을 관리하고 인증 상태를 확인하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            인증 대기 목록
          </Button>
          <Button>
            크리에이터 등록
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">등록된 크리에이터가 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          creators.map((creator) => (
            <Card key={creator.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{creator.name}</CardTitle>
                  <div className="flex gap-1">
                    {creator.isVerified && (
                      <Badge variant="default" className="text-xs">
                        인증
                      </Badge>
                    )}
                    <Badge variant={creator.isActive ? 'default' : 'secondary'}>
                      {creator.isActive ? '활성' : '비활성'}
                    </Badge>
                  </div>
                </div>
                {creator.description && (
                  <CardDescription className="line-clamp-2">
                    {creator.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creator.platforms.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">플랫폼</p>
                      <div className="flex flex-wrap gap-1">
                        {creator.platforms.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>등록일</span>
                    <span>{new Date(creator.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {!creator.isVerified && (
                    <Button size="sm" variant="default">
                      인증
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    수정
                  </Button>
                  <Button size="sm" variant="outline">
                    상세
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