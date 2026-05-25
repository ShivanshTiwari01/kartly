import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { useAppSelector } from '@store/hooks';

const CartPage = lazy(() => import('@pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('@pages/Checkout/CheckoutPage'));
const OrdersPage = lazy(() => import('@pages/Orders/OrdersPage'));
const OrderDetailPage = lazy(
  () => import('@pages/OrderDetail/OrderDetailPage'),
);
const ProfilePage = lazy(() => import('@pages/Profile/ProfilePage'));
const WishlistPage = lazy(() => import('@pages/Wishlist/WishlistPage'));

const Fallback = () => null;

const PrivateRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export const privateRoutes: RouteObject[] = [
  {
    element: <PrivateRoute />,
    children: [
      {
        path: ROUTES.CART,
        element: (
          <Suspense fallback={<Fallback />}>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.CHECKOUT,
        element: (
          <Suspense fallback={<Fallback />}>
            <CheckoutPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ORDERS,
        element: (
          <Suspense fallback={<Fallback />}>
            <OrdersPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ORDER_DETAIL,
        element: (
          <Suspense fallback={<Fallback />}>
            <OrderDetailPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <Suspense fallback={<Fallback />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.WISHLIST,
        element: (
          <Suspense fallback={<Fallback />}>
            <WishlistPage />
          </Suspense>
        ),
      },
    ],
  },
];
