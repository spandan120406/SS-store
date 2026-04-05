// app/api/products/route.ts
// GET all products with filtering, sorting, and pagination

import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const sortBy = searchParams.get('sort') || 'featured';
    const isNew = searchParams.get('isNew');
    const isSale = searchParams.get('isSale');
    const isFeatured = searchParams.get('isFeatured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const sizes = searchParams.get('sizes')?.split(',');

    // Start with all products
    let products = [...PRODUCTS];

    // Apply filters
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (subcategory) {
      products = products.filter(p => p.subcategory === subcategory);
    }

    if (isNew === 'true') {
      products = products.filter(p => p.isNew);
    }

    if (isSale === 'true') {
      products = products.filter(p => p.isSale);
    }

    if (isFeatured === 'true') {
      products = products.filter(p => p.isFeatured);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }

    // Price range filter
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Size filter
    if (sizes && sizes.length > 0) {
      products = products.filter(p =>
        sizes.some(size => p.sizes.includes(size))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case 'popular':
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        products.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
        break;
    }

    // Pagination
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
