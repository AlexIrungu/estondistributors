// src/components/dashboard/SpendingAnalytics.js
'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Droplets } from 'lucide-react';

const COLORS = ['#e68a00', '#3b82f6', '#10b981', '#f59e0b'];

export default function SpendingAnalytics({ stats }) {
  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
        <p className="text-neutral-500">Loading analytics...</p>
      </div>
    );
  }

  // Prepare monthly spending data for line chart
  const monthlyData = Object.entries(stats.monthlySpending || {})
    .map(([month, amount]) => ({
      month: new Date(month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount: amount,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months

  // Prepare fuel type data for pie chart - FIXED: using correct property names
  const fuelTypeData = Object.entries(stats.fuelTypeStats || {}).map(([type, data]) => ({
    name: type === 'pms' ? 'Super Petrol' : type === 'ago' ? 'Diesel' : 'Kerosene',
    value: data.totalSpent || 0,
    liters: data.totalQuantity || 0, // FIXED: was totalLiters, now totalQuantity
  }));

  // Calculate total liters from all fuel types
  const totalLiters = Object.values(stats.fuelTypeStats || {})
    .reduce((sum, data) => sum + (data.totalQuantity || 0), 0);

  // Calculate insights
  const avgMonthlySpending = monthlyData.length > 0
    ? monthlyData.reduce((sum, m) => sum + m.amount, 0) / monthlyData.length
    : 0;

  const mostUsedFuel = fuelTypeData.length > 0
    ? fuelTypeData.reduce((max, fuel) => fuel.value > max.value ? fuel : max, fuelTypeData[0])
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary-500" />
          Spending Analytics
        </h2>
        <p className="text-neutral-600 text-sm mt-1">
          Track your fuel spending and consumption patterns
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Key Insights */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Avg Monthly</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              KES {avgMonthlySpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Total Liters</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {totalLiters.toLocaleString()}
            </p>
          </div>

          {mostUsedFuel && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Most Used</span>
              </div>
              <p className="text-lg font-bold text-amber-900">
                {mostUsedFuel.name}
              </p>
            </div>
          )}
        </div>

        {/* Monthly Spending Trend */}
        {monthlyData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Monthly Spending Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`KES ${value.toLocaleString()}`, 'Spending']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#e68a00"
                  strokeWidth={3}
                  dot={{ fill: '#e68a00', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Fuel Type Distribution */}
        {fuelTypeData.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Spending by Fuel Type
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={fuelTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Consumption Breakdown
              </h3>
              <div className="space-y-4">
                {fuelTypeData.map((fuel, index) => (
                  <div key={fuel.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm font-medium text-neutral-700">
                          {fuel.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-secondary-900">
                        {fuel.liters.toLocaleString()} L
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(fuel.value / fuelTypeData.reduce((sum, f) => sum + f.value, 0)) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Total: KES {fuel.value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {monthlyData.length === 0 && fuelTypeData.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 mb-2">No analytics data yet</p>
            <p className="text-sm text-neutral-500">
              Place orders to see your spending analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}