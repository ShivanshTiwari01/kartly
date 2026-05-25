import { apiClient } from '@/lib/axios/client';
import type { Product, ProductFilters } from '@/types/product.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const productsApi = {
  getProducts: async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice !== undefined)
      params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined)
      params.set('maxPrice', String(filters.maxPrice));
    if (filters.search) params.set('search', filters.search);
    const response = await apiClient.get<PaginatedResponse<Product[]>>(
      `/products?${params.toString()}`,
    );
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`,
    );
    return response.data.data;
  },
};
