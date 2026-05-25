import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import MainLayout from '@components/layout/MainLayout';
import { Button } from '@components/ui/Button';
import { Separator } from '@components/ui/Separator';
import { useCart } from '@/features/cart/hooks/useCart';
import { ordersApi } from '@/features/orders/api/ordersApi';
import { userApi } from '@/features/user/api/userApi';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import { formatCurrency } from '@utils/formatCurrency';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { ROUTES } from '@/config/routes.config';
import type { PaymentMethod } from '@/types/order.types';
import type { Product } from '@/types/product.types';

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'upi', label: 'UPI' },
];

export default function CheckoutPage() {
  useDocumentTitle('Checkout');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: cart } = useCart();
  const { data: addressData } = useQuery({
    queryKey: queryKeys.user.addresses(),
    queryFn: userApi.getAddresses,
  });

  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Order placed!');
      navigate(ROUTES.ORDER_DETAIL.replace(':id', order._id));
    },
    onError: () => toast.error('Failed to place order'),
  });

  const items = cart?.items ?? [];
  const addresses = addressData ?? [];

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error('Please select an address');
      return;
    }
    placeOrder({ addressId: selectedAddress, paymentMethod });
  };

  return (
    <MainLayout>
      <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6'>
        <h1 className='mb-6 text-3xl font-black uppercase tracking-tight'>
          Checkout
        </h1>
        <div className='grid gap-8 lg:grid-cols-5'>
          {/* Left */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Delivery address */}
            <div className='rounded border border-border p-5'>
              <h2 className='mb-4 text-sm font-bold uppercase tracking-widest'>
                Delivery Address
              </h2>
              {addresses.length === 0 ? (
                <div className='text-sm text-text-muted'>
                  No saved addresses.{' '}
                  <a
                    href={ROUTES.PROFILE}
                    className='font-semibold text-primary underline'
                  >
                    Add one in your profile.
                  </a>
                </div>
              ) : (
                <div className='space-y-3'>
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex cursor-pointer gap-3 rounded border p-3 transition-colors ${
                        selectedAddress === addr._id
                          ? 'border-primary bg-muted'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type='radio'
                        name='address'
                        value={addr._id}
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                        className='mt-0.5 accent-primary'
                      />
                      <div className='text-sm'>
                        <p className='font-medium'>{addr.street}</p>
                        <p className='text-text-muted'>
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p className='text-text-muted'>{addr.country}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment */}
            <div className='rounded border border-border p-5'>
              <h2 className='mb-4 text-sm font-bold uppercase tracking-widest'>
                Payment Method
              </h2>
              <div className='space-y-3'>
                {paymentMethods.map(({ value, label }) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-3 rounded border p-3 transition-colors ${
                      paymentMethod === value
                        ? 'border-primary bg-muted'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type='radio'
                      name='payment'
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                      className='accent-primary'
                    />
                    <span className='text-sm font-medium'>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Order summary */}
          <div className='lg:col-span-2'>
            <div className='sticky top-24 rounded border border-border p-5'>
              <h2 className='mb-4 text-sm font-bold uppercase tracking-widest'>
                Order Summary
              </h2>
              <div className='space-y-3 text-sm'>
                {items.map((item) => {
                  const product =
                    typeof item.productId === 'object'
                      ? (item.productId as Product)
                      : null;
                  const price =
                    product?.details?.discountedPrice ??
                    product?.details?.price ??
                    0;
                  return (
                    <div key={item._id} className='flex justify-between gap-2'>
                      <span className='text-text-muted line-clamp-1'>
                        {product?.name} &times; {item.quantity}
                      </span>
                      <span className='shrink-0 font-medium'>
                        {formatCurrency(price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Separator className='my-3' />
              <div className='flex justify-between font-bold'>
                <span>Total</span>
                <span>{formatCurrency(cart?.totalAmount ?? 0)}</span>
              </div>
              <Button
                onClick={handlePlaceOrder}
                isLoading={isPending}
                disabled={addresses.length === 0}
                fullWidth
                size='lg'
                className='mt-4'
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
