// app/layout.tsx

import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'H&M Demo Store — Fashion & Quality',
    template: '%s | S&S Demo Store',
  },
  description:
    'Discover our latest fashion collection — T-shirts, Hoodies, Jackets, Jeans and more. Free delivery over £30.',
  keywords: ['fashion', 'clothing', 'men', 'women', 'sale', 'H&M', 'shop'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'H&M Demo Store',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Global toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2500,
            style: {
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.05em',
              borderRadius: '0',
            },
          }}
        />

        <Navbar />
        <CartDrawer />

        <main className="min-h-[60vh]">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
