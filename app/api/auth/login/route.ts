import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Simple in-memory rate limiting (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const attempts = loginAttempts.get(ip);
  if (!attempts) return false;
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    if (Date.now() - attempts.timestamp < LOCKOUT_DURATION) {
      return true;
    } else {
      // Reset after lockout period
      loginAttempts.delete(ip);
      return false;
    }
  }
  return false;
}

function incrementLoginAttempts(ip: string) {
  const attempts = loginAttempts.get(ip) || { count: 0, timestamp: Date.now() };
  attempts.count++;
  loginAttempts.set(ip, attempts);
}

function resetLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: Request) {
  try {
    // Validate JWT_SECRET
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      incrementLoginAttempts(ip);
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      incrementLoginAttempts(ip);
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    resetLoginAttempts(ip);

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, accountType: user.accountType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle Prisma errors
    if (error?.name === 'PrismaClientKnownRequestError') {
      console.error('Database error:', error);
      return NextResponse.json(
        { message: 'Database error occurred. Please try again later.' },
        { status: 503 }
      );
    }

    // Handle JWT errors
    if (error?.name === 'JsonWebTokenError') {
      console.error('JWT error:', error);
      return NextResponse.json(
        { message: 'Authentication error occurred' },
        { status: 500 }
      );
    }

    // Handle bcrypt errors
    if (error?.name === 'BcryptError') {
      console.error('Password verification error:', error);
      return NextResponse.json(
        { message: 'Authentication error occurred' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
} 