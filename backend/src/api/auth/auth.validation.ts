import * as z from 'zod';

export const userRegisterSchema = z.object({
  email: z.email().nonempty({ message: 'Email is required' }),
  password: z.string().min(8, 'Password must be atleast 8 characters'),
});

export const userSignInSchema = z.object({
  email: z.email().nonempty({ message: 'Email is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

export const forgotPasswordSchema = z.object({
  email: z.email().nonempty({ message: 'Email is required' }),
});

export const resetPasswordSchema = z.object({
  token: z.string().nonempty({ message: 'Reset token is required' }),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});
