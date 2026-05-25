import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { useAppSelector } from '@store/hooks';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from '@/features/wishlist/hooks/useWishlist';
import { formatCurrency } from '@utils/formatCurrency';
import { cn } from '@utils/cn';
import type { Product } from '@/types/product.types';

const FALLBACK_IMAGES = [
  '/shoes/shoe-5.avif',
  '/shoes/shoe-6.avif',
  '/shoes/shoe-7.avif',
  '/shoes/shoe-8.avif',
  '/shoes/shoe-9.avif',
  '/shoes/shoe-10.avif',
];

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: wishlist = [] } = useWishlist();
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const details = product.details;
  const price = details?.price ?? 0;
  const discountedPrice = details?.discountedPrice;
  const images = details?.images?.length
    ? details.images
    : [FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]];
  const rating = details?.rating ?? 0;
  const inStock = (details?.stock ?? 0) > 0;

  const isWishlisted = wishlist.some((w) => {
    const pid = typeof w.productId === 'string' ? w.productId : w.productId._id;
    return pid === product._id;
  });

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !inStock) return;
    addToCart({ productId: product._id, quantity: 1 });
  };

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL.replace(':id', product._id)}
      className='group relative flex flex-col overflow-hidden bg-white'
    >
      {/* Image */}
      <div className='relative overflow-hidden bg-muted aspect-square'>
        <img
          src={images[0]}
          alt={product.name}
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          loading='lazy'
        />
        {!inStock && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/70'>
            <span className='text-xs font-bold uppercase tracking-widest text-gray-500'>
              Sold Out
            </span>
          </div>
        )}
        {discountedPrice && discountedPrice < price && (
          <span className='absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'>
            Sale
          </span>
        )}

        {/* Actions overlay */}
        <div className='absolute bottom-0 left-0 right-0 flex translate-y-full flex-col gap-2 p-3 transition-transform duration-300 group-hover:translate-y-0'>
          <button
            onClick={handleAddToCart}
            disabled={!inStock || addingToCart || !isAuthenticated}
            className={cn(
              'flex h-10 w-full items-center justify-center gap-2 rounded bg-primary text-xs font-bold uppercase tracking-wider text-white transition-colors',
              'hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <ShoppingBag className='h-4 w-4' />
            {!isAuthenticated
              ? 'Sign in to buy'
              : inStock
                ? 'Add to Cart'
                : 'Out of Stock'}
          </button>
        </div>

        {/* Wishlist */}
        {isAuthenticated && (
          <button
            onClick={handleToggleWishlist}
            className='absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-50'
            aria-label='Wishlist'
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                isWishlisted ? 'fill-accent text-accent' : 'text-gray-400',
              )}
            />
          </button>
        )}
      </div>

      {/* Info */}
      <div className='flex flex-1 flex-col p-3'>
        <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
          {typeof product.categoryId === 'object'
            ? product.categoryId.name
            : ''}
        </p>
        <h3 className='mt-0.5 text-sm font-semibold text-text line-clamp-2 leading-snug'>
          {product.name}
        </h3>
        {rating > 0 && (
          <div className='mt-1 flex items-center gap-1'>
            <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
            <span className='text-xs text-text-muted'>{rating.toFixed(1)}</span>
          </div>
        )}
        <div className='mt-2 flex items-center gap-2'>
          {discountedPrice && discountedPrice < price ? (
            <>
              <span className='text-sm font-bold text-text'>
                {formatCurrency(discountedPrice)}
              </span>
              <span className='text-xs text-text-muted line-through'>
                {formatCurrency(price)}
              </span>
            </>
          ) : (
            <span className='text-sm font-bold text-text'>
              {formatCurrency(price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
