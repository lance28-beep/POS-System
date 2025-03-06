import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.accountType !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, jobRole, email, contactNumber, accountType } = body;

    // Validate required fields
    if (!fullName || !jobRole || !email || !contactNumber || !accountType) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { email },
          { NOT: { id: params.id } },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        fullName,
        jobRole,
        email,
        contactNumber,
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
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Error updating user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.accountType !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deleting the last admin
    if (user.accountType === 'admin') {
      const adminCount = await prisma.user.count({
        where: { accountType: 'admin' },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { message: 'Cannot delete the last admin user' },
          { status: 400 }
        );
      }
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Error deleting user' },
      { status: 500 }
    );
  }
} 