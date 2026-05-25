import type { Product } from './product.types';

export interface CartItem {
  _id: string;
  cartId: string;
  productId: string | Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  totalAmount: number;
  items: CartItem[];
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
