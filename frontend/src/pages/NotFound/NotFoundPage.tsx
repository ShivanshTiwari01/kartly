import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { Button } from '@components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center'>
      <p className='text-8xl font-black text-primary opacity-10'>404</p>
      <h1 className='-mt-4 text-3xl font-black uppercase tracking-tight'>
        Page not found
      </h1>
      <p className='mt-3 max-w-sm text-sm text-text-muted'>
        We couldn&apos;t find the page you were looking for. It might have been
        removed or the URL may be incorrect.
      </p>
      <div className='mt-6 flex gap-3'>
        <Link to={ROUTES.HOME}>
          <Button size='lg'>Go Home</Button>
        </Link>
        <Link to={ROUTES.PRODUCTS}>
          <Button size='lg' variant='outline'>
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
