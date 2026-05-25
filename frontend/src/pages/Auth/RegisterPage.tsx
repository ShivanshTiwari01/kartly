import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/config/routes.config';
import { useRegister } from '@/features/auth/hooks/useRegister';
import {
  registerSchema,
  type RegisterFormData,
} from '@/features/auth/schemas/auth.schema';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

export default function RegisterPage() {
  useDocumentTitle('Create Account');
  const { mutate: register_, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  return (
    <div className='flex min-h-screen bg-background'>
      <div
        className='hidden flex-1 items-center justify-center bg-cover bg-center lg:flex'
        style={{ backgroundImage: 'url(/hero-bg.png)' }}
      >
        <div className='p-12 text-center text-white'>
          <img
            src='/logo.svg'
            alt='Kartly'
            className='mx-auto mb-6 h-16 w-16 invert'
          />
          <h1 className='text-5xl font-black uppercase tracking-tight'>
            JOIN US
          </h1>
          <p className='mt-3 text-lg text-gray-300'>
            Create your Kartly account
          </p>
        </div>
      </div>
      <div className='flex flex-1 flex-col items-center justify-center px-6 py-12'>
        <div className='w-full max-w-sm'>
          <div className='mb-8'>
            <Link to={ROUTES.HOME} className='block lg:hidden mb-6'>
              <img src='/logo.svg' alt='Kartly' className='h-10 w-10' />
            </Link>
            <h2 className='text-3xl font-black uppercase tracking-tight'>
              Create Account
            </h2>
            <p className='mt-1 text-sm text-text-muted'>Join Kartly today</p>
          </div>
          <form
            onSubmit={handleSubmit((data) => register_(data))}
            className='space-y-4'
          >
            <Input
              label='Username'
              placeholder='cooluser'
              error={errors.username?.message}
              {...register('username')}
            />
            <Input
              label='Email'
              type='email'
              placeholder='you@example.com'
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label='Password'
              type='password'
              placeholder='Min. 8 characters'
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label='Mobile (optional)'
              type='tel'
              placeholder='+1 234 567 8900'
              error={errors.mobile?.message}
              {...register('mobile')}
            />
            <Button type='submit' isLoading={isPending} fullWidth size='lg'>
              Create Account
            </Button>
          </form>
          <p className='mt-6 text-center text-sm text-text-muted'>
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className='font-semibold text-primary hover:underline'
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
