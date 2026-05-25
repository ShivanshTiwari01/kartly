import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wishlistApi } from '../api/wishlistApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { getErrorMessage } from '@utils/error';
import { useAppSelector } from '@store/hooks';
import type { WishlistItem } from '@/types/wishlist.types';

export const useWishlist = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return useQuery({
    queryKey: queryKeys.wishlist.all,
    queryFn: wishlistApi.getWishlist,
    enabled: isAuthenticated,
    initialData: [] as WishlistItem[],
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.addItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      toast.success('Added to wishlist!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.removeItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      toast.success('Removed from wishlist');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
