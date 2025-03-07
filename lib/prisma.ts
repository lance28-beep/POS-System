import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Log the DATABASE_URL being used (but mask sensitive info)
const dbUrl = process.env.DATABASE_URL || '';
console.log('Database URL protocol:', dbUrl.split('://')[0]);
console.log('Database connection initialized');
