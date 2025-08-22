import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Content {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  url: string;
  platform: string;
  creatorId: string;
  creatorName: string;
  isApproved: boolean;
  isActive: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentFilters {
  search?: string;
  platform?: string;
  creatorId?: string;
  isApproved?: boolean;
  isActive?: boolean;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ContentState {
  contents: Content[];
  selectedContent: Content | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  filters: ContentFilters;
}

const initialState: ContentState = {
  contents: [],
  selectedContent: null,
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

export const fetchContents = createAsyncThunk<
  { contents: Content[]; pagination: PaginationState },
  { page?: number; filters?: ContentFilters },
  { rejectValue: string }
>(
  'content/fetchContents',
  async ({ page = 1, filters: _filters = {} }, { rejectWithValue }) => {
    try {
      // TODO: API 호출 구현
      return {
        contents: [],
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : '콘텐츠 조회 실패';
      return rejectWithValue(message);
    }
  }
);

export const approveContent = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'content/approveContent',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      // TODO: API 호출 구현
      dispatch(fetchContents({}));
    } catch (error) {
      const message = error instanceof Error ? error.message : '콘텐츠 승인 실패';
      return rejectWithValue(message);
    }
  }
);

export const deleteContent = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'content/deleteContent',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      // TODO: API 호출 구현
      dispatch(fetchContents({}));
    } catch (error) {
      const message = error instanceof Error ? error.message : '콘텐츠 삭제 실패';
      return rejectWithValue(message);
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSelectedContent: (state, action: PayloadAction<Content | null>) => {
      state.selectedContent = action.payload;
    },
    setFilters: (state, action: PayloadAction<ContentFilters>) => {
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
      .addCase(fetchContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        state.loading = false;
        state.contents = action.payload.contents;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(approveContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveContent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approveContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedContent, setFilters, setCurrentPage, clearError } = contentSlice.actions;
export default contentSlice.reducer;