import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // For now, return mock data since we haven't implemented all the models yet
    return NextResponse.json({
      totalSales: 15000,
      totalInventory: 250,
      activeUsers: 12,
      recentTransactions: 45,
      lowStockItems: 8,
      pendingBills: 5,
      monthlyRevenue: 25000,
      monthlyExpenses: 18000
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 