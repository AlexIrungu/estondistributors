'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, ArrowRight, History } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { calculatePriceStats } from '@/lib/utils/priceCalculations';

export default function PriceTrendSummary({ data, fuelType = 'pms', location = 'nairobi' }) {
  if (!data || data.length === 0) {
    return null;
  }

  const stats = calculatePriceStats(data);
  const recentData = data.slice(-6); // Last 6 months for mini chart

  const getTrendIcon = () => {
    if (stats.trend > 0.5) return <TrendingUp className="w-5 h-5" />;
    if (stats.trend < -0.5) return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  const getTrendColor = () => {
    if (stats.trend > 0.5) return 'bg-red-50 border-red-200 text-red-700';
    if (stats.trend < -0.5) return 'bg-green-50 border-green-200 text-green-700';
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  const getTrendText = () => {
    if (stats.trend > 0.5) return 'Upward Trend';
    if (stats.trend < -0.5) return 'Downward Trend';
    return 'Stable';
  };

  const getLineColor = () => {
    if (stats.trend > 0.5) return '#ef4444';
    if (stats.trend < -0.5) return '#10b981';
    return '#3b82f6';
  };

  const getFuelLabel = (type) => {
    const labels = {
      pms: 'Super Petrol',
      ago: 'Diesel',
      ik: 'Kerosene'
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-neutral-800">
              Price Trend - {getFuelLabel(fuelType)}
            </h3>
          </div>
          <Link
            href="/prices/history"
            className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-1"
          >
            <span>View Full History</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stats Column */}
          <div className="space-y-4">
            {/* Trend Indicator */}
            <div className={`rounded-lg p-4 border ${getTrendColor()}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">12-Month Trend</span>
                {getTrendIcon()}
              </div>
              <div className="text-2xl font-bold">
                {getTrendText()}
              </div>
              <div className="text-sm mt-1">
                {stats.changePercent > 0 ? '+' : ''}{stats.changePercent}% change
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-neutral-50 rounded-lg p-3 text-center">
                <div className="text-xs text-neutral-600 mb-1">Avg</div>
                <div className="text-sm font-bold text-neutral-900">
                  {stats.average}
                </div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3 text-center">
                <div className="text-xs text-neutral-600 mb-1">Min</div>
                <div className="text-sm font-bold text-green-600">
                  {stats.min}
                </div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3 text-center">
                <div className="text-xs text-neutral-600 mb-1">Max</div>
                <div className="text-sm font-bold text-red-600">
                  {stats.max}
                </div>
              </div>
            </div>
          </div>

          {/* Mini Chart Column */}
          <div className="flex flex-col justify-center">
            <div className="text-xs text-neutral-600 mb-2 text-center">
              Last 6 Months
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={recentData}>
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={getLineColor()} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-xs text-neutral-500 mt-2">
              <span>{recentData[0]?.date.split('-')[1]}/{recentData[0]?.date.split('-')[0]}</span>
              <span>{recentData[recentData.length - 1]?.date.split('-')[1]}/{recentData[recentData.length - 1]?.date.split('-')[0]}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <Link
            href="/prices/history"
            className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            Explore Detailed Analytics & Predictions
          </Link>
        </div>
      </div>
    </div>
  );
}