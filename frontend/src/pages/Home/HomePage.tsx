import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RotateCcw, Shield } from 'lucide-react';
import MainLayout from '@components/layout/MainLayout';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { ROUTES } from '@/config/routes.config';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Shield, title: 'Secure Checkout', desc: '100% secure payments' },
];

const trending = [
  { img: '/trending-1.png', label: 'Running' },
  { img: '/trending-2.png', label: 'Lifestyle' },
  { img: '/trending-3.png', label: 'Training' },
];

export default function HomePage() {
  useDocumentTitle('Home');
  const { data, isLoading } = useProducts({ limit: 8 });
  const products = data?.data ?? [];

  return (
    <MainLayout>
      {/* Hero */}
      <section
        className='relative flex min-h-[90vh] items-center overflow-hidden bg-cover bg-center'
        style={{ backgroundImage: 'url(/hero-bg.png)' }}
      >
        <div className='absolute inset-0 bg-black/50' />
        <div className='relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6'>
          <div className='max-w-xl text-white'>
            <p className='mb-4 text-xs font-bold uppercase tracking-[0.4em] text-gray-300'>
              New Season 2025
            </p>
            <h1 className='text-5xl font-black uppercase leading-none tracking-tight sm:text-7xl'>
              JUST
              <br />
              DO IT.
            </h1>
            <p className='mt-6 text-base text-gray-300 leading-relaxed max-w-md'>
              Discover the latest drops in performance footwear, apparel, and
              accessories.
            </p>
            <div className='mt-8 flex flex-wrap gap-4'>
              <Link
                to={ROUTES.PRODUCTS}
                className='inline-flex h-13 items-center gap-2 bg-white px-8 text-sm font-bold uppercase tracking-widest text-primary hover:bg-gray-100 transition-colors'
              >
                Shop Now <ArrowRight className='h-4 w-4' />
              </Link>
              <Link
                to={`${ROUTES.PRODUCTS}?sale=true`}
                className='inline-flex h-13 items-center gap-2 border-2 border-white px-8 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors'
              >
                View Sale
              </Link>
            </div>
          </div>
          <div className='hidden lg:block'>
            <img
              src='/hero-shoe.png'
              alt='Featured Shoe'
              className='h-[500px] w-auto drop-shadow-2xl'
            />
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className='border-y border-border bg-muted'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <div className='grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className='flex items-center gap-4 px-6 py-5'>
                <Icon
                  className='h-8 w-8 shrink-0 text-primary'
                  strokeWidth={1.5}
                />
                <div>
                  <p className='text-sm font-bold uppercase tracking-wider'>
                    {title}
                  </p>
                  <p className='text-xs text-text-muted'>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending categories */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6'>
        <div className='mb-8 flex items-end justify-between'>
          <div>
            <p className='text-xs font-bold uppercase tracking-widest text-text-muted'>
              Explore
            </p>
            <h2 className='mt-1 text-3xl font-black uppercase tracking-tight'>
              Trending Now
            </h2>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            className='flex items-center gap-1 text-sm font-semibold hover:underline'
          >
            View All <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {trending.map(({ img, label }) => (
            <Link
              key={label}
              to={`${ROUTES.PRODUCTS}?search=${label.toLowerCase()}`}
              className='group relative aspect-[4/5] overflow-hidden bg-muted'
            >
              <img
                src={img}
                alt={label}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent' />
              <div className='absolute bottom-0 left-0 p-5'>
                <p className='text-xs font-semibold uppercase tracking-widest text-gray-300'>
                  Shop
                </p>
                <h3 className='text-2xl font-black uppercase text-white'>
                  {label}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured banner */}
      <section className='bg-primary'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <div className='flex flex-col items-center gap-8 py-16 md:flex-row'>
            <div className='flex-1 text-white'>
              <p className='text-xs font-bold uppercase tracking-[0.3em] text-gray-400'>
                Featured Collection
              </p>
              <h2 className='mt-2 text-4xl font-black uppercase leading-tight tracking-tight'>
                Performance
                <br />
                Redefined
              </h2>
              <p className='mt-4 text-sm text-gray-400 max-w-md leading-relaxed'>
                Engineered for athletes who demand the best. Push your limits
                with our latest performance line.
              </p>
              <Link
                to={ROUTES.PRODUCTS}
                className='mt-6 inline-flex h-11 items-center gap-2 border-2 border-white px-6 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-primary transition-colors'
              >
                Shop Collection <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
            <div className='flex-1'>
              <img
                src='/feature.png'
                alt='Featured collection'
                className='w-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals grid */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6'>
        <div className='mb-8 flex items-end justify-between'>
          <div>
            <p className='text-xs font-bold uppercase tracking-widest text-text-muted'>
              Fresh Drops
            </p>
            <h2 className='mt-1 text-3xl font-black uppercase tracking-tight'>
              New Arrivals
            </h2>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            className='flex items-center gap-1 text-sm font-semibold hover:underline'
          >
            View All <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
        {isLoading ? (
          <div className='grid grid-cols-2 gap-px bg-border md:grid-cols-4'>
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
        ) : (
          <div className='grid grid-cols-2 gap-px bg-border md:grid-cols-4'>
            {products.map((product, i) => (
              <div key={product._id} className='bg-white'>
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className='bg-muted py-16'>
        <div className='mx-auto max-w-lg px-4 text-center'>
          <h2 className='text-2xl font-black uppercase tracking-tight'>
            Stay in the Loop
          </h2>
          <p className='mt-2 text-sm text-text-muted'>
            Subscribe for exclusive drops, early access, and member-only offers.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className='mt-6 flex flex-col gap-3 sm:flex-row'
          >
            <input
              type='email'
              placeholder='Enter your email'
              className='h-11 flex-1 rounded border border-border px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
            />
            <button
              type='submit'
              className='h-11 whitespace-nowrap rounded bg-primary px-6 text-xs font-bold uppercase tracking-widest text-white hover:bg-primary-light transition-colors'
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
