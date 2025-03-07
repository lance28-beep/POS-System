import { PrismaClient } from '@prisma/client';

async function main() {
  console.log('Checking environment variables...');
  
  const databaseUrl = process.env.DATABASE_URL;
  console.log('DATABASE_URL:', databaseUrl);
  
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set!');
    process.exit(1);
  }

  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    console.error('DATABASE_URL must start with postgresql:// or postgres://');
    process.exit(1);
  }

  console.log('Attempting to connect to database...');
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('Successfully connected to database!');
    
    const userCount = await prisma.user.count();
    console.log('Number of users in database:', userCount);
  } catch (error) {
    console.error('Failed to connect to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 