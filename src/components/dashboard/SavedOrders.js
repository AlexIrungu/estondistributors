// src/components/dashboard/SavedOrders.js
'use client';

import { useState, useEffect } from 'react';
import { Star, Trash2, ShoppingCart, Calendar, Package, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function SavedOrders({ onReorder }) {
  const [savedOrders, setSavedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSavedOrders();
  }, []);

  const fetchSavedOrders = async () => {
    try {
      const response = await fetch('/api/orders?favorites=true');
      const data = await response.json();
      
      if (data.success) {
        setSavedOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching saved orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (orderId) => {
    setDeletingId(orderId);
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_favorite' }),
      });

      const data = await response.json();

      if (data.success) {
        setSavedOrders(prev => prev.filter(order => order.id !== orderId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = (order) => {
    if (onReorder) {
      onReorder({
        fuelType: order.fuelType,
        quantity: order.quantity,
        deliveryAddress: order.deliveryAddress,
        deliveryZone: order.deliveryZone,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-neutral-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (savedOrders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Star className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            No Saved Orders
          </h3>
          <p className="text-neutral-600 mb-6">
            Star your favorite orders for quick reordering
          </p>
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-left max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Tip:</strong> Click the star icon on any order in your order history to save it here
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900">
                Saved Orders
              </h2>
              <p className="text-sm text-neutral-600">
                {savedOrders.length} {savedOrders.length === 1 ? 'order' : 'orders'} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Orders List */}
      <div className="divide-y divide-neutral-200">
        {savedOrders.map((order) => (
          <div
            key={order.id}
            className="p-6 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Order Details */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary-900 text-lg">
                      {order.fuelType}
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      Order #{order.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-700">
                      {order.quantity.toLocaleString()} Liters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-700">
                      {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-neutral-600">
                  <strong>Delivery:</strong> {order.deliveryAddress}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">Total:</span>
                  <span className="text-lg font-bold text-primary-600">
                    KES {order.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleReorder(order)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Reorder</span>
                </button>
                <button
                  onClick={() => handleRemoveFavorite(order.id)}
                  disabled={deletingId === order.id}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deletingId === order.id ? 'Removing...' : 'Remove'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Tip */}
      <div className="p-4 bg-neutral-50 border-t border-neutral-200">
        <div className="flex items-start gap-2 text-sm text-neutral-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Saved orders are stored for quick reordering. Click "Reorder" to place the same order again with updated prices.
          </p>
        </div>
      </div>
    </div>
  );
}