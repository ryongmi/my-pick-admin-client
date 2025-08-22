# CLAUDE.md - MyPick Admin Client

이 파일은 my-pick-admin-client 작업 시 Claude Code의 가이드라인을 제공합니다.

## 프로젝트 개요

my-pick-admin-client는 MyPick 플랫폼의 관리자 전용 인터페이스입니다. 크리에이터, 사용자, 콘텐츠, 플랫폼을 통합 관리할 수 있는 현대적이고 안전한 관리자 포탈을 제공합니다.

### 기술 스택
- **Next.js 15** - App Router 기반 React 프레임워크  
- **TypeScript** - 엄격 모드가 활성화된 완전한 타입 안전성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Redux Toolkit** - 상태 관리 및 비동기 처리
- **Axios** - HTTP 클라이언트

## 핵심 명령어

### 개발
```bash
# 개발 서버 시작 (포트 3310)
npm run dev

# 빌드
npm run build              # 프로덕션 빌드
npm run start              # 프로덕션 서버 시작 (포트 3310)

# 타입 검사
npm run type-check         # TypeScript 타입 검사
```

### 코드 품질
```bash
# 린팅
npm run lint               # ESLint 실행
npm run lint:fix           # 자동 수정과 함께 린팅
```

## 아키텍처 구조

### 관리자 전용 아키텍처
- **관리자 권한 검증**: AdminAuthGuard를 통한 역할 기반 접근 제어
- **자동 리다이렉트**: 비인가 사용자는 일반 포탈로 자동 이동
- **통합 관리**: 다중 백엔드 서비스 통합 인터페이스
- **실시간 모니터링**: 시스템 현황 실시간 대시보드

### 서비스 통합 아키텍처
my-pick-admin-client는 MyPick 마이크로서비스들의 관리 인터페이스입니다:

1. **auth-server (8000)** - 사용자 인증 및 사용자 관리
2. **my-pick-server (4000)** - 크리에이터, 콘텐츠, 플랫폼 관리

### 관리자 인터페이스 구조
- **대시보드** (`/`)
- **사용자 관리** (`/users`)
- **크리에이터 관리** (`/creators`)
- **콘텐츠 관리** (`/contents`)
- **플랫폼 관리** (`/platforms`)
- **설정** (`/settings`)

## Redux 상태 관리 패턴

### 1. 슬라이스 구조 표준
```typescript
// src/store/slices/userSlice.ts
interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  filters: UserFilters;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  filters: {}
};
```

### 2. 비동기 액션 패턴
```typescript
export const fetchUsers = createAsyncThunk<
  { users: User[]; pagination: PaginationState },
  { page?: number; filters?: UserFilters },
  { rejectValue: string }
>(
  'user/fetchUsers',
  async ({ page = 1, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers({ page, ...filters });
      return {
        users: response.items,
        pagination: response.pageInfo,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : '사용자 조회 실패';
      return rejectWithValue(message);
    }
  }
);
```

## API 서비스 레이어

### 1. HTTP 클라이언트 설정
```typescript
// src/lib/httpClient.ts
class HttpClient {
  private authClient: AxiosInstance;  // auth-server
  private pickClient: AxiosInstance;  // my-pick-server

  constructor() {
    this.authClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'http://localhost:8000',
      timeout: 10000,
      withCredentials: true,
    });

    this.pickClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_PICK_SERVER_URL || 'http://localhost:4000',
      timeout: 10000,
      withCredentials: true,
    });
  }
}
```

### 2. 서비스 클래스 패턴
```typescript
// src/services/userService.ts
class UserService {
  async getUsers(params: SearchParams = {}): Promise<PaginatedResponse<User>> {
    const response = await httpClient.authGet<PaginatedResponse<User>>('/api/users', params);
    return response.data;
  }

  async createUser(userData: CreateUserDto): Promise<void> {
    await httpClient.authPost<void>('/api/users', userData);
  }
}

export const userService = new UserService();
```

## AdminAuthGuard 시스템

### 1. AdminAuthGuard 구현
```typescript
// src/components/auth/AdminAuthGuard.tsx
const ADMIN_ROLE_NAMES = ['super-admin', 'system-admin', 'portal-admin', 'admin'];

function hasAdminRole(user: User | null): boolean {
  if (!user) return false;
  
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.some((role: { name?: string }) => 
      ADMIN_ROLE_NAMES.includes(role.name?.toLowerCase() || '')
    );
  }
  
  // 개발 환경에서 임시 바이패스
  if (process.env.NODE_ENV === 'development' && user.id) {
    return true;
  }
  
  return false;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // 비로그인 사용자 → 로그인 페이지
      const loginUrl = `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/login`;
      window.location.href = loginUrl;
    }
    
    if (isAuthenticated && user && !hasAdminRole(user)) {
      // 일반 사용자 → 포탈 클라이언트로 리다이렉트
      window.location.href = process.env.NEXT_PUBLIC_PORTAL_CLIENT_URL || 'http://localhost:3200';
    }
  }, [isAuthenticated, user, loading]);

  if (loading || !isAuthenticated || !hasAdminRole(user)) {
    return <PageLoader message="관리자 권한을 확인하는 중..." />;
  }

  return <>{children}</>;
}
```

## 컴포넌트 개발 표준

### 1. 페이지 컴포넌트 구조
```typescript
// src/app/users/page.tsx
'use client';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading, error, pagination } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers({}));
  }, [dispatch]);

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} onRetry={() => dispatch(fetchUsers({}))} />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="사용자 관리" />
      <UserTable users={users} pagination={pagination} />
    </div>
  );
}
```

