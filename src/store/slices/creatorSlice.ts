import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { creatorService } from '@/services/creatorService';

interface Creator {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  platforms: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isSubscribed?: boolean;
}

interface CreatorFilters {
  search?: string;
  platform?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface CreatorState {
  creators: Creator[];
  selectedCreator: Creator | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  filters: CreatorFilters;
  subscribing: boolean;
  subscribeError: string | null;
}

const initialState: CreatorState = {
  creators: [],
  selectedCreator: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  filters: {},
  subscribing: false,
  subscribeError: null,
};

export const fetchCreators = createAsyncThunk<
  { creators: Creator[]; pagination: PaginationState },
  { page?: number; filters?: CreatorFilters },
  { rejectValue: string }
>(
  'creator/fetchCreators',
  async ({ page = 1, filters: _filters = {} }, { rejectWithValue }) => {
    try {
      // TODO: API 호출 구현
      return {
        creators: [],
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : '크리에이터 조회 실패';
      return rejectWithValue(message);
    }
  }
);

export const verifyCreator = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'creator/verifyCreator',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      // TODO: API 호출 구현
      dispatch(fetchCreators({}));
    } catch (error) {
      const message = error instanceof Error ? error.message : '크리에이터 인증 실패';
      return rejectWithValue(message);
    }
  }
);

// ==================== 구독 관련 액션 ====================

/**
 * 크리에이터 구독
 */
export const subscribeToCreator = createAsyncThunk<
  string, // creatorId 반환
  string, // creatorId 파라미터
  { rejectValue: string }
>('creator/subscribe', async (creatorId, { rejectWithValue }) => {
  try {
    await creatorService.subscribeToCreator(creatorId);
    return creatorId;
  } catch (error) {
    const message = error instanceof Error ? error.message : '구독에 실패했습니다.';
    return rejectWithValue(message);
  }
});

/**
 * 크리에이터 구독 취소
 */
export const unsubscribeFromCreator = createAsyncThunk<
  string, // creatorId 반환
  string, // creatorId 파라미터
  { rejectValue: string }
>('creator/unsubscribe', async (creatorId, { rejectWithValue }) => {
  try {
    await creatorService.unsubscribeFromCreator(creatorId);
    return creatorId;
  } catch (error) {
    const message = error instanceof Error ? error.message : '구독 취소에 실패했습니다.';
    return rejectWithValue(message);
  }
});

const creatorSlice = createSlice({
  name: 'creator',
  initialState,
  reducers: {
    setSelectedCreator: (state, action: PayloadAction<Creator | null>) => {
      state.selectedCreator = action.payload;
    },
    setFilters: (state, action: PayloadAction<CreatorFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreators.fulfilled, (state, action) => {
        state.loading = false;
        state.creators = action.payload.creators;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCreators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyCreator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCreator.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyCreator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 구독 액션 처리
      .addCase(subscribeToCreator.pending, (state) => {
        state.subscribing = true;
        state.subscribeError = null;
      })
      .addCase(subscribeToCreator.fulfilled, (state, action) => {
        state.subscribing = false;
        const creator = state.creators.find((c) => c.id === action.payload);
        if (creator) {
          creator.isSubscribed = true;
        }
      })
      .addCase(subscribeToCreator.rejected, (state, action) => {
        state.subscribing = false;
        state.subscribeError = action.payload as string;
      })
      // 구독 취소 액션 처리
      .addCase(unsubscribeFromCreator.pending, (state) => {
        state.subscribing = true;
        state.subscribeError = null;
      })
      .addCase(unsubscribeFromCreator.fulfilled, (state, action) => {
        state.subscribing = false;
        const creator = state.creators.find((c) => c.id === action.payload);
        if (creator) {
          creator.isSubscribed = false;
        }
      })
      .addCase(unsubscribeFromCreator.rejected, (state, action) => {
        state.subscribing = false;
        state.subscribeError = action.payload as string;
      });
  },
});

export const { setSelectedCreator, setFilters, setCurrentPage, clearError } = creatorSlice.actions;
export default creatorSlice.reducer;