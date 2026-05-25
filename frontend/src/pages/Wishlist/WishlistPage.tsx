import MainLayout from '@components/layout/MainLayout';
import { WishlistItemCard } from '@/features/wishlist/components/WishlistItem';
import { EmptyWishlist } from '@/features/wishlist/components/EmptyWishlist';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

export default function WishlistPage() {
  useDocumentTitle('My Wishlist');
  const { data: wishlist = [], isLoading } = useWishlist();

  return (
    <MainLayout>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
        <h1 className='mb-6 text-3xl font-black uppercase tracking-tight'>
          Wishlist
        </h1>
        {isLoading ? (
          <div className='grid grid-cols-2 gap-px bg-border md:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='bg-white'>
                <Skeleton className='aspect-square w-full rounded-none' />
                <div className='p-3 space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-16' />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className='grid grid-cols-2 gap-px bg-border md:grid-cols-4'>
            {wishlist.map((item, i) => (
              <div key={item._id} className='bg-white'>
                <WishlistItemCard item={item} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
