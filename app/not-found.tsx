// app/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-light text-brand-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-light tracking-wide mb-3">Page Not Found</h1>
      <p className="text-sm text-brand-gray-500 mb-8 max-w-sm">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
        It may have been moved or no longer exists.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary text-xs px-8 py-3">
          GO HOME
        </Link>
        <Link href="/shop" className="btn-secondary text-xs px-8 py-3">
          BROWSE SHOP
        </Link>
      </div>
    </div>
  );
}
