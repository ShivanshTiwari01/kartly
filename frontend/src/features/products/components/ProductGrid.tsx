import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Product } from '@/types/product.types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

const colClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export const ProductGrid = ({
  products,
  isLoading = false,
  columns = 4,
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className={`grid ${colClasses[columns]} gap-px bg-border`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='bg-white'>
            <Skeleton className='aspect-square w-full rounded-none' />
            <div className='p-3 space-y-2'>
              <Skeleton className='h-3 w-20' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-16' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${colClasses[columns]} gap-px bg-border`}>
      {products.map((product, i) => (
        <div key={product._id} className='bg-white'>
          <ProductCard product={product} index={i} />
        </div>
      ))}
    </div>
  );
};
