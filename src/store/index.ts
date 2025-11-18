import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import creatorSlice from './slices/creatorSlice';
import creatorRegistrationSlice from './slices/creatorRegistrationSlice';
import contentSlice from './slices/contentSlice';
import platformSlice from './slices/platformSlice';
import syncSlice from './slices/syncSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    creator: creatorSlice,
    creatorRegistration: creatorRegistrationSlice,
    content: contentSlice,
    platform: platformSlice,
    sync: syncSlice,
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