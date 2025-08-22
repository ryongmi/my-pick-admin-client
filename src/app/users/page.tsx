'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers } from '@/store/slices/userSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function UsersPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { users, loading, error, pagination } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers({}));
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
          <Button onClick={() => dispatch(fetchUsers({}))}>
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
          <h1 className="text-3xl font-bold tracking-tight">사용자 관리</h1>
          <p className="text-muted-foreground">
            플랫폼에 등록된 모든 사용자를 관리하세요.
          </p>
        </div>
        <Button>
          사용자 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">등록된 사용자가 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? '활성' : '비활성'}
                  </Badge>
                </div>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.roles && user.roles.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role.id} variant="outline" className="text-xs">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>가입일</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
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