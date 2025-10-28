'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDate } from '@/lib/utils/priceCalculations';
import { BarChart3 } from 'lucide-react';

export default function ComparisonChart({ 
  data, // Should contain { pms: [], ago: [], ik: [] }
  location = 'nairobi',
  height = 400,
  showCrudeOil = false,
  crudeOilData = null
}) {
  if (!data || (!data.pms && !data.ago && !data.ik)) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
        <p className="text-center text-neutral-500">No comparison data available</p>
      </div>
    );
  }

  // Combine all fuel types into single dataset
  const dates = data.pms?.map(item => item.date) || 
                data.ago?.map(item => item.date) || 
                data.ik?.map(item => item.date) || [];

  const combinedData = dates.map(date => {
    const dataPoint = {
      date,
      displayDate: formatDate(date, 'short')
    };

    if (data.pms) {
      const pmsData = data.pms.find(item => item.date === date);
      if (pmsData) dataPoint.pms = pmsData.price;
    }

    if (data.ago) {
      const agoData = data.ago.find(item => item.date === date);
      if (agoData) dataPoint.ago = agoData.price;
    }

    if (data.ik) {
      const ikData = data.ik.find(item => item.date === date);
      if (ikData) dataPoint.ik = ikData.price;
    }

    // Add crude oil if available
    if (showCrudeOil && crudeOilData) {
      const crudeData = crudeOilData.find(item => item.date === date);
      if (crudeData) dataPoint.crude = crudeData.price;
    }

    return dataPoint;
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700 mb-2">
            {formatDate(payload[0].payload.date, 'full')}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 mb-1">
              <span className="text-xs" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                {entry.name === 'Brent Crude' ? '$' : 'KES'} {entry.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xl font-bold text-neutral-800">
            Fuel Price Comparison
          </h3>
        </div>
        <p className="text-sm text-neutral-500">
          {location.charAt(0).toUpperCase() + location.slice(1)} • All fuel types
          {showCrudeOil && ' + Brent Crude'}
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: 'KES/Litre', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          {showCrudeOil && crudeOilData && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              label={{ value: 'USD/Barrel', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {data.pms && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="pms" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Super Petrol"
            />
          )}
          
          {data.ago && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="ago" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Diesel"
            />
          )}
          
          {data.ik && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="ik" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Kerosene"
            />
          )}

          {showCrudeOil && crudeOilData && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="crude" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Brent Crude"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Price difference stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.pms && data.ago && (
          <div className="bg-gradient-to-br from-red-50 to-green-50 rounded-lg p-3 border border-neutral-200">
            <p className="text-xs text-neutral-600 mb-1">Petrol vs Diesel</p>
            <p className="text-lg font-bold text-neutral-900">
              KES {(data.pms[data.pms.length - 1].price - data.ago[data.ago.length - 1].price).toFixed(2)}
            </p>
            <p className="text-xs text-neutral-500">Current difference</p>
          </div>
        )}

        {data.pms && data.ik && (
          <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-lg p-3 border border-neutral-200">
            <p className="text-xs text-neutral-600 mb-1">Petrol vs Kerosene</p>
            <p className="text-lg font-bold text-neutral-900">
              KES {(data.pms[data.pms.length - 1].price - data.ik[data.ik.length - 1].price).toFixed(2)}
            </p>
            <p className="text-xs text-neutral-500">Current difference</p>
          </div>
        )}

        {data.ago && data.ik && (
          <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-lg p-3 border border-neutral-200">
            <p className="text-xs text-neutral-600 mb-1">Diesel vs Kerosene</p>
            <p className="text-lg font-bold text-neutral-900">
              KES {(data.ago[data.ago.length - 1].price - data.ik[data.ik.length - 1].price).toFixed(2)}
            </p>
            <p className="text-xs text-neutral-500">Current difference</p>
          </div>
        )}
      </div>
    </div>
  );
}