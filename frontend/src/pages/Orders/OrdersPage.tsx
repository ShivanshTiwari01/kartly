import { useQuery } from '@tanstack/react-query';
import MainLayout from '@components/layout/MainLayout';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@components/common/EmptyState';
import { ordersApi } from '@/features/orders/api/ordersApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { Button } from '@components/ui/Button';

export default function OrdersPage() {
  useDocumentTitle('My Orders');
  const { data: orders = [], isLoading } = useQuery({
    queryKey: queryKeys.orders.lists(),
    queryFn: ordersApi.getOrders,
  });

  return (
    <MainLayout>
      <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6'>
        <h1 className='mb-6 text-3xl font-black uppercase tracking-tight'>
          My Orders
        </h1>
        {isLoading ? (
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-20 w-full' />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Package className='h-16 w-16' />}
            title='No orders yet'
            description='When you place an order, it will appear here.'
            action={
              <Link to={ROUTES.PRODUCTS}>
                <Button>Start Shopping</Button>
              </Link>
            }
          />
        ) : (
          <div className='space-y-3'>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
