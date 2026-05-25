import type { Category } from './category.types';

export interface ProductDetails {
  _id: string;
  productId: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  images: string[];
  tags: string[];
  rating: number;
  specs: Record<string, string>;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  summary?: string;
  categoryId: string | Category;
  details?: ProductDetails;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}
