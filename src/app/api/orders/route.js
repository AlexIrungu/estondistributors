// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';
import User from '@/lib/db/models/User';

// GET - Fetch customer orders
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const customerId = session.user.id;

    switch (action) {
      case 'stats': {
        // Get order statistics
        const orders = await Order.findByCustomer(customerId);
        
        const stats = {
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          completedOrders: orders.filter(o => o.status === 'completed').length,
          totalSpent: orders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + o.totalAmount, 0),
          favoriteCount: orders.filter(o => o.isFavorite).length
        };
        
        return NextResponse.json({ success: true, stats });
      }

      case 'recent': {
        const limit = parseInt(searchParams.get('limit') || '5');
        const orders = await Order.findByCustomer(customerId);
        const recent = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit);
        
        return NextResponse.json({ success: true, orders: recent });
      }

      case 'favorites': {
        const orders = await Order.findByCustomer(customerId);
        const favorites = orders.filter(o => o.isFavorite);
        
        return NextResponse.json({ success: true, orders: favorites });
      }

      case 'search': {
        const query = searchParams.get('query') || '';
        const orders = await Order.findByCustomer(customerId);
        
        const searchResults = orders.filter(order => 
          order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
          order.fuelType.toLowerCase().includes(query.toLowerCase()) ||
          order.location.toLowerCase().includes(query.toLowerCase())
        );
        
        return NextResponse.json({ success: true, orders: searchResults });
      }

      case 'filter': {
        const status = searchParams.get('status');
        const orders = await Order.findByCustomer(customerId);
        const filtered = status 
          ? orders.filter(o => o.status === status)
          : orders;
        
        return NextResponse.json({ success: true, orders: filtered });
      }

      default: {
        // Get all orders for customer
        const allOrders = await Order.findByCustomer(customerId);
        return NextResponse.json({ success: true, orders: allOrders });
      }
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
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.fuelType || !body.quantity || !body.location) {
      return NextResponse.json(
        { error: 'Fuel type, quantity, and location are required' },
        { status: 400 }
      );
    }

    // Create order data
    const orderData = {
      customerId: session.user.id,
      customerName: session.user.name,
      customerEmail: session.user.email,
      fuelType: body.fuelType,
      quantity: body.quantity,
      pricePerLiter: body.pricePerLiter || 0,
      totalAmount: body.totalAmount || (body.quantity * body.pricePerLiter),
      location: body.location,
      deliveryAddress: body.deliveryAddress || '',
      deliveryDate: body.deliveryDate,
      deliveryTime: body.deliveryTime,
      notes: body.notes || '',
      paymentMethod: body.paymentMethod || 'mpesa',
      status: 'pending'
    };

    // Create order
    const order = new Order(orderData);
    await order.save();

    console.log('✅ Order created:', order.orderNumber);

    // Update user statistics
    const user = await User.findById(session.user.id);
    if (user) {
      user.stats.totalOrders = (user.stats.totalOrders || 0) + 1;
      user.stats.lastOrderDate = new Date();
      await user.save();
    }

    return NextResponse.json({
      success: true,
      order: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}