import axios from 'axios';
import { env } from '@/config/env';
import { setupInterceptors } from './interceptors';

export const apiClient = axios.create({
  baseURL: `${env.API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(apiClient);
