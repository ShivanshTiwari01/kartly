import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Package,
} from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { useAppSelector } from '@store/hooks';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useCart } from '@/features/cart/hooks/useCart';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useClickOutside } from '@hooks/useClickOutside';
import { cn } from '@utils/cn';

const navLinks = [
  { label: 'New Arrivals', href: `${ROUTES.PRODUCTS}?sort=newest` },
  { label: 'Men', href: `${ROUTES.PRODUCTS}?category=men` },
  { label: 'Women', href: `${ROUTES.PRODUCTS}?category=women` },
  { label: 'Kids', href: `${ROUTES.PRODUCTS}?category=kids` },
  { label: 'Sale', href: `${ROUTES.PRODUCTS}?sale=true` },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const userMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(userMenuRef, () => setUserMenuOpen(false));

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

  const cartCount = cart?.items?.length ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(
        `${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchValue.trim())}`,
      );
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  return (
    <header className='sticky top-0 z-50 border-b border-border bg-white'>
      {/* Top bar */}
      <div className='hidden bg-primary py-1.5 text-center text-xs font-medium tracking-widest text-white md:block'>
        FREE SHIPPING ON ORDERS OVER $100
      </div>

      {/* Main nav */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='flex h-16 items-center justify-between gap-4'>
          {/* Logo */}
          <Link to={ROUTES.HOME} className='shrink-0'>
            <img src='/logo.svg' alt='Kartly' className='h-8 w-8' />
          </Link>

          {/* Desktop nav */}
          <nav className='hidden items-center gap-8 md:flex'>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className='text-sm font-medium text-text-muted uppercase tracking-wider hover:text-primary transition-colors'
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className='flex items-center gap-3'>
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className='hidden h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors md:flex'
              aria-label='Search'
            >
              <Search className='h-5 w-5' />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to={ROUTES.WISHLIST}
                className='relative hidden h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors md:flex'
                aria-label='Wishlist'
              >
                <Heart className='h-5 w-5' />
                {wishlistCount > 0 && (
                  <span className='absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white'>
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className='relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors'
              aria-label='Cart'
            >
              <ShoppingBag className='h-5 w-5' />
              {cartCount > 0 && (
                <span className='absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white'>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div ref={userMenuRef} className='relative hidden md:block'>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-light transition-colors'
                  aria-label='User menu'
                >
                  <span className='text-xs font-bold uppercase'>
                    {user?.username?.slice(0, 2) ?? 'U'}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className='absolute right-0 top-11 w-44 rounded border border-border bg-white py-1 shadow-lg'>
                    <div className='border-b border-border px-4 py-2'>
                      <p className='text-xs font-semibold text-text truncate'>
                        {user?.username}
                      </p>
                      <p className='text-xs text-text-muted truncate'>
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to={ROUTES.PROFILE}
                      onClick={() => setUserMenuOpen(false)}
                      className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted'
                    >
                      <User className='h-4 w-4' /> Profile
                    </Link>
                    <Link
                      to={ROUTES.ORDERS}
                      onClick={() => setUserMenuOpen(false)}
                      className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted'
                    >
                      <Package className='h-4 w-4' /> Orders
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      disabled={loggingOut}
                      className='flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-muted'
                    >
                      <LogOut className='h-4 w-4' /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className={cn(
                  'hidden h-9 items-center justify-center rounded bg-primary px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-light transition-colors md:flex',
                )}
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className='flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors md:hidden'
              aria-label='Menu'
            >
              {mobileOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            className='border-t border-border pb-3 pt-3'
          >
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted' />
              <input
                autoFocus
                type='text'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder='Search for shoes, apparel...'
                className='h-11 w-full rounded border border-border pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              />
            </div>
          </form>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className='border-t border-border bg-white md:hidden'>
          <nav className='flex flex-col px-4 py-4 gap-1'>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className='py-2 text-sm font-medium uppercase tracking-wider text-text hover:text-accent'
              >
                {link.label}
              </Link>
            ))}
            <div className='my-2 border-t border-border' />
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.WISHLIST}
                  onClick={() => setMobileOpen(false)}
                  className='py-2 text-sm'
                >
                  Wishlist
                </Link>
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setMobileOpen(false)}
                  className='py-2 text-sm'
                >
                  Profile
                </Link>
                <Link
                  to={ROUTES.ORDERS}
                  onClick={() => setMobileOpen(false)}
                  className='py-2 text-sm'
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className='py-2 text-sm text-left text-red-600'
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setMobileOpen(false)}
                className='py-2 text-sm font-bold uppercase'
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
