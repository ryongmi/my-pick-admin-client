import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: Array<{ id: string; name: string }>;
}

interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

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
    itemsPerPage: 10,
  },
  filters: {},
};

export const fetchUsers = createAsyncThunk<
  { users: User[]; pagination: PaginationState },
  { page?: number; filters?: UserFilters },
  { rejectValue: string }
>(
  'user/fetchUsers',
  async ({ page = 1, filters: _filters = {} }, { rejectWithValue }) => {
    try {
      // TODO: API 호출 구현
      return {
        users: [],
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : '사용자 조회 실패';
      return rejectWithValue(message);
    }
  }
);

export const createUser = createAsyncThunk<
  void,
  { email: string; name: string; password: string },
  { rejectValue: string }
>(
  'user/createUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      // TODO: API 호출 구현
      dispatch(fetchUsers({}));
    } catch (error) {
      const message = error instanceof Error ? error.message : '사용자 생성 실패';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk<
  void,
  { id: string; data: Partial<User> },
  { rejectValue: string }
>(
  'user/updateUser',
  async ({ id: _id, data: _data }, { rejectWithValue, dispatch }) => {
    try {
      // TODO: API 호출 구현
      dispatch(fetchUsers({}));
    } catch (error) {
      const message = error instanceof Error ? error.message : '사용자 수정 실패';
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'user/deleteUser',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      // TODO: API 호출 구현
      dispatch(fetchUsers({}));
    } catch (error) {
      const message = error instanceof Error ? error.message : '사용자 삭제 실패';
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setFilters: (state, action: PayloadAction<UserFilters>) => {
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedUser, setFilters, setCurrentPage, clearError } = userSlice.actions;
export default userSlice.reducer;