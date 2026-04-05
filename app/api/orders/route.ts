// app/api/orders/route.ts
// POST create order, GET list orders

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { generateOrderId } from '@/lib/utils';

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const {
      items,
      shippingAddress,
      subtotal,
      shippingCost = 0,
      total,
      stripeSessionId,
      userId,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order must have at least one item' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, message: 'Shipping address is required' },
        { status: 400 }
      );
    }

    const orderId = generateOrderId();

    const order = await Order.create({
      orderId,
      userId,
      guestEmail: shippingAddress.email,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      status: 'confirmed',
      paymentStatus: stripeSessionId ? 'paid' : 'pending',
      stripeSessionId,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get orders (requires auth or email param)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    let query: Record<string, string> = {};
    if (userId) query.userId = userId;
    else if (email) query.guestEmail = email;
    else {
      return NextResponse.json(
        { success: false, message: 'Email or userId required' },
        { status: 400 }
      );
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
