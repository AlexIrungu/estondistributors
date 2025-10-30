'use client';

import { useState, useEffect, useMemo } from 'react';
import { Package, Calendar, MapPin, Search, Filter, Star, StarOff, Download, RefreshCw, ChevronDown, FileText, TrendingUp, Clock } from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showAnalytics, setShowAnalytics] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter, dateRange, fuelTypeFilter, sortBy]);

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

    // Fuel type filter
    if (fuelTypeFilter !== 'all') {
      filtered = filtered.filter(order => order.fuelType === fuelTypeFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const ranges = {
        'today': 0,
        'week': 7,
        'month': 30,
        'quarter': 90,
        'year': 365
      };
      const daysAgo = ranges[dateRange];
      const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
      filtered = filtered.filter(order => new Date(order.orderDate) >= cutoffDate);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.orderDate) - new Date(a.orderDate);
        case 'date-asc':
          return new Date(a.orderDate) - new Date(b.orderDate);
        case 'amount-desc':
          return b.totalCost - a.totalCost;
        case 'amount-asc':
          return a.totalCost - b.totalCost;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    const completed = filteredOrders.filter(o => o.status === 'delivered');
    const totalSpent = completed.reduce((sum, o) => sum + o.totalCost, 0);
    const totalLiters = completed.reduce((sum, o) => sum + o.quantity, 0);
    const avgOrderValue = completed.length > 0 ? totalSpent / completed.length : 0;
    
    // Delivery time analysis
    const deliveryTimes = completed
      .filter(o => o.deliveredAt && o.orderDate)
      .map(o => {
        const ordered = new Date(o.orderDate);
        const delivered = new Date(o.deliveredAt);
        return Math.ceil((delivered - ordered) / (1000 * 60 * 60 * 24));
      });
    const avgDeliveryTime = deliveryTimes.length > 0 
      ? deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length 
      : 0;

    return {
      totalOrders: filteredOrders.length,
      completedOrders: completed.length,
      totalSpent,
      totalLiters,
      avgOrderValue,
      avgDeliveryTime: avgDeliveryTime.toFixed(1)
    };
  }, [filteredOrders]);

  const toggleFavorite = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_favorite' }),
      });

      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, isFavorite: !order.isFavorite } : order
        ));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const reorderItem = async (order) => {
    if (confirm(`Reorder ${order.quantity}L of ${order.fuelTypeName}?`)) {
      window.location.href = `/contact?reorder=${order.id}`;
    }
  };

  const rateOrder = async (orderId, rating) => {
    console.log('Rating order:', orderId, rating);
    // Implement rating functionality
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Date', 'Fuel Type', 'Quantity', 'Total Cost', 'Status', 'Delivery Address'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        new Date(order.orderDate).toLocaleDateString(),
        order.fuelTypeName,
        order.quantity,
        order.totalCost,
        order.status,
        order.deliveryAddress.replace(/,/g, ';')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
    <div className="space-y-6">
      {/* Analytics Dashboard */}
      {showAnalytics && filteredOrders.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <Package className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90">Total Orders</p>
            <p className="text-3xl font-bold">{analytics.totalOrders}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
            <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90">Total Spent</p>
            <p className="text-3xl font-bold">KES {(analytics.totalSpent / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <FileText className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90">Avg Order Value</p>
            <p className="text-3xl font-bold">KES {(analytics.avgOrderValue / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
            <Clock className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90">Avg Delivery</p>
            <p className="text-3xl font-bold">{analytics.avgDeliveryTime} days</p>
          </div>
        </div>
      )}

      {/* Main Order History Card */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-secondary-900">Order History</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="px-4 py-2 text-sm border-2 border-neutral-300 rounded-lg hover:bg-neutral-50"
              >
                {showAnalytics ? 'Hide' : 'Show'} Analytics
              </button>
              <button
                onClick={exportOrders}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Fuel Type Filter */}
            <select
              value={fuelTypeFilter}
              onChange={(e) => setFuelTypeFilter(e.target.value)}
              className="px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="all">All Fuel Types</option>
              <option value="pms">Super Petrol</option>
              <option value="ago">Diesel</option>
              <option value="ik">Kerosene</option>
            </select>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last Year</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
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
              <div key={order.id} className="p-6 hover:bg-neutral-50 transition-colors">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-secondary-900">{order.fuelTypeName}</h3>
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
                      <p className="text-sm text-neutral-600">Order #{order.id}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary-900 mb-1">
                      KES {order.totalCost.toLocaleString()}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Quantity</p>
                    <p className="font-semibold text-secondary-900">{order.quantity.toLocaleString()} Liters</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Price per Liter</p>
                    <p className="font-semibold text-secondary-900">KES {order.pricePerLiter.toFixed(2)}</p>
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
                    <p className="font-semibold text-secondary-900">{new Date(order.deliveryDate).toLocaleDateString()}</p>
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => reorderItem(order)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reorder
                  </button>
                  <button className="flex-1 sm:flex-none px-4 py-2 border-2 border-neutral-300 text-neutral-700 rounded-lg font-medium hover:border-neutral-400 hover:bg-neutral-50 transition-colors text-sm flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Invoice
                  </button>
                  {order.status === 'delivered' && (
                    <button className="px-4 py-2 border-2 border-neutral-300 text-neutral-700 rounded-lg font-medium hover:border-neutral-400 hover:bg-neutral-50 transition-colors text-sm">
                      ⭐ Rate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No orders match your search' : 'No orders yet'}
            </p>
            <p className="text-sm text-neutral-500">
              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Place your first order to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}