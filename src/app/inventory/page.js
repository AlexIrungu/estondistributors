// src/app/inventory/page.js
'use client';

import { useState, useEffect } from 'react';
import { Package, MapPin, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';
import InventoryStatus from '@/components/inventory/InventoryStatus';
import LowStockAlert from '@/components/inventory/LowStockAlert';
import { 
  getAllInventory, 
  getInventorySummary, 
  DEPOT_LOCATIONS,
  formatQuantity 
} from '@/lib/db/inventoryStorage';

export default function InventoryPage() {
  const [selectedLocation, setSelectedLocation] = useState('nairobi');
  const [inventory, setInventory] = useState(null);
  const [summary, setSummary] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    const allInventory = getAllInventory();
    const inventorySummary = getInventorySummary();
    setInventory(allInventory);
    setSummary(inventorySummary);
    setLastUpdated(new Date());
  };

  const handleRefresh = () => {
    loadInventory();
  };

  const fuelTypes = [
    { id: 'pms', name: 'Super Petrol (PMS)', icon: '⛽' },
    { id: 'ago', name: 'Diesel (AGO)', icon: '🚚' },
    { id: 'ik', name: 'Kerosene (IK)', icon: '🔥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-accent-50/10">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Package className="w-5 h-5 text-primary-300" />
              <span className="text-sm font-semibold">Real-Time Stock Levels</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fuel Inventory Status
            </h1>
            
            <p className="text-xl text-neutral-200 mb-8">
              Check real-time availability across our depot locations
            </p>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* Low Stock Alert Banner */}
      <LowStockAlert variant="banner" />

      {/* Summary Cards */}
      {summary && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              National Stock Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fuelTypes.map(fuel => {
                const fuelSummary = summary[fuel.id];
                const status = fuelSummary.status;
                
                return (
                  <div 
                    key={fuel.id}
                    className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{fuel.icon}</div>
                        <div>
                          <h3 className="font-bold text-secondary-900">{fuel.name}</h3>
                          <p className="text-xs text-neutral-600">All Locations</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bgColor} ${status.textColor}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-600">Capacity</span>
                          <span className="font-semibold">{fuelSummary.percentageFull}%</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              status.level === 'high' ? 'bg-green-500' :
                              status.level === 'medium' ? 'bg-yellow-500' :
                              status.level === 'low' ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${fuelSummary.percentageFull}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-neutral-600 text-xs">Available</div>
                          <div className="font-bold text-green-600">
                            {formatQuantity(fuelSummary.available)}
                          </div>
                        </div>
                        <div>
                          <div className="text-neutral-600 text-xs">Total</div>
                          <div className="font-bold text-secondary-900">
                            {formatQuantity(fuelSummary.total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Location Selector */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">
            Stock by Location
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {Object.values(DEPOT_LOCATIONS).map(depot => (
              <button
                key={depot.id}
                onClick={() => setSelectedLocation(depot.id)}
                className={`text-left p-6 rounded-xl border-2 transition-all ${
                  selectedLocation === depot.id
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-6 h-6 ${
                      selectedLocation === depot.id ? 'text-primary-600' : 'text-neutral-600'
                    }`} />
                    <div>
                      <h3 className="font-bold text-secondary-900 text-lg">
                        {depot.name}
                      </h3>
                      <p className="text-sm text-neutral-600">{depot.location}</p>
                    </div>
                  </div>
                  {selectedLocation === depot.id && (
                    <span className="px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-600 mt-3 flex items-center gap-2">
                  <span>📞</span>
                  <span>{depot.contact}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Inventory by Location */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {fuelTypes.map(fuel => (
              <InventoryStatus
                key={fuel.id}
                locationId={selectedLocation}
                fuelType={fuel.id}
                variant="detailed"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-primary-50/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    About Our Inventory System
                  </h3>
                  <p className="text-neutral-600">
                    Our real-time inventory tracking ensures you always know what's available. 
                    Stock levels are updated continuously as orders are placed and deliveries are made.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-secondary-900">Stock Indicators:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-sm"><strong>High Stock:</strong> {">"} 50,000L</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <span className="text-sm"><strong>Medium:</strong> 20,000-50,000L</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                      <span className="text-sm"><strong>Low:</strong> 5,000-20,000L</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span className="text-sm"><strong>Critical:</strong> {"<"} 5,000L</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-secondary-900">Need to Order?</h4>
                  <p className="text-sm text-neutral-600">
                    Contact our sales team for immediate assistance with your fuel requirements.
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="/contact"
                      className="flex-1 text-center px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
                    >
                      Contact Sales
                    </a>
                    <a
                      href="tel:+254722943291"
                      className="flex-1 text-center px-4 py-2 bg-white border-2 border-neutral-300 text-neutral-700 rounded-lg text-sm font-semibold hover:border-neutral-400 transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-neutral-500 mt-6">
              Last updated: {lastUpdated.toLocaleString()} • Auto-refreshes every 5 minutes
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}