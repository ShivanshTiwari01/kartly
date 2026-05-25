import { apiClient } from '@/lib/axios/client';
import type { Order, CreateOrderRequest } from '@/types/order.types';
import type { ApiResponse } from '@/types/api.types';

export const ordersApi = {
  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
    return response.data.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    return response.data.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(
      `/orders/${id}/cancel`,
    );
    return response.data.data;
  },
};
