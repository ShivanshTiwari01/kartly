import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categoriesApi';
import { queryKeys } from '@/lib/query/queryKeys';

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: categoriesApi.getCategories,
    staleTime: 30 * 60 * 1000,
    initialData: [],
  });
};
