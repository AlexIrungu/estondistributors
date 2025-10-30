// src/app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findByEmail(email);
    
    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a reset link'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save token to user (expires in 1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In production, send email with reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    console.log('Password reset link:', resetUrl);
    console.log('Reset token:', resetToken);

    // TODO: Send email with resetUrl
    // await sendPasswordResetEmail(user.email, resetUrl);

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent',
      // Remove in production - only for demo
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Verify reset token
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

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Connect to database
    await connectDB();

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      email: user.email
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify token' },
      { status: 500 }
    );
  }
}