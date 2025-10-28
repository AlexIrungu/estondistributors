// src/lib/db/inventoryStorage.js

/**
 * Inventory Storage Management for Fuel Distribution
 * Handles stock levels, capacities, and alerts
 */

/**
 * Stock level thresholds (in liters)
 */
export const STOCK_THRESHOLDS = {
  high: 50000,      // > 50,000L
  medium: 20000,    // 20,000 - 50,000L
  low: 5000,        // 5,000 - 20,000L
  critical: 5000    // < 5,000L
};

/**
 * Depot locations with capacities
 */
export const DEPOT_LOCATIONS = {
  nairobi: {
    id: 'nairobi',
    name: 'Nairobi Depot',
    location: 'Industrial Area, Nairobi',
    capacity: {
      pms: 150000,  // 150,000 liters capacity
      ago: 200000,  // 200,000 liters capacity
      ik: 100000    // 100,000 liters capacity
    },
    contact: '+254 722 943 291'
  },
  mombasa: {
    id: 'mombasa',
    name: 'Mombasa Depot',
    location: 'Port Reitz, Mombasa',
    capacity: {
      pms: 180000,
      ago: 250000,
      ik: 120000
    },
    contact: '+254 722 943 291'
  }
};

/**
 * Initial inventory data (this would come from a database in production)
 */
const INITIAL_INVENTORY = {
  nairobi: {
    pms: {
      currentStock: 85000,
      capacity: 150000,
      lastUpdated: new Date().toISOString(),
      reserved: 10000,  // Orders pending delivery
      available: 75000
    },
    ago: {
      currentStock: 120000,
      capacity: 200000,
      lastUpdated: new Date().toISOString(),
      reserved: 15000,
      available: 105000
    },
    ik: {
      currentStock: 45000,
      capacity: 100000,
      lastUpdated: new Date().toISOString(),
      reserved: 5000,
      available: 40000
    }
  },
  mombasa: {
    pms: {
      currentStock: 95000,
      capacity: 180000,
      lastUpdated: new Date().toISOString(),
      reserved: 12000,
      available: 83000
    },
    ago: {
      currentStock: 160000,
      capacity: 250000,
      lastUpdated: new Date().toISOString(),
      reserved: 20000,
      available: 140000
    },
    ik: {
      currentStock: 55000,
      capacity: 120000,
      lastUpdated: new Date().toISOString(),
      reserved: 8000,
      available: 47000
    }
  }
};

/**
 * Get stock level status
 */
export function getStockStatus(currentStock) {
  if (currentStock >= STOCK_THRESHOLDS.high) {
    return {
      level: 'high',
      label: 'In Stock',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: '✓'
    };
  }
  
  if (currentStock >= STOCK_THRESHOLDS.medium) {
    return {
      level: 'medium',
      label: 'Moderate Stock',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      icon: '⚠'
    };
  }
  
  if (currentStock >= STOCK_THRESHOLDS.low) {
    return {
      level: 'low',
      label: 'Low Stock',
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      icon: '!'
    };
  }
  
  return {
    level: 'critical',
    label: 'Critical Stock',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: '⚠'
  };
}

/**
 * Get all inventory data
 */
export function getAllInventory() {
  // In production, this would fetch from a database
  // For now, we'll use localStorage with fallback to initial data
  if (typeof window === 'undefined') {
    return INITIAL_INVENTORY;
  }

  const stored = localStorage.getItem('fuel_inventory');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing inventory:', e);
    }
  }
  
  // Initialize with default data
  localStorage.setItem('fuel_inventory', JSON.stringify(INITIAL_INVENTORY));
  return INITIAL_INVENTORY;
}

/**
 * Get inventory for specific location
 */
export function getLocationInventory(locationId) {
  const inventory = getAllInventory();
  return inventory[locationId] || null;
}

/**
 * Get inventory for specific fuel type at location
 */
export function getFuelInventory(locationId, fuelType) {
  const locationInventory = getLocationInventory(locationId);
  if (!locationInventory) return null;
  
  const fuelStock = locationInventory[fuelType];
  if (!fuelStock) return null;

  const depot = DEPOT_LOCATIONS[locationId];
  const status = getStockStatus(fuelStock.currentStock);
  const percentageFull = (fuelStock.currentStock / fuelStock.capacity) * 100;

  return {
    ...fuelStock,
    depot: depot.name,
    location: depot.location,
    status,
    percentageFull: percentageFull.toFixed(1),
    isLowStock: status.level === 'low' || status.level === 'critical',
    canOrder: fuelStock.available > 0
  };
}

/**
 * Update inventory (admin function)
 */
