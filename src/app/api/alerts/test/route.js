// src/app/api/alerts/test/route.js
// Test route for sending sample alerts (development only)

import { NextResponse } from 'next/server';
import { sendPriceAlertEmail, sendVerificationEmail, sendWelcomeEmail } from '@/lib/services/emailService';
import { sendPriceAlertSMS, sendVerificationSMS, sendWelcomeSMS, sendTestSMS, formatPhoneNumber } from '@/lib/services/smsService';

export async function POST(request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint disabled in production' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { type, email, phone, name } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Test type required. Options: price_alert, verification, welcome, test_sms' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'price_alert_email':
        if (!email) {
          return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }
        result = await sendPriceAlertEmail({
          to: email,
          name: name || 'Test User',
          fuelType: 'Super Petrol',
          location: 'Nairobi',
          oldPrice: 188.84,
          newPrice: 195.50,
          change: 6.66,
          percentageChange: 3.53,
        });
        break;

      case 'verification_email':
        if (!email) {
          return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }
        result = await sendVerificationEmail({
          to: email,
          name: name || 'Test User',
          verificationToken: 'test-token-12345',
        });
        break;

      case 'welcome_email':
        if (!email) {
          return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }
        result = await sendWelcomeEmail({
          to: email,
          name: name || 'Test User',
        });
        break;

      case 'price_alert_sms':
        if (!phone) {
          return NextResponse.json({ error: 'Phone required' }, { status: 400 });
        }
        result = await sendPriceAlertSMS({
          to: formatPhoneNumber(phone),
          name: name || 'Test User',
          fuelType: 'Super Petrol',
          location: 'Nairobi',
          oldPrice: 188.84,
          newPrice: 195.50,
          change: 6.66,
          percentageChange: 3.53,
        });
        break;

      case 'verification_sms':
        if (!phone) {
          return NextResponse.json({ error: 'Phone required' }, { status: 400 });
        }
        result = await sendVerificationSMS({
          to: formatPhoneNumber(phone),
          name: name || 'Test User',
          verificationCode: '123456',
        });
        break;

      case 'welcome_sms':
        if (!phone) {
          return NextResponse.json({ error: 'Phone required' }, { status: 400 });
        }
        result = await sendWelcomeSMS({
          to: formatPhoneNumber(phone),
          name: name || 'Test User',
        });
        break;

      case 'test_sms':
        if (!phone) {
          return NextResponse.json({ error: 'Phone required' }, { status: 400 });
        }
        result = await sendTestSMS(formatPhoneNumber(phone));
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid test type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Test message sent successfully' : 'Failed to send test message',
      result: result,
    });

  } catch (error) {
    console.error('Test alert error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Show available test options
export async function GET() {
  return NextResponse.json({
    message: 'Alert Testing Endpoint',
    available_tests: {
      email: [
        'price_alert_email',
        'verification_email',
        'welcome_email'
      ],
      sms: [
        'price_alert_sms',
        'verification_sms',
        'welcome_sms',
        'test_sms'
      ]
    },
    usage: {
      method: 'POST',
      body: {
        type: 'test_type',
        email: 'test@example.com (for email tests)',
        phone: '+254700000000 (for SMS tests)',
        name: 'Test User (optional)'
      }
    },
    example: `
curl -X POST http://localhost:3000/api/alerts/test \\
  -H "Content-Type: application/json" \\
  -d '{"type":"price_alert_email","email":"test@example.com","name":"John Doe"}'
    `
  });
}