// src/lib/db/models/Order.js
// Order model schema for MongoDB with Admin Support

import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // Customer Information
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },

  // Order Details
  fuelType: {
    type: String,
    enum: ['pms', 'ago', 'ik'],
    required: true
  },
  fuelTypeName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1 liter']
  },
  pricePerLiter: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },

  // Delivery Information
  deliveryAddress: {
    type: String,
    required: true
  },
  deliveryZone: {
    type: String,
    default: 'Zone A'
  },
  deliveryCost: {
    type: Number,
    default: 0,
    min: 0
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    default: 'morning'
  },

  // Discounts
  bulkDiscount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  bulkDiscountAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  // Total Cost
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'partial'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mpesa', 'bank_transfer', 'credit'],
    default: 'cash'
  },

  // Notes
  specialInstructions: {
    type: String,
    default: ''
  },
  internalNotes: {
    type: String,
    default: ''
  },

  // Tracking Timestamps
  orderDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  confirmedAt: {
    type: Date,
    default: null
  },
  dispatchedAt: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },

  // Metadata
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
OrderSchema.index({ customerId: 1, orderDate: -1 });
OrderSchema.index({ status: 1, orderDate: -1 });
OrderSchema.index({ fuelType: 1 });
OrderSchema.index({ customerName: 1 });
OrderSchema.index({ customerEmail: 1 });

// Virtual for order ID display
OrderSchema.virtual('displayId').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Ensure virtuals are included in JSON
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

// Calculate subtotal before saving
OrderSchema.pre('save', function(next) {
  if (this.isModified('quantity') || this.isModified('pricePerLiter')) {
    this.subtotal = this.quantity * this.pricePerLiter;
  }
  
  // Calculate total cost
  if (this.isModified('subtotal') || this.isModified('bulkDiscountAmount') || this.isModified('deliveryCost')) {
    this.totalCost = this.subtotal - this.bulkDiscountAmount + this.deliveryCost;
  }
  
  next();
});

// ================================
// CUSTOMER METHODS
// ================================

// Static method to get orders by customer
OrderSchema.statics.findByCustomer = function(customerId) {
  return this.find({ customerId }).sort({ orderDate: -1 });
};

// Static method to get recent orders by customer
OrderSchema.statics.findRecent = function(customerId, limit = 5) {
  return this.find({ customerId })
    .sort({ orderDate: -1 })
    .limit(limit);
};

// Static method to get favorite orders
OrderSchema.statics.findFavorites = function(customerId) {
  return this.find({ customerId, isFavorite: true })
    .sort({ orderDate: -1 });
};

// ================================
// ADMIN METHODS
// ================================

// Static method to get ALL orders (for admin)
OrderSchema.statics.findAll = function(limit = null) {
  const query = this.find().sort({ orderDate: -1 });
  return limit ? query.limit(limit) : query;
};

// Static method to get order statistics (for admin or specific customer)
OrderSchema.statics.getStats = async function(customerId = null) {
  const query = customerId ? { customerId } : {};
  
  const orders = await this.find(query);
  
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    totalSpent: orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalCost, 0),
    
    // Additional stats
    currentMonthSpend: 0,
    lastMonthSpend: 0,
    avgOrderValue: 0,
    
    // Fuel type breakdown
    fuelTypeStats: {}
  };
  
  // Calculate current and last month spend
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  stats.currentMonthSpend = orders
    .filter(o => new Date(o.orderDate) >= currentMonthStart && o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalCost, 0);
    
  stats.lastMonthSpend = orders
    .filter(o => {
      const date = new Date(o.orderDate);
      return date >= lastMonthStart && date <= lastMonthEnd && o.status === 'delivered';
    })
    .reduce((sum, o) => sum + o.totalCost, 0);
  
  // Calculate average order value
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  stats.avgOrderValue = deliveredOrders.length > 0
    ? Math.round(stats.totalSpent / deliveredOrders.length)
    : 0;
  
  // Fuel type statistics
  const fuelTypes = ['pms', 'ago', 'ik'];
  fuelTypes.forEach(type => {
    const typeOrders = orders.filter(o => o.fuelType === type);
    if (typeOrders.length > 0) {
      stats.fuelTypeStats[type] = {
        count: typeOrders.length,
        totalQuantity: typeOrders.reduce((sum, o) => sum + o.quantity, 0),
        totalSpent: typeOrders
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + o.totalCost, 0)
      };
    }
  });
  
  return stats;
};

