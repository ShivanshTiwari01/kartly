export interface AuthUser {
  _id: string;
  email: string;
  username: string;
  mobile?: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  mobile?: string;
}
