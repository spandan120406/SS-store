'use client';
// components/product/ProductFilters.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  sort: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  totalProducts: number;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const SUBCATEGORY_OPTIONS = {
  men: ['t-shirts', 'hoodies', 'jackets', 'jeans', 'shoes', 'trousers', 'shirts'],
  women: ['dresses', 'trousers', 'jackets', 'skirts', 'knitwear'],
  sale: [],
  'new-arrivals': [],
};

const SIZE_OPTIONS_CLOTHING = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SIZE_OPTIONS_SHOES = ['40', '41', '42', '43', '44', '45', '46'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-xs font-semibold tracking-widest text-brand-black">
          {title.toUpperCase()}
        </span>
        <ChevronDown
          size={16}
          className={cn('transition-transform', isOpen ? 'rotate-180' : '')}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  totalProducts,
  isMobileOpen,
  onMobileClose,
}: ProductFiltersProps) {
  const subcategories =
    SUBCATEGORY_OPTIONS[filters.category as keyof typeof SUBCATEGORY_OPTIONS] || [];

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ sizes: newSizes });
  };

  const filterContent = (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-brand-gray-200">
        <h3 className="text-xs font-semibold tracking-widest">FILTER & SORT</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="text-xs text-brand-gray-500 hover:text-brand-black underline transition-colors"
          >
            Clear all
          </button>
          {onMobileClose && (
            <button onClick={onMobileClose} className="md:hidden p-1">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-brand-gray-500 mb-4">{totalProducts} items</p>

      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="space-y-2">
          {SORT_OPTIONS.map(option => (
            <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={filters.sort === option.value}
                onChange={() => onFilterChange({ sort: option.value })}
                className="w-3.5 h-3.5 accent-brand-black"
              />
              <span className="text-sm text-brand-gray-600 group-hover:text-brand-black transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Subcategory */}
      {subcategories.length > 0 && (
        <FilterSection title="Category">
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                value=""
                checked={!filters.subcategory}
                onChange={() => onFilterChange({ subcategory: '' })}
                className="w-3.5 h-3.5 accent-brand-black"
              />
              <span className="text-sm text-brand-gray-600 group-hover:text-brand-black">All</span>
            </label>
            {subcategories.map(sub => (
              <label key={sub} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="subcategory"
                  value={sub}
                  checked={filters.subcategory === sub}
                  onChange={() => onFilterChange({ subcategory: sub })}
                  className="w-3.5 h-3.5 accent-brand-black"
                />
                <span className="text-sm text-brand-gray-600 group-hover:text-brand-black capitalize transition-colors">
                  {sub.replace(/-/g, ' ')}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-brand-gray-500 mb-1 block">Min</label>
              <input
                type="number"
                min={0}
                value={filters.minPrice}
                onChange={e => onFilterChange({ minPrice: Number(e.target.value) })}
                className="w-full border border-brand-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-brand-black"
                placeholder="£0"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-brand-gray-500 mb-1 block">Max</label>
              <input
                type="number"
                min={0}
                value={filters.maxPrice === 999999 ? '' : filters.maxPrice}
                onChange={e =>
                  onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : 999999 })
                }
                className="w-full border border-brand-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-brand-black"
                placeholder="£999"
              />
            </div>
          </div>
          {/* Quick price filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Under £20', min: 0, max: 20 },
              { label: '£20–£50', min: 20, max: 50 },
              { label: 'Over £50', min: 50, max: 999999 },
            ].map(range => (
              <button
                key={range.label}
                onClick={() => onFilterChange({ minPrice: range.min, maxPrice: range.max })}
                className={cn(
                  'text-xs px-3 py-1.5 border transition-colors',
                  filters.minPrice === range.min && filters.maxPrice === range.max
                    ? 'bg-brand-black text-white border-brand-black'
                    : 'border-brand-gray-300 hover:border-brand-black'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Sizes (clothing) */}
      <FilterSection title="Size">
        <div className="grid grid-cols-3 gap-2">
          {SIZE_OPTIONS_CLOTHING.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                'border py-2 text-xs font-medium transition-colors',
                filters.sizes.includes(size)
                  ? 'bg-brand-black text-white border-brand-black'
                  : 'border-brand-gray-300 text-brand-gray-600 hover:border-brand-black hover:text-brand-black'
              )}
            >
              {size}
            </button>
          ))}
        </div>
        <p className="text-xs text-brand-gray-400 mt-3">Shoe sizes</p>
        <div className="grid grid-cols-4 gap-1.5 mt-2">
          {SIZE_OPTIONS_SHOES.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                'border py-1.5 text-xs font-medium transition-colors',
                filters.sizes.includes(size)
                  ? 'bg-brand-black text-white border-brand-black'
                  : 'border-brand-gray-300 text-brand-gray-600 hover:border-brand-black'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Sale / New filter */}
      <FilterSection title="Product Type" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { label: 'New Arrivals', value: 'new' },
            { label: 'On Sale', value: 'sale' },
          ].map(type => (
            <label key={type.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 accent-brand-black"
                onChange={() => {
                  if (type.value === 'sale') {
                    onFilterChange({ category: 'sale' });
                  } else {
                    onFilterChange({ category: 'new-arrivals' });
                  }
                }}
              />
              <span className="text-sm text-brand-gray-600 group-hover:text-brand-black transition-colors">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-56 flex-shrink-0">{filterContent}</div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-[320px] bg-white z-50 overflow-y-auto p-5 md:hidden"
            >
              {filterContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
