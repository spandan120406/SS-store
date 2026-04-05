'use client';
// components/home/HeroBanner.tsx

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=85',
    tag: 'NEW ARRIVALS',
    title: 'Spring\nCollection',
    subtitle: 'Fresh styles for a new season',
    ctaText: 'SHOP NOW',
    ctaHref: '/shop?category=new-arrivals',
    textColor: 'text-white',
    bgPosition: 'center',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=85',
    tag: 'MEN\'S EDIT',
    title: 'Effortless\nStyle',
    subtitle: 'Minimalist pieces, maximum impact',
    ctaText: 'SHOP MEN',
    ctaHref: '/shop?category=men',
    textColor: 'text-white',
    bgPosition: 'top',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
    tag: 'UP TO 70% OFF',
    title: 'Season\nSale',
    subtitle: 'Great quality at even better prices',
    ctaText: 'SHOP SALE',
    ctaHref: '/shop?category=sale',
    textColor: 'text-white',
    bgPosition: 'center',
    isRed: true,
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume autoplay after manual interaction
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => goToSlide((currentSlide + 1) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'min(80vh, 700px)' }}>
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: slide.bgPosition }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${currentSlide}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute inset-0 flex items-center"
        >
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 w-full">
            <div className="max-w-lg">
              {/* Tag */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`text-xs font-semibold tracking-[0.3em] mb-3 ${slide.isRed ? 'text-brand-red' : 'text-white/90'}`}
              >
                {slide.tag}
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-3 ${slide.textColor} whitespace-pre-line`}
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {slide.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 text-sm md:text-base mb-8 tracking-wide"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTA button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-3 bg-white text-brand-black px-8 py-4 text-xs font-semibold tracking-widest hover:bg-brand-gray-100 transition-colors group"
                >
                  {slide.ctaText}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors text-white"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 h-1.5 bg-white'
                : 'w-4 h-1.5 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
