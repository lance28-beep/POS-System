import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CategoryGroup {
  category: string;
  _count: {
    id: number;
  };
}

export async function GET() {
  try {
    // Get all products and group them by category
    const categoryGroups = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });

    // Transform the data for the chart
    const labels = categoryGroups.map((group: CategoryGroup) => group.category);
    const data = categoryGroups.map((group: CategoryGroup) => group._count.id);

    return NextResponse.json({
      labels,
      data
    });
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category distribution' },
      { status: 500 }
    );
  }
} 