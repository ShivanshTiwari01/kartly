import * as z from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

export const createAddressSchema = z.object({
  addressLineOne: z
    .string()
    .nonempty({ message: 'Address line 1 is required' }),
  addressLineTwo: z.string().optional(),
  country: z.string().nonempty({ message: 'Country is required' }),
  state: z.string().nonempty({ message: 'State is required' }),
  city: z.string().nonempty({ message: 'City is required' }),
  postalCode: z.string().nonempty({ message: 'Postal code is required' }),
  landMark: z.string().nonempty({ message: 'Landmark is required' }),
  countryCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  DialCode: z.string().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();
