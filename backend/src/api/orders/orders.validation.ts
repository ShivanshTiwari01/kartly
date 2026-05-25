import * as z from 'zod';

export const createOrderSchema = z.object({
  addressId: z.string().nonempty({ message: 'addressId is required' }),
  paymentMethod: z.string().nonempty({ message: 'paymentMethod is required' }),
});

export const updateOrderStatusSchema = z.object({
  status: z
    .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
});
