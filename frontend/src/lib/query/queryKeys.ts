export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (params: Record<string, unknown>) =>
      [...queryKeys.products.lists(), params] as const,
    detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.categories.all, 'detail', id] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  wishlist: {
    all: ['wishlist'] as const,
  },
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },
  user: {
    all: ['user'] as const,
    me: () => [...queryKeys.user.all, 'me'] as const,
    addresses: () => [...queryKeys.user.all, 'addresses'] as const,
  },
} as const;
