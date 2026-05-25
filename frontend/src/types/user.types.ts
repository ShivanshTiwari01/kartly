export interface UserProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface UserAddress {
  _id: string;
  profileId: string;
  street: string;
  city: string;
  state: string;
  country: string;
  countryCode?: string;
  postalCode: string;
  phone: string;
  landmark?: string;
  isDefault: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface CreateAddressRequest {
  street: string;
  city: string;
  state: string;
  country: string;
  countryCode?: string;
  postalCode: string;
  phone: string;
  landmark?: string;
}
