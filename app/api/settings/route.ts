import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const settings = await prisma.settings.findUnique({
      where: {
        id: '1',
      },
    });

    if (!settings) {
      return NextResponse.json(
        { message: 'Settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { message: 'Error fetching settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.accountType !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      address,
      phone,
      email,
      currency,
      taxRate,
      timezone,
      dateFormat,
      theme,
      language,
    } = body;

    const settings = await prisma.settings.update({
      where: {
        id: '1',
      },
      data: {
        companyName,
        address,
        phone,
        email,
        currency,
        taxRate,
        timezone,
        dateFormat,
        theme,
        language,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { message: 'Error updating settings' },
      { status: 500 }
    );
  }
} 