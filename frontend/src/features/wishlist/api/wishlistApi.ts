import { apiClient } from '@/lib/axios/client';
import type { WishlistItem } from '@/types/wishlist.types';
import type { ApiResponse } from '@/types/api.types';

export const wishlistApi = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response =
      await apiClient.get<ApiResponse<WishlistItem[]>>('/wishlist');
    return response.data.data;
  },

  addItem: async (productId: string): Promise<WishlistItem> => {
    const response = await apiClient.post<ApiResponse<WishlistItem>>(
      '/wishlist',
      { productId },
    );
    return response.data.data;
  },

  removeItem: async (productId: string): Promise<void> => {
    await apiClient.delete(`/wishlist/${productId}`);
  },
};
