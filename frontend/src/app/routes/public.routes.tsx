import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';

const HomePage = lazy(() => import('@pages/Home/HomePage'));
const ProductsPage = lazy(() => import('@pages/Products/ProductsPage'));
const ProductDetailPage = lazy(
  () => import('@pages/ProductDetail/ProductDetailPage'),
);
const LoginPage = lazy(() => import('@pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/Auth/RegisterPage'));
const NotFoundPage = lazy(() => import('@pages/NotFound/NotFoundPage'));

const Fallback = () => null;

export const publicRoutes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: (
      <Suspense fallback={<Fallback />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.PRODUCTS,
    element: (
      <Suspense fallback={<Fallback />}>
        <ProductsPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.PRODUCT_DETAIL,
    element: (
      <Suspense fallback={<Fallback />}>
        <ProductDetailPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <Suspense fallback={<Fallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <Suspense fallback={<Fallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Fallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];
