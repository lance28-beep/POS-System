import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function GET() {
  try {
    // For now, return mock data for the last 7 days
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return DAYS[date.getDay()];
    });

    const data = [4500, 5200, 4800, 5800, 6000, 5500, 6200];

    return NextResponse.json({
      labels,
      data
    });
  } catch (error) {
    console.error('Error fetching sales trend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales trend' },
      { status: 500 }
    );
  }
} 