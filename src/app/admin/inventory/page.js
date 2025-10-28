// src/app/admin/inventory/page.js
'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Save, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import { 
  getAllInventory, 
  updateInventory,
  getLowStockAlerts,
  DEPOT_LOCATIONS,
  formatQuantity 
} from '@/lib/db/inventoryStorage';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getAllInventory();
    const stockAlerts = getLowStockAlerts();
    setInventory(data);
    setAlerts(stockAlerts);
  };

  const handleEdit = (location, fuel, field, value) => {
    setInventory(prev => ({
      ...prev,
      [location]: {
        ...prev[location],
        [fuel]: {
          ...prev[location][fuel],
          [field]: parseInt(value) || 0
        }
      }
    }));
  };

  const handleQuickAdjust = (location, fuel, amount) => {
    setInventory(prev => {
      const currentStock = prev[location][fuel].currentStock;
      const newStock = Math.max(0, currentStock + amount);
      
      return {
        ...prev,
        [location]: {
          ...prev[location],
          [fuel]: {
            ...prev[location][fuel],
            currentStock: newStock,
            available: newStock - prev[location][fuel].reserved
          }
        }
      };
    });
  };

  const handleSave = (location, fuel) => {
    try {
      const updates = inventory[location][fuel];
      updateInventory(location, fuel, updates);
      setSaveStatus(`✓ ${location} ${fuel.toUpperCase()} saved`);
      setTimeout(() => setSaveStatus(''), 3000);
      loadData(); // Reload to get updated alerts
    } catch (error) {
      setSaveStatus(`✗ Error: ${error.message}`);
    }
  };

  const handleSaveAll = () => {
    try {
      Object.keys(inventory).forEach(location => {
        Object.keys(inventory[location]).forEach(fuel => {
          updateInventory(location, fuel, inventory[location][fuel]);
        });
      });
      setSaveStatus('✓ All changes saved successfully');
      setTimeout(() => setSaveStatus(''), 3000);
      loadData();
    } catch (error) {
      setSaveStatus(`✗ Error: ${error.message}`);
    }
  };

  const fuelTypes = [
    { id: 'pms', name: 'Super Petrol', color: 'primary' },
    { id: 'ago', name: 'Diesel', color: 'accent' },
    { id: 'ik', name: 'Kerosene', color: 'amber' }
  ];

  if (!inventory) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                  Inventory Management
                </h1>
                <p className="text-sm text-neutral-600">Admin Panel</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {saveStatus && (
                <span className={`text-sm font-semibold ${
                  saveStatus.startsWith('✓') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {saveStatus}
                </span>
              )}
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 border-2 border-neutral-300 rounded-lg font-semibold hover:border-neutral-400 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8 bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-orange-900">
                Low Stock Alerts ({alerts.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.map((alert, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg p-4 border-2 border-orange-300"
                >
                  <div className="font-bold text-secondary-900 mb-1">
                    {alert.fuelType} - {alert.locationName}
                  </div>
                  <div className="text-sm text-orange-700">
                    Available: <strong>{formatQuantity(alert.available)}</strong>
                  </div>
                  <div className="text-sm text-neutral-600">
                    Status: <strong className={alert.status.textColor}>{alert.status.label}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Management Tables */}
        {Object.entries(DEPOT_LOCATIONS).map(([locationId, depot]) => (
          <div key={locationId} className="mb-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              {depot.name}
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-100 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-secondary-900">
                        Fuel Type
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-secondary-900">
                        Current Stock (L)
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-secondary-900">
                        Reserved (L)
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-secondary-900">
                        Available (L)
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-secondary-900">
                        Capacity (L)
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-bold text-secondary-900">
                        Quick Adjust
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-bold text-secondary-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {fuelTypes.map(fuel => {
                      const stock = inventory[locationId][fuel.id];
                      const percentFull = ((stock.currentStock / stock.capacity) * 100).toFixed(1);
                      
                      return (
                        <tr key={fuel.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-secondary-900">
                              {fuel.name}
                            </div>
                            <div className="text-xs text-neutral-600">
                              {percentFull}% Full
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <input
                              type="number"
                              value={stock.currentStock}
                              onChange={(e) => handleEdit(locationId, fuel.id, 'currentStock', e.target.value)}
                              className="w-32 px-3 py-2 border border-neutral-300 rounded-lg text-right font-semibold focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <input
                              type="number"
                              value={stock.reserved}
                              onChange={(e) => handleEdit(locationId, fuel.id, 'reserved', e.target.value)}
                              className="w-32 px-3 py-2 border border-neutral-300 rounded-lg text-right font-semibold focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-green-600">
                              {stock.available.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-semibold text-neutral-700">
                              {stock.capacity.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleQuickAdjust(locationId, fuel.id, -5000)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Decrease by 5,000L"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleQuickAdjust(locationId, fuel.id, 5000)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                title="Increase by 5,000L"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleSave(locationId, fuel.id)}
                              className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors text-sm"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">Admin Instructions:</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Edit stock levels directly in the input fields</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Use Quick Adjust buttons (+/-) to change by 5,000L increments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Available stock is automatically calculated (Current - Reserved)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Click "Save" for individual fuel types or "Save All" to update everything</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Low stock alerts automatically update when levels fall below thresholds</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}