'use client'
import { useState, useEffect } from 'react';
import { Package, MapPin, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { getFuelInventory, formatQuantity } from '@/lib/db/inventoryStorage';

export default function InventoryStatus({ 
  locationId = 'nairobi', 
  fuelType = 'pms',
  variant = 'detailed' // 'simple', 'detailed', 'compact'
}) {
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    loadInventory();
  }, [locationId, fuelType]);

  const loadInventory = () => {
    const data = getFuelInventory(locationId, fuelType);
    setInventory(data);
  };

  if (!inventory) {
    return (
      <div className="animate-pulse bg-neutral-100 rounded-lg p-4">
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
      </div>
    );
  }

  const status = inventory.status;
  const fuelNames = {
    pms: 'Super Petrol',
    ago: 'Diesel',
    ik: 'Kerosene'
  };

  // Simple badge variant (for product cards, homepage)
  if (variant === 'simple') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.borderColor} ${status.bgColor}`}>
        <span className="text-sm">{status.icon}</span>
        <span className={`text-sm font-semibold ${status.textColor}`}>
          {status.label}
        </span>
      </div>
    );
  }

  // Compact variant (for lists)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between p-3 rounded-lg border ${status.borderColor} ${status.bgColor}`}>
        <div className="flex items-center gap-2">
          <Package className={`w-4 h-4 ${status.textColor}`} />
          <span className={`text-sm font-semibold ${status.textColor}`}>
            {status.label}
          </span>
        </div>
        <span className={`text-sm font-bold ${status.textColor}`}>
          {formatQuantity(inventory.available)}
        </span>
      </div>
    );
  }

  // Detailed variant (default - for product pages, inventory page)
  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-secondary-900 mb-1">
            {fuelNames[fuelType]} Stock Status
          </h3>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="w-4 h-4" />
            <span>{inventory.depot}</span>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-full border-2 ${status.borderColor} ${status.bgColor}`}>
          <span className={`text-lg font-bold ${status.textColor}`}>
            {status.icon} {status.label}
          </span>
        </div>
      </div>

      {/* Stock Levels */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-neutral-700">Storage Capacity</span>
            <span className="text-sm font-bold text-secondary-900">
              {inventory.percentageFull}% Full
            </span>
          </div>
          <div className="relative w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                status.level === 'high' ? 'bg-green-500' :
                status.level === 'medium' ? 'bg-yellow-500' :
                status.level === 'low' ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${inventory.percentageFull}%` }}
            />
          </div>
        </div>

        {/* Stock Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
            <div className="text-xs text-neutral-600 mb-1">Available Now</div>
            <div className="text-xl font-bold text-green-600">
              {formatQuantity(inventory.available)}
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
            <div className="text-xs text-neutral-600 mb-1">Total Stock</div>
            <div className="text-xl font-bold text-secondary-900">
              {formatQuantity(inventory.currentStock)}
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <div className="text-xs text-neutral-600 mb-1">Reserved</div>
            <div className="text-xl font-bold text-amber-600">
              {formatQuantity(inventory.reserved)}
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
            <div className="text-xs text-neutral-600 mb-1">Capacity</div>
            <div className="text-xl font-bold text-neutral-700">
              {formatQuantity(inventory.capacity)}
            </div>
          </div>
        </div>

        {/* Warning Message */}
        {inventory.isLowStock && (
          <div className={`flex items-start gap-2 p-3 rounded-lg border ${
            status.level === 'critical' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              status.level === 'critical' ? 'text-red-600' : 'text-orange-600'
            }`} />
            <div className="text-sm">
              <p className={`font-semibold ${
                status.level === 'critical' ? 'text-red-800' : 'text-orange-800'
              }`}>
                {status.level === 'critical' ? 'Critical Stock Alert' : 'Low Stock Notice'}
              </p>
              <p className={`mt-1 ${
                status.level === 'critical' ? 'text-red-700' : 'text-orange-700'
              }`}>
                {status.level === 'critical' 
                  ? 'Stock critically low. Please order in advance to avoid delays.'
                  : 'Stock running low. Consider ordering soon to ensure availability.'}
              </p>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <span className="text-xs text-neutral-500">
            Last updated: {new Date(inventory.lastUpdated).toLocaleString()}
          </span>
          {inventory.canOrder && (
            <button 
              onClick={() => window.location.href = '/contact'}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Order Now →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}