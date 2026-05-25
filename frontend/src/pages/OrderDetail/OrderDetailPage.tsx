import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import MainLayout from '@components/layout/MainLayout';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ordersApi } from '@/features/orders/api/ordersApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { formatCurrency } from '@utils/formatCurrency';
import { formatDate } from '@utils/formatDate';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { ROUTES } from '@/config/routes.config';
import { ArrowLeft, Package } from 'lucide-react';
import type { OrderStatus } from '@/types/order.types';

const statusVariant: Record<
  OrderStatus,
  'default' | 'success' | 'warning' | 'error'
> = {
  pending: 'warning',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'error',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  useDocumentTitle('Order Details');
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.orders.detail(id ?? ''),
    queryFn: () => ordersApi.getOrder(id ?? ''),
    enabled: !!id,
  });

  const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: () => ordersApi.cancelOrder(id ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Order cancelled');
    },
    onError: () => toast.error('Cannot cancel this order'),
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6'>
          <Skeleton className='h-8 w-48 mb-6' />
          <Skeleton className='h-64 w-full' />
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className='flex flex-col items-center justify-center gap-4 py-24'>
          <Package className='h-16 w-16 text-gray-300' />
          <h2 className='text-2xl font-black uppercase'>Order not found</h2>
          <Link to={ROUTES.ORDERS}>
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const canCancel = order.status === 'pending' || order.status === 'processing';

  return (
    <MainLayout>
      <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6'>
        <Link
          to={ROUTES.ORDERS}
          className='mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary'
        >
          <ArrowLeft className='h-4 w-4' /> Back to Orders
        </Link>

        <div className='flex items-start justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-2xl font-black uppercase'>
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className='text-sm text-text-muted'>
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge
            variant={statusVariant[order.status]}
            className='capitalize text-sm px-3 py-1'
          >
            {order.status}
          </Badge>
        </div>

        {/* Items */}
        <div className='rounded border border-border'>
          <div className='px-5 py-4 border-b border-border'>
            <h2 className='text-sm font-bold uppercase tracking-widest'>
              Items
            </h2>
          </div>
          <div className='divide-y divide-border'>
            {(order.items ?? []).map((item) => (
              <div
                key={item._id}
                className='flex items-center justify-between px-5 py-3 text-sm'
              >
                <div>
                  <p className='font-medium'>{item.productName}</p>
                  <p className='text-text-muted'>Qty: {item.quantity}</p>
                </div>
                <p className='font-medium'>
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className='px-5 py-4 border-t border-border flex justify-between font-bold'>
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Details */}
        <div className='mt-4 grid gap-4 sm:grid-cols-2'>
          <div className='rounded border border-border p-4'>
            <h3 className='mb-2 text-xs font-bold uppercase tracking-widest text-text-muted'>
              Payment
            </h3>
            <p className='text-sm capitalize'>{order.paymentMethod}</p>
            <Badge
              variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}
              className='mt-1 capitalize'
            >
              {order.paymentStatus}
            </Badge>
          </div>
        </div>

        {canCancel && (
          <div className='mt-6'>
            <Button
              variant='danger'
              onClick={() => cancel()}
              isLoading={cancelling}
            >
              Cancel Order
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
