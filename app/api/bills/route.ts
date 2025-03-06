import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json(
      { message: 'Error fetching bills' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, dueDate, description } = body;

    // Validate required fields
    if (!type || !amount || !dueDate || !description) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate bill number (format: BILL-YYYYMMDD-XXXX)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const number = `BILL-${year}${month}${day}-${random}`;

    // Create bill
    const bill = await prisma.bill.create({
      data: {
        number,
        type,
        amount,
        dueDate: new Date(dueDate),
        description,
        status: 'pending',
      },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json(
      { message: 'Error creating bill' },
      { status: 500 }
    );
  }
} 