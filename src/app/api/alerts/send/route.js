// src/app/api/alerts/send/route.js
// API endpoint for sending price change alerts

import { NextResponse } from 'next/server';
import { getActiveSubscriptionsForFuel, shouldTriggerAlert, recordAlertSent, getFuelTypeName, getLocationName } from '@/lib/db/alertStorage';
import { sendPriceAlertEmail } from '@/lib/services/emailService';
import { sendPriceAlertSMS } from '@/lib/services/smsService';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { fuelType, location, oldPrice, newPrice } = body;
    
    if (!fuelType || !location || oldPrice === undefined || newPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: fuelType, location, oldPrice, newPrice' },
        { status: 400 }
      );
    }

    // Calculate price change
    const change = newPrice - oldPrice;
    const percentageChange = ((change / oldPrice) * 100);

    if (change === 0) {
      return NextResponse.json({
        success: true,
        message: 'No price change detected',
        alertsSent: 0,
      });
    }

    // Get subscriptions for this fuel type and location
    const subscriptions = getActiveSubscriptionsForFuel(fuelType, location);

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active subscriptions for this fuel/location',
        alertsSent: 0,
      });
    }

    // Prepare price change data
    const priceChangeData = {
      fuelType: getFuelTypeName(fuelType),
      location: getLocationName(location),
      oldPrice,
      newPrice,
      change,
      percentageChange,
    };

    let emailsSent = 0;
    let smsSent = 0;
    let errors = [];

    // Send alerts to all matching subscriptions
    for (const subscription of subscriptions) {
      // Check if this change should trigger an alert for this user
      if (!shouldTriggerAlert(subscription, { percentageChange })) {
        continue;
      }

      // Send email alert
      if (subscription.preferences.emailEnabled) {
        const emailResult = await sendPriceAlertEmail({
          to: subscription.email,
          name: subscription.name,
          ...priceChangeData,
        });

        if (emailResult.success) {
          emailsSent++;
        } else {
          errors.push(`Email failed for ${subscription.email}: ${emailResult.error}`);
        }
      }

      // Send SMS alert
      if (subscription.preferences.smsEnabled && subscription.phone) {
        const smsResult = await sendPriceAlertSMS({
          to: subscription.phone,
          name: subscription.name,
          ...priceChangeData,
        });

        if (smsResult.success) {
          smsSent++;
        } else {
          errors.push(`SMS failed for ${subscription.phone}: ${smsResult.error}`);
        }
      }

      // Record that alert was sent
      recordAlertSent(subscription.id);
    }

    return NextResponse.json({
      success: true,
      message: `Alerts sent successfully`,
      stats: {
        totalSubscriptions: subscriptions.length,
        emailsSent,
        smsSent,
        totalAlertsSent: emailsSent + smsSent,
      },
      priceChange: priceChangeData,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('Error sending alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Test alert sending (for development)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');

    if (test === 'true') {
      // Send test alert with sample data
      const result = await POST({
        json: async () => ({
          fuelType: 'pms',
          location: 'nairobi',
          oldPrice: 188.84,
          newPrice: 195.50,
        })
      });

      return result;
    }

    return NextResponse.json({
      message: 'Send alerts endpoint',
      usage: 'POST with {fuelType, location, oldPrice, newPrice}',
      test: 'Add ?test=true to send test alert',
    });

  } catch (error) {
    console.error('Error in test alert:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}