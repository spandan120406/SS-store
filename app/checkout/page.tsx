'use client';
// app/checkout/page.tsx
// Full checkout page with shipping form and Stripe payment

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown, Lock, ArrowLeft, Check } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { formatPrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postcode: z.string().min(3, 'Postcode is required'),
  country: z.string().min(2, 'Country is required'),
  saveInfo: z.boolean().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const COUNTRIES = [
  'United Kingdom', 'United States', 'Canada', 'Australia',
  'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden',
];

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 30 ? 0 : 3.99;
  const total = subtotal + shippingCost;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      country: 'United Kingdom',
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your bag is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: data,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout`,
        }),
      });

      const result = await res.json();

      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        // Demo mode — simulate success
        toast.success('Order placed! (Demo mode — Stripe not configured)', { duration: 4000 });
        clearCart();
        window.location.href = '/checkout/success?demo=true';
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-light mb-4">Your bag is empty</h1>
        <Link href="/shop" className="btn-primary text-xs px-8 py-3">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/cart" className="flex items-center gap-2 text-sm text-brand-gray-500 hover:text-brand-black transition-colors">
          <ArrowLeft size={16} />
          Back to bag
        </Link>
        <h1 className="text-xl md:text-2xl font-light tracking-wide">Checkout</h1>
        <div className="flex items-center gap-1.5 text-xs text-brand-gray-500">
          <Lock size={12} />
          Secure checkout
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {['Bag', 'Shipping', 'Payment', 'Confirmation'].map((step, i) => (
          <div key={step} className="flex items-center">
            <div className={cn(
              'flex items-center gap-2',
              i <= 1 ? 'text-brand-black' : 'text-brand-gray-300'
            )}>
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
                i < 1 ? 'bg-brand-black text-white' :
                i === 1 ? 'bg-brand-black text-white' :
                'border border-brand-gray-300 text-brand-gray-300'
              )}>
                {i < 1 ? <Check size={12} /> : i + 1}
              </div>
              <span className="text-xs font-medium tracking-wide hidden sm:block">{step}</span>
            </div>
            {i < 3 && (
              <div className={cn(
                'w-8 md:w-16 h-px mx-2',
                i < 1 ? 'bg-brand-black' : 'bg-brand-gray-200'
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16">
        {/* ── Left: Checkout form ── */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact information */}
            <section>
              <h2 className="text-sm font-semibold tracking-widest mb-5 flex items-center gap-2">
                <span className="w-5 h-5 bg-brand-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">1</span>
                CONTACT INFORMATION
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
                    Email address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className={cn('input-field', errors.email && 'border-brand-red')}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-brand-red mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
                    Phone number *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className={cn('input-field', errors.phone && 'border-brand-red')}
                    placeholder="+44 7700 900000"
                  />
                  {errors.phone && (
                    <p className="text-xs text-brand-red mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Shipping address */}
            <section>
              <h2 className="text-sm font-semibold tracking-widest mb-5 flex items-center gap-2">
                <span className="w-5 h-5 bg-brand-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">2</span>
                SHIPPING ADDRESS
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
                      First name *
                    </label>
                    <input
                      {...register('firstName')}
                      className={cn('input-field', errors.firstName && 'border-brand-red')}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-brand-red mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
                      Last name *
                    </label>
                    <input
                      {...register('lastName')}
                      className={cn('input-field', errors.lastName && 'border-brand-red')}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-brand-red mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
                    Street address *
                  </label>
                  <input
                    {...register('address')}
                    className={cn('input-field', errors.address && 'border-brand-red')}
                    placeholder="123 Fashion Street, Apt 4B"
                  />
                  {errors.address && (
                    <p className="text-xs text-brand-red mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      className={cn('input-field', errors.city && 'border-brand-red')}
                      placeholder="London"
                    />
                    {errors.city && (
                      <p className="text-xs text-brand-red mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
                      Postcode *
                    </label>
                    <input
                      {...register('postcode')}
                      className={cn('input-field', errors.postcode && 'border-brand-red')}
                      placeholder="SW1A 1AA"
                    />
                    {errors.postcode && (
                      <p className="text-xs text-brand-red mt-1">{errors.postcode.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
                    Country *
                  </label>
                  <div className="relative">
                    <select
                      {...register('country')}
                      className="input-field appearance-none pr-8"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-gray-400" />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('saveInfo')}
                    className="w-4 h-4 accent-brand-black"
                  />
                  <span className="text-sm text-brand-gray-600">
                    Save this information for next time
                  </span>
                </label>
              </div>
            </section>

            {/* Payment section */}
            <section>
              <h2 className="text-sm font-semibold tracking-widest mb-5 flex items-center gap-2">
                <span className="w-5 h-5 bg-brand-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">3</span>
                PAYMENT
              </h2>

              <div className="border border-brand-gray-200 p-4 bg-brand-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={14} className="text-brand-gray-500" />
                  <p className="text-xs text-brand-gray-600 font-medium">
                    Secure payment powered by Stripe
                  </p>
                </div>
                <p className="text-xs text-brand-gray-500 mb-3">
                  You will be redirected to Stripe's secure payment page to complete your purchase.
                  We accept Visa, Mastercard, American Express, and PayPal.
                </p>
                <div className="flex gap-2">
                  {['VISA', 'MC', 'AMEX', 'PayPal'].map(m => (
                    <span key={m} className="border border-brand-gray-200 bg-white px-2.5 py-1 text-[10px] text-brand-gray-600 font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Test card info for demo */}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-700 font-medium mb-1">🧪 Demo / Test Mode</p>
                <p className="text-xs text-blue-600">
                  Use Stripe test card: <code className="font-mono bg-blue-100 px-1">4242 4242 4242 4242</code><br />
                  Expiry: any future date · CVC: any 3 digits
                </p>
              </div>
            </section>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isProcessing}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'btn-primary w-full flex items-center justify-center gap-2 py-4 text-sm',
                isProcessing && 'opacity-70 cursor-not-allowed'
              )}
            >
              <Lock size={15} />
              {isProcessing ? 'PROCESSING...' : `PAY ${formatPrice(total)}`}
            </motion.button>

            <p className="text-xs text-brand-gray-400 text-center">
              By placing your order you agree to our{' '}
              <a href="#" className="underline hover:text-brand-black">Terms & Conditions</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-brand-black">Privacy Policy</a>.
            </p>
          </form>
        </div>

        {/* ── Right: Order summary ── */}
        <div>
          <div className="bg-brand-gray-50 p-6 sticky top-24">
            {/* Mobile toggle */}
            <button
              className="lg:hidden w-full flex items-center justify-between mb-4"
              onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
            >
              <span className="text-sm font-semibold tracking-widest">ORDER SUMMARY</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatPrice(total)}</span>
                <ChevronDown size={16} className={cn('transition-transform', orderSummaryOpen ? 'rotate-180' : '')} />
              </div>
            </button>

            <div className={cn('hidden lg:block', orderSummaryOpen && '!block')}>
              <h2 className="text-sm font-semibold tracking-widest mb-5 hidden lg:block">
                ORDER SUMMARY
              </h2>

              {/* Items list */}
              <ul className="space-y-4 mb-6">
                {items.map(item => (
                  <li
                    key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-3"
                  >
                    <div className="relative w-16 h-20 bg-brand-gray-200 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      {/* Quantity badge */}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-gray-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-brand-black line-clamp-2 leading-snug">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-brand-gray-500 mt-1">
                        {item.selectedSize} · {item.selectedColor}
                      </p>
                    </div>
                    <p className="text-xs font-medium flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Pricing */}
              <div className="space-y-3 pt-4 border-t border-brand-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-brand-gray-600">Subtotal</span>
                  <span className="text-sm">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-brand-gray-600">Delivery</span>
                  <span className={cn('text-sm', shippingCost === 0 ? 'text-green-600 font-medium' : '')}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-brand-gray-200">
                  <span className="text-base font-semibold">Total (GBP)</span>
                  <span className="text-base font-semibold">{formatPrice(total)}</span>
                </div>
                <p className="text-[10px] text-brand-gray-400">Including VAT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
