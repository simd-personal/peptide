import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { sendOrderConfirmation } from '../../email/route';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  let body: Buffer;

  try {
    // Next.js API routes don't expose raw body by default, workaround:
    body = Buffer.from(await req.arrayBuffer());
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret!);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      // Parse metadata
      const userId = session.metadata?.userId || 'guest';
      const shippingAddress = JSON.parse(session.metadata?.shippingAddress || '{}');
      const billingAddress = JSON.parse(session.metadata?.billingAddress || '{}');
      const items = JSON.parse(session.metadata?.items || '[]');
      const orderSummary = JSON.parse(session.metadata?.orderSummary || '{}');

      // Create shipping address
      const shippingAddressRecord = await prisma.address.create({
        data: { ...shippingAddress, type: 'shipping', userId },
      });
      // Create billing address
      const billingAddressRecord = await prisma.address.create({
        data: { ...billingAddress, type: 'billing', userId },
      });
      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          status: 'paid',
          subtotal: orderSummary.subtotal,
          tax: orderSummary.tax,
          shipping: orderSummary.shipping,
          total: orderSummary.total,
          shippingAddressId: shippingAddressRecord.id,
          billingAddressId: billingAddressRecord.id,
          stripePaymentId: session.payment_intent as string,
        },
      });
      // Create order items and update inventory
      for (const item of items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });
        await prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        await prisma.inventoryLog.create({
          data: {
            productId: item.productId,
            type: 'out',
            quantity: item.quantity,
            reason: `Order ${order.id}`,
          },
        });
      }
      // Send order confirmation email
      await sendOrderConfirmation(order.id);
    } catch (err) {
      console.error('Error fulfilling order from Stripe webhook:', err);
      return NextResponse.json({ error: 'Order fulfillment error' }, { status: 500 });
    }
  }
  return NextResponse.json({ received: true });
} 