export function updateInventory(locationId, fuelType, updates) {
  const inventory = getAllInventory();
  
  if (!inventory[locationId] || !inventory[locationId][fuelType]) {
    throw new Error('Invalid location or fuel type');
  }

  inventory[locationId][fuelType] = {
    ...inventory[locationId][fuelType],
    ...updates,
    lastUpdated: new Date().toISOString()
  };

  // Recalculate available stock
  inventory[locationId][fuelType].available = 
    inventory[locationId][fuelType].currentStock - 
    inventory[locationId][fuelType].reserved;

  if (typeof window !== 'undefined') {
    localStorage.setItem('fuel_inventory', JSON.stringify(inventory));
  }

  return inventory[locationId][fuelType];
}

/**
 * Reserve stock for an order
 */
export function reserveStock(locationId, fuelType, quantity) {
  const inventory = getAllInventory();
  const fuelStock = inventory[locationId]?.[fuelType];

  if (!fuelStock) {
    throw new Error('Invalid location or fuel type');
  }

  if (fuelStock.available < quantity) {
    throw new Error('Insufficient stock available');
  }

  fuelStock.reserved += quantity;
  fuelStock.available = fuelStock.currentStock - fuelStock.reserved;
  fuelStock.lastUpdated = new Date().toISOString();

  if (typeof window !== 'undefined') {
    localStorage.setItem('fuel_inventory', JSON.stringify(inventory));
  }

  return fuelStock;
}

/**
 * Complete an order (reduce actual stock)
 */
export function completeOrder(locationId, fuelType, quantity) {
  const inventory = getAllInventory();
  const fuelStock = inventory[locationId]?.[fuelType];

  if (!fuelStock) {
    throw new Error('Invalid location or fuel type');
  }

  fuelStock.currentStock -= quantity;
  fuelStock.reserved -= quantity;
  fuelStock.available = fuelStock.currentStock - fuelStock.reserved;
  fuelStock.lastUpdated = new Date().toISOString();

  if (typeof window !== 'undefined') {
    localStorage.setItem('fuel_inventory', JSON.stringify(inventory));
  }

  return fuelStock;
}

/**
 * Get low stock alerts
 */
export function getLowStockAlerts() {
  const inventory = getAllInventory();
  const alerts = [];

  Object.entries(inventory).forEach(([locationId, location]) => {
    Object.entries(location).forEach(([fuelType, stock]) => {
      const status = getStockStatus(stock.currentStock);
      
      if (status.level === 'low' || status.level === 'critical') {
        alerts.push({
          locationId,
          locationName: DEPOT_LOCATIONS[locationId].name,
          fuelType: fuelType.toUpperCase(),
          currentStock: stock.currentStock,
          capacity: stock.capacity,
          available: stock.available,
          status,
          percentageFull: ((stock.currentStock / stock.capacity) * 100).toFixed(1)
        });
      }
    });
  });

  return alerts;
}

/**
 * Get inventory summary (total across all locations)
 */
export function getInventorySummary() {
  const inventory = getAllInventory();
  const summary = {
    pms: { total: 0, available: 0, reserved: 0, capacity: 0 },
    ago: { total: 0, available: 0, reserved: 0, capacity: 0 },
    ik: { total: 0, available: 0, reserved: 0, capacity: 0 }
  };

  Object.values(inventory).forEach(location => {
    Object.entries(location).forEach(([fuelType, stock]) => {
      summary[fuelType].total += stock.currentStock;
      summary[fuelType].available += stock.available;
      summary[fuelType].reserved += stock.reserved;
      summary[fuelType].capacity += stock.capacity;
    });
  });

  // Add status for each fuel type
  Object.keys(summary).forEach(fuelType => {
    summary[fuelType].status = getStockStatus(summary[fuelType].total);
    summary[fuelType].percentageFull = 
      ((summary[fuelType].total / summary[fuelType].capacity) * 100).toFixed(1);
  });

  return summary;
}

/**
 * Format quantity for display
 */
export function formatQuantity(liters) {
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)}K L`;
  }
  return `${liters.toLocaleString()} L`;
}

/**
 * Check if order can be fulfilled
 */
export function canFulfillOrder(locationId, fuelType, quantity) {
  const fuelStock = getFuelInventory(locationId, fuelType);
  
  if (!fuelStock) {
    return {
      canFulfill: false,
      reason: 'Invalid location or fuel type'
    };
  }

  if (fuelStock.available < quantity) {
    return {
      canFulfill: false,
      reason: `Insufficient stock. Only ${formatQuantity(fuelStock.available)} available`,
      available: fuelStock.available
    };
  }

  if (fuelStock.status.level === 'critical') {
    return {
      canFulfill: true,
      warning: 'Stock is critically low. Order may be delayed.',
      available: fuelStock.available
    };
  }

  return {
    canFulfill: true,
    available: fuelStock.available
  };
}

export default {
  STOCK_THRESHOLDS,
  DEPOT_LOCATIONS,
  getStockStatus,
  getAllInventory,
  getLocationInventory,
  getFuelInventory,
  updateInventory,
  reserveStock,
  completeOrder,
  getLowStockAlerts,
  getInventorySummary,
  formatQuantity,
  canFulfillOrder
};