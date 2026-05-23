import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { listenerMiddleware } from './listeners';
import { customMiddleware } from './middleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(customMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
