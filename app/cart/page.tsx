'use client';
// app/cart/page.tsx
// Full cart page with quantity controls and order summary

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 30 ? 0 : 3.99;
  const total = subtotal + shippingCost;

  const handleRemove = (productId: string, size: string, color: string, name: string) => {
    removeItem(productId, size, color);
    toast(`${name} removed from bag`, {
      duration: 2000,
      position: 'bottom-center',
      style: { background: '#111', color: '#fff', borderRadius: 0, fontSize: '12px' },
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-8">Shopping Bag</h1>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <ShoppingBag size={64} className="text-brand-gray-300 mb-4" />
          <h2 className="text-xl font-light mb-2">Your bag is empty</h2>
          <p className="text-sm text-brand-gray-500 mb-8">
            Browse our collection and add items to get started.
          </p>
          <Link href="/shop" className="btn-primary text-xs px-10 py-3">
            START SHOPPING
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-brand-gray-200">
              <p className="text-sm text-brand-gray-500">
                {items.reduce((s, i) => s + i.quantity, 0)} item(s)
              </p>
              <button
                onClick={() => { clearCart(); toast('Bag cleared', { duration: 1500 }); }}
                className="text-xs text-brand-gray-400 hover:text-brand-black underline transition-colors"
              >
                Clear bag
              </button>
            </div>

            <ul className="space-y-0 divide-y divide-brand-gray-100">
              <AnimatePresence>
                {items.map(item => (
                  <motion.li
                    key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-5 py-5"
                  >
                    {/* Image */}
                    <Link href={`/product/${item.product._id}`} className="flex-shrink-0">
                      <div className="relative w-24 h-32 md:w-28 md:h-40 bg-brand-gray-100 overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="120px"
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <Link
                          href={`/product/${item.product._id}`}
                          className="text-sm font-medium text-brand-black hover:underline line-clamp-2 leading-snug"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-brand-gray-500 mt-1.5">
                          Colour: {item.selectedColor}
                        </p>
                        <p className="text-xs text-brand-gray-500">
                          Size: {item.selectedSize}
                        </p>
                        <p className="text-xs text-brand-gray-400 mt-1">
                          SKU: {item.product.sku}
                        </p>
                      </div>

                      {/* Quantity + remove */}
                      <div className="flex items-center justify-between mt-3">
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
                            className="w-9 h-9 flex items-center justify-center hover:bg-brand-gray-100 transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity + 1
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-brand-gray-100 transition-colors"
                            aria-label="Increase"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            handleRemove(
                              item.product._id,
                              item.selectedSize,
                              item.selectedColor,
                              item.product.name
                            )
                          }
                          className="flex items-center gap-1 text-xs text-brand-gray-400 hover:text-brand-black transition-colors"
                        >
                          <X size={14} />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-brand-gray-400 mt-0.5">
                          {formatPrice(item.product.price)} each
                        </p>
                      )}
                      {item.product.isSale && item.product.originalPrice && (
                        <p className="text-xs text-brand-gray-400 line-through mt-0.5">
                          {formatPrice(item.product.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-gray-50 p-6 sticky top-24">
              <h2 className="text-sm font-semibold tracking-widest mb-6">ORDER SUMMARY</h2>

              {/* Promo code */}
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 border border-brand-gray-300 px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black bg-white"
                />
                <button
                  onClick={() => toast('Promo codes not active in demo', { duration: 2000 })}
                  className="flex items-center gap-1.5 bg-brand-black text-white px-4 py-2.5 text-xs font-medium tracking-wide hover:bg-brand-gray-800 transition-colors"
                >
                  <Tag size={12} />
                  APPLY
                </button>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 mb-4 pb-4 border-b border-brand-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-brand-gray-600">Subtotal</span>
                  <span className="text-sm">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-brand-gray-600">Delivery</span>
                  <span className={`text-sm ${shippingCost === 0 ? 'text-green-600 font-medium' : ''}`}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                {subtotal < 30 && (
                  <p className="text-xs text-brand-gray-400">
                    Add {formatPrice(30 - subtotal)} more for free delivery
                  </p>
                )}
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-base font-semibold tracking-wide">Total</span>
                <span className="text-base font-semibold">{formatPrice(total)}</span>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2 text-xs mb-3"
              >
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </Link>

              <p className="text-[10px] text-brand-gray-400 text-center">
                Taxes included. Shipping calculated at checkout.
              </p>

              {/* Accepted payments */}
              <div className="mt-4 pt-4 border-t border-brand-gray-200">
                <p className="text-[10px] text-brand-gray-400 text-center mb-2">
                  SECURE PAYMENT
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {['VISA', 'Mastercard', 'AMEX', 'PayPal'].map(m => (
                    <span key={m} className="text-[10px] border border-brand-gray-200 px-2 py-0.5 text-brand-gray-500">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
