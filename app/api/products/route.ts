import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, category, supplier, stocks, unitPrice } = body;

    // Validate required fields
    if (!code || !name || !category || !supplier || !stocks || !unitPrice) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = stocks * unitPrice;

    // Create new product
    const product = await prisma.product.create({
      data: {
        code,
        name,
        category,
        supplier,
        stocks,
        unitPrice,
        totalPrice,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product code already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 