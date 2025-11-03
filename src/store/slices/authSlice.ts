import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import type { UserProfile } from '@krgeobuk/user/interfaces';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false,
};

// 앱 초기화 비동기 액션 (RefreshToken으로 AccessToken + 사용자 정보 한번에 조회)
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // /auth/initialize API 호출 (RefreshToken으로 AccessToken + 사용자 정보 반환)
      const { accessToken, user, isLogin } = await authService.initialize();
      return { accessToken, user, isLogin };
    } catch (error) {
      // 인증 실패 (RefreshToken이 없거나 만료됨)
      const message = error instanceof Error ? error.message : '초기화에 실패했습니다.';
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk<
  { user: UserProfile; token: string },
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // TODO: API 호출 구현
      throw new Error('API 구현 필요');
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인 실패';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: API 호출 구현
      localStorage.removeItem('token');
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그아웃 실패';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 앱 초기화
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = null;

        // isLogin 플래그를 우선 기준으로 인증 상태 판단
        if (action.payload.isLogin && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.token = null;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.payload as string;
      })
      // 로그인
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 로그아웃
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;