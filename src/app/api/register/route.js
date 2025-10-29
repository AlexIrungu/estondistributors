// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import { createUserAccount } from '@/lib/db/userStorage.server';

export async function POST(request) {
  try {
    const userData = await request.json();

    console.log('Registration attempt:', { email: userData.email, name: userData.name });

    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Create user account
    const result = await createUserAccount(userData);

    console.log('Registration result:', result.success ? 'Success' : 'Failed', result.error || '');

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        user: result.user,
        message: 'Account created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
