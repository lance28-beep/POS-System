import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Successfully connected to the database');

    // Create a test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        password: hashedPassword,
        fullName: 'Test User',
        email: 'test@example.com',
        jobRole: 'Admin',
        contactNumber: '1234567890',
        accountType: 'admin',
      },
    });

    console.log('Created test user:', user);

    // Query all users
    const users = await prisma.user.findMany();
    console.log('All users:', users);

    // Test successful
    console.log('Database connection and queries successful!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 