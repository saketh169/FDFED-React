import { configureStore } from '@reduxjs/toolkit';
import adminSlice from './slices/adminSlice';
import analyticsSlice from './slices/analyticsSlice';
import blogSlice from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    admin: adminSlice,
    analytics: analyticsSlice,
    blog: blogSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});