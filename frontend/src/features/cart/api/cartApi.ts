import { apiClient } from '@/lib/axios/client';
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@/types/cart.types';
import type { ApiResponse } from '@/types/api.types';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  addItem: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>(
      '/cart/items',
      data,
    );
    return response.data.data;
  },

  updateItem: async (
    id: string,
    data: UpdateCartItemRequest,
  ): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(
      `/cart/items/${id}`,
      data,
    );
    return response.data.data;
  },

  removeItem: async (id: string): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>(
      `/cart/items/${id}`,
    );
    return response.data.data;
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },
};
