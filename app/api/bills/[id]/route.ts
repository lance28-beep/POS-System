import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Update bill status
    const bill = await prisma.bill.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json(
      { message: 'Error updating bill' },
      { status: 500 }
    );
  }
} 