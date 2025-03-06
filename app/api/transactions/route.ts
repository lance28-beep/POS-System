import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      include: {
        sale: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, amount, description } = body;

    // Validate required fields
    if (!type || !amount || !description) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        description,
        status: 'completed',
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { message: 'Error creating transaction' },
      { status: 500 }
    );
  }
} 