import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/config/routes.config';
import { useLogin } from '@/features/auth/hooks/useLogin';
import {
  loginSchema,
  type LoginFormData,
} from '@/features/auth/schemas/auth.schema';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('Sign In');
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  return (
    <div className='flex min-h-screen bg-background'>
      {/* Left - visual */}
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
            KARTLY
          </h1>
          <p className='mt-3 text-lg text-gray-300'>
            Premium Footwear & Apparel
          </p>
        </div>
      </div>

      {/* Right - form */}
      <div className='flex flex-1 flex-col items-center justify-center px-6 py-12'>
        <div className='w-full max-w-sm'>
          <div className='mb-8'>
            <Link to={ROUTES.HOME} className='block lg:hidden mb-6'>
              <img src='/logo.svg' alt='Kartly' className='h-10 w-10' />
            </Link>
            <h2 className='text-3xl font-black uppercase tracking-tight'>
              Welcome Back
            </h2>
            <p className='mt-1 text-sm text-text-muted'>
              Sign in to your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit((data) => login(data))}
            className='space-y-4'
          >
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
              placeholder='••••••••'
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type='submit' isLoading={isPending} fullWidth size='lg'>
              Sign In
            </Button>
          </form>

          <div className='mt-4 flex items-center gap-3'>
            <div className='h-px flex-1 bg-border' />
            <span className='text-xs text-text-muted'>OR</span>
            <div className='h-px flex-1 bg-border' />
          </div>

          <div className='mt-4 flex gap-3'>
            <button className='flex flex-1 h-11 items-center justify-center gap-2 rounded border border-border hover:bg-muted transition-colors text-sm'>
              <img src='/google.svg' alt='Google' className='h-4 w-4' /> Google
            </button>
            <button className='flex flex-1 h-11 items-center justify-center gap-2 rounded border border-border hover:bg-muted transition-colors text-sm'>
              <img src='/apple.svg' alt='Apple' className='h-4 w-4' /> Apple
            </button>
          </div>

          <p className='mt-6 text-center text-sm text-text-muted'>
            Don&apos;t have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className='font-semibold text-primary hover:underline'
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
