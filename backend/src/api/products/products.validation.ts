import * as z from 'zod';

export const createProductSchema = z.object({
  name: z.string().nonempty({ message: 'name is required' }),
  description: z.string().nonempty({ message: 'description is required' }),
  summary: z.string().nonempty({ message: 'summary is required' }),
  categoryId: z.string().nonempty({ message: 'categoryId is required' }),
  price: z.number().positive({ message: 'price must be positive' }),
  discountedPrice: z
    .number()
    .positive({ message: 'discountedPrice must be positive' })
    .optional(),
  stock: z
    .number()
    .int()
    .nonnegative({ message: 'stock must be a non-negative integer' })
    .optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  specs: z.record(z.string(), z.any()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
});
