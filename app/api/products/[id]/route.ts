// app/api/products/[id]/route.ts
// GET single product by ID

import { NextRequest, NextResponse } from 'next/server';
import { getProductById, PRODUCTS } from '@/lib/products-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = getProductById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Get related products (same category, excluding current product)
    const related = PRODUCTS.filter(
      p => p.category === product.category && p._id !== product._id
    ).slice(0, 4);

    return NextResponse.json({
      success: true,
      product,
      related,
    });
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
