'use client';
// app/shop/page.tsx
// Product listing page with filters, sorting, and grid

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, Grid2X2, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/product/ProductFilters';
import { ProductGridSkeleton } from '@/components/ui/Skeletons';
import { Product, PRODUCTS } from '@/lib/products-data';
import { cn } from '@/lib/utils';

interface FilterState {
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  sort: string;
}

const CATEGORY_TITLES: Record<string, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  'new-arrivals': 'New Arrivals',
  sale: 'Sale',
  all: 'All Products',
};

function ShopContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    minPrice: 0,
    maxPrice: 999999,
    sizes: [],
    sort: searchParams.get('sort') || 'featured',
  });

  // Apply filters and update products
  const applyFilters = useCallback(() => {
    setIsLoading(true);

    // Simulate async fetch
    setTimeout(() => {
      let filtered = [...PRODUCTS];

      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      if (filters.subcategory) {
        filtered = filtered.filter(p => p.subcategory === filters.subcategory);
      }
      if (filters.minPrice > 0) {
        filtered = filtered.filter(p => p.price >= filters.minPrice);
      }
      if (filters.maxPrice < 999999) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
      }
      if (filters.sizes.length > 0) {
        filtered = filtered.filter(p => filters.sizes.some(s => p.sizes.includes(s)));
      }

      // Search query
      const search = searchParams.get('search');
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some(t => t.includes(q))
        );
      }

      // Sort
      switch (filters.sort) {
        case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
        case 'newest': filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1)); break;
        case 'popular': filtered.sort((a, b) => b.reviewCount - a.reviewCount); break;
        case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
        default: filtered.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
      }

      setProducts(filtered);
      setIsLoading(false);
    }, 300);
  }, [filters, searchParams]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Sync URL category to filters on mount
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const sort = searchParams.get('sort') || 'featured';
    setFilters(prev => ({ ...prev, category, subcategory, sort }));
  }, [searchParams]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      category: searchParams.get('category') || '',
      subcategory: '',
      minPrice: 0,
      maxPrice: 999999,
      sizes: [],
      sort: 'featured',
    });
  };

  const searchQuery = searchParams.get('search');
  const categoryTitle = searchQuery
    ? `Search: "${searchQuery}"`
    : CATEGORY_TITLES[filters.category] || 'All Products';

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Page header */}
      <div className="mb-6 md:mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-light tracking-wide"
        >
          {categoryTitle}
        </motion.h1>
        <p className="text-sm text-brand-gray-500 mt-1">
          {isLoading ? 'Loading...' : `${products.length} items`}
        </p>
      </div>

      {/* Active filters chips */}
      {(filters.subcategory || filters.minPrice > 0 || filters.maxPrice < 999999 || filters.sizes.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.subcategory && (
            <span className="inline-flex items-center gap-1.5 bg-brand-gray-100 text-xs px-3 py-1.5 font-medium capitalize">
              {filters.subcategory.replace(/-/g, ' ')}
              <button onClick={() => handleFilterChange({ subcategory: '' })}>
                <X size={12} />
              </button>
            </span>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 999999) && (
            <span className="inline-flex items-center gap-1.5 bg-brand-gray-100 text-xs px-3 py-1.5 font-medium">
              £{filters.minPrice}–{filters.maxPrice === 999999 ? '∞' : `£${filters.maxPrice}`}
              <button onClick={() => handleFilterChange({ minPrice: 0, maxPrice: 999999 })}>
                <X size={12} />
              </button>
            </span>
          )}
          {filters.sizes.map(size => (
            <span key={size} className="inline-flex items-center gap-1.5 bg-brand-gray-100 text-xs px-3 py-1.5 font-medium">
              Size {size}
              <button onClick={() => handleFilterChange({ sizes: filters.sizes.filter(s => s !== size) })}>
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            onClick={handleReset}
            className="text-xs text-brand-gray-500 hover:text-brand-black underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          totalProducts={products.length}
          isMobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-brand-gray-200">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 text-xs font-medium tracking-wide border border-brand-gray-300 px-4 py-2 hover:bg-brand-gray-50"
            >
              <SlidersHorizontal size={14} />
              FILTER
            </button>

            <div className="hidden md:block" />

            <div className="flex items-center gap-3">
              {/* Grid view toggle */}
              <div className="hidden lg:flex items-center gap-1">
                {([2, 3, 4] as const).map(cols => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={cn(
                      'p-1.5 transition-colors',
                      gridCols === cols ? 'text-brand-black' : 'text-brand-gray-400 hover:text-brand-black'
                    )}
                    aria-label={`${cols} column grid`}
                  >
                    {cols === 2 ? <Grid2X2 size={18} /> : <Grid3X3 size={18} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product grid */}
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-light text-brand-gray-400 mb-4">
                No products found
              </p>
              <p className="text-sm text-brand-gray-400 mb-6">
                Try adjusting your filters or searching for something else.
              </p>
              <button onClick={handleReset} className="btn-secondary text-xs px-8 py-3">
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <div
              className={cn(
                'grid gap-3 md:gap-5',
                gridCols === 2 && 'grid-cols-2',
                gridCols === 3 && 'grid-cols-2 md:grid-cols-3',
                gridCols === 4 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              )}
            >
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={12} />}>
      <ShopContent />
    </Suspense>
  );
}
