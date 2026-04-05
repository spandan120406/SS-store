'use client';
// components/product/ProductCard.tsx

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/products-data';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCartStore();

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);

    // Use first available size and color for quick add
    const size = product.sizes[0];
    const color = product.colors[0];
    addItem(product, size, color, 1);

    toast.success(`${product.name} added to bag`, {
      duration: 2000,
      position: 'bottom-center',
      style: {
        background: '#111',
        color: '#fff',
        borderRadius: '0',
        fontSize: '12px',
        letterSpacing: '0.05em',
      },
    });

    setTimeout(() => setIsAddingToCart(false), 600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      duration: 1500,
      position: 'bottom-center',
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="product-card"
    >
      <Link href={`/product/${product._id}`}>
        {/* Image container */}
        <div
          className="relative bg-brand-gray-100 overflow-hidden aspect-[3/4]"
          onMouseEnter={() => product.images[1] && setCurrentImageIndex(1)}
          onMouseLeave={() => setCurrentImageIndex(0)}
        >
          <Image
            src={product.images[currentImageIndex] || product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-500 group-hover:scale-105"
            priority={index < 4}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-white text-brand-black text-[10px] font-semibold tracking-widest px-2 py-1">
                NEW
              </span>
            )}
            {product.isSale && discount > 0 && (
              <span className="bg-brand-red text-white text-[10px] font-semibold tracking-widest px-2 py-1">
                -{discount}%
              </span>
            )}
          </div>

          {/* Action buttons on hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className="w-8 h-8 bg-white flex items-center justify-center shadow-sm hover:bg-brand-gray-100"
              aria-label="Add to wishlist"
            >
              <Heart
                size={15}
                className={cn(isWishlisted ? 'fill-brand-red text-brand-red' : 'text-brand-gray-700')}
              />
            </motion.button>
          </div>

          {/* Quick add button — appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 py-3 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button
              onClick={handleQuickAdd}
              disabled={isAddingToCart}
              className="w-full flex items-center justify-center gap-2 text-[11px] font-semibold tracking-widest text-brand-black hover:text-brand-gray-600 transition-colors"
            >
              <ShoppingBag size={14} />
              {isAddingToCart ? 'ADDED!' : 'QUICK ADD'}
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-3 space-y-1">
          <p className="text-xs text-brand-gray-500 tracking-wide">
            {product.subcategory.replace(/-/g, ' ').toUpperCase()}
          </p>
          <h3 className="text-sm text-brand-black leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className={cn('text-sm font-medium', product.isSale ? 'text-brand-red' : 'text-brand-black')}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-brand-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color swatches */}
          {product.colors.length > 1 && (
            <p className="text-xs text-brand-gray-400">
              {product.colors.length} colours
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
