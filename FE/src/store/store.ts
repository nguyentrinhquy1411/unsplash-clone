import { configureStore } from "@reduxjs/toolkit";
import photosReducer from "./photosSlice";

export const store = configureStore({
  reducer: {
    photos: photosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
