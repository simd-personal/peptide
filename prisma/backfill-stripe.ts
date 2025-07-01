import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function backfillStripeProducts() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    try {
      console.log(`Processing product: ${product.name} (${product.id})`);
      // 1. Create Stripe Product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        images: product.image ? [product.image] : undefined,
        metadata: { productId: product.id },
      });
      // 2. Create one-time price
      const oneTimePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100),
        currency: 'usd',
      });
      // 3. Create subscription price
      const subscriptionPrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100),
        currency: 'usd',
        recurring: { interval: 'month' },
      });
      // 4. Update product in DB
      await prisma.product.update({
        where: { id: product.id },
        data: {
          stripeProductId: stripeProduct.id,
          stripeOneTimePriceId: oneTimePrice.id,
          stripeSubscriptionPriceId: subscriptionPrice.id,
        },
      });
      console.log(`✔ Updated product ${product.name} with new Stripe IDs.`);
    } catch (err) {
      console.error(`✖ Failed to update product ${product.name}:`, err);
    }
  }
  await prisma.$disconnect();
}

backfillStripeProducts().then(() => {
  console.log('Backfill complete.');
}); 