'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Package, Calendar, MapPin, TruckIcon, Filter,
  Search, Star, AlertCircle, Loader2, CheckCircle,
  Clock, XCircle, Eye, Trash2, Download, UserCircle,
  Phone, Mail, CheckCheck, X, MessageSquare
} from 'lucide-react';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchOrders();
      fetchStats();
    }
  }, [session]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/orders?action=stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.displayId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.fuelType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!confirm(`Are you sure you want to ${newStatus === 'cancelled' ? 'reject' : 'update'} this order to ${newStatus}?`)) {
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        fetchOrders();
        fetchStats();
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleFavorite = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_favorite' })
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchOrders();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
      in_transit: { color: 'bg-purple-100 text-purple-800', icon: TruckIcon, label: 'In Transit' },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const getFuelIcon = (fuelType) => {
    const icons = {
      pms: '⛽',
      ago: '🚚',
      ik: '🔥'
    };
    return icons[fuelType] || '⛽';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-secondary-900">
              {isAdmin ? 'All Orders' : 'My Orders'}
            </h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500 text-white rounded-full text-sm font-semibold">
                <Star className="w-4 h-4" />
                Admin
              </span>
            )}
          </div>
          <p className="text-neutral-600">
            {isAdmin ? 'Manage and track all customer orders' : 'Track and manage your fuel orders'}
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total Orders</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Pending</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Completed</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.completedOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TruckIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total {isAdmin ? 'Revenue' : 'Spent'}</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    KES {stats.totalSpent?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder={isAdmin ? "Search by order, customer, fuel type..." : "Search orders..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none appearance-none bg-white"
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
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
            <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">No orders found</h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : isAdmin 
                  ? 'No customer orders yet'
                  : 'Start by placing your first order'}
            </p>
            {!isAdmin && (
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Package className="w-5 h-5" />
                Place New Order
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-4">
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{getFuelIcon(order.fuelType)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-secondary-900">
                              {order.displayId || `Order #${order._id?.slice(-8)}`}
                            </h3>
                            {getStatusBadge(order.status)}
                            {!isAdmin && (
                              <button
                                onClick={() => toggleFavorite(order._id)}
                                className="lg:hidden"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    order.isFavorite
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-neutral-300'
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          <div className="space-y-1.5 text-sm text-neutral-600">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Package className="w-4 h-4" />
                              <span className="font-medium">
                                {order.fuelTypeName || order.fuelType.toUpperCase()}
                              </span>
                              <span>• {order.quantity?.toLocaleString()}L</span>
                              <span>• KES {order.pricePerLiter?.toFixed(2)}/L</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">{order.deliveryAddress}</span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="text-neutral-400">•</span>
                              <span className="capitalize">{order.deliveryTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-neutral-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-primary-600">
                        KES {order.totalCost?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info (Admin Only) */}
                  {isAdmin && (
                    <div className="border-t border-neutral-200 pt-4">
                      <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">Customer Information</p>
                      <div className="grid sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-4 h-4 text-neutral-400" />
                          <span className="font-medium text-secondary-900">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-600">{order.customerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-600">{order.customerPhone}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="border-t border-neutral-200 pt-4 flex flex-wrap gap-2">
                    {isAdmin ? (
                      <>
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'confirmed')}
                              disabled={updatingOrderId === order._id}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              {updatingOrderId === order._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCheck className="w-4 h-4" />
                              )}
                              Accept Order
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'cancelled')}
                              disabled={updatingOrderId === order._id}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              <X className="w-4 h-4" />
                              Reject Order
                            </button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'in_transit')}
                            disabled={updatingOrderId === order._id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 text-sm font-medium"
                          >
                            {updatingOrderId === order._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <TruckIcon className="w-4 h-4" />
                            )}
                            Mark In Transit
                          </button>
                        )}
                        {order.status === 'in_transit' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'delivered')}
                            disabled={updatingOrderId === order._id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                          >
                            {updatingOrderId === order._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Mark Delivered
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Order Completed
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                            <XCircle className="w-4 h-4" />
                            Order Cancelled
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleFavorite(order._id)}
                          className="hidden lg:inline-flex items-center gap-2 px-4 py-2 border-2 border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-sm"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              order.isFavorite
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-neutral-400'
                            }`}
                          />
                          {order.isFavorite ? 'Favorited' : 'Add to Favorites'}
                        </button>

                        {order.status === 'pending' && (
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Cancel Order
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}