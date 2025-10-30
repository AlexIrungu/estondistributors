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
        const orders = await Order.findByCustomer(customerId);
        
        const stats = {
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          completedOrders: orders.filter(o => o.status === 'delivered').length,
          totalSpent: orders
            .filter(o => o.status === 'delivered')
            .reduce((sum, o) => sum + o.totalCost, 0),
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
          order.displayId.toLowerCase().includes(query.toLowerCase()) ||
          order.fuelType.toLowerCase().includes(query.toLowerCase()) ||
          order.deliveryZone.toLowerCase().includes(query.toLowerCase())
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
    if (!body.fuelType || !body.quantity || !body.deliveryAddress) {
      return NextResponse.json(
        { error: 'Fuel type, quantity, and delivery address are required' },
        { status: 400 }
      );
    }

    // Get user data to access phone number
    const user = await User.findById(session.user.id);
    const customerPhone = user?.phone || session.user.phone || '254700000000'; // Fallback

    // Create order data matching Order model schema exactly
    const orderData = {
  // Customer Information
  customerId: session.user.id,
  customerName: session.user.name,
  customerEmail: session.user.email,
  customerPhone: customerPhone, // ✅ Added

  // Order Details
  fuelType: body.fuelType,
  fuelTypeName: body.fuelTypeName || body.fuelType.toUpperCase(),
  quantity: body.quantity,
  pricePerLiter: body.pricePerLiter || 0,
  subtotal: body.subtotal || (body.quantity * body.pricePerLiter),

  // Delivery Information
  deliveryAddress: body.deliveryAddress,
  deliveryZone: body.deliveryZone || 'Zone A',
  deliveryCost: body.deliveryCost || 0,
  deliveryDate: body.deliveryDate,
  deliveryTime: body.deliveryTime || 'morning', // ✅ Valid enum

  // Discounts
  bulkDiscount: body.bulkDiscount || 0,
  bulkDiscountAmount: body.bulkDiscountAmount || 0,

  // Total Cost
  totalCost: body.totalCost || body.subtotal + body.deliveryCost - body.bulkDiscountAmount, // ✅ Changed from totalAmount

  // Status
  status: 'pending',
  paymentMethod: body.paymentMethod || 'mpesa',

  // Notes
  specialInstructions: body.specialInstructions || '', // ✅ Changed from notes
};

    // Create order
    const order = new Order(orderData);
    await order.save();

    console.log('✅ Order created:', order.displayId);

    // Update user statistics
    if (user) {
      user.stats = user.stats || {};
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
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}