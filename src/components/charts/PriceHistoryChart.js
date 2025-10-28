'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDate, calculatePriceStats } from '@/lib/utils/priceCalculations';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PriceHistoryChart({ 
  data, 
  fuelType = 'pms', 
  location = 'nairobi',
  showStats = true,
  height = 400 
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <p className="text-center text-neutral-500">No historical data available</p>
      </div>
    );
  }

  const stats = calculatePriceStats(data);
  
  const getFuelLabel = (type) => {
    const labels = {
      pms: 'Super Petrol',
      ago: 'Diesel',
      ik: 'Kerosene'
    };
    return labels[type] || type;
  };

  const getTrendIcon = () => {
    if (stats.trend > 0.5) return <TrendingUp className="w-5 h-5 text-red-500" />;
    if (stats.trend < -0.5) return <TrendingDown className="w-5 h-5 text-green-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (stats.trend > 0.5) return 'text-red-600';
    if (stats.trend < -0.5) return 'text-green-600';
    return 'text-gray-600';
  };

  // Format data for chart
  const chartData = data.map(item => ({
    ...item,
    displayDate: formatDate(item.date, 'short')
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700 mb-1">
            {formatDate(data.date, 'full')}
          </p>
          <p className="text-lg font-bold text-blue-600">
            KES {data.price.toFixed(2)}
          </p>
          {data.change && (
            <p className={`text-sm ${data.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-neutral-800">
            {getFuelLabel(fuelType)} Price History
          </h3>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className={`text-sm font-semibold ${getTrendColor()}`}>
              {stats.changePercent > 0 ? '+' : ''}{stats.changePercent}% (12 months)
            </span>
          </div>
        </div>
        <p className="text-sm text-neutral-500">
          {location.charAt(0).toUpperCase() + location.slice(1)} • Last 12 months
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={{ fill: '#2563eb', r: 4 }}
            activeDot={{ r: 6 }}
            name="Price (KES/L)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Statistics */}
      {showStats && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-neutral-600 mb-1">Average</p>
            <p className="text-lg font-bold text-blue-900">KES {stats.average}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <p className="text-xs text-neutral-600 mb-1">Minimum</p>
            <p className="text-lg font-bold text-green-900">KES {stats.min}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 border border-red-100">
            <p className="text-xs text-neutral-600 mb-1">Maximum</p>
            <p className="text-lg font-bold text-red-900">KES {stats.max}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <p className="text-xs text-neutral-600 mb-1">Volatility</p>
            <p className="text-lg font-bold text-amber-900">±{stats.volatility}</p>
          </div>
        </div>
      )}
    </div>
  );
}