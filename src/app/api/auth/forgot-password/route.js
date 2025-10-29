// src/app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db/userStorage';
import crypto from 'crypto';

// In production, you'd store these in a database
const resetTokens = new Map();

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = getUserByEmail(email);
    
    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a reset link'
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    // Store token (in production, save to database)
    resetTokens.set(token, {
      email,
      expires
    });

    // In production, send email with reset link
    // await sendPasswordResetEmail(email, token);
    
    console.log('Password reset token:', token);
    console.log('Reset link would be:', `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent',
      // Remove in production - only for demo
      token: process.env.NODE_ENV === 'development' ? token : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Helper to verify reset token
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const tokenData = resetTokens.get(token);

    if (!tokenData) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    if (Date.now() > tokenData.expires) {
      resetTokens.delete(token);
      return NextResponse.json(
        { success: false, error: 'Token has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      email: tokenData.email
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify token' },
      { status: 500 }
    );
  }
}