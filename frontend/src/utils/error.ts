import type { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    return error.message;
  }
  return 'An unexpected error occurred';
};
