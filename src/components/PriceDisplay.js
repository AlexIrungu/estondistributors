'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, ArrowRight, AlertCircle, Calendar } from 'lucide-react';

export default function PriceDisplay({ location = 'nairobi' }) {
  const [prices, setPrices] = useState(null);
  const [crudeOil, setCrudeOil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [historicalData, setHistoricalData] = useState(null);

  const locations = [
    { key: 'nairobi', name: 'Nairobi' },
    { key: 'mombasa', name: 'Mombasa' },
    { key: 'nakuru', name: 'Nakuru' },
    { key: 'eldoret', name: 'Eldoret' },
    { key: 'kisumu', name: 'Kisumu' }
  ];

  useEffect(() => {
    fetchPrices();
    fetchCrudeOil();
    fetchHistoricalData();
  }, [selectedLocation]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/prices?location=${selectedLocation}`);
      if (!response.ok) throw new Error('Failed to fetch prices');
      const data = await response.json();
      setPrices(data);
    } catch (err) {
      setError(err.message);
      setPrices(getFallbackPriceData());
    } finally {
      setLoading(false);
    }
  };

  const fetchCrudeOil = async () => {
    try {
      const response = await fetch('/api/crude-oil');
      if (response.ok) {
        const data = await response.json();
        setCrudeOil(data);
      }
    } catch (err) {
      console.error('Error fetching crude oil:', err);
    }
  };

  const fetchHistoricalData = async () => {
    // Simulated historical data - replace with actual API call
    const mockData = {
      pms: { high: 188.50, low: 177.30, avg: 182.40, lastMonth: 183.20 },
      ago: { high: 174.90, low: 163.50, avg: 169.20, lastMonth: 170.10 },
      ik: { high: 157.60, low: 147.20, avg: 152.40, lastMonth: 153.50 }
    };
    setHistoricalData(mockData);
  };

  const getFallbackPriceData = () => {
    return {
      lastUpdated: new Date().toISOString(),
      effectiveDate: 'Fallback Data',
      source: 'Fallback',
      locations: {
        [selectedLocation]: {
          name: selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1),
          prices: {
            pms: { price: 180.00, change: 0, label: 'Super Petrol', unit: 'KES/Litre' },
            ago: { price: 170.00, change: 0, label: 'Diesel', unit: 'KES/Litre' },
            ik: { price: 150.00, change: 0, label: 'Kerosene', unit: 'KES/Litre' }
          }
        }
      },
      isFallback: true
    };
  };

  const formatPrice = (price) => `KES ${price.toFixed(2)}`;

  const getPriceChangeColor = (change) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getPriceChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <span className="w-4 h-4">—</span>;
  };

  const getNextUpdateTime = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    const daysUntil = Math.ceil((nextMonth - now) / (1000 * 60 * 60 * 24));
    return `${daysUntil} days`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button onClick={fetchPrices} className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
          Try again
        </button>
      </div>
    );
  }

  if (!prices) return null;

  const locationData = prices.locations?.[selectedLocation];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header with Next Update Info */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Current Fuel Prices</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Effective: {prices.effectiveDate}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
              <Clock className="w-4 h-4" />
              <span>Next update in {getNextUpdateTime()}</span>
            </div>
          </div>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
          View History <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Location Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Location:</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {locations.map((loc) => (
            <option key={loc.key} value={loc.key}>{loc.name}</option>
          ))}
        </select>
      </div>

      {/* Enhanced Fuel Prices Grid */}
      {locationData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(locationData.prices).map(([key, fuel]) => {
            const historical = historicalData?.[key];
            const percentChange = fuel.change;
            const isIncrease = percentChange > 0;
            const isAtHigh = historical && fuel.price >= historical.high * 0.98;
            const isAtLow = historical && fuel.price <= historical.low * 1.02;

            return (
              <div key={key} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 relative overflow-hidden">
                {/* Historical marker badge */}
                {isAtHigh && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Near High
                  </div>
                )}
                {isAtLow && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Near Low
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">{fuel.label}</h3>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${getPriceChangeColor(percentChange)}`}>
                    {getPriceChangeIcon(percentChange)}
                    <span>{percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%</span>
                  </div>
                </div>

                <p className="text-3xl font-bold text-blue-900 mb-1">{formatPrice(fuel.price)}</p>
                <p className="text-xs text-gray-600 mb-3">per litre</p>

                {/* Historical comparison */}
                {historical && (
                  <div className="border-t border-blue-200 pt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">30-day High:</span>
                      <span className="font-semibold text-red-600">{formatPrice(historical.high)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">30-day Low:</span>
                      <span className="font-semibold text-green-600">{formatPrice(historical.low)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-semibold text-gray-700">{formatPrice(historical.avg)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Price Trend Summary Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 mb-1">Price Trend Insight</p>
            <p className="text-amber-800">
              Based on crude oil trends, fuel prices are expected to{' '}
              {crudeOil?.wti?.price > 75 ? 'increase' : 'remain stable'} in the next pricing cycle.
              Consider stocking up if you have storage capacity.
            </p>
          </div>
        </div>
      </div>

      {/* Crude Oil Prices */}
      {crudeOil && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">International Crude Oil Prices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crudeOil.wti && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">WTI Crude</p>
                    <p className="text-2xl font-bold text-gray-900">${crudeOil.wti.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{crudeOil.wti.unit}</p>
                  </div>
                  {crudeOil.wti.isMock && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Demo</span>
                  )}
                </div>
              </div>
            )}
            {crudeOil.brent && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Brent Crude</p>
                    <p className="text-2xl font-bold text-gray-900">${crudeOil.brent.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{crudeOil.brent.unit}</p>
                  </div>
                  {crudeOil.brent.isMock && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Demo</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Source Attribution */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          Data Source: {prices.source} | Last Updated: {new Date(prices.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
}