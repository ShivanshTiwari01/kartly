export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  WISHLIST: '/wishlist',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
