import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';
import { queryKeys } from '@/lib/query/queryKeys';

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
};
