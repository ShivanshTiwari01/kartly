import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cartApi } from '../api/cartApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { getErrorMessage } from '@utils/error';
import { useAppSelector } from '@store/hooks';

export const useCart = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      toast.success('Added to cart!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { quantity: number } }) =>
      cartApi.updateItem(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      toast.success('Removed from cart');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
