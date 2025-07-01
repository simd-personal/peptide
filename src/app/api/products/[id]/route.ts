import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 