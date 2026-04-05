// components/ui/Skeletons.tsx
// Loading skeleton components

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-brand-gray-200 shimmer" />
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-brand-gray-200 rounded w-1/3" />
        <div className="h-4 bg-brand-gray-200 rounded w-4/5" />
        <div className="h-4 bg-brand-gray-200 rounded w-2/3" />
        <div className="h-4 bg-brand-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2 aspect-[3/4] bg-brand-gray-200" />
          <div className="aspect-[3/4] bg-brand-gray-200" />
          <div className="aspect-[3/4] bg-brand-gray-200" />
        </div>
        {/* Info */}
        <div className="space-y-4">
          <div className="h-4 bg-brand-gray-200 rounded w-1/3" />
          <div className="h-7 bg-brand-gray-200 rounded w-4/5" />
          <div className="h-6 bg-brand-gray-200 rounded w-1/4" />
          <div className="space-y-2 mt-6">
            <div className="h-4 bg-brand-gray-200 rounded" />
            <div className="h-4 bg-brand-gray-200 rounded w-5/6" />
            <div className="h-4 bg-brand-gray-200 rounded w-4/6" />
          </div>
          <div className="h-12 bg-brand-gray-200 rounded mt-8" />
          <div className="h-12 bg-brand-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="w-full h-[70vh] bg-brand-gray-200 shimmer animate-pulse" />
  );
}
