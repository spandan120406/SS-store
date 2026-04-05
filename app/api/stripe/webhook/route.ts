// app/api/stripe/webhook/route.ts
// Handles Stripe webhook events to update order status

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { generateOrderId } from '@/lib/utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  try {
    await dbConnect();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (metadata?.orderItems) {
          const items = JSON.parse(metadata.orderItems);
          const shippingDetails = session.shipping_details;
          const customerDetails = session.customer_details;

          // Build shipping address from Stripe data
          const shippingAddress = {
            firstName: customerDetails?.name?.split(' ')[0] || '',
            lastName: customerDetails?.name?.split(' ').slice(1).join(' ') || '',
            email: customerDetails?.email || '',
            phone: customerDetails?.phone || '',
            address: shippingDetails?.address?.line1 || '',
            city: shippingDetails?.address?.city || '',
            postcode: shippingDetails?.address?.postal_code || '',
            country: shippingDetails?.address?.country || 'GB',
          };

          const subtotal = (session.amount_total || 0) / 100;

          // Create order record in database
          await Order.create({
            orderId: generateOrderId(),
            guestEmail: customerDetails?.email,
            items,
            shippingAddress,
            subtotal,
            shippingCost: 0,
            total: subtotal,
            status: 'confirmed',
            paymentStatus: 'paid',
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Update order payment status if we have a matching session
        await Order.updateOne(
          { stripePaymentIntentId: paymentIntent.id },
          { paymentStatus: 'failed' }
        );
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

// Stripe requires the raw body — disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};
