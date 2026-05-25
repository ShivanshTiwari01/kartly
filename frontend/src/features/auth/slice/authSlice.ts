import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, AuthState } from '@/types/auth.types';
import { storage } from '@utils/storage';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@utils/constants';

const initialState: AuthState = {
  user: storage.get<AuthUser>(AUTH_USER_KEY),
  accessToken: storage.get<string>(AUTH_TOKEN_KEY),
  isAuthenticated: !!storage.get<string>(AUTH_TOKEN_KEY),
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      storage.set(AUTH_TOKEN_KEY, action.payload.accessToken);
      storage.set(AUTH_USER_KEY, action.payload.user);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      storage.remove(AUTH_TOKEN_KEY);
      storage.remove(AUTH_USER_KEY);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export const authReducer = authSlice.reducer;
