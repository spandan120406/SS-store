// app/api/stripe/create-checkout/route.ts
// Creates a Stripe Checkout Session

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
  try {
    const { items, shippingAddress, successUrl, cancelUrl } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items provided' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Build Stripe line items from cart
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: {
        product: { name: string; price: number; images: string[] };
        quantity: number;
        selectedSize: string;
        selectedColor: string;
      }) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.product.name,
            description: `Size: ${item.selectedSize} | Colour: ${item.selectedColor}`,
            images: item.product.images.slice(0, 1),
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to pence
        },
        quantity: item.quantity,
      })
    );

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${appUrl}/cart`,
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU', 'DE', 'FR'],
      },
      metadata: {
        orderItems: JSON.stringify(
          items.map((item: {
            product: { _id: string; name: string; price: number; images: string[] };
            quantity: number;
            selectedSize: string;
            selectedColor: string;
          }) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
            image: item.product.images[0] || '',
          }))
        ),
      },
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      customer_email: shippingAddress?.email,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
