// src/app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';

// GET single order
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findById(params.id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order belongs to user (or user is admin)
    if (order.customerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH - Update order
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { action, ...updates } = body;

    const order = await Order.findById(params.id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check ownership (or admin)
    if (order.customerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Handle specific actions
    if (action === 'toggle_favorite') {
      order.isFavorite = !order.isFavorite;
      await order.save();
      
      return NextResponse.json({
        success: true,
        message: order.isFavorite ? 'Added to favorites' : 'Removed from favorites',
        order
      });
    }

    // Handle status updates (admin only)
    if (updates.status && session.user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Only admins can update order status' 
      }, { status: 403 });
    }

    // Regular update
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        order[key] = updates[key];
      }
    });

    await order.save();

    console.log('✅ Order updated:', order.orderNumber);

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE - Cancel/Delete order
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findById(params.id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check ownership (or admin)
    if (order.customerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only allow deletion of pending orders
    if (order.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Only pending orders can be deleted' 
      }, { status: 400 });
    }

    await Order.findByIdAndDelete(params.id);

    console.log('✅ Order deleted:', order.orderNumber);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}