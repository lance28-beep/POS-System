import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { message: 'Error fetching settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    // Validate required fields
    if (!companyName || !address || !phone || !email || !currency || !taxRate || !timezone || !dateFormat || !theme || !language) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Upsert settings
    const settings = await prisma.settings.upsert({
      where: {
        id: '1', // We only have one settings record
      },
      update: {
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
      create: {
        id: '1',
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
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { message: 'Error saving settings' },
      { status: 500 }
    );
  }
} 