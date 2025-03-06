import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function GET() {
  try {
    // For now, return mock data for the last 6 months
    const labels = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return MONTHS[date.getMonth()];
    });

    const revenue = [18000, 22000, 19500, 24000, 25000, 28000];
    const expenses = [15000, 16500, 14800, 17500, 18000, 19000];

    return NextResponse.json({
      labels,
      revenue,
      expenses
    });
  } catch (error) {
    console.error('Error fetching revenue and expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue and expenses' },
      { status: 500 }
    );
  }
} 