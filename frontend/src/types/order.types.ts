export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'cod' | 'upi';

export interface OrderItem {
  _id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  addressId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  addressId: string;
  paymentMethod: PaymentMethod;
}
