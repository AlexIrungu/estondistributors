// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';
import User from '@/lib/db/models/User';

// GET - Fetch orders (admin sees all, customers see only their own)
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
    const isAdmin = session.user.role === 'admin';
    const customerId = isAdmin ? null : session.user.id;

    switch (action) {
      case 'stats': {
        // Admin gets all stats, customers get only their stats
        const stats = await Order.getStats(customerId);
        return NextResponse.json({ success: true, stats });
      }

      case 'recent': {
        const limit = parseInt(searchParams.get('limit') || '5');
        let orders;
        
        if (isAdmin) {
          // Admin sees all recent orders
          orders = await Order.findAll(limit);
        } else {
          // Customer sees only their recent orders
          orders = await Order.findByCustomer(customerId);
          orders = orders.slice(0, limit);
        }
        
        // Transform orders to include displayId
        const transformedOrders = orders.map(order => ({
          ...order.toObject(),
          displayId: order.displayId,
          id: order._id.toString()
        }));
        
        return NextResponse.json({ success: true, orders: transformedOrders });
      }

      case 'favorites': {
        // Only customers have favorites
        if (isAdmin) {
          return NextResponse.json({ 
            success: true, 
            orders: [],
            message: 'Favorites not available for admin' 
          });
        }
        
        const orders = await Order.findFavorites(customerId);
        const transformedOrders = orders.map(order => ({
          ...order.toObject(),
          displayId: order.displayId,
          id: order._id.toString()
        }));
        
        return NextResponse.json({ success: true, orders: transformedOrders });
      }

      case 'search': {
        const query = searchParams.get('query') || '';
        const orders = await Order.searchOrders(query, customerId);
        
        const transformedOrders = orders.map(order => ({
          ...order.toObject(),
          displayId: order.displayId,
          id: order._id.toString()
        }));
        
        return NextResponse.json({ success: true, orders: transformedOrders });
      }

      case 'filter': {
        const status = searchParams.get('status');
        const query = status ? { status } : {};
        
        // Add customer filter if not admin
        if (!isAdmin) {
          query.customerId = customerId;
        }
        
        const orders = await Order.find(query).sort({ orderDate: -1 });
        const transformedOrders = orders.map(order => ({
          ...order.toObject(),
          displayId: order.displayId,
          id: order._id.toString()
        }));
        
        return NextResponse.json({ success: true, orders: transformedOrders });
      }

      default: {
        // Default: get all orders (admin gets all, customer gets only theirs)
        let orders;
        
        if (isAdmin) {
          orders = await Order.findAll();
        } else {
          orders = await Order.findByCustomer(customerId);
        }
        
        const transformedOrders = orders.map(order => ({
          ...order.toObject(),
          displayId: order.displayId,
          id: order._id.toString()
        }));
        
        return NextResponse.json({ success: true, orders: transformedOrders });
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

// POST - Create new order (unchanged)
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
    const customerPhone = user?.phone || session.user.phone || '254700000000';

    // Create order data
    const orderData = {
      customerId: session.user.id,
      customerName: session.user.name,
      customerEmail: session.user.email,
      customerPhone: customerPhone,
      
      fuelType: body.fuelType,
      fuelTypeName: body.fuelTypeName || body.fuelType.toUpperCase(),
      quantity: body.quantity,
      pricePerLiter: body.pricePerLiter || 0,
      subtotal: body.subtotal || (body.quantity * body.pricePerLiter),
      
      deliveryAddress: body.deliveryAddress,
      deliveryZone: body.deliveryZone || 'Zone A',
      deliveryCost: body.deliveryCost || 0,
      deliveryDate: body.deliveryDate,
      deliveryTime: body.deliveryTime || 'morning',
      
      bulkDiscount: body.bulkDiscount || 0,
      bulkDiscountAmount: body.bulkDiscountAmount || 0,
      
      totalCost: body.totalCost || body.subtotal + body.deliveryCost - body.bulkDiscountAmount,
      
      status: 'pending',
      paymentMethod: body.paymentMethod || 'mpesa',
      specialInstructions: body.specialInstructions || '',
    };

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
      order: {
        ...order.toObject(),
        displayId: order.displayId
      },
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