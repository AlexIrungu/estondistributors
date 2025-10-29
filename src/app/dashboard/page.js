// src/app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Package, TrendingUp, Calendar, DollarSign,
  Loader2, ArrowRight, Star, Clock
} from 'lucide-react';
import OrderHistory from '@/components/dashboard/OrderHistory';
import SpendingAnalytics from '@/components/dashboard/SpendingAnalytics';
import QuickOrderForm from '@/components/dashboard/QuickOrderForm';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/orders?action=stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch recent orders
      const ordersRes = await fetch('/api/orders?action=recent&limit=5');
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setRecentOrders(ordersData.orders);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total Spent',
      value: `KES ${(stats?.totalSpent || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Completed',
      value: stats?.completedOrders || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Pending',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-neutral-600 mt-1">
                Here's what's happening with your orders
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-primary-50 border-2 border-primary-200 rounded-xl px-6 py-3">
                <p className="text-sm text-primary-700 font-medium">
                  Account ID: <span className="font-mono">{session.user.id.slice(0, 12)}...</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-sm text-neutral-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Orders & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Order */}
            <QuickOrderForm onOrderCreated={fetchDashboardData} />

            {/* Spending Analytics */}
            <SpendingAnalytics stats={stats} />

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-secondary-900">
                    Recent Orders
                  </h2>
                  <button
                    onClick={() => router.push('/dashboard/orders')}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {recentOrders.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-secondary-900">
                              {order.fuelTypeName}
                            </p>
                            <p className="text-sm text-neutral-600">
                              {order.quantity.toLocaleString()} Liters
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-secondary-900">
                            KES {order.totalCost.toLocaleString()}
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div>Order #{order.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-2">No orders yet</p>
                  <p className="text-sm text-neutral-500">
                    Place your first order using the quick order form above
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/prices')}
                  className="w-full flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
                >
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-secondary-900 group-hover:text-primary-600">
                    View Current Prices
                  </span>
                </button>
                <button
                  onClick={() => router.push('/calculator')}
                  className="w-full flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
                >
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-secondary-900 group-hover:text-primary-600">
                    Savings Calculator
                  </span>
                </button>
                <button
                  onClick={() => router.push('/alerts')}
                  className="w-full flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
                >
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-secondary-900 group-hover:text-primary-600">
                    Price Alerts
                  </span>
                </button>
              </div>
            </div>

            {/* Fuel Type Stats */}
            {stats?.fuelTypeStats && Object.keys(stats.fuelTypeStats).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">
                  Fuel Type Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(stats.fuelTypeStats).map(([type, data]) => (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700">
                          {type === 'pms' ? 'Super Petrol' : type === 'ago' ? 'Diesel' : 'Kerosene'}
                        </span>
                        <span className="text-sm font-semibold text-secondary-900">
                          {data.count} orders
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{
                            width: `${(data.count / stats.totalOrders) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}