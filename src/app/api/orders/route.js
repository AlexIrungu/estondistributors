// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  getOrdersByCustomerId,
  createNewOrder,
  getCustomerOrderStats,
  getRecentOrders,
  getFavoriteOrders,
  searchOrders,
  filterOrdersByStatus,
} from '@/lib/db/orderStorage';
import { updateUserStats } from '@/lib/db/userStorage';

// GET - Fetch customer orders
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const customerId = session.user.id;

    switch (action) {
      case 'stats':
        const stats = getCustomerOrderStats(customerId);
        return NextResponse.json({ success: true, stats });

      case 'recent':
        const limit = parseInt(searchParams.get('limit') || '5');
        const recent = getRecentOrders(customerId, limit);
        return NextResponse.json({ success: true, orders: recent });

      case 'favorites':
        const favorites = getFavoriteOrders(customerId);
        return NextResponse.json({ success: true, orders: favorites });

      case 'search':
        const query = searchParams.get('query') || '';
        const searchResults = searchOrders(customerId, query);
        return NextResponse.json({ success: true, orders: searchResults });

      case 'filter':
        const status = searchParams.get('status');
        const filtered = filterOrdersByStatus(customerId, status);
        return NextResponse.json({ success: true, orders: filtered });

      default:
        const allOrders = getOrdersByCustomerId(customerId);
        return NextResponse.json({ success: true, orders: allOrders });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Add customer info from session
    const orderData = {
      ...body,
      customerId: session.user.id,
      customerName: session.user.name,
      customerEmail: session.user.email,
    };

    const result = createNewOrder(orderData);

    if (result.success) {
      // Update user statistics
      updateUserStats(session.user.id, result.order);

      return NextResponse.json({
        success: true,
        order: result.order,
        message: 'Order created successfully'
      });
    }

    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}