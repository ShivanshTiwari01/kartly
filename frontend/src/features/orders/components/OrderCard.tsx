import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { Badge } from '@components/ui/Badge';
import { formatCurrency } from '@utils/formatCurrency';
import { formatDateShort } from '@utils/formatDate';
import type { Order, OrderStatus } from '@/types/order.types';

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

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => (
  <Link
    to={ROUTES.ORDER_DETAIL.replace(':id', order._id)}
    className='flex items-center justify-between gap-4 rounded border border-border bg-white p-4 hover:border-primary transition-colors'
  >
    <div className='flex items-center gap-3'>
      <div className='flex h-10 w-10 items-center justify-center rounded bg-muted'>
        <Package className='h-5 w-5 text-text-muted' />
      </div>
      <div>
        <p className='text-xs font-mono text-text-muted'>
          #{order._id.slice(-8).toUpperCase()}
        </p>
        <p className='text-sm font-semibold text-text'>
          {formatCurrency(order.totalAmount)}
        </p>
      </div>
    </div>
    <div className='flex flex-col items-end gap-1'>
      <Badge variant={statusVariant[order.status]} className='capitalize'>
        {order.status}
      </Badge>
      <span className='text-xs text-text-muted'>
        {formatDateShort(order.createdAt)}
      </span>
    </div>
  </Link>
);
