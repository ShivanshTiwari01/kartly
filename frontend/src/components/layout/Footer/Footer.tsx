import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';

const shopLinks = [
  { label: 'New Arrivals', href: ROUTES.PRODUCTS },
  { label: 'Men', href: ROUTES.PRODUCTS },
  { label: 'Women', href: ROUTES.PRODUCTS },
  { label: 'Kids', href: ROUTES.PRODUCTS },
  { label: 'Sale', href: ROUTES.PRODUCTS },
];

const companyLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
  { label: 'Investors', href: '#' },
];

const supportLinks = [
  { label: 'Help & FAQs', href: '#' },
  { label: 'Order Status', href: ROUTES.ORDERS },
  { label: 'Shipping Info', href: '#' },
  { label: 'Returns', href: '#' },
];

export default function Footer() {
  return (
    <footer className='border-t border-border bg-primary text-white'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6'>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-5'>
          {/* Brand */}
          <div className='col-span-2 md:col-span-1'>
            <Link to={ROUTES.HOME} className='flex items-center gap-2'>
              <img src='/logo.svg' alt='Kartly' className='h-8 w-8 invert' />
              <span className='text-xl font-black tracking-tight'>KARTLY</span>
            </Link>
            <p className='mt-3 text-sm text-gray-400'>
              Premium footwear & apparel. Just do it.
            </p>
            <div className='mt-4 flex items-center gap-3'>
              <a
                href='#'
                aria-label='Instagram'
                className='opacity-70 hover:opacity-100 transition-opacity'
              >
                <img
                  src='/instagram.svg'
                  alt='Instagram'
                  className='h-5 w-5 invert'
                />
              </a>
              <a
                href='#'
                aria-label='Facebook'
                className='opacity-70 hover:opacity-100 transition-opacity'
              >
                <img
                  src='/facebook.svg'
                  alt='Facebook'
                  className='h-5 w-5 invert'
                />
              </a>
              <a
                href='#'
                aria-label='X'
                className='opacity-70 hover:opacity-100 transition-opacity'
              >
                <img src='/x.svg' alt='X' className='h-5 w-5 invert' />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-4'>
              Shop
            </h4>
            <ul className='space-y-2'>
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className='text-sm text-gray-300 hover:text-white transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-4'>
              Company
            </h4>
            <ul className='space-y-2'>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className='text-sm text-gray-300 hover:text-white transition-colors'
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-4'>
              Support
            </h4>
            <ul className='space-y-2'>
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className='text-sm text-gray-300 hover:text-white transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-widest text-gray-400 mb-4'>
              Newsletter
            </h4>
            <p className='mb-3 text-sm text-gray-400'>
              Get exclusive offers and updates.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className='flex flex-col gap-2'
            >
              <input
                type='email'
                placeholder='Your email'
                className='h-10 rounded border border-gray-700 bg-gray-900 px-3 text-sm text-white placeholder:text-gray-600 focus:border-white focus:outline-none'
              />
              <button
                type='submit'
                className='h-10 rounded bg-white text-xs font-bold uppercase tracking-wider text-primary hover:bg-gray-100 transition-colors'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className='mt-12 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-xs text-gray-500'>
            © {new Date().getFullYear()} Kartly. All rights reserved.
          </p>
          <div className='flex items-center gap-4'>
            <a href='#' className='text-xs text-gray-500 hover:text-white'>
              Privacy Policy
            </a>
            <a href='#' className='text-xs text-gray-500 hover:text-white'>
              Terms of Use
            </a>
            <a href='#' className='text-xs text-gray-500 hover:text-white'>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
