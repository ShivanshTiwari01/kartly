import * as z from 'zod';

export const createCategorySchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  description: z.string().nonempty({ message: 'Description is required' }),
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
