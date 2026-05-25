import type { Product } from './product.types';

export interface WishlistItem {
  _id: string;
  userId: string;
  productId: string | Product;
  createdAt: string;
}
