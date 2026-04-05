'use client';
// components/cart/CartDrawer.tsx
// Slide-in cart drawer from the right side

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-gray-200">
              <h2 className="text-sm font-semibold tracking-widest">
                SHOPPING BAG {items.length > 0 && `(${items.reduce((s, i) => s + i.quantity, 0)})`}
              </h2>
              <button
                onClick={closeCart}
                className="p-1.5 hover:bg-brand-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
                  <ShoppingBag size={48} className="text-brand-gray-300 mb-4" />
                  <h3 className="text-base font-light tracking-wide mb-2">Your bag is empty</h3>
                  <p className="text-sm text-brand-gray-400 mb-6">
                    Add items to your bag to see them here.
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-primary text-xs px-6 py-3"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-brand-gray-100">
                  {items.map((item, index) => (
                    <motion.li
                      key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-5"
                    >
                      {/* Product image */}
                      <Link
                        href={`/product/${item.product._id}`}
                        onClick={closeCart}
                        className="flex-shrink-0"
                      >
                        <div className="relative w-20 h-28 bg-brand-gray-100 overflow-hidden">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product._id}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-brand-black hover:underline line-clamp-2 leading-snug"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-brand-gray-500 mt-1">
                          {item.selectedSize} · {item.selectedColor}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatPrice(item.product.price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-brand-gray-200">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.selectedSize,
                                  item.selectedColor,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-brand-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.selectedSize,
                                  item.selectedColor,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-brand-gray-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeItem(
                                item.product._id,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            className="text-xs text-brand-gray-400 hover:text-brand-black underline transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Item total */}
                      <div className="text-sm font-medium text-right flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer with totals */}
            {items.length > 0 && (
              <div className="border-t border-brand-gray-200 px-6 py-5 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brand-gray-500">Subtotal</span>
                  <span className="text-sm font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brand-gray-500">Delivery</span>
                  <span className="text-sm text-green-600 font-medium">
                    {totalPrice >= 30 ? 'FREE' : formatPrice(3.99)}
                  </span>
                </div>
                <div className="flex justify-between items-center font-medium text-base pt-2 border-t border-brand-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice >= 30 ? totalPrice : totalPrice + 3.99)}</span>
                </div>

                {totalPrice < 30 && (
                  <p className="text-xs text-brand-gray-400 text-center">
                    Add {formatPrice(30 - totalPrice)} more for free delivery
                  </p>
                )}

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-xs"
                >
                  CHECKOUT <ArrowRight size={16} />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-xs text-brand-gray-500 hover:text-brand-black underline transition-colors"
                >
                  View full bag
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
