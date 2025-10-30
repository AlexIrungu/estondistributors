// src/app/api/alerts/route.js
// Main alert management API

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Alert from '@/lib/db/models/Alert';

// GET - Retrieve alerts
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const token = searchParams.get('token');

    // Get statistics
    if (action === 'stats') {
      const stats = await Alert.getStatistics();
      return NextResponse.json(stats);
    }

    // Verify subscription
    if (action === 'verify' && token) {
      const subscription = await Alert.findOne({ verificationToken: token });
      
      if (!subscription) {
        return NextResponse.json(
          { error: 'Invalid verification token' },
          { status: 400 }
        );
      }

      if (subscription.verified) {
        return NextResponse.json(
          { error: 'Subscription already verified' },
          { status: 400 }
        );
      }

      subscription.verified = true;
      subscription.status = 'active';
      subscription.verificationToken = undefined;
      await subscription.save();

      // Send welcome email after verification
      const { sendWelcomeEmail } = await import('@/lib/services/emailService');
      await sendWelcomeEmail({
        to: subscription.email,
        name: subscription.name,
      });

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully!',
        subscription,
      });
    }

    // Get specific subscription
    if (id) {
      const subscription = await Alert.findById(id);
      
      if (!subscription) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(subscription);
    }

    // Get all subscriptions (admin only - add auth check in production)
    const subscriptions = await Alert.find()
      .sort({ createdAt: -1 })
      .select('-verificationToken'); // Don't expose tokens
    
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
    await connectDB();

    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    const subscription = await Alert.findById(id);

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Handle specific actions
    switch (action) {
      case 'pause':
        subscription.status = 'paused';
        subscription.pausedAt = new Date();
        break;
      
      case 'resume':
        subscription.status = 'active';
        subscription.pausedAt = undefined;
        break;
      
      case 'unsubscribe':
        subscription.status = 'unsubscribed';
        subscription.unsubscribedAt = new Date();
        break;
      
      default:
        // General update
        Object.keys(updates).forEach(key => {
          if (key !== 'verified' && key !== 'verificationToken') {
            if (key === 'preferences') {
              subscription.preferences = {
                ...subscription.preferences,
                ...updates.preferences
              };
            } else {
              subscription[key] = updates[key];
            }
          }
        });
    }

    await subscription.save();

    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription,
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
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    const subscription = await Alert.findByIdAndDelete(id);

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
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