import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import {
  useUpdateCartItem,
  useRemoveFromCart,
} from '@/features/cart/hooks/useCart';
import { QuantitySelector } from '@/features/products/components/QuantitySelector';
import { formatCurrency } from '@utils/formatCurrency';
import type { CartItem as CartItemType } from '@/types/cart.types';
import type { Product } from '@/types/product.types';

const FALLBACK_IMAGES = [
  '/shoes/shoe-5.avif',
  '/shoes/shoe-6.avif',
  '/shoes/shoe-7.avif',
];

interface CartItemProps {
  item: CartItemType;
  index?: number;
}

export const CartItem = ({ item, index = 0 }: CartItemProps) => {
  const product =
    typeof item.productId === 'object' ? (item.productId as Product) : null;
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem, isPending: removing } = useRemoveFromCart();

  const price =
    product?.details?.discountedPrice ?? product?.details?.price ?? 0;
  const image =
    product?.details?.images?.[0] ??
    FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const productId =
    product?._id ?? (typeof item.productId === 'string' ? item.productId : '');

  return (
    <div className='flex gap-4 py-4'>
      <Link
        to={ROUTES.PRODUCT_DETAIL.replace(':id', productId)}
        className='shrink-0'
      >
        <img
          src={image}
          alt={product?.name ?? 'Product'}
          className='h-24 w-24 rounded object-cover bg-muted'
        />
      </Link>
      <div className='flex flex-1 flex-col justify-between'>
        <div className='flex items-start justify-between gap-2'>
          <div>
            <Link
              to={ROUTES.PRODUCT_DETAIL.replace(':id', productId)}
              className='text-sm font-semibold text-text hover:underline line-clamp-2'
            >
              {product?.name ?? 'Product'}
            </Link>
          </div>
          <button
            onClick={() => removeItem(item._id)}
            disabled={removing}
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-muted text-text-muted hover:text-red-500 transition-colors'
            aria-label='Remove'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </div>
        <div className='flex items-center justify-between'>
          <QuantitySelector
            value={item.quantity}
            max={product?.details?.stock ?? 10}
            onChange={(qty) =>
              updateItem({ id: item._id, data: { quantity: qty } })
            }
          />
          <span className='text-sm font-bold text-text'>
            {formatCurrency(price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};
