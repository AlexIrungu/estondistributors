// src/app/api/alerts/route.js
// Main alert management API

import { NextResponse } from 'next/server';
import {
  getAllAlertSubscriptions,
  getAlertSubscription,
  updateAlertSubscription,
  verifyAlertSubscription,
  pauseAlertSubscription,
  resumeAlertSubscription,
  unsubscribeAlert,
  deleteAlertSubscription,
  getAlertStatistics,
} from '@/lib/db/alertStorage';

// GET - Retrieve alerts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const token = searchParams.get('token');

    // Get statistics
    if (action === 'stats') {
      const stats = getAlertStatistics();
      return NextResponse.json(stats);
    }

    // Verify subscription
    if (action === 'verify' && token) {
      const result = verifyAlertSubscription(token);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      // Send welcome email after verification
      const { sendWelcomeEmail } = await import('@/lib/services/emailService');
      await sendWelcomeEmail({
        to: result.subscription.email,
        name: result.subscription.name,
      });

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully!',
        subscription: result.subscription,
      });
    }

    // Get specific subscription
    if (id) {
      const subscription = getAlertSubscription(id);
      
      if (!subscription) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(subscription);
    }

    // Get all subscriptions
    const subscriptions = getAllAlertSubscriptions();
    return NextResponse.json(subscriptions);

  } catch (error) {
    console.error('Error in alerts GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update subscription
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    let result;

    // Handle specific actions
    switch (action) {
      case 'pause':
        result = pauseAlertSubscription(id);
        break;
      
      case 'resume':
        result = resumeAlertSubscription(id);
        break;
      
      case 'unsubscribe':
        result = unsubscribeAlert(id);
        break;
      
      default:
        // General update
        result = updateAlertSubscription(id, updates);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: result.subscription,
    });

  } catch (error) {
    console.error('Error in alerts PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete subscription
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    const result = deleteAlertSubscription(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully',
    });

  } catch (error) {
    console.error('Error in alerts DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}