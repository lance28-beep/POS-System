import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      return NextResponse.json(
        { message: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { message: 'Error fetching sale' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      );
    }

    // Get the sale with its items
    const sale = await prisma.sale.findUnique({
      where: { id: params.id },
      include: {
        items: true,
      },
    });

    if (!sale) {
      return NextResponse.json(
        { message: 'Sale not found' },
        { status: 404 }
      );
    }

    // If cancelling, restore product stocks
    if (status === 'cancelled' && sale.status === 'completed') {
      await prisma.$transaction(async (tx) => {
        // Update sale status
        await tx.sale.update({
          where: { id: params.id },
          data: { status },
        });

        // Restore product stocks
        for (const item of sale.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stocks: {
                increment: item.quantity,
              },
            },
          });
        }
      });
    } else {
      // Just update the status
      await prisma.sale.update({
        where: { id: params.id },
        data: { status },
      });
    }

    return NextResponse.json({ message: 'Sale updated successfully' });
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json(
      { message: 'Error updating sale' },
      { status: 500 }
    );
  }
} 