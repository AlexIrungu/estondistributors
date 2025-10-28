'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { predictPrices, formatDate } from '@/lib/utils/priceCalculations';
import { AlertCircle, TrendingUp } from 'lucide-react';

export default function PricePredictionChart({ 
  historicalData, 
  fuelType = 'pms',
  location = 'nairobi',
  daysToPredict = 30,
  height = 400 
}) {
  if (!historicalData || historicalData.length < 3) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <p className="text-center text-neutral-500">Insufficient data for predictions</p>
      </div>
    );
  }

  const predictions = predictPrices(historicalData, daysToPredict);
  
  // Combine historical and predicted data
  const recentHistory = historicalData.slice(-30); // Last 30 days
  const combinedData = [
    ...recentHistory.map(item => ({
      ...item,
      displayDate: formatDate(item.date, 'short'),
      type: 'historical'
    })),
    ...predictions.map(item => ({
      ...item,
      displayDate: formatDate(item.date, 'short'),
      type: 'predicted'
    }))
  ];

  const getFuelLabel = (type) => {
    const labels = {
      pms: 'Super Petrol',
      ago: 'Diesel',
      ik: 'Kerosene'
    };
    return labels[type] || type;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPredicted = data.type === 'predicted';
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-xs font-semibold text-neutral-500 mb-1">
            {isPredicted ? 'Predicted' : 'Historical'}
          </p>
          <p className="text-sm font-semibold text-neutral-700 mb-1">
            {formatDate(data.date, 'full')}
          </p>
          <p className="text-lg font-bold text-blue-600">
            KES {data.price.toFixed(2)}
          </p>
          {isPredicted && (
            <div className="mt-2 pt-2 border-t border-neutral-200">
              <p className="text-xs text-neutral-600">
                Range: KES {data.lowerBound.toFixed(2)} - {data.upperBound.toFixed(2)}
              </p>
            </div>
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
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-bold text-neutral-800">
              {getFuelLabel(fuelType)} Price Forecast
            </h3>
          </div>
        </div>
        <p className="text-sm text-neutral-500">
          {location.charAt(0).toUpperCase() + location.slice(1)} • Next {daysToPredict} days
        </p>
      </div>

      {/* Alert */}
      <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start space-x-2">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <strong>Note:</strong> Predictions are based on historical trends and may not account for sudden market changes, policy decisions, or global events.
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          
          {/* Confidence interval area */}
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="none"
            fill="#c084fc"
            fillOpacity={0.2}
            name="Upper Bound"
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="none"
            fill="#c084fc"
            fillOpacity={0.2}
            name="Lower Bound"
          />
          
          {/* Historical line */}
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.type === 'historical') {
                return <circle cx={cx} cy={cy} r={4} fill="#2563eb" />;
              }
              return null;
            }}
            name="Actual Price"
            connectNulls
          />
          
          {/* Predicted line */}
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#9333ea" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.type === 'predicted') {
                return <circle cx={cx} cy={cy} r={3} fill="#9333ea" />;
              }
              return null;
            }}
            name="Predicted Price"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend explanation */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-blue-600"></div>
          <span className="text-neutral-600">Historical Data</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-purple-600 border-dashed border-t-2"></div>
          <span className="text-neutral-600">Predicted Trend</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 bg-purple-200 opacity-50"></div>
          <span className="text-neutral-600">Confidence Range</span>
        </div>
      </div>
    </div>
  );
}