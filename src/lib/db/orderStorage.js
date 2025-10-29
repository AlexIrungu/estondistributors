// src/lib/db/orderStorage.js
// Order management and history tracking

const STORAGE_KEY = 'eston_orders';

// Order structure
const createOrder = (data) => ({
  id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  customerId: data.customerId,
  customerName: data.customerName,
  customerEmail: data.customerEmail,
  customerPhone: data.customerPhone,
  
  // Order details
  fuelType: data.fuelType,
  fuelTypeName: data.fuelTypeName,
  quantity: data.quantity,
  pricePerLiter: data.pricePerLiter,
  subtotal: data.quantity * data.pricePerLiter,
  
  // Delivery
  deliveryAddress: data.deliveryAddress,
  deliveryZone: data.deliveryZone || 'Zone A',
  deliveryCost: data.deliveryCost || 0,
  deliveryDate: data.deliveryDate,
  deliveryTime: data.deliveryTime || 'morning',
  
  // Discounts
  bulkDiscount: data.bulkDiscount || 0,
  bulkDiscountAmount: data.bulkDiscountAmount || 0,
  
  // Total
  totalCost: (data.quantity * data.pricePerLiter) - (data.bulkDiscountAmount || 0) + (data.deliveryCost || 0),
  
  // Status
  status: 'pending', // pending, confirmed, in_transit, delivered, cancelled
  paymentStatus: 'unpaid', // unpaid, paid, partial
  paymentMethod: data.paymentMethod || 'cash',
  
  // Notes
  specialInstructions: data.specialInstructions || '',
  internalNotes: '',
  
  // Tracking
  orderDate: new Date().toISOString(),
  confirmedAt: null,
  dispatchedAt: null,
  deliveredAt: null,
  cancelledAt: null,
  
  // Metadata
  isFavorite: false,
  tags: data.tags || [],
});

// Get all orders
export function getAllOrders() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

// Get order by ID
export function getOrderById(id) {
  const orders = getAllOrders();
  return orders.find(order => order.id === id);
}

// Get orders by customer ID
export function getOrdersByCustomerId(customerId) {
  const orders = getAllOrders();
  return orders
    .filter(order => order.customerId === customerId)
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
}

