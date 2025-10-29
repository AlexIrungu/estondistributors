// src/app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, updateUser } from '@/lib/db/userStorage';

// This should match the tokens Map from forgot-password route
// In production, use a database
const resetTokens = new Map();

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Verify token
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

    // Get user
    const user = getUserByEmail(tokenData.email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    const result = updateUser(user.id, {
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Delete used token
    resetTokens.delete(token);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}