import MainLayout from '@components/layout/MainLayout';
import { CartItem } from '@/features/cart/components/CartItem';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { EmptyCart } from '@/features/cart/components/EmptyCart';
import { Skeleton } from '@/components/ui/Skeleton';
import { Separator } from '@components/ui/Separator';
import { useCart } from '@/features/cart/hooks/useCart';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

export default function CartPage() {
  useDocumentTitle('Your Cart');
  const { data: cart, isLoading } = useCart();

  const items = cart?.items ?? [];
  const hasItems = items.length > 0;

  if (isLoading) {
    return (
      <MainLayout>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
          <Skeleton className='h-8 w-48 mb-6' />
          <div className='grid gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2 space-y-4'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='h-28 w-full' />
              ))}
            </div>
            <Skeleton className='h-64 w-full' />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
        <h1 className='mb-6 text-3xl font-black uppercase tracking-tight'>
          Your Bag
        </h1>
        {!hasItems ? (
          <EmptyCart />
        ) : (
          <div className='grid gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              <div className='divide-y divide-border'>
                {items.map((item, i) => (
                  <CartItem key={item._id} item={item} index={i} />
                ))}
              </div>
              <Separator className='mt-4' />
            </div>
            <CartSummary
              totalAmount={cart?.totalAmount ?? 0}
              itemCount={items.length}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
