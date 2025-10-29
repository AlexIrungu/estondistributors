// src/components/fleet/FleetAnalytics.js
'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#e68a00', '#05699b', '#f97316', '#737373', '#fdba74'];

const FUEL_TYPE_LABELS = {
  pms: 'Super Petrol',
  ago: 'Diesel',
  ik: 'Kerosene'
};

export default function FleetAnalytics({ analytics }) {
  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-neutral-600">No analytics data available</p>
      </div>
    );
  }

  // Prepare fuel type data for pie chart
  const fuelTypeData = Object.entries(analytics.fuelTypeBreakdown || {}).map(([type, data]) => ({
    name: FUEL_TYPE_LABELS[type] || type,
    value: data.cost,
    liters: data.liters
  }));

  // Prepare vehicle type data for bar chart
  const vehicleTypeData = Object.entries(analytics.vehicleTypeBreakdown || {}).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count
  }));

  // Prepare monthly trend data
  const monthlyData = (analytics.monthlyTrend || []).map(item => ({
    month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
    cost: item.cost,
    liters: item.liters
  }));

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-5 border border-primary-200">
          <div className="text-sm text-primary-700 mb-1">Total Vehicles</div>
          <div className="text-3xl font-bold text-primary-900">{analytics.totalVehicles}</div>
          <div className="text-xs text-primary-600 mt-1">{analytics.activeVehicles} active</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="text-sm text-green-700 mb-1">Total Fuel Cost</div>
          <div className="text-3xl font-bold text-green-900">
            KES {(analytics.totalFuelCost / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-green-600 mt-1">
            {analytics.totalLiters.toFixed(0)} liters
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="text-sm text-blue-700 mb-1">Avg. Efficiency</div>
          <div className="text-3xl font-bold text-blue-900">
            {analytics.avgFuelEfficiency.toFixed(1)} km/L
          </div>
          <div className="text-xs text-blue-600 mt-1">Fleet average</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="text-sm text-orange-700 mb-1">This Month</div>
          <div className="text-3xl font-bold text-orange-900">
            KES {((analytics.monthlyTrend[analytics.monthlyTrend.length - 1]?.cost || 0) / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-orange-600 mt-1">
            {analytics.monthlyTrend[analytics.monthlyTrend.length - 1]?.liters.toFixed(0) || 0} L
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      {monthlyData.length > 0 && (
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Monthly Fuel Cost Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="month" 
                stroke="#737373"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#737373"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'cost' 
                    ? `KES ${value.toLocaleString()}` 
                    : `${value.toFixed(1)} L`,
                  name === 'cost' ? 'Cost' : 'Liters'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#e68a00" 
                strokeWidth={2}
                dot={{ fill: '#e68a00', r: 4 }}
                activeDot={{ r: 6 }}
                name="Cost (KES)"
              />
              <Line 
                type="monotone" 
                dataKey="liters" 
                stroke="#05699b" 
                strokeWidth={2}
                dot={{ fill: '#05699b', r: 4 }}
                activeDot={{ r: 6 }}
                name="Liters"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Type Breakdown */}
        {fuelTypeData.length > 0 && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Fuel Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fuelTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fuelTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `KES ${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Fuel Type Details */}
            <div className="mt-4 space-y-2">
              {fuelTypeData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-neutral-50 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-neutral-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-neutral-900">
                      KES {item.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {item.liters.toFixed(0)} L
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicle Type Breakdown */}
        {vehicleTypeData.length > 0 && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Vehicle Types
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="name" 
                  stroke="#737373"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#737373"
                  style={{ fontSize: '12px' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#e68a00"
                  radius={[8, 8, 0, 0]}
                  name="Vehicles"
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Vehicle Type Details */}
            <div className="mt-4 space-y-2">
              {vehicleTypeData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-neutral-50 rounded">
                  <span className="text-sm font-medium text-neutral-900">{item.name}</span>
                  <span className="text-sm font-bold text-primary-600">
                    {item.count} {item.count === 1 ? 'vehicle' : 'vehicles'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">
          💡 Fleet Insights & Recommendations
        </h3>
        <div className="space-y-3">
          {analytics.avgFuelEfficiency < 8 && (
            <div className="flex gap-3 text-sm text-blue-800">
              <span>⚠️</span>
              <p>
                Your fleet's average fuel efficiency is below 8 km/L. Consider scheduling maintenance 
                checks or driver training to improve fuel consumption.
              </p>
            </div>
          )}
          
          {analytics.totalFuelCost > 500000 && (
            <div className="flex gap-3 text-sm text-blue-800">
              <span>💰</span>
              <p>
                Your monthly fuel costs exceed KES 500K. Consider bulk fuel purchasing or 
                negotiating volume discounts with suppliers.
              </p>
            </div>
          )}
          
          <div className="flex gap-3 text-sm text-blue-800">
            <span>📊</span>
            <p>
              Track your fleet's performance regularly to identify trends and optimize fuel consumption. 
              Set up price alerts to purchase fuel when prices drop.
            </p>
          </div>

          <div className="flex gap-3 text-sm text-blue-800">
            <span>🔧</span>
            <p>
              Regular vehicle maintenance can improve fuel efficiency by up to 15%. Ensure all vehicles 
              are serviced according to schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}