// src/lib/db/models/Fleet.js
// Fleet vehicle and refuel tracking models for MongoDB

import mongoose from 'mongoose';

// Vehicle Schema
const VehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    trim: true,
    uppercase: true
  },
  vehicleName: {
    type: String,
    default: '',
    trim: true
  },
  vehicleType: {
    type: String,
    enum: ['truck', 'van', 'car', 'motorcycle', 'bus', 'other'],
    required: true
  },
  make: {
    type: String,
    default: '',
    trim: true
  },
  model: {
    type: String,
    default: '',
    trim: true
  },
  year: {
    type: Number,
    default: () => new Date().getFullYear(),
    min: 1900,
    max: () => new Date().getFullYear() + 1
  },
  fuelType: {
    type: String,
    enum: ['pms', 'ago', 'ik'],
    required: true
  },
  tankCapacity: {
    type: Number,
    default: 0,
    min: 0
  },
  avgConsumption: {
    type: Number,
    default: 0,
    min: 0,
    comment: 'km per liter'
  },
  currentOdometer: {
    type: Number,
    default: 0,
    min: 0,
    comment: 'Current odometer reading in km'
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'retired', 'deleted'],
    default: 'active',
    index: true
  },
  notes: {
    type: String,
    default: ''
  },
  stats: {
    totalRefuels: {
      type: Number,
      default: 0
    },
    totalLiters: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number,
      default: 0
    },
    totalDistance: {
      type: Number,
      default: 0
    },
    avgFuelEfficiency: {
      type: Number,
      default: 0
    },
    lastRefuelDate: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Indexes
VehicleSchema.index({ userId: 1, status: 1 });
VehicleSchema.index({ userId: 1, vehicleNumber: 1 }, { unique: true });

// Refuel Schema
const RefuelSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  odometer: {
    type: Number,
    required: true,
    min: 0,
    comment: 'Odometer reading in km'
  },
  liters: {
    type: Number,
    required: true,
    min: 0.1
  },
  pricePerLiter: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  fuelType: {
    type: String,
    enum: ['pms', 'ago', 'ik'],
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  fuelStation: {
    type: String,
    default: ''
  },
  isFull: {
    type: Boolean,
    default: false,
    comment: 'Whether tank was filled completely'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for refuels
RefuelSchema.index({ vehicleId: 1, date: -1 });
RefuelSchema.index({ userId: 1, date: -1 });

// Calculate total cost before saving
RefuelSchema.pre('save', function(next) {
  if (this.isModified('liters') || this.isModified('pricePerLiter')) {
    this.totalCost = this.liters * this.pricePerLiter;
  }
  next();
});

// Static method to get refuels by vehicle
RefuelSchema.statics.findByVehicle = function(vehicleId) {
  return this.find({ vehicleId }).sort({ date: -1 });
};

// Static method to get refuels by user
RefuelSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ date: -1 });
};

// Prevent model recompilation
const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);
const Refuel = mongoose.models.Refuel || mongoose.model('Refuel', RefuelSchema);

export { Vehicle, Refuel };
export default Vehicle;