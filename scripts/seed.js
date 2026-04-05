// scripts/seed.js
// Run with: node scripts/seed.js
// Seeds the MongoDB database with demo products and a test user

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hm-store';

// ---- Inline product data (mirrors lib/products-data.ts) ----
const PRODUCTS = [
  {
    name: 'Regular Fit Cotton T-shirt',
    price: 9.99,
    description: 'Regular-fit T-shirt in soft cotton jersey. Crew neck and short sleeves.',
    category: 'men',
    subcategory: 't-shirts',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy'],
    rating: 4.2, reviewCount: 234, isNew: false, isSale: false, isFeatured: true, stock: 150, sku: 'TS-001', tags: ['basics', 'essentials'],
  },
  {
    name: 'Slim Fit Polo Shirt',
    price: 19.99,
    description: 'Slim-fit polo shirt in smooth piqué fabric.',
    category: 'men',
    subcategory: 't-shirts',
    images: ['https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'White', 'Forest Green'],
    rating: 4.5, reviewCount: 189, isNew: true, isSale: false, isFeatured: true, stock: 80, sku: 'TS-002', tags: ['polo', 'smart-casual'],
  },
  {
    name: 'Regular Fit Hoodie',
    price: 34.99,
    description: 'Regular-fit hoodie in soft terry fabric.',
    category: 'men',
    subcategory: 'hoodies',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Grey', 'Black', 'Navy'],
    rating: 4.6, reviewCount: 412, isNew: false, isSale: false, isFeatured: true, stock: 200, sku: 'HD-001', tags: ['hoodie', 'essentials'],
  },
  {
    name: 'Technical Softshell Jacket',
    price: 69.99,
    description: 'Jacket in technical softshell fabric with four-way stretch.',
    category: 'men',
    subcategory: 'jackets',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Forest Green'],
    rating: 4.7, reviewCount: 289, isNew: false, isSale: false, isFeatured: true, stock: 70, sku: 'JK-001', tags: ['jacket', 'outdoor'],
  },
  {
    name: 'Slim Fit Jeans',
    price: 39.99,
    description: 'Slim-fit jeans in stretch denim.',
    category: 'men',
    subcategory: 'jeans',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'],
    sizes: ['28/30', '30/32', '32/32', '34/32'],
    colors: ['Mid Denim', 'Dark Denim', 'Black'],
    rating: 4.4, reviewCount: 567, isNew: false, isSale: false, isFeatured: true, stock: 250, sku: 'JN-001', tags: ['jeans', 'slim'],
  },
  {
    name: 'Suede Chelsea Boots',
    price: 69.99,
    description: 'Chelsea boots in suede with elastic gore panels.',
    category: 'men',
    subcategory: 'shoes',
    images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=80'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['Brown', 'Black'],
    rating: 4.6, reviewCount: 178, isNew: false, isSale: false, isFeatured: true, stock: 60, sku: 'SH-001', tags: ['chelsea', 'boots'],
  },
  {
    name: 'Puffer Jacket',
    price: 49.99,
    originalPrice: 79.99,
    description: 'Lightweight puffer jacket with down-like filling.',
    category: 'sale',
    subcategory: 'jackets',
    images: ['https://images.unsplash.com/photo-1587491439149-bd2ff295d450?w=600&q=80'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Red'],
    rating: 4.6, reviewCount: 321, isNew: false, isSale: true, isFeatured: true, stock: 45, sku: 'SA-001', tags: ['puffer', 'sale'],
  },
  {
    name: 'Ribbed Jersey Dress',
    price: 29.99,
    description: 'Fitted dress in soft ribbed jersey.',
    category: 'women',
    subcategory: 'dresses',
    images: ['https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=600&q=80'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Cream', 'Dusty Rose'],
    rating: 4.5, reviewCount: 312, isNew: true, isSale: false, isFeatured: true, stock: 120, sku: 'WD-001', tags: ['dress', 'women'],
  },
];

async function seed() {
  console.log('🌱 Seeding database...');

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Dynamic import for ES modules
  const bcrypt = require('bcryptjs');

  // Define schemas inline
  const productSchema = new mongoose.Schema({
    name: String, price: Number, originalPrice: Number,
    description: String, category: String, subcategory: String,
    images: [String], sizes: [String], colors: [String],
    rating: Number, reviewCount: Number,
    isNew: Boolean, isSale: Boolean, isFeatured: Boolean,
    stock: Number, sku: { type: String, unique: true }, tags: [String],
  }, { timestamps: true });

  const userSchema = new mongoose.Schema({
    name: String, email: { type: String, unique: true },
    password: String, role: { type: String, default: 'user' },
  });

  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
  const User = mongoose.models.User || mongoose.model('User', userSchema);

  // Clear existing
  await Product.deleteMany({});
  await User.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Seed products
  await Product.insertMany(PRODUCTS);
  console.log(`📦 Inserted ${PRODUCTS.length} products`);

  // Seed test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
    role: 'user',
  });
  console.log('👤 Created test user: test@example.com / password123');

  // Seed admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: adminPassword,
    role: 'admin',
  });
  console.log('👑 Created admin user: admin@example.com / admin123');

  await mongoose.disconnect();
  console.log('\n✅ Seeding complete!');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
