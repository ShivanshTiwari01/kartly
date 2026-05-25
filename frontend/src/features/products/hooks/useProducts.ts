import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';
import { queryKeys } from '@/lib/query/queryKeys';
import type { ProductFilters } from '@/types/product.types';

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters as Record<string, unknown>),
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 5 * 60 * 1000,
  });
};
