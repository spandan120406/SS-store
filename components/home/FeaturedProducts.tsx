'use client';
// components/home/FeaturedProducts.tsx

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/lib/products-data';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function FeaturedProducts({
  title,
  subtitle,
  products,
  viewAllHref = '/shop',
  viewAllLabel = 'VIEW ALL',
}: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-14">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-6 md:mb-8"
      >
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && (
            <p className="text-sm text-brand-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <Link
          href={viewAllHref}
          className="hidden sm:flex items-center gap-2 text-xs font-medium tracking-widest text-brand-black hover:text-brand-gray-600 transition-colors group flex-shrink-0 ml-4"
        >
          {viewAllLabel}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {products.slice(0, 8).map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {/* Mobile view all */}
      <div className="mt-6 text-center sm:hidden">
        <Link href={viewAllHref} className="btn-secondary text-xs px-8 py-3">
          {viewAllLabel}
        </Link>
      </div>
    </section>
  );
}
