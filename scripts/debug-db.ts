import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Log environment
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Log DATABASE_URL (safely)
  const dbUrl = process.env.DATABASE_URL || '';
  const [protocol, rest] = dbUrl.split('://');
  console.log('Database URL protocol:', protocol);
  console.log('Has connection string:', !!rest);

  // Validate URL format
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.error('ERROR: DATABASE_URL must start with postgresql:// or postgres://');
    process.exit(1);
  }

  // Initialize Prisma with logging
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Attempting database connection...');
    await prisma.$connect();
    console.log('Successfully connected to database');

    // Test query
    const userCount = await prisma.user.count();
    console.log('Current user count:', userCount);

    await prisma.$disconnect();
    console.log('Successfully disconnected from database');
  } catch (error) {
    console.error('Database connection/query error:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 