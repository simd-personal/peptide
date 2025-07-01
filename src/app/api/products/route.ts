import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Create product in DB first (to get ID, etc.)
    const product = await prisma.product.create({
      data: {
        name: body.name,
        useCase: body.useCase,
        injectionSite: body.injectionSite,
        description: body.description,
        tags: JSON.stringify(body.tags),
        price: body.price,
        dosage: body.dosage,
        cycleLength: body.cycleLength,
        image: body.image,
        stockQuantity: body.stockQuantity,
        isActive: body.isActive,
      },
    });

    // 2. Create Stripe Product
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
      images: product.image ? [product.image] : undefined,
      metadata: { productId: product.id },
    });

    // 3. Create Stripe Prices
    // One-time price
    const oneTimePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100), // cents
      currency: 'usd',
    });
    // Subscription price (monthly)
    const subscriptionPrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100), // same price, monthly
      currency: 'usd',
      recurring: { interval: 'month' },
    });

    // 4. Update product with Stripe IDs
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        stripeProductId: stripeProduct.id,
        stripeOneTimePriceId: oneTimePrice.id,
        stripeSubscriptionPriceId: subscriptionPrice.id,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
} 