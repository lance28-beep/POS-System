import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { message: 'Error fetching sales' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, paymentMethod, items } = body;

    // Validate required fields
    if (!customerName || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate invoice number (format: INV-YYYYMMDD-XXXX)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const invoiceNumber = `INV-${year}${month}${day}-${random}`;

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);

    // Create sale with items in a transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create the sale
      const newSale = await tx.sale.create({
        data: {
          invoiceNumber,
          customerName,
          paymentMethod,
          totalAmount,
          status: 'completed',
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product stocks
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stocks: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newSale;
    });

    return NextResponse.json(sale);
  } catch (error: any) {
    console.error('Error creating sale:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Invoice number already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error creating sale' },
      { status: 500 }
    );
  }
} 