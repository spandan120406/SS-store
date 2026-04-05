# H&M-Style Fashion eCommerce Store

A production-ready, full-stack fashion eCommerce website built with Next.js 14, inspired by H&M's design language. Features a complete shopping experience: product browsing, filtering, cart management, Stripe checkout, and user authentication.

---

## 📸 Features

- **Homepage** — Hero carousel, category grid, featured products, promo banners
- **Shop/PLP** — Grid layout, live filters (category, size, price), sorting
- **Product Detail** — Image gallery, size/color selector, Add to Bag, Buy Now
- **Cart** — Drawer + full-page cart, quantity controls, order summary
- **Checkout** — Shipping form with validation, Stripe payment redirect
- **Auth** — Sign up / sign in with JWT, guest checkout
- **UI/UX** — Sticky nav with dropdowns, loading skeletons, toast notifications, Framer Motion animations, fully responsive

---

## 🗂️ Project Structure

```
hm-store/
├── app/
│   ├── layout.tsx              # Root layout (Navbar, Footer, CartDrawer, Toaster)
│   ├── page.tsx                # Homepage
│   ├── shop/
│   │   └── page.tsx            # Product listing page
│   ├── product/[id]/
│   │   └── page.tsx            # Product detail page
│   ├── cart/
│   │   └── page.tsx            # Full cart page
│   ├── checkout/
│   │   ├── page.tsx            # Checkout form
│   │   └── success/
│   │       └── page.tsx        # Order confirmation
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── signup/
│   │   └── page.tsx            # Signup page
│   └── api/
│       ├── products/
│       │   ├── route.ts        # GET all products (filter/sort/paginate)
│       │   └── [id]/route.ts   # GET single product + related
│       ├── orders/
│       │   └── route.ts        # POST create order, GET list orders
│       ├── auth/
│       │   ├── login/route.ts  # POST login
│       │   └── signup/route.ts # POST signup
│       └── stripe/
│           ├── create-checkout/route.ts  # POST create Stripe session
│           └── webhook/route.ts          # POST Stripe webhook handler
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav with dropdowns, search, cart icon
│   │   └── Footer.tsx          # Footer with links, newsletter, socials
│   ├── cart/
│   │   └── CartDrawer.tsx      # Slide-in cart sidebar
│   ├── home/
│   │   ├── HeroBanner.tsx      # Auto-playing hero carousel
│   │   ├── CategoryGrid.tsx    # 4-column category image grid
│   │   ├── FeaturedProducts.tsx # Product grid section with header
│   │   └── PromoBanners.tsx    # 2-column editorial promo banners
│   ├── product/
│   │   ├── ProductCard.tsx     # Grid card with hover quick-add
│   │   └── ProductFilters.tsx  # Sidebar + mobile drawer filters
│   └── ui/
│       └── Skeletons.tsx       # Loading skeleton components
│
├── lib/
│   ├── products-data.ts        # 28 demo products + helper functions
│   ├── cart-store.ts           # Zustand cart state (persisted to localStorage)
│   ├── auth-store.ts           # Zustand auth state (persisted)
│   ├── db.ts                   # MongoDB/Mongoose connection with caching
│   └── utils.ts                # cn(), formatPrice(), calculateDiscount(), etc.
│
├── models/
│   ├── Product.ts              # Mongoose Product schema
│   ├── User.ts                 # Mongoose User schema (bcrypt hashing)
│   └── Order.ts                # Mongoose Order schema
│
├── scripts/
│   └── seed.js                 # Database seeding script
│
├── styles/
│   └── globals.css             # Global CSS, Tailwind directives, custom utilities
│
├── public/images/              # Static assets
├── .env.local.example          # Environment variables template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| State Management | Zustand (with localStorage persistence) |
| Form Validation | React Hook Form + Zod |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Payments | Stripe Checkout (test mode) |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Language | TypeScript |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (free, for test mode)

### 1. Clone and Install

```bash
# Navigate into the project
cd hm-store

# Install all dependencies
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the template
cp .env.local.example .env.local

# Edit .env.local with your values
```

Fill in these required values:

```env
# MongoDB — local or Atlas connection string
MONGODB_URI=mongodb://localhost:27017/hm-store

# JWT — any random secret string
JWT_SECRET=my-super-secret-key-123

# Stripe — from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # only needed for webhooks

# App base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** The app works in "demo mode" without MongoDB or Stripe — products are served from local data, and checkout shows a simulated success screen.

### 3. Seed the Database (optional)

```bash
npm run seed
```

This creates:
- 8 sample products in MongoDB
- Test user: `test@example.com` / `password123`
- Admin user: `admin@example.com` / `admin123`

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 💳 Stripe Setup

### Test mode (recommended for development)

1. Go to [stripe.com](https://stripe.com) → Create a free account
2. Dashboard → Developers → API Keys
3. Copy **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`)
4. Paste into `.env.local`

### Test payment card

When the Stripe checkout page loads, use:

```
Card number:  4242 4242 4242 4242
Expiry:       Any future date (e.g. 12/34)
CVC:          Any 3 digits (e.g. 123)
Postcode:     Any valid format (e.g. SW1A 1AA)
```

### Webhook setup (for order persistence)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook signing secret shown and add to .env.local
```

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or via CLI:
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

Use **MongoDB Atlas** (free tier) for the cloud database.

---

## 🔑 Key Implementation Notes

### Cart State
Cart uses Zustand with `persist` middleware — items survive page refreshes automatically via localStorage. No server session required.

### Auth Flow
JWT is stored in Zustand (also persisted). Protected routes can check `useAuthStore().user`. Guest checkout works without any account.

### Product Data
Products are served from `lib/products-data.ts` (no DB call needed) so the app runs without MongoDB. The API routes also support MongoDB queries when `MONGODB_URI` is set.

### Image CDN
All product images use Unsplash URLs. In production, replace with your own CDN or upload pipeline.

---

## 📱 Responsive Breakpoints

| Breakpoint | Columns | Layout |
|---|---|---|
| Mobile (`< 640px`) | 2 | Compact product grid, mobile nav |
| Tablet (`640–1024px`) | 2–3 | Medium grid, condensed filters |
| Desktop (`> 1024px`) | 3–4 | Full grid, sidebar filters visible |

---

## 🧩 Extending the Project

**Add more products:** Edit `lib/products-data.ts` — add entries to the `PRODUCTS` array.

**Add new categories:** Update `NAV_ITEMS` in `Navbar.tsx` and `SUBCATEGORY_OPTIONS` in `ProductFilters.tsx`.

**Enable real orders:** Set `MONGODB_URI` — the `/api/orders` route will save orders to MongoDB. The Stripe webhook handler also auto-creates orders on payment success.

**Add admin dashboard:** Create `app/admin/page.tsx` with a check for `user.role === 'admin'`.

---

## 📄 License

MIT — free to use for personal and commercial projects.
