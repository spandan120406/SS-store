'use client';
// app/signup/page.tsx

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  marketing: z.boolean().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const result = await res.json();

      if (result.success) {
        setUser(result.user, result.token);
        toast.success('Account created! Welcome to S&S.');
        router.push('/');
      } else {
        toast.error(result.message || 'Signup failed');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light tracking-wide mb-2">Create Account</h1>
          <p className="text-sm text-brand-gray-500">
            Join S&S Club for exclusive offers and early access to sales
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
              Full name
            </label>
            <input
              {...register('name')}
              className={cn('input-field', errors.name && 'border-brand-red')}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-xs text-brand-red mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
              Email address
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={cn('input-field', errors.email && 'border-brand-red')}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-xs text-brand-red mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={cn('input-field pr-10', errors.password && 'border-brand-red')}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-400 hover:text-brand-black"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-brand-red mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-brand-gray-700 mb-1.5">
              Confirm password
            </label>
            <input
              {...register('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={cn('input-field', errors.confirmPassword && 'border-brand-red')}
              placeholder="Repeat your password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-brand-red mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              {...register('marketing')}
              className="w-3.5 h-3.5 accent-brand-black mt-0.5"
            />
            <span className="text-xs text-brand-gray-500 leading-relaxed">
              I'd like to receive emails about exclusive offers, new arrivals, and style inspiration from H&M.
            </span>
          </label>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-4 py-4"
          >
            <UserPlus size={14} />
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </motion.button>

          <p className="text-xs text-brand-gray-400 text-center">
            By creating an account you agree to our{' '}
            <a href="#" className="underline hover:text-brand-black">Terms & Conditions</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-brand-black">Privacy Policy</a>.
          </p>
        </form>

        <p className="text-center text-sm text-brand-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-black font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
