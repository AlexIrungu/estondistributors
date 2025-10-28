'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

export default function PriceWidget({ location = 'nairobi', compact = false }) {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, [location]);

  const fetchPrices = async () => {
    try {
      const response = await fetch(`/api/prices?location=${location}`);
      if (response.ok) {
        const data = await response.json();
        setPrices(data);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (change) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!prices) return null;

  const locationData = prices.locations[location];

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Today's Fuel Prices</h3>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            {locationData?.name}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {locationData && Object.entries(locationData.prices).map(([key, fuel]) => (
            <div key={key} className="text-center">
              <div className="text-xs opacity-80 mb-1">{fuel.label}</div>
              <div className="text-2xl font-bold">
                {fuel.price.toFixed(0)}
              </div>
              <div className="text-xs opacity-60">KES/L</div>
            </div>
          ))}
        </div>
        
        <Link
          href="/prices"
          className="flex items-center justify-center text-sm hover:underline"
        >
          View all locations <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Current Fuel Prices</h3>
            <p className="text-sm text-primary-100">
              {locationData?.name} • {prices.effectiveDate}
            </p>
          </div>
          <Link
            href="/prices"
            className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Prices */}
      <div className="p-6">
        <div className="space-y-4">
          {locationData && Object.entries(locationData.prices).map(([key, fuel]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">
                    {key === 'pms' ? '⛽' : key === 'ago' ? '🚚' : '🏠'}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-secondary-900">
                    {fuel.label}
                  </div>
                  <div className="text-xs text-neutral-500">{fuel.unit}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-secondary-900">
                  {fuel.price.toFixed(2)}
                </div>
                <div className={`flex items-center justify-end text-sm ${getTrendColor(fuel.change)}`}>
                  {getTrendIcon(fuel.change)}
                  <span className="ml-1">
                    {fuel.change > 0 ? '+' : ''}{fuel.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 text-center">
            Source: {prices.source} • Last Updated: {prices.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}