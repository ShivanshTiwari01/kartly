import { apiClient } from '@/lib/axios/client';
import type {
  UserProfile,
  UserAddress,
  UpdateProfileRequest,
  CreateAddressRequest,
} from '@/types/user.types';
import type { ApiResponse } from '@/types/api.types';

interface MeResponse {
  user: { _id: string; email: string; username: string; role: string };
  profile: UserProfile | null;
}

export const userApi = {
  getMe: async (): Promise<MeResponse> => {
    const response = await apiClient.get<ApiResponse<MeResponse>>('/users/me');
    return response.data.data;
  },

  updateMe: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      '/users/me',
      data,
    );
    return response.data.data;
  },

  getAddresses: async (): Promise<UserAddress[]> => {
    const response = await apiClient.get<ApiResponse<UserAddress[]>>(
      '/users/me/addresses',
    );
    return response.data.data;
  },

  createAddress: async (data: CreateAddressRequest): Promise<UserAddress> => {
    const response = await apiClient.post<ApiResponse<UserAddress>>(
      '/users/me/addresses',
      data,
    );
    return response.data.data;
  },

  updateAddress: async (
    id: string,
    data: Partial<CreateAddressRequest>,
  ): Promise<UserAddress> => {
    const response = await apiClient.put<ApiResponse<UserAddress>>(
      `/users/me/addresses/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/me/addresses/${id}`);
  },
};
