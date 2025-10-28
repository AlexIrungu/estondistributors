'use client';

import { useState, useEffect } from 'react';

export default function PriceDisplay({ location = 'nairobi' }) {
  const [prices, setPrices] = useState(null);
  const [crudeOil, setCrudeOil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(location);

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
  }, [selectedLocation]);

  // Update your PriceDisplay component's fetch functions
const fetchPrices = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch(`/api/prices?location=${selectedLocation}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data.locations || !data.locations[selectedLocation]) {
      throw new Error('Invalid data structure received from server');
    }
    
    setPrices(data);
  } catch (err) {
    console.error('Error fetching prices:', err);
    setError(err.message);
    
    // Set fallback data
    setPrices(getFallbackPriceData());
  } finally {
    setLoading(false);
  }
};

// Add fallback data function
const getFallbackPriceData = () => {
  const fallbackPrices = {
    pms: { price: 180.00, change: 0, label: 'Super Petrol', unit: 'KES/Litre' },
    ago: { price: 170.00, change: 0, label: 'Diesel', unit: 'KES/Litre' },
    ik: { price: 150.00, change: 0, label: 'Kerosene', unit: 'KES/Litre' }
  };
  
  return {
    lastUpdated: new Date().toISOString(),
    effectiveDate: 'Fallback Data',
    source: 'Fallback',
    locations: {
      [selectedLocation]: {
        name: selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1),
        prices: fallbackPrices
      }
    },
    isFallback: true
  };
};

  const fetchCrudeOil = async () => {
    try {
      const response = await fetch('/api/crude-oil', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCrudeOil(data);
    } catch (err) {
      console.error('Error fetching crude oil:', err);
      // Don't set error state for crude oil, just log it
    }
  };

  const formatPrice = (price) => {
    return `KES ${price.toFixed(2)}`;
  };

  const getPriceChangeColor = (change) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getPriceChangeIcon = (change) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '—';
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
        <button 
          onClick={fetchPrices}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!prices) return null;

  const locationData = prices.locations?.[selectedLocation];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Current Fuel Prices
        </h2>
        <p className="text-sm text-gray-600">
          Effective: {prices.effectiveDate}
        </p>
        <p className="text-xs text-gray-500">
          Last Updated: {prices.lastUpdated}
        </p>
      </div>

      {/* Location Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Location:
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {locations.map((loc) => (
            <option key={loc.key} value={loc.key}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Prices Grid */}
      {locationData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(locationData.prices).map(([key, fuel]) => (
            <div
              key={key}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  {fuel.label}
                </h3>
                <span className={`text-xs font-semibold ${getPriceChangeColor(fuel.change)}`}>
                  {getPriceChangeIcon(fuel.change)} {Math.abs(fuel.change).toFixed(2)}%
                </span>
              </div>
              <p className="text-3xl font-bold text-blue-900">
                {formatPrice(fuel.price)}
              </p>
              <p className="text-xs text-gray-600 mt-1">per litre</p>
            </div>
          ))}
        </div>
      )}

      {/* Crude Oil Prices */}
      {crudeOil && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            International Crude Oil Prices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crudeOil.wti && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">WTI Crude</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${crudeOil.wti.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{crudeOil.wti.unit}</p>
                  </div>
                  {crudeOil.wti.isMock && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Demo
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {crudeOil.brent && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Brent Crude</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${crudeOil.brent.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{crudeOil.brent.unit}</p>
                  </div>
                  {crudeOil.brent.isMock && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Demo
                    </span>
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
          Data Source: {prices.source} | Updated {prices.lastUpdated}
        </p>
      </div>
    </div>
  );
}