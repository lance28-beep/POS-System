import { PrismaClient } from '@prisma/client';

async function main() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.split('://')[0] + '://***');

  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // Test the connection
    await prisma.$connect();
    console.log('Successfully connected to the database');

    // Try to query users
    const userCount = await prisma.user.count();
    console.log('Number of users in database:', userCount);

    await prisma.$disconnect();
    console.log('Successfully disconnected from the database');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

main(); 