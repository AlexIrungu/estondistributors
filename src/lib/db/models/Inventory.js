// src/lib/db/models/Inventory.js
// Inventory model for MongoDB

import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  locationId: {
    type: String,
    required: true,
    enum: ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret'],
    index: true
  },
  locationName: {
    type: String,
    required: true
  },
  locationAddress: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  
  // Fuel stock levels
  fuelStock: {
    pms: {
      currentStock: {
        type: Number,
        default: 0,
        min: 0,
        comment: 'Current stock in liters'
      },
      capacity: {
        type: Number,
        required: true,
        min: 0,
        comment: 'Maximum capacity in liters'
      },
      reserved: {
        type: Number,
        default: 0,
        min: 0,
        comment: 'Reserved for pending orders'
      },
      available: {
        type: Number,
        default: 0,
        min: 0,
        comment: 'Available = currentStock - reserved'
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    ago: {
      currentStock: {
        type: Number,
        default: 0,
        min: 0
      },
      capacity: {
        type: Number,
        required: true,
        min: 0
      },
      reserved: {
        type: Number,
        default: 0,
        min: 0
      },
      available: {
        type: Number,
        default: 0,
        min: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    ik: {
      currentStock: {
        type: Number,
        default: 0,
        min: 0
      },
      capacity: {
        type: Number,
        required: true,
        min: 0
      },
      reserved: {
        type: Number,
        default: 0,
        min: 0
      },
      available: {
        type: Number,
        default: 0,
        min: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }
  },

  // Alert thresholds
  alertThresholds: {
    critical: {
      type: Number,
      default: 5000,
      comment: 'Alert when stock falls below this (liters)'
    },
    low: {
      type: Number,
      default: 20000
    },
    medium: {
      type: Number,
      default: 50000
    }
  },

  status: {
    type: String,
    enum: ['active', 'maintenance', 'closed'],
    default: 'active'
  },

  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound unique index
InventorySchema.index({ locationId: 1 }, { unique: true });

// Calculate available stock before saving
InventorySchema.pre('save', function(next) {
  ['pms', 'ago', 'ik'].forEach(fuelType => {
    if (this.fuelStock[fuelType]) {
      this.fuelStock[fuelType].available = 
        this.fuelStock[fuelType].currentStock - 
        this.fuelStock[fuelType].reserved;
      this.fuelStock[fuelType].lastUpdated = new Date();
    }
  });
  next();
});

// Static method to find by location
InventorySchema.statics.findByLocation = function(locationId) {
  return this.findOne({ locationId });
};

// Static method to get all active locations
InventorySchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Method to check stock status
InventorySchema.methods.getStockStatus = function(fuelType) {
  const stock = this.fuelStock[fuelType];
  if (!stock) return null;

  const currentStock = stock.currentStock;
  const thresholds = this.alertThresholds;

  if (currentStock >= thresholds.medium) {
    return {
      level: 'high',
      label: 'In Stock',
      color: 'green'
    };
  } else if (currentStock >= thresholds.low) {
    return {
      level: 'medium',
      label: 'Moderate Stock',
      color: 'yellow'
    };
  } else if (currentStock >= thresholds.critical) {
    return {
      level: 'low',
      label: 'Low Stock',
      color: 'orange'
    };
  } else {
    return {
      level: 'critical',
      label: 'Critical Stock',
      color: 'red'
    };
  }
};

// Method to reserve stock
InventorySchema.methods.reserveStock = function(fuelType, quantity) {
  const stock = this.fuelStock[fuelType];
  
  if (!stock) {
    throw new Error('Invalid fuel type');
  }

  if (stock.available < quantity) {
    throw new Error('Insufficient stock available');
  }

  stock.reserved += quantity;
  stock.available = stock.currentStock - stock.reserved;
  stock.lastUpdated = new Date();

  return this.save();
};

// Method to complete order (reduce actual stock)
InventorySchema.methods.completeOrder = function(fuelType, quantity) {
  const stock = this.fuelStock[fuelType];
  
  if (!stock) {
    throw new Error('Invalid fuel type');
  }

  stock.currentStock -= quantity;
  stock.reserved -= quantity;
  stock.available = stock.currentStock - stock.reserved;
  stock.lastUpdated = new Date();

  return this.save();
};

// Method to cancel reservation
InventorySchema.methods.cancelReservation = function(fuelType, quantity) {
  const stock = this.fuelStock[fuelType];
  
  if (!stock) {
    throw new Error('Invalid fuel type');
  }

  stock.reserved -= quantity;
  stock.available = stock.currentStock - stock.reserved;
  stock.lastUpdated = new Date();

  return this.save();
};

// Method to add stock (restock)
InventorySchema.methods.addStock = function(fuelType, quantity) {
  const stock = this.fuelStock[fuelType];
  
  if (!stock) {
    throw new Error('Invalid fuel type');
  }

  stock.currentStock += quantity;
  stock.available = stock.currentStock - stock.reserved;
  stock.lastUpdated = new Date();

  return this.save();
};

// Prevent model recompilation
const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);

export default Inventory;