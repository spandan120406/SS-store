'use client';
// components/layout/Footer.tsx

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const FOOTER_LINKS = {
  'Customer Service': [
    { label: 'Contact Us', href: '#' },
    { label: 'My Orders', href: '#' },
    { label: 'Returns & Refunds', href: '#' },
    { label: 'Delivery Options', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Size Guide', href: '#' },
  ],
  'About H&M': [
    { label: 'About Us', href: '#' },
    { label: 'Sustainability', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Investors', href: '#' },
  ],
  'Discover': [
    { label: 'Gift Cards', href: '#' },
    { label: 'H&M Club', href: '#' },
    { label: 'H&M Home', href: '#' },
    { label: 'H&M Kids', href: '#' },
    { label: 'Student Discount', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-gray-50 border-t border-brand-gray-200 mt-16">
      {/* Newsletter */}
      <div className="bg-brand-black text-white py-12 px-4">
        <div className="max-w-[1400px] mx-auto text-center">
          <h3 className="text-xl font-light tracking-widest mb-2">JOIN THE CLUB</h3>
          <p className="text-brand-gray-400 text-sm mb-6">
            Subscribe to our newsletter for exclusive offers and style inspiration.
          </p>
          <div className="flex max-w-md mx-auto gap-0">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-brand-gray-800 border border-brand-gray-700 px-4 py-3 text-sm text-white placeholder-brand-gray-500 focus:outline-none focus:border-white"
            />
            <button className="bg-white text-brand-black px-6 py-3 text-sm font-medium tracking-widest hover:bg-brand-gray-100 transition-colors">
              JOIN
            </button>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold tracking-widest text-brand-black mb-4">
                {category.toUpperCase()}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-gray-500 hover:text-brand-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social media */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-brand-black mb-4">
              FOLLOW US
            </h4>
            <div className="flex gap-3 mb-6">
              {[
                { Icon: Instagram, label: 'Instagram', href: '#' },
                { Icon: Facebook, label: 'Facebook', href: '#' },
                { Icon: Twitter, label: 'Twitter', href: '#' },
                { Icon: Youtube, label: 'YouTube', href: '#' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-brand-gray-300 flex items-center justify-center hover:bg-brand-black hover:border-brand-black hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-brand-gray-400 font-medium tracking-wider">PAYMENT METHODS</p>
              <div className="flex gap-2 flex-wrap">
                {['VISA', 'MC', 'AMEX', 'PayPal'].map(method => (
                  <span
                    key={method}
                    className="border border-brand-gray-200 px-2.5 py-1 text-xs text-brand-gray-500 font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-gray-200 py-4 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-brand-gray-400">
            © {new Date().getFullYear()} S&S Demo Store. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms & Conditions', 'Cookie Settings'].map(item => (
              <a key={item} href="#" className="text-xs text-brand-gray-400 hover:text-brand-black">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