// Create new order
export function createNewOrder(data) {
  try {
    const orders = getAllOrders();
    const newOrder = createOrder(data);
    
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    
    return {
      success: true,
      order: newOrder
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update order
export function updateOrder(id, updates) {
  try {
    const orders = getAllOrders();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Order not found'
      };
    }

    orders[index] = {
      ...orders[index],
      ...updates
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    
    return {
      success: true,
      order: orders[index]
    };
  } catch (error) {
    console.error('Error updating order:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update order status
export function updateOrderStatus(id, status) {
  const statusTimestamps = {
    confirmed: 'confirmedAt',
    in_transit: 'dispatchedAt',
    delivered: 'deliveredAt',
    cancelled: 'cancelledAt',
  };

  const updates = { status };
  if (statusTimestamps[status]) {
    updates[statusTimestamps[status]] = new Date().toISOString();
  }

  return updateOrder(id, updates);
}

// Mark order as favorite
export function toggleOrderFavorite(id) {
  const order = getOrderById(id);
  if (!order) {
    return { success: false, error: 'Order not found' };
  }

  return updateOrder(id, { isFavorite: !order.isFavorite });
}

// Delete order
export function deleteOrder(id) {
  try {
    const orders = getAllOrders();
    const filtered = orders.filter(order => order.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    return {
      success: true,
      deleted: true
    };
  } catch (error) {
    console.error('Error deleting order:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get customer order statistics
export function getCustomerOrderStats(customerId) {
  const orders = getOrdersByCustomerId(customerId);
  
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const totalSpent = deliveredOrders.reduce((sum, o) => sum + o.totalCost, 0);
  
  // Calculate fuel type distribution
  const fuelTypeStats = orders.reduce((acc, order) => {
    if (!acc[order.fuelType]) {
      acc[order.fuelType] = { count: 0, totalLiters: 0, totalCost: 0 };
    }
    acc[order.fuelType].count++;
    acc[order.fuelType].totalLiters += order.quantity;
    acc[order.fuelType].totalCost += order.totalCost;
    return acc;
  }, {});

  // Calculate monthly spending
  const monthlySpending = orders.reduce((acc, order) => {
    const month = new Date(order.orderDate).toISOString().slice(0, 7);
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += order.totalCost;
    return acc;
  }, {});

  return {
    totalOrders: orders.length,
    completedOrders: deliveredOrders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalSpent,
    averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
    totalLiters: orders.reduce((sum, o) => sum + o.quantity, 0),
    fuelTypeStats,
    monthlySpending,
    mostRecentOrder: orders[0] || null,
    favoriteOrders: orders.filter(o => o.isFavorite),
  };
}

// Get recent orders
export function getRecentOrders(customerId, limit = 5) {
  const orders = getOrdersByCustomerId(customerId);
  return orders.slice(0, limit);
}

// Get favorite orders
export function getFavoriteOrders(customerId) {
  const orders = getOrdersByCustomerId(customerId);
  return orders.filter(order => order.isFavorite);
}

// Search orders
export function searchOrders(customerId, query) {
  const orders = getOrdersByCustomerId(customerId);
  const lowerQuery = query.toLowerCase();
  
  return orders.filter(order =>
    order.id.toLowerCase().includes(lowerQuery) ||
    order.fuelTypeName.toLowerCase().includes(lowerQuery) ||
    order.status.toLowerCase().includes(lowerQuery) ||
    order.deliveryAddress.toLowerCase().includes(lowerQuery)
  );
}

// Filter orders by date range
export function filterOrdersByDateRange(customerId, startDate, endDate) {
  const orders = getOrdersByCustomerId(customerId);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= start && orderDate <= end;
  });
}

// Filter orders by status
export function filterOrdersByStatus(customerId, status) {
  const orders = getOrdersByCustomerId(customerId);
  return orders.filter(order => order.status === status);
}

// Calculate potential savings from bulk orders
export function calculateBulkSavingsOpportunity(customerId) {
  const orders = getOrdersByCustomerId(customerId);
  const last3Months = orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return orderDate >= threeMonthsAgo;
  });

  const totalQuantity = last3Months.reduce((sum, o) => sum + o.quantity, 0);
  const averageQuantity = totalQuantity / (last3Months.length || 1);

  // Suggest bulk order if average is below 2000L
  if (averageQuantity < 2000) {
    const potentialSavings = (2000 - averageQuantity) * 0.5; // Estimated 0.5 KES saving per liter
    return {
      shouldConsiderBulk: true,
      currentAverage: averageQuantity,
      recommendedQuantity: 2000,
      estimatedSavingsPerOrder: potentialSavings,
      estimatedMonthlySavings: potentialSavings * (last3Months.length / 3),
    };
  }

  return { shouldConsiderBulk: false };
}

// Create sample orders for demo user
export function createSampleOrders(customerId, customerName, customerEmail) {
  const sampleOrders = [
    {
      customerId,
      customerName,
      customerEmail,
      customerPhone: '+254700000000',
      fuelType: 'pms',
      fuelTypeName: 'Super Petrol',
      quantity: 1000,
      pricePerLiter: 188.84,
      deliveryAddress: '123 Demo Street, Nairobi',
      deliveryZone: 'Zone A',
      deliveryCost: 1500,
      deliveryDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bulkDiscount: 2,
      bulkDiscountAmount: 3776.80,
      status: 'delivered',
      paymentStatus: 'paid',
    },
    {
      customerId,
      customerName,
      customerEmail,
      customerPhone: '+254700000000',
      fuelType: 'ago',
      fuelTypeName: 'Diesel',
      quantity: 2500,
      pricePerLiter: 173.10,
      deliveryAddress: '123 Demo Street, Nairobi',
      deliveryZone: 'Zone A',
      deliveryCost: 2000,
      deliveryDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bulkDiscount: 3,
      bulkDiscountAmount: 12982.50,
      status: 'delivered',
      paymentStatus: 'paid',
    },
    {
      customerId,
      customerName,
      customerEmail,
      customerPhone: '+254700000000',
      fuelType: 'pms',
      fuelTypeName: 'Super Petrol',
      quantity: 500,
      pricePerLiter: 188.84,
      deliveryAddress: '123 Demo Street, Nairobi',
      deliveryZone: 'Zone A',
      deliveryCost: 1500,
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      paymentStatus: 'unpaid',
    },
  ];

  const results = [];
  for (const orderData of sampleOrders) {
    const result = createNewOrder(orderData);
    results.push(result);
  }

  return results;
}