// Static method to search orders (admin functionality)
OrderSchema.statics.searchOrders = function(query, customerId = null) {
  const searchQuery = customerId ? { customerId } : {};
  
  if (query) {
    const displayIdMatch = query.toUpperCase();
    searchQuery.$or = [
      { fuelType: { $regex: query, $options: 'i' } },
      { fuelTypeName: { $regex: query, $options: 'i' } },
      { deliveryAddress: { $regex: query, $options: 'i' } },
      { customerName: { $regex: query, $options: 'i' } },
      { customerEmail: { $regex: query, $options: 'i' } }
    ];
  }
  
  return this.find(searchQuery).sort({ orderDate: -1 });
};

// Static method to get orders by status (admin or customer)
OrderSchema.statics.findByStatus = function(status, customerId = null) {
  const query = { status };
  if (customerId) {
    query.customerId = customerId;
  }
  return this.find(query).sort({ orderDate: -1 });
};

// Static method to get orders by date range (admin or customer)
OrderSchema.statics.findByDateRange = function(startDate, endDate, customerId = null) {
  const query = {
    orderDate: {
      $gte: startDate,
      $lte: endDate
    }
  };
  if (customerId) {
    query.customerId = customerId;
  }
  return this.find(query).sort({ orderDate: -1 });
};

// Static method to get revenue report (admin)
OrderSchema.statics.getRevenueReport = async function(startDate, endDate) {
  const orders = await this.find({
    orderDate: { $gte: startDate, $lte: endDate },
    status: 'delivered'
  });
  
  const report = {
    totalRevenue: orders.reduce((sum, o) => sum + o.totalCost, 0),
    totalOrders: orders.length,
    avgOrderValue: 0,
    byFuelType: {},
    byDay: {}
  };
  
  // Calculate average
  report.avgOrderValue = orders.length > 0 
    ? report.totalRevenue / orders.length 
    : 0;
  
  // Group by fuel type
  ['pms', 'ago', 'ik'].forEach(type => {
    const typeOrders = orders.filter(o => o.fuelType === type);
    if (typeOrders.length > 0) {
      report.byFuelType[type] = {
        orders: typeOrders.length,
        revenue: typeOrders.reduce((sum, o) => sum + o.totalCost, 0),
        quantity: typeOrders.reduce((sum, o) => sum + o.quantity, 0)
      };
    }
  });
  
  // Group by day
  orders.forEach(order => {
    const day = new Date(order.orderDate).toISOString().split('T')[0];
    if (!report.byDay[day]) {
      report.byDay[day] = {
        orders: 0,
        revenue: 0
      };
    }
    report.byDay[day].orders += 1;
    report.byDay[day].revenue += order.totalCost;
  });
  
  return report;
};

// Static method to get top customers (admin)
OrderSchema.statics.getTopCustomers = async function(limit = 10) {
  const result = await this.aggregate([
    {
      $match: { status: 'delivered' }
    },
    {
      $group: {
        _id: '$customerId',
        customerName: { $first: '$customerName' },
        customerEmail: { $first: '$customerEmail' },
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalCost' },
        totalQuantity: { $sum: '$quantity' }
      }
    },
    {
      $sort: { totalSpent: -1 }
    },
    {
      $limit: limit
    }
  ]);
  
  return result;
};

// Instance method to update status with timestamp
OrderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  switch(newStatus) {
    case 'confirmed':
      this.confirmedAt = new Date();
      break;
    case 'in_transit':
      this.dispatchedAt = new Date();
      break;
    case 'delivered':
      this.deliveredAt = new Date();
      this.paymentStatus = 'paid';
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      break;
  }
  
  return this.save();
};

// Prevent model recompilation
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;