import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { creatorRegistrationService } from '@/services/creatorRegistrationService';
import type {
  CreatorRegistration,
  RegistrationSearchParams,
  RegistrationStats,
  ReviewRegistrationRequest,
} from '@/types/creatorRegistration';

interface CreatorRegistrationState {
  registrations: CreatorRegistration[];
  selectedRegistration: CreatorRegistration | null;
  stats: RegistrationStats | null;
  loading: boolean;
  error: string | null;
  total: number;
  filters: RegistrationSearchParams;
}

const initialState: CreatorRegistrationState = {
  registrations: [],
  selectedRegistration: null,
  stats: null,
  loading: false,
  error: null,
  total: 0,
  filters: {
    limit: 20,
    offset: 0,
  },
};

// 신청 목록 조회
export const fetchRegistrations = createAsyncThunk(
  'creatorRegistration/fetchRegistrations',
  async (params: RegistrationSearchParams | undefined, { rejectWithValue }) => {
    try {
      return await creatorRegistrationService.getRegistrations(params);
    } catch (error) {
      const message = error instanceof Error ? error.message : '신청 목록 조회 실패';
      return rejectWithValue(message);
    }
  }
);

// 신청 통계 조회
export const fetchRegistrationStats = createAsyncThunk(
  'creatorRegistration/fetchRegistrationStats',
  async (_, { rejectWithValue }) => {
    try {
      return await creatorRegistrationService.getRegistrationStats();
    } catch (error) {
      const message = error instanceof Error ? error.message : '신청 통계 조회 실패';
      return rejectWithValue(message);
    }
  }
);

// 신청 상세 조회
export const fetchRegistrationById = createAsyncThunk<
  CreatorRegistration,
  string,
  { rejectValue: string }
>(
  'creatorRegistration/fetchRegistrationById',
  async (id, { rejectWithValue }) => {
    try {
      return await creatorRegistrationService.getRegistrationById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : '신청 상세 조회 실패';
      return rejectWithValue(message);
    }
  }
);

// 신청 검토 (승인/거부)
export const reviewRegistration = createAsyncThunk<
  void,
  { id: string; reviewData: ReviewRegistrationRequest },
  { rejectValue: string }
>(
  'creatorRegistration/reviewRegistration',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      await creatorRegistrationService.reviewRegistration(id, reviewData);
    } catch (error) {
      const message = error instanceof Error ? error.message : '신청 검토 실패';
      return rejectWithValue(message);
    }
  }
);

const creatorRegistrationSlice = createSlice({
  name: 'creatorRegistration',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<RegistrationSearchParams>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        limit: 20,
        offset: 0,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedRegistration: (state) => {
      state.selectedRegistration = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 신청 목록 조회
      .addCase(fetchRegistrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegistrations.fulfilled, (state, action) => {
        state.loading = false;
        state.registrations = action.payload.registrations;
        state.total = action.payload.total;
      })
      .addCase(fetchRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 신청 통계 조회
      .addCase(fetchRegistrationStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchRegistrationStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchRegistrationStats.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // 신청 상세 조회
      .addCase(fetchRegistrationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegistrationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRegistration = action.payload;
      })
      .addCase(fetchRegistrationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 신청 검토
      .addCase(reviewRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewRegistration.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(reviewRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearSelectedRegistration } = creatorRegistrationSlice.actions;
export default creatorRegistrationSlice.reducer;
