'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage(): JSX.Element {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">설정</h1>
        <p className="text-muted-foreground">
          시스템 설정과 관리자 계정 설정을 관리하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시스템 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>시스템 설정</CardTitle>
            <CardDescription>
              플랫폼 전반의 시스템 설정을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">사용자 가입 허용</p>
                <p className="text-xs text-muted-foreground">새로운 사용자의 회원가입을 허용합니다.</p>
              </div>
              <Switch checked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">크리에이터 등록 승인</p>
                <p className="text-xs text-muted-foreground">크리에이터 등록 시 관리자 승인을 요구합니다.</p>
              </div>
              <Switch checked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">콘텐츠 자동 승인</p>
                <p className="text-xs text-muted-foreground">새로운 콘텐츠를 자동으로 승인합니다.</p>
              </div>
              <Switch checked={false} />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">유지보수 모드</p>
                <p className="text-xs text-muted-foreground">플랫폼을 유지보수 모드로 전환합니다.</p>
              </div>
              <Switch checked={false} />
            </div>
          </CardContent>
        </Card>

        {/* 알림 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>알림 설정</CardTitle>
            <CardDescription>
              관리자 알림 및 이메일 설정을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">신규 사용자 알림</p>
                <p className="text-xs text-muted-foreground">새로운 사용자 가입 시 알림을 받습니다.</p>
              </div>
              <Switch checked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">크리에이터 등록 알림</p>
                <p className="text-xs text-muted-foreground">크리에이터 등록 요청 시 알림을 받습니다.</p>
              </div>
              <Switch checked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">콘텐츠 승인 알림</p>
                <p className="text-xs text-muted-foreground">콘텐츠 승인 요청 시 알림을 받습니다.</p>
              </div>
              <Switch checked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">시스템 오류 알림</p>
                <p className="text-xs text-muted-foreground">시스템 오류 발생 시 즉시 알림을 받습니다.</p>
              </div>
              <Switch checked />
            </div>
          </CardContent>
        </Card>

        {/* 백업 및 복구 */}
        <Card>
          <CardHeader>
            <CardTitle>백업 및 복구</CardTitle>
            <CardDescription>
              데이터 백업과 복구 설정을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">자동 백업</p>
                <p className="text-xs text-muted-foreground">매일 자동으로 데이터를 백업합니다.</p>
              </div>
              <Switch checked />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">수동 백업</p>
              <p className="text-xs text-muted-foreground">현재 데이터를 즉시 백업합니다.</p>
              <Button size="sm" variant="outline">
                백업 실행
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">마지막 백업</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">2024-01-20 03:00</Badge>
                <span className="text-xs text-muted-foreground">성공</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>API 설정</CardTitle>
            <CardDescription>
              외부 API 연동 및 설정을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">YouTube API</p>
              <div className="flex items-center gap-2">
                <Badge variant="default">연결됨</Badge>
                <Button size="sm" variant="outline">
                  설정
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Instagram API</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">연결 안됨</Badge>
                <Button size="sm" variant="outline">
                  연결
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">TikTok API</p>
              <div className="flex items-center gap-2">
                <Badge variant="default">연결됨</Badge>
                <Button size="sm" variant="outline">
                  설정
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">
          초기화
        </Button>
        <Button>
          설정 저장
        </Button>
      </div>
    </div>
  );
}