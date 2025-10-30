// src/app/admin/prices/page.js
'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminPricesPage() {
  const [cacheStatus, setCacheStatus] = useState(null);
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Load cache status on mount
  useEffect(() => {
    fetchCacheStatus();
  }, []);

  const fetchCacheStatus = async () => {
    try {
      const response = await fetch('/api/prices?status=true');
      const data = await response.json();
      setCacheStatus(data.cacheStatus);
    } catch (error) {
      console.error('Error fetching cache status:', error);
    }
  };

  const fetchCurrentPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/prices');
      const data = await response.json();
      setPrices(data);
      setMessage({ type: 'success', text: 'Prices loaded successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load prices: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const refreshCache = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Cache refreshed successfully from EPRA' });
        await fetchCacheStatus();
        await fetchCurrentPrices();
      } else {
        setMessage({ type: 'error', text: 'Failed to refresh cache' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Cache cleared successfully' });
        await fetchCacheStatus();
      } else {
        setMessage({ type: 'error', text: 'Failed to clear cache' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">
            EPRA Price Management
          </h1>
          <p className="text-neutral-600">
            Manage and monitor EPRA fuel price data scraping and caching
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Actions</h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={refreshCache}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              <span>Refresh from EPRA</span>
            </button>

            <button
              onClick={fetchCurrentPrices}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Database className="w-5 h-5" />
              <span>Load Current Prices</span>
            </button>

            <button
              onClick={clearCache}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-neutral-600 hover:bg-neutral-700 disabled:bg-neutral-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Database className="w-5 h-5" />
              <span>Clear Cache</span>
            </button>

            <button
              onClick={fetchCacheStatus}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 disabled:bg-neutral-300 text-neutral-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* Cache Status */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Cache Status</h2>
          
          {cacheStatus ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="text-sm text-neutral-600 mb-1">Status</div>
                  <div className="text-lg font-semibold">
                    {cacheStatus.cached ? (
                      <span className={cacheStatus.isValid ? 'text-green-600' : 'text-amber-600'}>
                        {cacheStatus.isValid ? '✓ Cached' : '⚠ Stale'}
                      </span>
                    ) : (
                      <span className="text-red-600">✗ No Cache</span>
                    )}
                  </div>
                </div>

                {cacheStatus.cached && (
                  <>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="text-sm text-neutral-600 mb-1">Cache Age</div>
                      <div className="text-lg font-semibold text-secondary-900">
                        {cacheStatus.ageHours} hours {cacheStatus.ageMinutes % 60} min
                      </div>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="text-sm text-neutral-600 mb-1">Expires In</div>
                      <div className="text-lg font-semibold text-secondary-900">
                        {cacheStatus.expiresInMinutes} minutes
                      </div>
                    </div>
                  </>
                )}
              </div>

              {cacheStatus.lastUpdated && (
                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-sm text-neutral-600">Last Updated</div>
                  <div className="text-neutral-900 font-mono text-sm">
                    {new Date(cacheStatus.lastUpdated).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              Loading cache status...
            </div>
          )}
        </div>

        {/* Current Prices Display */}
        {prices && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-secondary-900">Current Prices</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                prices.dataSource === 'epra' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {prices.dataSource === 'epra' ? 'Live EPRA Data' : 'Fallback Data'}
              </span>
            </div>

            <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
              <div className="text-sm text-neutral-600">Effective Period</div>
              <div className="font-semibold text-secondary-900">{prices.effectiveDate}</div>
            </div>

            <div className="space-y-6">
              {Object.entries(prices.locations).map(([key, location]) => (
                <div key={key} className="border border-neutral-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-secondary-900 mb-3">{location.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(location.prices).map(([fuelKey, fuel]) => (
                      <div key={fuelKey} className="bg-neutral-50 p-4 rounded-lg">
                        <div className="text-sm text-neutral-600 mb-1">{fuel.label}</div>
                        <div className="text-2xl font-bold text-secondary-900 mb-1">
                          KES {fuel.price.toFixed(2)}
                        </div>
                        <div className={`text-sm font-semibold ${
                          fuel.trend === 'up' ? 'text-red-600' : 
                          fuel.trend === 'down' ? 'text-green-600' : 
                          'text-neutral-600'
                        }`}>
                          {fuel.trend === 'up' ? '▲' : fuel.trend === 'down' ? '▼' : '■'} 
                          {' '}{Math.abs(fuel.change).toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}