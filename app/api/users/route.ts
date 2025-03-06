import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        jobRole: true,
        email: true,
        contactNumber: true,
        username: true,
        accountType: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users' },
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
    const { fullName, jobRole, email, contactNumber, username, password, accountType } = body;

    // Validate required fields
    if (!fullName || !jobRole || !email || !contactNumber || !username || !password || !accountType) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        jobRole,
        email,
        contactNumber,
        username,
        password: hashedPassword,
        accountType,
      },
      select: {
        id: true,
        fullName: true,
        jobRole: true,
        email: true,
        contactNumber: true,
        username: true,
        accountType: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
} 