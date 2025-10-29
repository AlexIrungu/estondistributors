// src/app/api/init-demo-users/route.js
import { NextResponse } from 'next/server';
import { initializeDemoUsers } from '@/lib/db/initDemoUsers';

export async function POST(request) {
  try {
    // Optional: Add a secret key check for security
    const { secret } = await request.json().catch(() => ({}));
    
    if (process.env.NODE_ENV === 'production' && secret !== process.env.INIT_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results = await initializeDemoUsers();
    
    return NextResponse.json({
      success: true,
      message: 'Demo users initialized',
      results
    });
  } catch (error) {
    console.error('Error initializing demo users:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to initialize demo users'
  });
}