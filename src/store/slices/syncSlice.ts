import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  syncService,
  type SyncResponse,
  type FullSyncResponse,
  type ResumeSyncResponse
} from '@/services/syncService';

interface SyncState {
  syncing: boolean;
  syncingPlatformId: string | null;
  lastSyncResult: SyncResponse | null;
  error: string | null;
  successMessage: string | null;
}

const initialState: SyncState = {
  syncing: false,
  syncingPlatformId: null,
  lastSyncResult: null,
  error: null,
  successMessage: null,
};

/**
 * 플랫폼 콘텐츠 수동 동기화 트리거 (일반 동기화)
 */
export const triggerSync = createAsyncThunk<
  SyncResponse,
  string,
  { rejectValue: string }
>(
  'sync/triggerSync',
  async (platformId, { rejectWithValue }) => {
    try {
      return await syncService.triggerContentSync(platformId);
    } catch (error) {
      const message = error instanceof Error ? error.message : '콘텐츠 동기화 실패';
      return rejectWithValue(message);
    }
  }
);

/**
 * 플랫폼 전체 콘텐츠 동기화 트리거
 */
export const triggerFullSync = createAsyncThunk<
  FullSyncResponse,
  string,
  { rejectValue: string }
>(
  'sync/triggerFullSync',
  async (platformId, { rejectWithValue }) => {
    try {
      return await syncService.triggerFullSync(platformId);
    } catch (error) {
      const message = error instanceof Error ? error.message : '전체 동기화 실패';
      return rejectWithValue(message);
    }
  }
);

/**
 * 초기 동기화 재개 트리거
 */
export const triggerResumeSync = createAsyncThunk<
  ResumeSyncResponse,
  string,
  { rejectValue: string }
>(
  'sync/triggerResumeSync',
  async (platformId, { rejectWithValue }) => {
    try {
      return await syncService.resumeInitialSync(platformId);
    } catch (error) {
      const message = error instanceof Error ? error.message : '동기화 재개 실패';
      return rejectWithValue(message);
    }
  }
);

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    clearSyncMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
    clearSyncResult: (state) => {
      state.lastSyncResult = null;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 일반 동기화
      .addCase(triggerSync.pending, (state, action) => {
        state.syncing = true;
        state.syncingPlatformId = action.meta.arg;
        state.error = null;
        state.successMessage = null;
        state.lastSyncResult = null;
      })
      .addCase(triggerSync.fulfilled, (state, action) => {
        state.syncing = false;
        state.syncingPlatformId = null;
        state.lastSyncResult = action.payload;

        if (action.payload.success) {
          const count = action.payload.syncedCount || 0;
          state.successMessage = `${action.payload.message} (동기화된 콘텐츠: ${count}개)`;
        } else {
          state.error = action.payload.error || action.payload.message;
        }
      })
      .addCase(triggerSync.rejected, (state, action) => {
        state.syncing = false;
        state.syncingPlatformId = null;
        state.error = action.payload || '알 수 없는 오류가 발생했습니다';
      })
      // 전체 동기화
      .addCase(triggerFullSync.pending, (state, action) => {
        state.syncing = true;
        state.syncingPlatformId = action.meta.arg;
        state.error = null;
        state.successMessage = null;
        state.lastSyncResult = null;
      })
      .addCase(triggerFullSync.fulfilled, (state, action) => {
        state.syncing = false;
        state.syncingPlatformId = null;
        state.lastSyncResult = action.payload as SyncResponse;

        if (action.payload.success) {
          const total = action.payload.totalCount || 0;
          const quota = action.payload.estimatedQuotaUsage || 0;
          state.successMessage = `${action.payload.message} (총 ${total}개 예상, 예상 할당량: ${quota})`;
        } else {
          state.error = action.payload.error || action.payload.message;
        }
      })
      .addCase(triggerFullSync.rejected, (state, action) => {
        state.syncing = false;
        state.syncingPlatformId = null;
        state.error = action.payload || '전체 동기화 실패';
      })
      // 동기화 재개
      .addCase(triggerResumeSync.pending, (state, action) => {
        state.syncing = true;
        state.syncingPlatformId = action.meta.arg;
        state.error = null;
        state.successMessage = null;
        state.lastSyncResult = null;
      })
      .addCase(triggerResumeSync.fulfilled, (state, action) => {
        state.syncing = false;
        state.syncingPlatformId = null;
        state.lastSyncResult = action.payload as SyncResponse;

        if (action.payload.success) {
          const resumed = action.payload.resumedCount || 0;
          state.successMessage = `${action.payload.message} (${resumed}개부터 재개)`;
        } else {
          state.error = action.payload.error || action.payload.message;
        }
      })
      .addCase(triggerResumeSync.rejected, (state, action) => {
        state.syncing = false;
        state.syncingPlatformId = null;
        state.error = action.payload || '동기화 재개 실패';
      });
  },
});

export const { clearSyncMessage, clearSyncResult } = syncSlice.actions;
export default syncSlice.reducer;
