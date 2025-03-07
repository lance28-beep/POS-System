import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'not set';
  const maskedDbUrl = dbUrl.replace(/\/\/.*@/, '//*****@');
  
  return NextResponse.json({
    database_url_starts_with: dbUrl.substring(0, 20) + '...',
    database_url_is_string: typeof dbUrl === 'string',
    database_url_length: dbUrl.length,
    starts_with_postgresql: dbUrl.startsWith('postgresql://'),
    starts_with_postgres: dbUrl.startsWith('postgres://'),
    env_keys: Object.keys(process.env).filter(key => 
      !key.toLowerCase().includes('token') && 
      !key.toLowerCase().includes('secret') &&
      !key.toLowerCase().includes('password')
    ),
    node_env: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV,
  });
} 