import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { storage } from '@utils/storage';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@utils/constants';

export const setupInterceptors = (client: AxiosInstance): void => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = storage.get<string>(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        storage.remove(AUTH_TOKEN_KEY);
        storage.remove(AUTH_USER_KEY);
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login')
        ) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    },
  );
};
