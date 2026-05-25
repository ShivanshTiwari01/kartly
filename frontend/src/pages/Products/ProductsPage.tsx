import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/common/EmptyState';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { useDebounce } from '@hooks/useDebounce';
import type { ProductFilters as Filters } from '@/types/product.types';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  useDocumentTitle('Products');
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get('category') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    page: 1,
    limit: 12,
  });
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading } = useProducts(activeFilters);
  const products = data?.data ?? [];
  const pagination = data?.pagination;

  const updateFilter = (
    key: keyof Filters,
    value: string | number | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({ page: 1, limit: 12 });
    setSearchInput('');
  };

  return (
    <MainLayout>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
        {/* Header */}
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-black uppercase tracking-tight'>
              All Products
            </h1>
            {pagination && (
              <p className='mt-1 text-sm text-text-muted'>
                {pagination.total} products
              </p>
            )}
          </div>
          <div className='flex items-center gap-3'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted' />
              <input
                type='text'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder='Search products...'
                className='h-10 w-56 rounded border border-border pl-9 pr-3 text-sm focus:border-primary focus:outline-none'
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text'
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              )}
            </div>
            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className='flex h-10 items-center gap-2 rounded border border-border px-4 text-sm font-medium hover:bg-muted lg:hidden'
            >
              <SlidersHorizontal className='h-4 w-4' />
              Filters
            </button>
          </div>
        </div>

        <div className='flex gap-8'>
          {/* Sidebar filters - desktop */}
          <div className='hidden lg:block'>
            <ProductFilters
              filters={activeFilters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
            />
          </div>

          {/* Mobile filter overlay */}
          {showFilters && (
            <div className='fixed inset-0 z-50 flex lg:hidden'>
              <div
                className='absolute inset-0 bg-black/50'
                onClick={() => setShowFilters(false)}
              />
              <div className='relative ml-auto h-full w-72 overflow-y-auto bg-white p-6 shadow-xl'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='font-bold uppercase tracking-widest text-sm'>
                    Filters
                  </h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className='h-5 w-5' />
                  </button>
                </div>
                <ProductFilters
                  filters={activeFilters}
                  onFilterChange={(k, v) => {
                    updateFilter(k, v);
                  }}
                  onReset={() => {
                    resetFilters();
                    setShowFilters(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Products */}
          <div className='flex-1'>
            {!isLoading && products.length === 0 ? (
              <EmptyState
                title='No products found'
                description='Try adjusting your filters or search term.'
                action={
                  <button
                    onClick={resetFilters}
                    className='text-sm font-semibold text-primary underline'
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <>
                <ProductGrid
                  products={products}
                  isLoading={isLoading}
                  columns={3}
                />
                {pagination && pagination.totalPages > 1 && (
                  <div className='mt-8 flex justify-center'>
                    <Pagination
                      page={filters.page ?? 1}
                      totalPages={pagination.totalPages}
                      onPageChange={(p) =>
                        setFilters((prev) => ({ ...prev, page: p }))
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
