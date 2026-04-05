'use client';
// app/checkout/success/page.tsx

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isDemo = searchParams.get('demo') === 'true';
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
      >
        <CheckCircle size={40} className="text-green-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl md:text-3xl font-light mb-3">
          {isDemo ? 'Demo Order Placed!' : 'Order Confirmed!'}
        </h1>
        <p className="text-brand-gray-500 mb-2">
          Thank you for your purchase. {isDemo ? '(This is a demo — no real charge was made.)' : ''}
        </p>
        {sessionId && (
          <p className="text-xs text-brand-gray-400 font-mono mb-6">
            Session: {sessionId.slice(0, 24)}...
          </p>
        )}

        {isDemo && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded mb-6 text-left">
            <p className="text-sm text-blue-700 font-medium mb-1">ℹ️ Demo Mode</p>
            <p className="text-xs text-blue-600">
              In production with real Stripe keys configured, this would show your real order confirmation.
              Add your Stripe keys to <code className="bg-blue-100 px-1 font-mono">.env.local</code> to enable live payments.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="border border-brand-gray-200 p-4 text-left">
            <Package size={20} className="text-brand-gray-400 mb-2" />
            <p className="text-xs font-semibold tracking-wide mb-1">WHAT'S NEXT?</p>
            <p className="text-xs text-brand-gray-500">
              You'll receive an email confirmation with your order details and tracking information.
            </p>
          </div>
          <div className="border border-brand-gray-200 p-4 text-left">
            <CheckCircle size={20} className="text-green-500 mb-2" />
            <p className="text-xs font-semibold tracking-wide mb-1">ESTIMATED DELIVERY</p>
            <p className="text-xs text-brand-gray-500">
              Standard: 3-5 working days<br />
              Express: 1-2 working days
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary flex items-center justify-center gap-2 text-xs px-8 py-3">
            CONTINUE SHOPPING <ArrowRight size={14} />
          </Link>
          <Link href="/" className="btn-secondary flex items-center justify-center gap-2 text-xs px-8 py-3">
            BACK TO HOME
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-brand-gray-400">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
