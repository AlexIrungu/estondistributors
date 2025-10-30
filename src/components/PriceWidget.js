'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, ArrowRight, RefreshCw, AlertCircle, Clock, MapPin } from 'lucide-react';

export default function PriceWidget({ location = 'nairobi', compact = false, showHeader = true }) {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchPrices();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const fetchPrices = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/prices?location=${location}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      
      const data = await response.json();
      setPrices(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching prices:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (change) => {
    if (change > 0) return 'text-red-600 bg-red-50';
    if (change < 0) return 'text-green-600 bg-green-50';
    return 'text-neutral-600 bg-neutral-50';
  };

  const getFuelIcon = (key) => {
    const icons = {
      pms: '⛽',
      ago: '🚚',
      ik: '🏠'
    };
    return icons[key] || '⛽';
  };

  const getFuelGradient = (key) => {
    const gradients = {
      pms: 'from-red-500 to-orange-500',
      ago: 'from-green-500 to-emerald-500',
      ik: 'from-blue-500 to-cyan-500'
    };
    return gradients[key] || 'from-primary-500 to-primary-600';
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="bg-gradient-to-r from-neutral-200 to-neutral-300 h-28"></div>
          
          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-neutral-200 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-neutral-200 rounded"></div>
                    <div className="h-3 w-16 bg-neutral-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-20 bg-neutral-200 rounded"></div>
                  <div className="h-4 w-16 bg-neutral-200 rounded ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2">
            Unable to Load Prices
          </h3>
          <p className="text-neutral-600 mb-6">
            {error}
          </p>
          <button
            onClick={fetchPrices}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!prices) return null;

  const locationData = prices.locations[location];

  // Compact Variant (for sidebars, footers)
  if (compact) {
    return (
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Today's Prices</h3>
            <div className="flex items-center gap-2 text-sm text-primary-100">
              <MapPin className="w-3 h-3" />
              <span>{locationData?.name}</span>
            </div>
          </div>
          <button
            onClick={fetchPrices}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Refresh prices"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {locationData && Object.entries(locationData.prices).map(([key, fuel]) => (
            <div key={key} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-2xl mb-2">{getFuelIcon(key)}</div>
              <div className="text-xs opacity-80 mb-1">{fuel.label}</div>
              <div className="text-xl font-bold">
                {fuel.price.toFixed(0)}
              </div>
              <div className="text-[10px] opacity-60">KES/L</div>
            </div>
          ))}
        </div>
        
        <Link
          href="/prices"
          className="flex items-center justify-center gap-2 text-sm hover:bg-white/10 py-2 rounded-lg transition-colors group"
        >
          <span>View All Locations</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  // Full Widget (default)
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 hover:shadow-3xl transition-shadow">
      {/* Enhanced Header */}
      {showHeader && (
        <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white px-6 py-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-2xl font-bold mb-2">Current Fuel Prices</h3>
                <div className="flex items-center gap-4 text-sm text-primary-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">{locationData?.name}</span>
                  </div>
                  {lastUpdated && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{lastUpdated.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={fetchPrices}
                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm border border-white/30"
                title="Refresh prices"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <p className="text-sm text-primary-100">
                Effective: {prices.effectiveDate}
              </p>
              <Link
                href="/prices"
                className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm border border-white/30 font-semibold"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Price Cards */}
      <div className="p-6">
        <div className="space-y-4">
          {locationData && Object.entries(locationData.prices).map(([key, fuel], index) => (
            <div
              key={key}
              className="group relative bg-gradient-to-br from-neutral-50 to-white rounded-xl p-5 border-2 border-neutral-200 hover:border-primary-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getFuelGradient(key)} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`}></div>

              <div className="relative flex items-center justify-between">
                {/* Left Side - Fuel Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getFuelGradient(key)} rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {getFuelIcon(key)}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-secondary-900 mb-1">
                      {fuel.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 font-medium">
                        {fuel.unit}
                      </span>
                      {fuel.trend && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${getTrendColor(fuel.change)}`}>
                          {getTrendIcon(fuel.change)}
                          <span>
                            {fuel.change > 0 ? '+' : ''}{fuel.change.toFixed(2)}%
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Price */}
                <div className="text-right">
                  <div className="text-3xl font-bold text-secondary-900 mb-1">
                    {fuel.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-neutral-500 font-semibold">
                    KES per Litre
                  </div>
                </div>
              </div>

              {/* Progress Bar showing price relative to max */}
              <div className="mt-4 relative">
                <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getFuelGradient(key)} transition-all duration-500`}
                    style={{ 
                      width: `${Math.min((fuel.price / 200) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
          {/* Data Source */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-neutral-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <span className="text-neutral-500">
              Source: {prices.source}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Link
              href="/prices/history"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-sm font-semibold transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Price History</span>
            </Link>
            <Link
              href="/alerts"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              <span>Set Alert</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Last Update Notice */}
          {prices.dataSource === 'fallback' && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Showing cached data. Live prices may vary.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}