// app/page.tsx
// Main homepage

import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanners from '@/components/home/PromoBanners';
import { getFeaturedProducts, getNewArrivals, getSaleProducts } from '@/lib/products-data';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  const saleProducts = getSaleProducts();

  return (
    <>
      {/* Hero carousel */}
      <HeroBanner />

      {/* Category grid */}
      <CategoryGrid />

      {/* New Arrivals */}
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Fresh styles just landed"
        products={newArrivals}
        viewAllHref="/shop?category=new-arrivals&sort=newest"
        viewAllLabel="VIEW ALL NEW"
      />

      {/* Promo banners */}
      <PromoBanners />

      {/* Featured Products */}
      <FeaturedProducts
        title="Our Picks"
        subtitle="Staff-selected favourites this season"
        products={featuredProducts}
        viewAllHref="/shop"
        viewAllLabel="VIEW ALL"
      />

      {/* Sale section */}
      <section className="bg-brand-black py-3 mb-0">
        <p className="text-center text-white text-xs tracking-[0.3em] font-medium">
          SALE IS ON · UP TO 70% OFF · FREE RETURNS
        </p>
      </section>
      <FeaturedProducts
        title="Sale"
        subtitle="Great styles at even better prices"
        products={saleProducts}
        viewAllHref="/shop?category=sale"
        viewAllLabel="SHOP SALE"
      />

      {/* Trust badges */}
      <section className="border-t border-brand-gray-200 py-10 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', title: 'Free Delivery', sub: 'On orders over £30' },
            { icon: '↩️', title: 'Free Returns', sub: 'Within 30 days' },
            { icon: '🔒', title: 'Secure Payment', sub: 'Protected by Stripe' },
            { icon: '💚', title: 'Sustainable', sub: 'We care about our planet' },
          ].map(badge => (
            <div key={badge.title} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-xs font-semibold tracking-wider">{badge.title}</p>
              <p className="text-xs text-brand-gray-500">{badge.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
