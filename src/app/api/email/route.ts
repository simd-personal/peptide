import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, orderId, email, subject, content } = body;

    // In a real app, integrate with email service like SendGrid, Mailgun, etc.
    // For demo purposes, we'll just log the email and store it in the database
    
    console.log('Email would be sent:', {
      type,
      orderId,
      email,
      subject,
      content: content.substring(0, 100) + '...'
    });

    // Store email log in database
    const emailLog = await prisma.emailLog.create({
      data: {
        orderId,
        type,
        subject,
        content,
        status: 'sent', // In real app, this would be 'pending' until actually sent
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ 
      message: 'Email logged successfully',
      emailLogId: emailLog.id 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

// Helper function to send order confirmation email
export async function sendOrderConfirmation(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const subject = `Order Confirmation - ${order.id}`;
    const content = `
      <h1>Thank you for your order!</h1>
      <p>Dear ${order.shippingAddress.firstName} ${order.shippingAddress.lastName},</p>
      <p>Your order has been confirmed and is being processed.</p>
      
      <h2>Order Details:</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      
      <h2>Items Ordered:</h2>
      <ul>
        ${order.items.map((item: any) => `
          <li>${item.product.name} - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
        `).join('')}
      </ul>
      
      <h2>Shipping Address:</h2>
      <p>
        ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
        ${order.shippingAddress.address1}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
      </p>
      
      <p>We'll send you tracking information once your order ships.</p>
      
      <p>Thank you for choosing our peptide products!</p>
    `;

    // Store email log
    await prisma.emailLog.create({
      data: {
        orderId,
        type: 'order_confirmation',
        subject,
        content,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    console.log('Order confirmation email logged for order:', orderId);
  } catch (error) {
    console.error('Error sending order confirmation:', error);
  }
} 