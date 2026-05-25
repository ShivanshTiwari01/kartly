import { useCategories } from '@/features/catalog/hooks/useCategories';
import { Separator } from '@components/ui/Separator';
import type { ProductFilters as Filters } from '@/types/product.types';

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (
    key: keyof Filters,
    value: string | number | undefined,
  ) => void;
  onReset: () => void;
}

export const ProductFilters = ({
  filters,
  onFilterChange,
  onReset,
}: ProductFiltersProps) => {
  const { data: categories } = useCategories();

  return (
    <aside className='w-64 shrink-0'>
      <div className='sticky top-24 flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-bold uppercase tracking-widest'>
            Filters
          </h3>
          <button
            onClick={onReset}
            className='text-xs text-text-muted underline hover:text-primary'
          >
            Clear all
          </button>
        </div>

        {/* Category */}
        <div>
          <h4 className='mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted'>
            Category
          </h4>
          <ul className='space-y-2'>
            <li>
              <label className='flex cursor-pointer items-center gap-2'>
                <input
                  type='radio'
                  name='category'
                  value=''
                  checked={!filters.category}
                  onChange={() => onFilterChange('category', undefined)}
                  className='accent-primary'
                />
                <span className='text-sm'>All</span>
              </label>
            </li>
            {categories.map((cat) => (
              <li key={cat._id}>
                <label className='flex cursor-pointer items-center gap-2'>
                  <input
                    type='radio'
                    name='category'
                    value={cat._id}
                    checked={filters.category === cat._id}
                    onChange={() => onFilterChange('category', cat._id)}
                    className='accent-primary'
                  />
                  <span className='text-sm capitalize'>{cat.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Price range */}
        <div>
          <h4 className='mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted'>
            Price
          </h4>
          <div className='flex items-center gap-2'>
            <input
              type='number'
              placeholder='Min'
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onFilterChange(
                  'minPrice',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className='h-9 w-full rounded border border-border px-2 text-sm focus:border-primary focus:outline-none'
            />
            <span className='text-text-muted'>–</span>
            <input
              type='number'
              placeholder='Max'
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onFilterChange(
                  'maxPrice',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className='h-9 w-full rounded border border-border px-2 text-sm focus:border-primary focus:outline-none'
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
