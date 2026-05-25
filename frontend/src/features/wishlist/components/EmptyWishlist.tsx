import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { Button } from '@components/ui/Button';

export const EmptyWishlist = () => (
  <div className='flex flex-col items-center justify-center gap-6 py-20 text-center'>
    <div className='flex h-24 w-24 items-center justify-center rounded-full bg-muted'>
      <Heart className='h-12 w-12 text-gray-300' />
    </div>
    <div>
      <h2 className='text-2xl font-black uppercase tracking-tight'>
        Your wishlist is empty
      </h2>
      <p className='mt-2 text-sm text-text-muted'>
        Save items you love to your wishlist.
      </p>
    </div>
    <Link to={ROUTES.PRODUCTS}>
      <Button size='lg'>Browse Products</Button>
    </Link>
  </div>
);
