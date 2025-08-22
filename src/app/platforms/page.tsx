'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPlatforms } from '@/store/slices/platformSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PlatformsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { platforms, loading, error } = useAppSelector((state) => state.platform);

  useEffect(() => {
    dispatch(fetchPlatforms());
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
          <Button onClick={() => dispatch(fetchPlatforms())}>
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
          <h1 className="text-3xl font-bold tracking-tight">플랫폼 관리</h1>
          <p className="text-muted-foreground">
            지원하는 플랫폼들을 관리하고 설정을 변경하세요.
          </p>
        </div>
        <Button>
          플랫폼 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">등록된 플랫폼이 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          platforms.map((platform) => (
            <Card key={platform.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-8 h-8 rounded-full ${platform.color}`}
                      style={{ backgroundColor: platform.color }}
                    />
                    <div>
                      <CardTitle className="text-lg">{platform.displayName}</CardTitle>
                      <CardDescription className="text-xs">{platform.name}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={platform.isActive ? 'default' : 'secondary'}>
                    {platform.isActive ? '활성' : '비활성'}
                  </Badge>
                </div>
                {platform.description && (
                  <CardDescription className="line-clamp-2 mt-2">
                    {platform.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">아이콘</span>
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {platform.icon}
                    </span>
                  </div>
                  {platform.apiConfig && Object.keys(platform.apiConfig).length > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">API 설정</span>
                      <div className="mt-1 p-2 bg-muted rounded text-xs">
                        API 설정 완료
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>등록일</span>
                    <span>{new Date(platform.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    설정
                  </Button>
                  <Button size="sm" variant="outline">
                    수정
                  </Button>
                  <Button 
                    size="sm" 
                    variant={platform.isActive ? 'secondary' : 'default'}
                  >
                    {platform.isActive ? '비활성화' : '활성화'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}