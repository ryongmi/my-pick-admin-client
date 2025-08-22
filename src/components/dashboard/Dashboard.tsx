'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Dashboard(): JSX.Element {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">관리자 대시보드</h1>
          <p className="text-muted-foreground">
            MyPick 플랫폼의 전체 현황을 확인하고 관리하세요.
          </p>
        </div>
        <Badge variant="secondary">Admin</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              총 사용자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% 전월 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              등록된 크리에이터
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5% 전월 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              총 콘텐츠
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-muted-foreground">
              +18% 전월 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              활성 플랫폼
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              YouTube, Instagram, TikTok, Twitter
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 가입 사용자</CardTitle>
            <CardDescription>
              최근 7일간 가입한 사용자 목록입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: '김사용자', email: 'user1@example.com', date: '2024-01-20' },
                { name: '이팬', email: 'fan2@example.com', date: '2024-01-19' },
                { name: '박구독자', email: 'subscriber3@example.com', date: '2024-01-18' },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>플랫폼별 콘텐츠 현황</CardTitle>
            <CardDescription>
              각 플랫폼별 등록된 콘텐츠 수를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { platform: 'YouTube', count: 1234, color: 'bg-red-500' },
                { platform: 'Instagram', count: 567, color: 'bg-pink-500' },
                { platform: 'TikTok', count: 345, color: 'bg-gray-900' },
                { platform: 'Twitter', count: 310, color: 'bg-blue-500' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.platform}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}