### 2. UI 컴포넌트 활용
```typescript
// 기본 UI 컴포넌트 사용
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 일관된 스타일링
<Card className="hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle>{item.title}</CardTitle>
  </CardHeader>
  <CardContent>
    <Badge variant={item.isActive ? 'default' : 'secondary'}>
      {item.isActive ? '활성' : '비활성'}
    </Badge>
  </CardContent>
</Card>
```

## 레이아웃 구조

### 1. 전체 레이아웃
```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AdminAuthGuard>
            <Layout>
              {children}
            </Layout>
          </AdminAuthGuard>
        </Providers>
      </body>
    </html>
  );
}
```

### 2. 네비게이션
```typescript
// src/components/layout/Navigation.tsx
const navigation = [
  { name: '대시보드', href: '/', icon: LayoutDashboard },
  { name: '사용자 관리', href: '/users', icon: Users },
  { name: '크리에이터 관리', href: '/creators', icon: Crown },
  { name: '콘텐츠 관리', href: '/contents', icon: VideoIcon },
  { name: '플랫폼 관리', href: '/platforms', icon: Monitor },
  { name: '설정', href: '/settings', icon: Settings },
];
```

## 환경 설정

### 필수 환경 변수
```bash
# 백엔드 서비스 URL (필수)
NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:8000
NEXT_PUBLIC_PICK_SERVER_URL=http://localhost:4000

# 클라이언트 URL
NEXT_PUBLIC_ADMIN_CLIENT_URL=http://localhost:3310
NEXT_PUBLIC_PORTAL_CLIENT_URL=http://localhost:3200

# 환경 설정
NEXT_PUBLIC_ENVIRONMENT=local
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

## 개발 가이드

### 1. 새로운 페이지 추가
1. `src/app/[page-name]/page.tsx` 생성
2. Redux 슬라이스가 필요한 경우 `src/store/slices/` 에 추가
3. API 서비스가 필요한 경우 `src/services/` 에 추가
4. `src/components/layout/Navigation.tsx` 에 메뉴 항목 추가

### 2. 새로운 API 서비스 추가
1. `src/services/[service-name]Service.ts` 생성
2. 인터페이스와 타입 정의
3. httpClient를 사용한 API 메서드 구현
4. 해당 Redux 슬라이스에서 서비스 사용

### 3. 새로운 컴포넌트 추가
1. 적절한 디렉토리에 컴포넌트 생성 (`src/components/`)
2. TypeScript 인터페이스 정의
3. Tailwind CSS를 사용한 스타일링
4. 기존 UI 컴포넌트 최대한 활용

## 코딩 표준

### 1. TypeScript
- 모든 컴포넌트와 함수에 타입 정의
- interface 사용으로 명확한 API 계약
- strict mode 활성화

### 2. 스타일링
- Tailwind CSS 유틸리티 클래스 사용
- 일관된 색상과 간격 시스템
- 반응형 디자인 고려

### 3. 상태 관리
- Redux Toolkit 사용
- 슬라이스별 기능 분리
- createAsyncThunk로 비동기 작업 처리

### 4. 에러 처리
- try-catch로 API 에러 처리
- 사용자 친화적 에러 메시지
- 재시도 기능 제공

## 성능 최적화

### 1. 코드 분할
- 페이지별 동적 import
- 불필요한 라이브러리 import 지양

### 2. 메모이제이션
- React.memo로 불필요한 리렌더링 방지
- useMemo, useCallback 적절히 사용

### 3. 이미지 최적화
- Next.js Image 컴포넌트 사용
- 적절한 이미지 크기와 포맷

## 보안 고려사항

### 1. 인증 및 권한
- AdminAuthGuard로 페이지 접근 제어
- JWT 토큰 기반 인증
- 자동 토큰 갱신

### 2. API 보안
- HTTPS 사용 (운영 환경)
- 요청 시 토큰 자동 주입
- 401 에러 시 자동 로그아웃

### 3. 입력 검증
- 클라이언트 사이드 검증
- 백엔드 검증과 이중 보안

## 배포 가이드

### 1. 환경별 설정
- `.env.local` (개발 환경)
- `.env.production` (운영 환경)
- 환경별 API URL 분리

### 2. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm run start

# 타입 검사
npm run type-check

# 린팅 검사
npm run lint
```

## 문제 해결

### 일반적인 이슈

#### 1. 인증 관련 문제
- **증상**: 로그인 후에도 계속 로그인 페이지로 리다이렉트
- **해결**: auth-server CORS 설정 확인, 쿠키 도메인 설정 검증

#### 2. 권한 관련 문제
- **증상**: 관리자임에도 일반 포탈로 리다이렉트
- **해결**: hasAdminRole 함수의 역할 검증 로직 확인

#### 3. API 호출 실패
- **증상**: 백엔드 API 호출 실패
- **해결**: 환경 변수 확인, 네트워크 연결 확인, CORS 설정 검증

### 디버깅 도구
- **React DevTools**: 컴포넌트 상태 확인
- **Redux DevTools**: 상태 변화 추적  
- **Network Tab**: API 호출 모니터링
- **Console**: 에러 로그 확인

## 개발 팀 협업

### 1. Git 워크플로우
```bash
# 기능 개발
git checkout -b feature/admin-user-management
git commit -m "feat: 사용자 관리 페이지 구현"
git push origin feature/admin-user-management
```

### 2. 코드 리뷰
- TypeScript 타입 안전성 확인
- 컴포넌트 재사용성 검토
- 성능 최적화 포인트 확인
- 보안 취약점 검토

### 3. 테스트
- 단위 테스트 (Jest)
- 통합 테스트 (API 연동)
- E2E 테스트 (Playwright)

---

MyPick Admin Client는 효율적이고 안전한 관리자 경험을 제공하는 것을 목표로 합니다. 일관된 개발 표준을 유지하여 유지보수성과 확장성을 확보하세요.