'use client';

import { useState, useEffect } from 'react';
import { Package, MapPin, AlertCircle, TrendingDown, Calendar, RefreshCw, Bell, CheckCircle } from 'lucide-react';

export default function InventoryStatus({ 
  locationId = 'nairobi', 
  fuelType = 'pms',
  variant = 'detailed'
}) {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
    const interval = setInterval(loadInventory, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [locationId, fuelType]);

  const loadInventory = async () => {
    try {
      // Simulated inventory data - replace with actual API call
      const mockInventory = {
        depot: locationId.charAt(0).toUpperCase() + locationId.slice(1),
        currentStock: 85000,
        capacity: 200000,
        reserved: 15000,
        available: 70000,
        percentageFull: 42.5,
        lastUpdated: new Date().toISOString(),
        isLowStock: false,
        canOrder: true,
        daysOfStockRemaining: 12,
        avgDailyConsumption: 5800,
        reorderPoint: 40000,
        nextDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        expectedDeliveryVolume: 100000,
        turnoverRate: 8.5,
        status: {
          level: 'medium',
          label: 'Moderate Stock',
          icon: '⚠️',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        }
      };
      setInventory(mockInventory);
      setLoading(false);
    } catch (error) {
      console.error('Error loading inventory:', error);
      setLoading(false);
    }
  };

  const formatQuantity = (liters) => {
    if (liters >= 1000) {
      return `${(liters / 1000).toFixed(1)}K L`;
    }
    return `${liters.toLocaleString()} L`;
  };

  const fuelNames = {
    pms: 'Super Petrol',
    ago: 'Diesel',
    ik: 'Kerosene'
  };

  if (loading || !inventory) {
    return (
      <div className="animate-pulse bg-neutral-100 rounded-lg p-4">
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
      </div>
    );
  }

  const status = inventory.status;

  // Simple badge variant
  if (variant === 'simple') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.borderColor} ${status.bgColor}`}>
        <span className="text-sm">{status.icon}</span>
        <span className={`text-sm font-semibold ${status.textColor}`}>{status.label}</span>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between p-3 rounded-lg border ${status.borderColor} ${status.bgColor}`}>
        <div className="flex items-center gap-2">
          <Package className={`w-4 h-4 ${status.textColor}`} />
          <span className={`text-sm font-semibold ${status.textColor}`}>{status.label}</span>
        </div>
        <span className={`text-sm font-bold ${status.textColor}`}>{formatQuantity(inventory.available)}</span>
      </div>
    );
  }

  // Detailed variant with tank visualization
  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-secondary-900 mb-1">{fuelNames[fuelType]} Stock Status</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="w-4 h-4" />
            <span>{inventory.depot} Depot</span>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-full border-2 ${status.borderColor} ${status.bgColor}`}>
          <span className={`text-lg font-bold ${status.textColor}`}>
            {status.icon} {status.label}
          </span>
        </div>
      </div>

      {/* Visual Tank Indicator */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-neutral-700">Tank Level</span>
          <span className="text-xl font-bold text-secondary-900">{inventory.percentageFull.toFixed(1)}%</span>
        </div>

        {/* 3D-style Tank Visualization */}
        <div className="relative h-48 bg-gradient-to-b from-neutral-200 to-neutral-300 rounded-lg overflow-hidden border-2 border-neutral-400">
          {/* Water level effect */}
          <div 
            className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${
              status.level === 'high' ? 'bg-gradient-to-t from-green-500 to-green-400' :
              status.level === 'medium' ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' :
              status.level === 'low' ? 'bg-gradient-to-t from-orange-500 to-orange-400' :
              'bg-gradient-to-t from-red-500 to-red-400'
            }`}
            style={{ height: `${inventory.percentageFull}%` }}
          >
            {/* Animated wave effect */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-white opacity-20 animate-pulse"></div>
          </div>

          {/* Capacity markers */}
          <div className="absolute inset-0 flex flex-col justify-between py-2 px-4 pointer-events-none">
            {[100, 75, 50, 25, 0].map(percent => (
              <div key={percent} className="flex items-center justify-between text-xs text-neutral-600 font-semibold">
                <span className="bg-white px-2 py-0.5 rounded shadow-sm">{percent}%</span>
                <span className="bg-white px-2 py-0.5 rounded shadow-sm">
                  {formatQuantity((inventory.capacity * percent) / 100)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Level Indicator */}
        <div className="mt-3 text-center">
          <p className="text-2xl font-bold text-secondary-900">{formatQuantity(inventory.currentStock)}</p>
          <p className="text-sm text-neutral-600">of {formatQuantity(inventory.capacity)} capacity</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-xs font-medium text-green-700">Available Now</p>
          </div>
          <p className="text-2xl font-bold text-green-900">{formatQuantity(inventory.available)}</p>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-amber-600" />
            <p className="text-xs font-medium text-amber-700">Reserved</p>
          </div>
          <p className="text-2xl font-bold text-amber-900">{formatQuantity(inventory.reserved)}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <p className="text-xs font-medium text-blue-700">Days Remaining</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">{inventory.daysOfStockRemaining} days</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-purple-600" />
            <p className="text-xs font-medium text-purple-700">Daily Usage</p>
          </div>
          <p className="text-2xl font-bold text-purple-900">{formatQuantity(inventory.avgDailyConsumption)}</p>
        </div>
      </div>

      {/* Automated Reorder Alert */}
      {inventory.currentStock <= inventory.reorderPoint && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Bell className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <p className="font-bold text-orange-900 mb-1">⚡ Automated Reorder Triggered</p>
              <p className="text-sm text-orange-800 mb-2">
                Stock has reached reorder point ({formatQuantity(inventory.reorderPoint)}). 
                Automated purchase order initiated.
              </p>
              <div className="bg-white rounded p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Expected Delivery:</span>
                  <span className="font-semibold text-neutral-900">
                    {new Date(inventory.nextDeliveryDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Order Volume:</span>
                  <span className="font-semibold text-neutral-900">
                    {formatQuantity(inventory.expectedDeliveryVolume)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Message for Low Stock */}
      {inventory.isLowStock && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${
          status.level === 'critical' ? 'bg-red-50 border-red-300' : 'bg-orange-50 border-orange-300'
        }`}>
          <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
            status.level === 'critical' ? 'text-red-600' : 'text-orange-600'
          }`} />
          <div className="text-sm flex-1">
            <p className={`font-semibold mb-1 ${
              status.level === 'critical' ? 'text-red-800' : 'text-orange-800'
            }`}>
              {status.level === 'critical' ? '🚨 Critical Stock Alert' : '⚠️ Low Stock Notice'}
            </p>
            <p className={status.level === 'critical' ? 'text-red-700' : 'text-orange-700'}>
              {status.level === 'critical' 
                ? 'Stock critically low. Immediate restocking recommended to avoid stockouts.'
                : 'Stock running low. Consider ordering soon to maintain adequate inventory levels.'}
            </p>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-neutral-900 mb-3">Inventory Performance</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-600">Turnover Rate (per month):</span>
            <span className="font-bold text-neutral-900">{inventory.turnoverRate}x</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-600">Stock Efficiency:</span>
            <span className="font-bold text-green-600">
              {inventory.turnoverRate > 8 ? 'Excellent' : inventory.turnoverRate > 5 ? 'Good' : 'Fair'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <RefreshCw className="w-3 h-3" />
          <span>Updated {new Date(inventory.lastUpdated).toLocaleTimeString()}</span>
        </div>
        {inventory.canOrder && (
          <button 
            onClick={() => window.location.href = '/contact'}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors text-sm"
          >
            Order Now →
          </button>
        )}
      </div>
    </div>
  );
}