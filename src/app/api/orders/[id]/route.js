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

    const { id } = await params;
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order belongs to user (or user is admin)
    const isAdmin = session.user.role === 'admin';
    const isOwner = order.customerId.toString() === session.user.id;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        ...order.toObject(),
        displayId: order.displayId
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH - Update order (toggle favorite or update status)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { action, status, ...updates } = body;

    const { id } = await params;
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check ownership (or admin)
    const isAdmin = session.user.role === 'admin';
    const isOwner = order.customerId.toString() === session.user.id;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Handle toggle favorite action
    if (action === 'toggle_favorite') {
      // Only order owner can favorite
      if (!isOwner) {
        return NextResponse.json({ 
          error: 'Only order owner can favorite' 
        }, { status: 403 });
      }

      order.isFavorite = !order.isFavorite;
      await order.save();
      
      return NextResponse.json({
        success: true,
        message: order.isFavorite ? 'Added to favorites' : 'Removed from favorites',
        order: {
          ...order.toObject(),
          displayId: order.displayId
        }
      });
    }

    // Handle update status action (admin only)
    if (action === 'update_status') {
      if (!isAdmin) {
        return NextResponse.json({ 
          error: 'Only admins can update order status' 
        }, { status: 403 });
      }

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        }, { status: 400 });
      }

      // Use the model's updateStatus method if available
      if (typeof order.updateStatus === 'function') {
        await order.updateStatus(status);
      } else {
        // Fallback: manual status update with timestamps
        order.status = status;
        
        switch(status) {
          case 'confirmed':
            order.confirmedAt = new Date();
            break;
          case 'in_transit':
            order.dispatchedAt = new Date();
            break;
          case 'delivered':
            order.deliveredAt = new Date();
            order.paymentStatus = 'paid';
            break;
          case 'cancelled':
            order.cancelledAt = new Date();
            break;
        }
        
        await order.save();
      }

      console.log('✅ Order status updated:', order.displayId || order._id, 'to', status);

      return NextResponse.json({
        success: true,
        message: `Order status updated to ${status}`,
        order: {
          ...order.toObject(),
          displayId: order.displayId
        }
      });
    }

    // Handle general updates (admin only for status changes)
    if (updates.status && !isAdmin) {
      return NextResponse.json({ 
        error: 'Only admins can update order status' 
      }, { status: 403 });
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        order[key] = updates[key];
      }
    });

    await order.save();

    console.log('✅ Order updated:', order.displayId || order._id);

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        ...order.toObject(),
        displayId: order.displayId
      }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update order' 
    }, { status: 500 });
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

    const { id } = await params;
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check ownership (or admin)
    const isAdmin = session.user.role === 'admin';
    const isOwner = order.customerId.toString() === session.user.id;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only allow deletion of pending orders
    if (order.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Only pending orders can be cancelled' 
      }, { status: 400 });
    }

    // Instead of deleting, set status to cancelled
    if (typeof order.updateStatus === 'function') {
      await order.updateStatus('cancelled');
    } else {
      order.status = 'cancelled';
      order.cancelledAt = new Date();
      await order.save();
    }

    console.log('✅ Order cancelled:', order.displayId || order._id);

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to cancel order' 
    }, { status: 500 });
  }
}