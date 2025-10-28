// src/app/api/alerts/subscribe/route.js
// API endpoint for subscribing to price alerts

import { NextResponse } from 'next/server';
import { createAlertSubscriptionRecord } from '@/lib/db/alertStorage';
import { sendVerificationEmail } from '@/lib/services/emailService';
import { sendVerificationSMS, formatPhoneNumber, isValidKenyanPhone } from '@/lib/services/smsService';

export async function POST(request) {
  try {
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

    // Create subscription
    const result = createAlertSubscriptionRecord({
      name,
      email,
      phone: formattedPhone,
      fuelTypes: fuelTypes || ['pms', 'ago', 'ik'],
      locations: locations || ['nairobi', 'mombasa'],
      alertTypes: alertTypes || ['price_increase', 'price_decrease', 'significant_change'],
      threshold: threshold || 5,
      emailEnabled: emailEnabled !== false,
      smsEnabled: smsEnabled || false,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Send verification email
    if (emailEnabled !== false) {
      const emailResult = await sendVerificationEmail({
        to: email,
        name: name,
        verificationToken: result.subscription.verificationToken,
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
        id: result.subscription.id,
        email: result.subscription.email,
        preferences: result.subscription.preferences,
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
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    const { getAlertSubscriptionByEmail } = await import('@/lib/db/alertStorage');
    const subscription = getAlertSubscriptionByEmail(email);

    if (!subscription) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      exists: true,
      subscription: {
        id: subscription.id,
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