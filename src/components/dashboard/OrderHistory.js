// src/components/dashboard/OrderHistory.js
'use client';

import { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, DollarSign, Search, Filter, Star, StarOff, Download } from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.fuelTypeName.toLowerCase().includes(query) ||
        order.deliveryAddress.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const toggleFavorite = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_favorite' }),
      });

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order =>
          order.id === orderId
            ? { ...order, isFavorite: !order.isFavorite }
            : order
        ));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-blue-100 text-blue-700',
      in_transit: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-700';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
        <p className="text-neutral-500">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Order History</h2>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-neutral-600 mt-4">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="divide-y divide-neutral-200">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 hover:bg-neutral-50 transition-colors"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-secondary-900">
                        {order.fuelTypeName}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(order.id)}
                        className="text-neutral-400 hover:text-amber-500 transition-colors"
                      >
                        {order.isFavorite ? (
                          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                        ) : (
                          <StarOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Order #{order.id}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-secondary-900 mb-1">
                    KES {order.totalCost.toLocaleString()}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Quantity</p>
                  <p className="font-semibold text-secondary-900">
                    {order.quantity.toLocaleString()} Liters
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Price per Liter</p>
                  <p className="font-semibold text-secondary-900">
                    KES {order.pricePerLiter.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Order Date</p>
                  <p className="font-semibold text-secondary-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Delivery Date</p>
                  <p className="font-semibold text-secondary-900">
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-neutral-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Delivery Address
                </p>
                <p className="text-sm text-secondary-900">{order.deliveryAddress}</p>
              </div>

              {/* Order Summary */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span className="font-semibold">KES {order.subtotal.toLocaleString()}</span>
                </div>
                {order.bulkDiscountAmount > 0 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span>Discount ({order.bulkDiscount}%):</span>
                    <span className="font-semibold">
                      -KES {order.bulkDiscountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600">Delivery:</span>
                  <span className="font-semibold">KES {order.deliveryCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-200">
                <button className="flex-1 sm:flex-none px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm">
                  Reorder
                </button>
                <button className="flex-1 sm:flex-none px-4 py-2 border-2 border-neutral-300 text-neutral-700 rounded-lg font-medium hover:border-neutral-400 hover:bg-neutral-50 transition-colors text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 mb-2">
            {searchQuery || statusFilter !== 'all'
              ? 'No orders match your search'
              : 'No orders yet'}
          </p>
          <p className="text-sm text-neutral-500">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Place your first order to get started'}
          </p>
        </div>
      )}
    </div>
  );
}