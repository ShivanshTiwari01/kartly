import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import MainLayout from '@components/layout/MainLayout';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { userApi } from '@/features/user/api/userApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { useAppSelector } from '@store/hooks';
import { Trash2, Plus, MapPin } from 'lucide-react';
import type { CreateAddressRequest } from '@/types/user.types';

export default function ProfilePage() {
  useDocumentTitle('My Profile');
  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const [showAddressForm, setShowAddressForm] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: userApi.getMe,
  });

  const { data: addresses = [], isLoading: loadingAddresses } = useQuery({
    queryKey: queryKeys.user.addresses(),
    queryFn: userApi.getAddresses,
  });

  const profileForm = useForm({
    defaultValues: {
      firstName: profileData?.profile?.firstName ?? '',
      lastName: profileData?.profile?.lastName ?? '',
    },
  });

  const addressForm = useForm<CreateAddressRequest>();

  const { mutate: updateProfile, isPending: updatingProfile } = useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const { mutate: createAddress, isPending: creatingAddress } = useMutation({
    mutationFn: userApi.createAddress,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.user.addresses(),
      });
      toast.success('Address added!');
      setShowAddressForm(false);
      addressForm.reset();
    },
    onError: () => toast.error('Failed to add address'),
  });

  const { mutate: deleteAddress } = useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.user.addresses(),
      });
      toast.success('Address removed');
    },
    onError: () => toast.error('Failed to remove address'),
  });

  return (
    <MainLayout>
      <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6'>
        <h1 className='mb-6 text-3xl font-black uppercase tracking-tight'>
          My Profile
        </h1>

        {/* Profile info */}
        <div className='mb-8 rounded border border-border p-6'>
          <h2 className='mb-4 text-sm font-bold uppercase tracking-widest'>
            Account Info
          </h2>
          {isLoading ? (
            <div className='space-y-3'>
              {[1, 2].map((i) => (
                <Skeleton key={i} className='h-10 w-full' />
              ))}
            </div>
          ) : (
            <>
              <div className='mb-4 flex items-center gap-3 p-3 rounded bg-muted'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white'>
                  {user?.username?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className='text-sm font-semibold'>{user?.username}</p>
                  <p className='text-xs text-text-muted'>{user?.email}</p>
                </div>
              </div>
              <form
                onSubmit={profileForm.handleSubmit((data) =>
                  updateProfile(data),
                )}
                className='grid gap-4 sm:grid-cols-2'
              >
                <Input
                  label='First Name'
                  placeholder='John'
                  defaultValue={profileData?.profile?.firstName}
                  {...profileForm.register('firstName')}
                />
                <Input
                  label='Last Name'
                  placeholder='Doe'
                  defaultValue={profileData?.profile?.lastName}
                  {...profileForm.register('lastName')}
                />
                <div className='sm:col-span-2'>
                  <Button type='submit' isLoading={updatingProfile}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Addresses */}
        <div className='rounded border border-border p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-sm font-bold uppercase tracking-widest'>
              Saved Addresses
            </h2>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowAddressForm((v) => !v)}
            >
              <Plus className='h-4 w-4' /> Add New
            </Button>
          </div>

          {showAddressForm && (
            <form
              onSubmit={addressForm.handleSubmit((data) => createAddress(data))}
              className='mb-6 rounded border border-border bg-muted p-4 grid gap-3 sm:grid-cols-2'
            >
              <Input
                label='Street'
                placeholder='123 Main St'
                className='sm:col-span-2'
                {...addressForm.register('street', { required: true })}
              />
              <Input
                label='City'
                placeholder='New York'
                {...addressForm.register('city', { required: true })}
              />
              <Input
                label='State'
                placeholder='NY'
                {...addressForm.register('state', { required: true })}
              />
              <Input
                label='Country'
                placeholder='United States'
                {...addressForm.register('country', { required: true })}
              />
              <Input
                label='Postal Code'
                placeholder='10001'
                {...addressForm.register('postalCode', { required: true })}
              />
              <Input
                label='Phone'
                placeholder='+1 234 567 8900'
                className='sm:col-span-2'
                {...addressForm.register('phone', { required: true })}
              />
              <Input
                label='Landmark (optional)'
                placeholder='Near park'
                className='sm:col-span-2'
                {...addressForm.register('landmark')}
              />
              <div className='sm:col-span-2 flex gap-2'>
                <Button type='submit' isLoading={creatingAddress} size='sm'>
                  Add Address
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowAddressForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {loadingAddresses ? (
            <div className='space-y-3'>
              {[1, 2].map((i) => (
                <Skeleton key={i} className='h-20 w-full' />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className='flex flex-col items-center gap-3 py-8 text-center'>
              <MapPin className='h-10 w-10 text-gray-300' />
              <p className='text-sm text-text-muted'>No saved addresses</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className='flex items-start justify-between gap-4 rounded border border-border p-4'
                >
                  <div className='text-sm'>
                    <p className='font-medium'>{addr.street}</p>
                    <p className='text-text-muted'>
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className='text-text-muted'>{addr.country}</p>
                    {addr.phone && (
                      <p className='text-text-muted'>{addr.phone}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteAddress(addr._id)}
                    className='flex h-8 w-8 items-center justify-center rounded hover:bg-muted hover:text-red-500 transition-colors'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
