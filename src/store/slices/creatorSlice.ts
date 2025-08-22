import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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
      });
  },
});

export const { setSelectedCreator, setFilters, setCurrentPage, clearError } = creatorSlice.actions;
export default creatorSlice.reducer;