// src/lib/db/models/Alert.js
// Alert subscription model for MongoDB

import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  preferences: {
    fuelTypes: [{
      type: String,
      enum: ['pms', 'ago', 'ik']
    }],
    locations: [{
      type: String,
      enum: ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret']
    }],
    alertTypes: [{
      type: String,
      enum: ['price_increase', 'price_decrease', 'significant_change', 'low_stock']
    }],
    threshold: {
      type: Number,
      default: 5,
      min: 1,
      max: 100,
      comment: 'Percentage change threshold'
    },
    emailEnabled: {
      type: Boolean,
      default: true
    },
    smsEnabled: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'unsubscribed'],
    default: 'active',
    index: true
  },
  lastAlertSent: {
    type: Date,
    default: null
  },
  alertCount: {
    type: Number,
    default: 0,
    min: 0
  },
  verificationToken: {
    type: String,
    required: true,
    unique: true
  },
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  unsubscribedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
AlertSchema.index({ email: 1 }, { unique: true });
AlertSchema.index({ status: 1, verified: 1 });
AlertSchema.index({ verificationToken: 1 });

// Generate verification token before saving
AlertSchema.pre('save', function(next) {
  if (!this.verificationToken) {
    this.verificationToken = Math.random().toString(36).substr(2, 15) + 
                            Date.now().toString(36);
  }
  next();
});

// Static method to find active subscriptions
AlertSchema.statics.findActive = function() {
  return this.find({ 
    status: 'active', 
    verified: true 
  });
};

// Static method to find by fuel type and location
AlertSchema.statics.findByFuelAndLocation = function(fuelType, location) {
  return this.find({
    status: 'active',
    verified: true,
    'preferences.fuelTypes': fuelType,
    'preferences.locations': location
  });
};

// Static method to find by email
AlertSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Method to check if alert should be triggered
AlertSchema.methods.shouldTriggerAlert = function(priceChange) {
  const { alertTypes, threshold } = this.preferences;
  const changePercent = Math.abs(priceChange.percentageChange);

  // Check if change exceeds threshold
  if (changePercent < threshold) {
    return false;
  }

  // Check alert type preferences
  if (priceChange.percentageChange > 0 && !alertTypes.includes('price_increase')) {
    return false;
  }

  if (priceChange.percentageChange < 0 && !alertTypes.includes('price_decrease')) {
    return false;
  }

  if (changePercent >= 10 && !alertTypes.includes('significant_change')) {
    return false;
  }

  return true;
};

// Method to record alert sent
AlertSchema.methods.recordAlertSent = function() {
  this.lastAlertSent = new Date();
  this.alertCount += 1;
  return this.save();
};

// Prevent model recompilation
const Alert = mongoose.models.Alert || mongoose.model('Alert', AlertSchema);

export default Alert;