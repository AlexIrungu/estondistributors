// src/app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getOrderById, updateOrder, toggleOrderFavorite } from '@/lib/db/orderStorage';

// GET single order
export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = getOrderById(params.id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order belongs to user
    if (order.customerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH - Update order
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...updates } = body;

    // Handle specific actions
    if (action === 'toggle_favorite') {
      const result = toggleOrderFavorite(params.id);
      return NextResponse.json(result);
    }

    // Regular update
    const result = updateOrder(params.id, updates);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}