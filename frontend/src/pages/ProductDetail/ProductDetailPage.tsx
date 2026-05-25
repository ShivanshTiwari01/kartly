import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  ArrowLeft,
  Package,
  RotateCcw,
} from 'lucide-react';
import MainLayout from '@components/layout/MainLayout';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { QuantitySelector } from '@/features/products/components/QuantitySelector';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { useProduct } from '@/features/products/hooks/useProduct';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@store/hooks';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { formatCurrency } from '@utils/formatCurrency';
import { ROUTES } from '@/config/routes.config';

const FALLBACK_IMAGES = [
  '/shoes/shoe-5.avif',
  '/shoes/shoe-6.avif',
  '/shoes/shoe-7.avif',
  '/shoes/shoe-8.avif',
  '/shoes/shoe-9.avif',
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id ?? '');
  const { data: related } = useProducts({ limit: 4 });
  const { data: wishlist = [] } = useWishlist();
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useDocumentTitle(product?.name ?? 'Product');

  const details = product?.details;
  const images = details?.images?.length
    ? details.images
    : FALLBACK_IMAGES.slice(0, 3);
  const price = details?.price ?? 0;
  const discountedPrice = details?.discountedPrice;
  const inStock = (details?.stock ?? 0) > 0;
  const rating = details?.rating ?? 0;

  const isWishlisted = wishlist.some((w) => {
    const pid = typeof w.productId === 'string' ? w.productId : w.productId._id;
    return pid === id;
  });

  const handleAddToCart = () => {
    if (!id || !isAuthenticated) return;
    addToCart({ productId: id, quantity: qty });
  };

  const handleToggleWishlist = () => {
    if (!id || !isAuthenticated) return;
    if (isWishlisted) removeFromWishlist(id);
    else addToWishlist(id);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
          <div className='grid gap-12 md:grid-cols-2'>
            <Skeleton className='aspect-square w-full rounded-none' />
            <div className='space-y-4'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-8 w-24' />
              <Skeleton className='h-32 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !product) {
    return (
      <MainLayout>
        <div className='flex flex-col items-center justify-center gap-4 py-24 text-center'>
          <h2 className='text-2xl font-black uppercase'>Product not found</h2>
          <Link to={ROUTES.PRODUCTS}>
            <Button>Back to Products</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
        {/* Breadcrumb */}
        <Link
          to={ROUTES.PRODUCTS}
          className='mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors'
        >
          <ArrowLeft className='h-4 w-4' /> Back to Products
        </Link>

        <div className='grid gap-12 lg:grid-cols-2'>
          {/* Gallery */}
          <div className='flex gap-3'>
            <div className='flex flex-col gap-2'>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img
                    src={img}
                    alt=''
                    className='h-full w-full object-cover bg-muted'
                  />
                </button>
              ))}
            </div>
            <div className='flex-1 overflow-hidden bg-muted'>
              <img
                src={images[activeImage]}
                alt={product.name}
                className='h-full w-full object-cover'
              />
            </div>
          </div>

          {/* Info */}
          <div>
            {typeof product.categoryId === 'object' && (
              <p className='mb-1 text-xs font-bold uppercase tracking-widest text-text-muted'>
                {product.categoryId.name}
              </p>
            )}
            <h1 className='text-3xl font-black uppercase leading-tight tracking-tight'>
              {product.name}
            </h1>

            {/* Rating */}
            {rating > 0 && (
              <div className='mt-2 flex items-center gap-2'>
                <div className='flex'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className='text-sm text-text-muted'>
                  {rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Price */}
            <div className='mt-4 flex items-center gap-3'>
              {discountedPrice && discountedPrice < price ? (
                <>
                  <span className='text-3xl font-black'>
                    {formatCurrency(discountedPrice)}
                  </span>
                  <span className='text-xl text-text-muted line-through'>
                    {formatCurrency(price)}
                  </span>
                  <Badge variant='error' className='text-xs'>
                    -{Math.round(((price - discountedPrice) / price) * 100)}%
                  </Badge>
                </>
              ) : (
                <span className='text-3xl font-black'>
                  {formatCurrency(price)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className='mt-3'>
              {inStock ? (
                <span className='text-xs font-semibold uppercase tracking-wider text-green-600'>
                  In Stock ({details?.stock} left)
                </span>
              ) : (
                <span className='text-xs font-semibold uppercase tracking-wider text-red-500'>
                  Out of Stock
                </span>
              )}
            </div>

            <p className='mt-4 text-sm leading-relaxed text-text-muted'>
              {product.description}
            </p>

            {/* Tags */}
            {details?.tags && details.tags.length > 0 && (
              <div className='mt-4 flex flex-wrap gap-1.5'>
                {details.tags.map((tag) => (
                  <Badge key={tag} variant='outline' className='text-xs'>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className='mt-6 flex flex-col gap-3'>
              <div className='flex items-center gap-3'>
                <span className='text-sm font-medium'>Quantity</span>
                <QuantitySelector
                  value={qty}
                  max={details?.stock ?? 10}
                  onChange={setQty}
                />
              </div>
              <div className='flex gap-3'>
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock || !isAuthenticated}
                  isLoading={addingToCart}
                  size='lg'
                  className='flex-1'
                >
                  <ShoppingBag className='h-4 w-4' />
                  {!isAuthenticated ? 'Sign in to Buy' : 'Add to Cart'}
                </Button>
                {isAuthenticated && (
                  <Button
                    variant='outline'
                    size='lg'
                    onClick={handleToggleWishlist}
                    className='w-13'
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isWishlisted ? 'fill-accent text-accent' : ''
                      }`}
                    />
                  </Button>
                )}
              </div>
            </div>

            {/* Perks */}
            <div className='mt-6 grid grid-cols-2 gap-3'>
              <div className='flex items-center gap-2 rounded border border-border p-3'>
                <Package className='h-4 w-4 text-text-muted' />
                <span className='text-xs'>Free shipping over $100</span>
              </div>
              <div className='flex items-center gap-2 rounded border border-border p-3'>
                <RotateCcw className='h-4 w-4 text-text-muted' />
                <span className='text-xs'>30-day free returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className='mt-16'>
          <h2 className='mb-6 text-2xl font-black uppercase tracking-tight'>
            You May Also Like
          </h2>
          <ProductGrid
            products={(related?.data ?? [])
              .filter((p) => p._id !== id)
              .slice(0, 4)}
            columns={4}
          />
        </div>
      </div>
    </MainLayout>
  );
}
