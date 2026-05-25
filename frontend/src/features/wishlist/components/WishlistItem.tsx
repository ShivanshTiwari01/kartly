import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { useRemoveFromWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { formatCurrency } from '@utils/formatCurrency';
import type { WishlistItem as WishlistItemType } from '@/types/wishlist.types';
import type { Product } from '@/types/product.types';

const FALLBACK_IMAGES = [
  '/shoes/shoe-11.avif',
  '/shoes/shoe-12.avif',
  '/shoes/shoe-13.avif',
];

interface WishlistItemProps {
  item: WishlistItemType;
  index?: number;
}

export const WishlistItemCard = ({ item, index = 0 }: WishlistItemProps) => {
  const product =
    typeof item.productId === 'object' ? (item.productId as Product) : null;
  const { mutate: remove, isPending: removing } = useRemoveFromWishlist();
  const { mutate: addToCart } = useAddToCart();

  const productId =
    product?._id ?? (typeof item.productId === 'string' ? item.productId : '');
  const price =
    product?.details?.discountedPrice ?? product?.details?.price ?? 0;
  const image =
    product?.details?.images?.[0] ??
    FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return (
    <div className='group relative flex flex-col overflow-hidden bg-white'>
      <Link
        to={ROUTES.PRODUCT_DETAIL.replace(':id', productId)}
        className='block overflow-hidden'
      >
        <img
          src={image}
          alt={product?.name ?? 'Product'}
          className='aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 bg-muted'
        />
      </Link>
      <div className='p-3'>
        <Link
          to={ROUTES.PRODUCT_DETAIL.replace(':id', productId)}
          className='text-sm font-semibold text-text line-clamp-1 hover:underline'
        >
          {product?.name ?? 'Product'}
        </Link>
        <p className='mt-1 text-sm font-bold'>{formatCurrency(price)}</p>
        <div className='mt-3 flex gap-2'>
          <button
            onClick={() => addToCart({ productId, quantity: 1 })}
            className='flex h-9 flex-1 items-center justify-center gap-1.5 rounded bg-primary text-xs font-bold uppercase text-white hover:bg-primary-light transition-colors'
          >
            <ShoppingBag className='h-3.5 w-3.5' /> Add to Cart
          </button>
          <button
            onClick={() => remove(productId)}
            disabled={removing}
            className='flex h-9 w-9 items-center justify-center rounded border border-border hover:bg-muted hover:text-red-500 transition-colors'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
};
