import * as z from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().nonempty({ message: 'productId is required' }),
  quantity: z
    .number()
    .int()
    .positive({ message: 'Quantity must be a positive integer' }),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int()
    .positive({ message: 'Quantity must be a positive integer' }),
});
