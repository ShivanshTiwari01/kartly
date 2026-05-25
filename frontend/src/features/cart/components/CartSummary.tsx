import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { formatCurrency } from '@utils/formatCurrency';
import { Button } from '@components/ui/Button';
import { Separator } from '@components/ui/Separator';

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

interface CartSummaryProps {
  totalAmount: number;
  itemCount: number;
}

export const CartSummary = ({ totalAmount, itemCount }: CartSummaryProps) => {
  const freeShipping = totalAmount >= SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : SHIPPING_COST;
  const total = totalAmount + shipping;

  return (
    <div className='rounded border border-border bg-white p-6'>
      <h3 className='text-sm font-bold uppercase tracking-widest text-text'>
        Order Summary
      </h3>
      <div className='mt-4 space-y-3'>
        <div className='flex justify-between text-sm'>
          <span className='text-text-muted'>Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-text-muted'>Shipping</span>
          <span className={freeShipping ? 'font-medium text-green-600' : ''}>
            {freeShipping ? 'FREE' : formatCurrency(SHIPPING_COST)}
          </span>
        </div>
        {!freeShipping && (
          <p className='text-xs text-text-muted'>
            Add {formatCurrency(SHIPPING_THRESHOLD - totalAmount)} more for free
            shipping!
          </p>
        )}
      </div>
      <Separator className='my-4' />
      <div className='flex justify-between font-bold'>
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
      <Link to={ROUTES.CHECKOUT} className='mt-4 block'>
        <Button fullWidth size='lg'>
          Checkout
        </Button>
      </Link>
      <Link
        to={ROUTES.PRODUCTS}
        className='mt-3 block text-center text-xs text-text-muted underline hover:text-primary'
      >
        Continue Shopping
      </Link>
    </div>
  );
};
