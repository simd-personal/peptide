import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendOrderConfirmation } from '../email/route';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, billingAddress, orderSummary } = body;

    // Create shipping address
    const shippingAddressRecord = await prisma.address.create({
      data: {
        type: 'shipping',
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        company: shippingAddress.company,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        userId: 'guest', // For demo - in real app, use actual user ID
      },
    });

    // Create billing address
    const billingAddressRecord = await prisma.address.create({
      data: {
        type: 'billing',
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        company: billingAddress.company,
        address1: billingAddress.address1,
        address2: billingAddress.address2,
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.postalCode,
        country: billingAddress.country,
        phone: billingAddress.phone,
        userId: 'guest', // For demo - in real app, use actual user ID
      },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: 'guest', // For demo - in real app, use actual user ID
        status: 'pending',
        subtotal: orderSummary.subtotal,
        tax: orderSummary.tax,
        shipping: orderSummary.shipping,
        total: orderSummary.total,
        shippingAddressId: shippingAddressRecord.id,
        billingAddressId: billingAddressRecord.id,
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

      // Update product inventory
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });

      // Log inventory change
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

    return NextResponse.json({ 
      orderId: order.id,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
} 