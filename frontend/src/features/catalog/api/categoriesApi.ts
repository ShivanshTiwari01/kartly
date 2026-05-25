import { apiClient } from '@/lib/axios/client';
import type { Category } from '@/types/category.types';
import type { ApiResponse } from '@/types/api.types';

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response =
      await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      `/categories/${id}`,
    );
    return response.data.data;
  },
};
