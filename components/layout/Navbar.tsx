'use client';
// components/layout/Navbar.tsx
// Sticky navigation bar with dropdown menus and cart icon

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    label: 'NEW ARRIVALS',
    href: '/shop?category=new-arrivals',
    dropdown: [
      { label: 'New This Week', href: '/shop?category=new-arrivals&sort=newest' },
      { label: 'Trending Now', href: '/shop?sort=popular' },
      { label: 'Best Sellers', href: '/shop?sort=popular' },
    ],
  },
  {
    label: 'MEN',
    href: '/shop?category=men',
    dropdown: [
      { label: 'T-Shirts', href: '/shop?category=men&subcategory=t-shirts' },
      { label: 'Hoodies', href: '/shop?category=men&subcategory=hoodies' },
      { label: 'Jackets', href: '/shop?category=men&subcategory=jackets' },
      { label: 'Jeans', href: '/shop?category=men&subcategory=jeans' },
      { label: 'Shoes', href: '/shop?category=men&subcategory=shoes' },
      { label: 'Trousers', href: '/shop?category=men&subcategory=trousers' },
    ],
  },
  {
    label: 'WOMEN',
    href: '/shop?category=women',
    dropdown: [
      { label: 'Dresses', href: '/shop?category=women&subcategory=dresses' },
      { label: 'Trousers', href: '/shop?category=women&subcategory=trousers' },
      { label: 'Jackets', href: '/shop?category=women&subcategory=jackets' },
      { label: 'Skirts', href: '/shop?category=women&subcategory=skirts' },
      { label: 'Knitwear', href: '/shop?category=women&subcategory=knitwear' },
    ],
  },
  {
    label: 'SALE',
    href: '/shop?category=sale',
    isRed: true,
    dropdown: [
      { label: 'Up to 70% Off', href: '/shop?category=sale' },
      { label: 'Men\'s Sale', href: '/shop?category=men&isSale=true' },
      { label: 'Women\'s Sale', href: '/shop?category=women&isSale=true' },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownTimeout = useRef<NodeJS.Timeout>();

  const { getTotalItems, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleMouseEnter = (label: string) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300',
          isScrolled ? 'shadow-sm' : ''
        )}
      >
        {/* Top promo bar */}
        <div className="bg-brand-black text-white text-center py-2 px-4 text-xs tracking-widest">
          FREE DELIVERY ON ORDERS OVER £30 · FREE RETURNS
        </div>

        {/* Main navbar */}
        <nav className="border-b border-brand-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 -ml-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Logo */}
              <Link href="/" className="text-2xl font-bold tracking-widest text-brand-black">
                S&S
              </Link>

              {/* Desktop nav links */}
              <ul className="hidden md:flex items-center gap-8">
                {NAV_ITEMS.map(item => (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium tracking-widest py-5 border-b-2 transition-colors',
                        item.isRed ? 'text-brand-red hover:text-red-700' : 'text-brand-black hover:text-brand-gray-600',
                        pathname.includes(item.href.split('?')[0]) && !item.isRed
                          ? 'border-brand-black'
                          : 'border-transparent'
                      )}
                    >
                      {item.label}
                      <ChevronDown size={12} />
                    </Link>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 w-48 bg-white border border-brand-gray-200 shadow-lg py-2 z-50"
                        >
                          {item.dropdown.map(sub => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block px-4 py-2.5 text-xs text-brand-gray-700 hover:bg-brand-gray-50 hover:text-brand-black transition-colors tracking-wide"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>

              {/* Right icons */}
              <div className="flex items-center gap-1">
                {/* Search */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2.5 hover:bg-brand-gray-100 transition-colors rounded-none"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {/* Account */}
                <Link
                  href={user ? '/account' : '/login'}
                  className="p-2.5 hover:bg-brand-gray-100 transition-colors hidden sm:block"
                  aria-label="Account"
                >
                  <User size={20} />
                </Link>

                {/* Cart */}
                <button
                  onClick={toggleCart}
                  className="p-2.5 hover:bg-brand-gray-100 transition-colors relative"
                  aria-label="Shopping bag"
                >
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 bg-brand-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-brand-gray-200"
              >
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      autoFocus
                      type="search"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search for products..."
                      className="flex-1 border border-brand-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-black"
                    />
                    <button type="submit" className="btn-primary px-6 py-2.5">
                      SEARCH
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-0 bg-white z-40 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-brand-gray-200">
                <Link href="/" className="text-2xl font-bold">H&M</Link>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="px-4 py-6">
                {NAV_ITEMS.map(item => (
                  <div key={item.label} className="border-b border-brand-gray-100">
                    <Link
                      href={item.href}
                      className={cn(
                        'block py-4 text-sm font-medium tracking-widest',
                        item.isRed ? 'text-brand-red' : 'text-brand-black'
                      )}
                    >
                      {item.label}
                    </Link>
                    <div className="pb-3 pl-4 space-y-2">
                      {item.dropdown.map(sub => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block py-1.5 text-sm text-brand-gray-500"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-6 space-y-3">
                  <Link href="/login" className="block text-sm font-medium tracking-wide py-2">
                    Sign In / Create Account
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[106px]" />
    </>
  );
}
