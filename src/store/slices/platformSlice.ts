import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Platform {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  isActive: boolean;
  description?: string;
  apiConfig?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface PlatformState {
  platforms: Platform[];
  selectedPlatform: Platform | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlatformState = {
  platforms: [],
  selectedPlatform: null,
  loading: false,
  error: null,
};

export const fetchPlatforms = createAsyncThunk<
  Platform[],
  void,
  { rejectValue: string }
>(
  'platform/fetchPlatforms',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: API 호출 구현
      return [];
    } catch (error) {
      const message = error instanceof Error ? error.message : '플랫폼 조회 실패';
      return rejectWithValue(message);
    }
  }
);

export const createPlatform = createAsyncThunk<
  void,
  { name: string; displayName: string; icon: string; color: string; description?: string },
  { rejectValue: string }
>(
  'platform/createPlatform',
  async (platformData, { rejectWithValue, dispatch }) => {
    try {
      // TODO: API 호출 구현
      dispatch(fetchPlatforms());
    } catch (error) {
      const message = error instanceof Error ? error.message : '플랫폼 생성 실패';
      return rejectWithValue(message);
    }
  }
);

export const updatePlatform = createAsyncThunk<
  void,
  { id: string; data: Partial<Platform> },
  { rejectValue: string }
>(
  'platform/updatePlatform',
  async ({ id: _id, data: _data }, { rejectWithValue, dispatch }) => {
    try {
      // TODO: API 호출 구현
      dispatch(fetchPlatforms());
    } catch (error) {
      const message = error instanceof Error ? error.message : '플랫폼 수정 실패';
      return rejectWithValue(message);
    }
  }
);

export const deletePlatform = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'platform/deletePlatform',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      // TODO: API 호출 구현
      dispatch(fetchPlatforms());
    } catch (error) {
      const message = error instanceof Error ? error.message : '플랫폼 삭제 실패';
      return rejectWithValue(message);
    }
  }
);

const platformSlice = createSlice({
  name: 'platform',
  initialState,
  reducers: {
    setSelectedPlatform: (state, action: PayloadAction<Platform | null>) => {
      state.selectedPlatform = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatforms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.loading = false;
        state.platforms = action.payload;
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlatform.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPlatform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlatform.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePlatform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlatform.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePlatform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedPlatform, clearError } = platformSlice.actions;
export default platformSlice.reducer;