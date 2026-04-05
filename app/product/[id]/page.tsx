'use client';
// app/product/[id]/page.tsx
// Product detail page with image gallery, size selector, and add to cart

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Zap,
  ChevronDown,
  Star,
  Truck,
  RotateCcw,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getProductById, PRODUCTS } from '@/lib/products-data';
import { useCartStore } from '@/lib/cart-store';
import ProductCard from '@/components/product/ProductCard';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductById(id);

  if (!product) notFound();

  const related = PRODUCTS.filter(
    p => p.category === product.category && p._id !== product._id
  ).slice(0, 4);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<string | null>('description');

  const { addItem, openCart } = useCartStore();
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      const el = document.getElementById('size-selector');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    addItem(product, selectedSize, selectedColor, 1);
    openCart();
    toast.success(`Added to bag!`, {
      style: { background: '#111', color: '#fff', borderRadius: 0 },
    });
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ product, quantity: 1, selectedSize, selectedColor }],
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error('Payment setup not configured. Please add Stripe keys.');
    } catch {
      toast.error('Checkout unavailable in demo mode. Configure Stripe to enable.');
    }
  };

  const ACCORDION_ITEMS = [
    {
      id: 'description',
      title: 'Product Description',
      content: product.description,
    },
    {
      id: 'details',
      title: 'Materials & Care',
      content:
        'Outer fabric: 100% Cotton\nCare: Machine wash at 30°C\nDo not tumble dry\nIron at medium temperature\nDo not dry clean',
    },
    {
      id: 'delivery',
      title: 'Delivery & Returns',
      content:
        'Standard delivery: 3-5 working days\nExpress delivery: 1-2 working days\nFree delivery on orders over £30\nFree returns within 30 days of purchase',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-gray-400 mb-6">
        <Link href="/" className="hover:text-brand-black transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-brand-black transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-brand-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* ── Left: Image Gallery ── */}
        <div>
          {/* Main image */}
          <div className="relative aspect-[3/4] bg-brand-gray-100 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[currentImage]}
                  alt={`${product.name} - image ${currentImage + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-white text-brand-black text-[10px] font-semibold tracking-widest px-2 py-1">NEW</span>
              )}
              {product.isSale && discount > 0 && (
                <span className="bg-brand-red text-white text-[10px] font-semibold tracking-widest px-2 py-1">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Wishlist button */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 w-9 h-9 bg-white flex items-center justify-center shadow-sm hover:bg-brand-gray-50 transition-colors"
            >
              <Heart
                size={18}
                className={cn(
                  isWishlisted ? 'fill-brand-red text-brand-red' : 'text-brand-gray-600'
                )}
              />
            </button>

            {/* Image navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage(i => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentImage(i => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    'relative flex-1 aspect-[3/4] overflow-hidden bg-brand-gray-100 border-2 transition-all',
                    currentImage === index
                      ? 'border-brand-black'
                      : 'border-transparent hover:border-brand-gray-300'
                  )}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Info ── */}
        <div className="md:sticky md:top-24 self-start">
          {/* Subcategory */}
          <p className="text-xs text-brand-gray-400 tracking-widest mb-2 uppercase">
            {product.subcategory.replace(/-/g, ' ')}
          </p>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-light text-brand-black leading-tight mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={14}
                  className={cn(
                    star <= Math.round(product.rating)
                      ? 'fill-brand-black text-brand-black'
                      : 'fill-brand-gray-200 text-brand-gray-200'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-brand-gray-500">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className={cn('text-2xl font-medium', product.isSale ? 'text-brand-red' : '')}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-brand-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-sm font-medium text-brand-red">-{discount}%</span>
            )}
          </div>

          {/* Color selector */}
          <div className="mb-5">
            <p className="text-xs font-semibold tracking-wider text-brand-black mb-3">
              COLOUR: <span className="font-normal text-brand-gray-600">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'px-3 py-1.5 text-xs border transition-all',
                    selectedColor === color
                      ? 'border-brand-black bg-brand-black text-white'
                      : 'border-brand-gray-300 hover:border-brand-black'
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div id="size-selector" className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className={cn('text-xs font-semibold tracking-wider', sizeError ? 'text-brand-red' : 'text-brand-black')}>
                {sizeError ? 'PLEASE SELECT A SIZE' : 'SELECT SIZE'}
              </p>
              <button className="text-xs text-brand-gray-500 underline hover:text-brand-black">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={cn(
                    'py-2.5 text-xs border transition-all',
                    selectedSize === size
                      ? 'border-brand-black bg-brand-black text-white'
                      : sizeError
                      ? 'border-brand-red text-brand-gray-600 hover:border-brand-black'
                      : 'border-brand-gray-300 text-brand-gray-600 hover:border-brand-black'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              ADD TO BAG
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              BUY NOW
            </motion.button>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-t border-b border-brand-gray-200">
            {[
              { Icon: Truck, text: 'Free delivery over £30' },
              { Icon: RotateCcw, text: 'Free returns 30 days' },
              { Icon: Shield, text: 'Secure payment' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                <Icon size={18} className="text-brand-gray-500" />
                <p className="text-[10px] text-brand-gray-500 leading-tight">{text}</p>
              </div>
            ))}
          </div>

          {/* Accordion: Description, Materials, Delivery */}
          <div className="space-y-0">
            {ACCORDION_ITEMS.map(item => (
              <div key={item.id} className="border-b border-brand-gray-200">
                <button
                  onClick={() => setAccordionOpen(accordionOpen === item.id ? null : item.id)}
                  className="flex items-center justify-between w-full py-4 text-left"
                >
                  <span className="text-xs font-semibold tracking-widest">{item.title.toUpperCase()}</span>
                  <ChevronDown
                    size={16}
                    className={cn('transition-transform text-brand-gray-500', accordionOpen === item.id ? 'rotate-180' : '')}
                  />
                </button>
                <AnimatePresence>
                  {accordionOpen === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-brand-gray-600 leading-relaxed pb-4 whitespace-pre-line">
                        {item.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* SKU */}
          <p className="text-xs text-brand-gray-400 mt-4">SKU: {product.sku}</p>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-brand-gray-200">
          <h2 className="section-title mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, index) => (
              <ProductCard key={p._id} product={p} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
