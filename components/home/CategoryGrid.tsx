'use client';
// components/home/CategoryGrid.tsx

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    label: 'MEN',
    href: '/shop?category=men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
    description: 'Timeless staples & trend-forward pieces',
  },
  {
    label: 'WOMEN',
    href: '/shop?category=women',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80',
    description: 'From casual days to special occasions',
  },
  {
    label: 'NEW ARRIVALS',
    href: '/shop?category=new-arrivals',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    description: 'The latest styles just landed',
  },
  {
    label: 'SALE',
    href: '/shop?category=sale',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    description: 'Up to 70% off selected styles',
    isRed: true,
  },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title text-center mb-8"
      >
        Shop by Category
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {CATEGORIES.map((cat, index) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={cat.href} className="block group overflow-hidden">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-gray-100">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3
                    className={`text-white text-base md:text-xl font-medium tracking-widest mb-1 ${
                      cat.isRed ? 'text-brand-red' : ''
                    }`}
                  >
                    {cat.label}
                  </h3>
                  <p className="text-white/75 text-xs hidden md:block">{cat.description}</p>

                  <span className="inline-block mt-2 md:mt-3 text-white text-xs font-medium tracking-wider border-b border-white/60 pb-0.5 group-hover:border-white transition-colors">
                    SHOP NOW →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
