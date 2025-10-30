// src/app/dashboard/page.js
'use client';

import { useEffect, useState, memo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Package, TrendingUp, Calendar, DollarSign,
  Loader2, ArrowRight, Star, Clock, Bell,
  CheckCircle, TruckIcon, AlertCircle, Download,
  Filter, RefreshCcw, BarChart3, Zap
} from 'lucide-react';
import OrderHistory from '@/components/dashboard/OrderHistory';
import SpendingAnalytics from '@/components/dashboard/SpendingAnalytics';
import QuickOrderForm from '@/components/dashboard/QuickOrderForm';

// Memoized StatCard component for better performance
const StatCard = memo(({ stat, trend }) => (
  <div className="group bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-neutral-600'
        }`}>
          <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-sm text-neutral-600 mb-1">{stat.title}</p>
    <div className="flex items-baseline gap-2">
      <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
      {trend !== undefined && (
        <span className="text-xs text-neutral-500">vs last month</span>
      )}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

// Activity Timeline Component
const ActivityTimeline = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-500" />
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600 text-sm">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary-500" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3 group">
            <div className="flex-shrink-0 relative">
              <div className={`w-8 h-8 ${activity.color || 'bg-primary-100'} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {activity.icon}
              </div>
              {index !== activities.length - 1 && (
                <div className="absolute top-8 left-4 w-px h-8 bg-neutral-200"></div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium text-secondary-900">{activity.title}</p>
              <p className="text-xs text-neutral-600 mt-1">{activity.description}</p>
              <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Performance Overview Component
const PerformanceOverview = ({ stats }) => {
  const currentMonthSpend = stats?.currentMonthSpend || 0;
  const lastMonthSpend = stats?.lastMonthSpend || 0;
  const percentageChange = lastMonthSpend > 0 
    ? ((currentMonthSpend - lastMonthSpend) / lastMonthSpend * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary-500" />
        Performance Overview
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
          <div>
            <p className="text-sm text-neutral-600 mb-1">This Month</p>
            <p className="text-2xl font-bold text-secondary-900">
              KES {currentMonthSpend.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 mb-1">Last Month</p>
            <p className="text-xl font-semibold text-neutral-700">
              KES {lastMonthSpend.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${
          percentageChange > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">Change</span>
            <span className={`text-lg font-bold flex items-center gap-1 ${
              percentageChange > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              <TrendingUp className={`w-5 h-5 ${percentageChange > 0 ? 'rotate-180' : ''}`} />
              {Math.abs(percentageChange)}%
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Average Order Value</span>
            <span className="text-lg font-semibold text-secondary-900">
              KES {(stats?.avgOrderValue || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Total Orders</span>
            <span className="text-lg font-semibold text-secondary-900">
              {stats?.totalOrders || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keyboard Shortcuts Helper
const KeyboardShortcuts = () => (
  <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
    <p className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
      <Zap className="w-4 h-4 text-primary-600" />
      Keyboard Shortcuts
    </p>
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-neutral-700">New Order</span>
        <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono">
          Ctrl+N
        </kbd>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-neutral-700">View Prices</span>
        <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono">
          Ctrl+P
        </kbd>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-neutral-700">All Orders</span>
        <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono">
          Ctrl+O
        </kbd>
      </div>
    </div>
  </div>
);

// Loading Skeleton
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 animate-pulse">
        <div className="w-12 h-12 bg-neutral-200 rounded-xl mb-4"></div>
        <div className="h-4 bg-neutral-200 rounded w-20 mb-2"></div>
        <div className="h-8 bg-neutral-200 rounded w-24"></div>
      </div>
    ))}
  </div>
);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'n':
            e.preventDefault();
            document.getElementById('quick-order-form')?.scrollIntoView({ behavior: 'smooth' });
            break;
          case 'p':
            e.preventDefault();
            router.push('/prices');
            break;
          case 'o':
            e.preventDefault();
            router.push('/dashboard/orders');
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
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
        
        // Generate activity timeline from recent orders
        const orderActivities = ordersData.orders.slice(0, 5).map(order => ({
          title: `Order ${order.status === 'delivered' ? 'Delivered' : order.status === 'pending' ? 'Placed' : 'Processing'}`,
          description: `${order.fuelTypeName} - ${order.quantity.toLocaleString()} Liters`,
          timestamp: new Date(order.orderDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          icon: order.status === 'delivered' 
            ? <CheckCircle className="w-4 h-4 text-green-600" />
            : order.status === 'pending'
            ? <Clock className="w-4 h-4 text-amber-600" />
            : <TruckIcon className="w-4 h-4 text-blue-600" />,
          color: order.status === 'delivered' 
            ? 'bg-green-100'
            : order.status === 'pending'
            ? 'bg-amber-100'
            : 'bg-blue-100'
        }));
        
        setActivities(orderActivities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
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
      trend: 12,
    },
    {
      title: 'Total Spent',
      value: `KES ${(stats?.totalSpent || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      trend: -5,
    },
    {
      title: 'Completed',
      value: stats?.completedOrders || 0,
      icon: CheckCircle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      trend: 8,
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
      <div className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-1">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-neutral-600">
                Here's what's happening with your orders today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-neutral-200 rounded-lg text-secondary-700 hover:border-primary-300 hover:bg-primary-50 transition-all disabled:opacity-50"
              >
                <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="bg-primary-50 border-2 border-primary-200 rounded-xl px-4 py-2">
                <p className="text-sm text-primary-700 font-medium">
                  ID: <span className="font-mono">{session.user.id.slice(0, 12)}...</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {loading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <StatCard key={index} stat={stat} trend={stat.trend} />
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Orders & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Order */}
            <div id="quick-order-form">
              <QuickOrderForm onOrderCreated={() => fetchDashboardData(true)} />
            </div>

            {/* Spending Analytics */}
            <SpendingAnalytics stats={stats} />

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-500" />
                    Recent Orders
                  </h2>
                  <button
                    onClick={() => router.push('/dashboard/orders')}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
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
                      className="p-6 hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/orders`)}
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
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">No orders yet</h3>
                  <p className="text-neutral-600 mb-6">Start by placing your first fuel order</p>
                  <button
                    onClick={() => document.getElementById('quick-order-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Package className="w-5 h-5" />
                    Create Order
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-500" />
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

            {/* Performance Overview */}
            <PerformanceOverview stats={stats} />

            {/* Activity Timeline */}
            <ActivityTimeline activities={activities} />

            {/* Fuel Type Stats */}
            {stats?.fuelTypeStats && Object.keys(stats.fuelTypeStats).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-500" />
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
                      <div className="w-full bg-neutral-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
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

            {/* Keyboard Shortcuts */}
            <KeyboardShortcuts />
          </div>
        </div>
      </div>
    </div>
  );
}