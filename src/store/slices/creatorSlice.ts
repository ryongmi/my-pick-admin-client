import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { creatorService } from '@/services/creatorService';
import type { Creator, CreatorSearchParams, CreatorDetail } from '@/types/creator';
import type { LimitType } from '@krgeobuk/core/enum';

interface CreatorState {
  creators: Creator[];
  selectedCreator: CreatorDetail | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  pageInfo: {
    totalItems: number;
    page: number;
    limit: LimitType;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  filters: CreatorSearchParams;
}

const initialState: CreatorState = {
  creators: [],
  selectedCreator: null,
  loading: false,
  detailLoading: false,
  error: null,
  pageInfo: {
    totalItems: 0,
    page: 1,
    limit: 30,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  filters: {
    page: 1,
    limit: 30,
  },
};

// 크리에이터 목록 조회
export const fetchCreators = createAsyncThunk(
  'creator/fetchCreators',
  async (params: CreatorSearchParams | undefined, { rejectWithValue }) => {
    try {
      return await creatorService.getCreators(params);
    } catch (error) {
      const message = error instanceof Error ? error.message : '크리에이터 목록 조회 실패';
      return rejectWithValue(message);
    }
  }
);

// 크리에이터 상세 조회
export const fetchCreatorById = createAsyncThunk<
  CreatorDetail,
  string,
  { rejectValue: string }
>(
  'creator/fetchCreatorById',
  async (id, { rejectWithValue }) => {
    try {
      return await creatorService.getCreatorById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : '크리에이터 조회 실패';
      return rejectWithValue(message);
    }
  }
);

// fetchCreatorPlatforms는 제거됨 - GET /creators/:id가 이미 platforms 포함

const creatorSlice = createSlice({
  name: 'creator',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CreatorSearchParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 30,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 크리에이터 목록 조회
      .addCase(fetchCreators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreators.fulfilled, (state, action) => {
        state.loading = false;
        state.creators = action.payload.items;
        state.pageInfo = action.payload.pageInfo;
      })
      .addCase(fetchCreators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 크리에이터 상세 조회
      .addCase(fetchCreatorById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchCreatorById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedCreator = action.payload;
      })
      .addCase(fetchCreatorById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearError } = creatorSlice.actions;
export default creatorSlice.reducer;
