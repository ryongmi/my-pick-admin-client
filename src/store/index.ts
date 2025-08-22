import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import creatorSlice from './slices/creatorSlice';
import contentSlice from './slices/contentSlice';
import platformSlice from './slices/platformSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    creator: creatorSlice,
    content: contentSlice,
    platform: platformSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;