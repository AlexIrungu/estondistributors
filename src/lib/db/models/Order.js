// src/lib/db/models/Order.js
// Order model schema for MongoDB

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

// Virtual for order ID display
OrderSchema.virtual('displayId').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

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

// Static method to get orders by customer
OrderSchema.statics.findByCustomer = function(customerId) {
  return this.find({ customerId }).sort({ orderDate: -1 });
};

// Static method to get recent orders
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

// Prevent model recompilation
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;