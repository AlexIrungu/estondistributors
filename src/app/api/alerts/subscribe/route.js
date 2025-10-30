// src/app/api/alerts/subscribe/route.js
// API endpoint for subscribing to price alerts

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Alert from '@/lib/db/models/Alert';
import { sendVerificationEmail } from '@/lib/services/emailService';
import { sendVerificationSMS, formatPhoneNumber, isValidKenyanPhone } from '@/lib/services/smsService';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    const { name, email, phone, fuelTypes, locations, alertTypes, threshold, emailEnabled, smsEnabled } = body;
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await Alert.findOne({ email });
    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Validate phone if SMS enabled
    if (smsEnabled) {
      if (!phone) {
        return NextResponse.json(
          { error: 'Phone number required for SMS alerts' },
          { status: 400 }
        );
      }
      
      if (!isValidKenyanPhone(phone)) {
        return NextResponse.json(
          { error: 'Invalid Kenyan phone number. Use format: 07XX XXX XXX or +254 7XX XXX XXX' },
          { status: 400 }
        );
      }
    }

    // Format phone number if provided
    const formattedPhone = phone ? formatPhoneNumber(phone) : null;

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create subscription
    const subscription = new Alert({
      name,
      email,
      phone: formattedPhone,
      preferences: {
        fuelTypes: fuelTypes || ['pms', 'ago', 'ik'],
        locations: locations || ['nairobi', 'mombasa'],
        alertTypes: alertTypes || ['price_increase', 'price_decrease', 'significant_change'],
        threshold: threshold || 5,
        emailEnabled: emailEnabled !== false,
        smsEnabled: smsEnabled || false,
      },
      verificationToken,
      verified: false,
      status: 'pending',
    });

    await subscription.save();

    // Send verification email
    if (emailEnabled !== false) {
      const emailResult = await sendVerificationEmail({
        to: email,
        name: name,
        verificationToken: verificationToken,
      });

      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error);
        // Don't fail the subscription, just log the error
      }
    }

    // Send verification SMS if enabled
    if (smsEnabled && formattedPhone) {
      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const smsResult = await sendVerificationSMS({
        to: formattedPhone,
        name: name,
        verificationCode: verificationCode,
      });

      if (!smsResult.success) {
        console.error('Failed to send verification SMS:', smsResult.error);
        // Don't fail the subscription, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully! Please check your email to verify.',
      subscription: {
        id: subscription._id,
        email: subscription.email,
        preferences: subscription.preferences,
      }
    });

  } catch (error) {
    console.error('Error in subscribe API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Check subscription status
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    const subscription = await Alert.findOne({ email }).select('-verificationToken');

    if (!subscription) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      exists: true,
      subscription: {
        id: subscription._id,
        status: subscription.status,
        verified: subscription.verified,
        preferences: subscription.preferences,
      }
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}