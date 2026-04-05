'use client';
// components/home/PromoBanners.tsx

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PROMO_BANNERS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80',
    tag: 'SUMMER ESSENTIALS',
    title: 'Easy Linen',
    description: 'Breathable fabrics for warm days',
    ctaText: 'SHOP NOW',
    ctaHref: '/shop?category=men&subcategory=t-shirts',
    position: 'center',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    tag: 'TRENDING',
    title: 'Denim Season',
    description: 'Classic cuts, modern fits',
    ctaText: 'EXPLORE',
    ctaHref: '/shop?category=men&subcategory=jeans',
    position: 'top',
  },
];

export default function PromoBanners() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROMO_BANNERS.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <Link href={banner.ctaHref} className="block group overflow-hidden relative">
              <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-brand-gray-100">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  style={{ objectPosition: banner.position }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <p className="text-white/80 text-[10px] font-semibold tracking-[0.3em] mb-2">
                    {banner.tag}
                  </p>
                  <h3
                    className="text-white text-2xl md:text-3xl font-light mb-1"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {banner.title}
                  </h3>
                  <p className="text-white/75 text-sm mb-4">{banner.description}</p>
                  <span className="inline-flex items-center gap-2 text-white text-xs font-semibold tracking-widest w-fit border-b border-white/50 pb-0.5 group-hover:border-white transition-colors">
                    {banner.ctaText} →
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
