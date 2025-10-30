'use client';

import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Award, Fuel, DollarSign, Activity, Calendar } from 'lucide-react';

const COLORS = ['#e68a00', '#05699b', '#f97316', '#737373', '#fdba74'];

const FUEL_TYPE_LABELS = {
  pms: 'Super Petrol',
  ago: 'Diesel',
  ik: 'Kerosene'
};

export default function EnhancedFleetAnalytics({ analytics }) {
  const [selectedView, setSelectedView] = useState('overview');
  const [comparisonMode, setComparisonMode] = useState(false);

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-neutral-600">No analytics data available</p>
      </div>
    );
  }

  // Prepare fuel efficiency trend data (simulated)
  const efficiencyTrend = [
    { month: 'Jan', efficiency: 8.2, target: 9.0 },
    { month: 'Feb', efficiency: 8.5, target: 9.0 },
    { month: 'Mar', efficiency: 8.3, target: 9.0 },
    { month: 'Apr', efficiency: 8.7, target: 9.0 },
    { month: 'May', efficiency: 8.9, target: 9.0 },
    { month: 'Jun', efficiency: 9.1, target: 9.0 }
  ];

  // Cost per kilometer data
  const costPerKmData = [
    { vehicle: 'TRK-001', costPerKm: 12.5, avgEfficiency: 8.2 },
    { vehicle: 'TRK-002', costPerKm: 11.8, avgEfficiency: 8.9 },
    { vehicle: 'VAN-001', costPerKm: 10.2, avgEfficiency: 9.5 },
    { vehicle: 'VAN-002', costPerKm: 13.1, avgEfficiency: 7.8 },
    { vehicle: 'CAR-001', costPerKm: 8.5, avgEfficiency: 11.2 }
  ];

  // Vehicle utilization data
  const utilizationData = [
    { vehicle: 'TRK-001', utilization: 85, status: 'optimal' },
    { vehicle: 'TRK-002', utilization: 92, status: 'high' },
    { vehicle: 'VAN-001', utilization: 78, status: 'good' },
    { vehicle: 'VAN-002', utilization: 65, status: 'low' },
    { vehicle: 'CAR-001', utilization: 88, status: 'optimal' }
  ];

  // Maintenance cost tracking
  const maintenanceCosts = [
    { month: 'Jan', fuel: 450000, maintenance: 85000, total: 535000 },
    { month: 'Feb', fuel: 480000, maintenance: 92000, total: 572000 },
    { month: 'Mar', fuel: 465000, maintenance: 78000, total: 543000 },
    { month: 'Apr', fuel: 490000, maintenance: 105000, total: 595000 },
    { month: 'May', fuel: 475000, maintenance: 88000, total: 563000 },
    { month: 'Jun', fuel: 510000, maintenance: 95000, total: 605000 }
  ];

  // Vehicle performance comparison
  const vehicleComparison = [
    { 
      vehicle: 'TRK-001', 
      efficiency: 8.2, 
      cost: 450000, 
      distance: 12500,
      rating: 4.2 
    },
    { 
      vehicle: 'TRK-002', 
      efficiency: 8.9, 
      cost: 420000, 
      distance: 13200,
      rating: 4.7 
    },
    { 
      vehicle: 'VAN-001', 
      efficiency: 9.5, 
      cost: 380000, 
      distance: 11800,
      rating: 4.8 
    },
    { 
      vehicle: 'VAN-002', 
      efficiency: 7.8, 
      cost: 480000, 
      distance: 10200,
      rating: 3.9 
    },
    { 
      vehicle: 'CAR-001', 
      efficiency: 11.2, 
      cost: 280000, 
      distance: 9800,
      rating: 4.9 
    }
  ];

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

  // Calculate performance metrics
  const bestPerformer = vehicleComparison.reduce((best, vehicle) => 
    vehicle.efficiency > best.efficiency ? vehicle : best
  );
  
  const worstPerformer = vehicleComparison.reduce((worst, vehicle) => 
    vehicle.efficiency < worst.efficiency ? vehicle : worst
  );

  const avgUtilization = utilizationData.reduce((sum, v) => sum + v.utilization, 0) / utilizationData.length;

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-neutral-200 p-2">
        <div className="flex gap-2">
          {['overview', 'efficiency', 'costs', 'comparison'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedView === view
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setComparisonMode(!comparisonMode)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            comparisonMode
              ? 'bg-blue-500 text-white'
              : 'border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          Compare Vehicles
        </button>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-5 border border-primary-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-primary-600" />
            <span className="text-xs bg-primary-200 text-primary-700 px-2 py-1 rounded-full font-semibold">
              +{analytics.activeVehicles}
            </span>
          </div>
          <div className="text-sm text-primary-700 mb-1">Total Vehicles</div>
          <div className="text-3xl font-bold text-primary-900">{analytics.totalVehicles}</div>
          <div className="text-xs text-primary-600 mt-1">
            {((analytics.activeVehicles / analytics.totalVehicles) * 100).toFixed(0)}% active
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-sm text-green-700 mb-1">Total Fuel Cost</div>
          <div className="text-3xl font-bold text-green-900">
            KES {(analytics.totalFuelCost / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-green-600 mt-1">
            {analytics.totalLiters.toFixed(0)} liters used
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Fuel className="w-8 h-8 text-blue-600" />
            {analytics.avgFuelEfficiency >= 9 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="text-sm text-blue-700 mb-1">Avg. Efficiency</div>
          <div className="text-3xl font-bold text-blue-900">
            {analytics.avgFuelEfficiency.toFixed(1)} km/L
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Target: 9.0 km/L
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-orange-600" />
            <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full font-semibold">
              Current
            </span>
          </div>
          <div className="text-sm text-orange-700 mb-1">This Month</div>
          <div className="text-3xl font-bold text-orange-900">
            KES {((analytics.monthlyTrend[analytics.monthlyTrend.length - 1]?.cost || 0) / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-orange-600 mt-1">
            {analytics.monthlyTrend[analytics.monthlyTrend.length - 1]?.liters.toFixed(0) || 0} L
          </div>
        </div>
      </div>

      {/* Performance Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border-2 border-green-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Best Performer</p>
              <p className="font-bold text-green-900">{bestPerformer.vehicle}</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">{bestPerformer.efficiency.toFixed(1)}</span>
            <span className="text-sm text-neutral-600">km/L</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-red-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Needs Attention</p>
              <p className="font-bold text-red-900">{worstPerformer.vehicle}</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-600">{worstPerformer.efficiency.toFixed(1)}</span>
            <span className="text-sm text-neutral-600">km/L</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-blue-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Fleet Utilization</p>
              <p className="font-bold text-blue-900">Average</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">{avgUtilization.toFixed(0)}</span>
            <span className="text-sm text-neutral-600">%</span>
          </div>
        </div>
      </div>

      {/* Main Content Based on Selected View */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Monthly Trend Chart */}
          {monthlyData.length > 0 && (
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Monthly Fuel Cost Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e68a00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e68a00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" stroke="#737373" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#737373" style={{ fontSize: '12px' }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'cost' ? `KES ${value.toLocaleString()}` : `${value.toFixed(1)} L`,
                      name === 'cost' ? 'Cost' : 'Liters'
                    ]}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e5e5', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="cost" stroke="#e68a00" fill="url(#costGradient)" name="Cost (KES)" />
                  <Line type="monotone" dataKey="liters" stroke="#05699b" strokeWidth={2} name="Liters" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Fuel Type and Vehicle Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fuelTypeData.length > 0 && (
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Fuel Type Distribution</h3>
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
                    <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {vehicleTypeData.length > 0 && (
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Vehicle Types</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vehicleTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="name" stroke="#737373" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#737373" style={{ fontSize: '12px' }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#e68a00" radius={[8, 8, 0, 0]} name="Vehicles" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedView === 'efficiency' && (
        <div className="space-y-6">
          {/* Fuel Efficiency Trend */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Fuel Efficiency Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={efficiencyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#737373" />
                <YAxis stroke="#737373" domain={[7, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#05699b" strokeWidth={3} name="Actual (km/L)" />
                <Line type="monotone" dataKey="target" stroke="#f97316" strokeDasharray="5 5" strokeWidth={2} name="Target (km/L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Vehicle Utilization */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Vehicle Utilization Rates</h3>
            <div className="space-y-3">
              {utilizationData.map((vehicle, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-900">{vehicle.vehicle}</span>
                    <span className={`text-sm font-bold ${
                      vehicle.utilization >= 80 ? 'text-green-600' :
                      vehicle.utilization >= 60 ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {vehicle.utilization}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        vehicle.utilization >= 80 ? 'bg-green-500' :
                        vehicle.utilization >= 60 ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${vehicle.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedView === 'costs' && (
        <div className="space-y-6">
          {/* Cost per Kilometer */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Cost per Kilometer Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costPerKmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="vehicle" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip formatter={(value) => `KES ${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="costPerKm" fill="#e68a00" radius={[8, 8, 0, 0]} name="Cost/km (KES)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Maintenance vs Fuel Costs */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Fuel vs Maintenance Costs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={maintenanceCosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#737373" />
                <YAxis stroke="#737373" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                <Legend />
                <Area type="monotone" dataKey="fuel" stackId="1" stroke="#05699b" fill="#05699b" name="Fuel" />
                <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#f97316" fill="#f97316" name="Maintenance" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedView === 'comparison' && (
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Vehicle Performance Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b-2 border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900">Vehicle</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-neutral-900">Efficiency (km/L)</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-neutral-900">Total Cost</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-neutral-900">Distance (km)</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-neutral-900">Rating</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-neutral-900">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {vehicleComparison.map((vehicle, index) => (
                  <tr key={index} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-semibold text-neutral-900">{vehicle.vehicle}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${
                        vehicle.efficiency >= 9 ? 'text-green-600' :
                        vehicle.efficiency >= 8 ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {vehicle.efficiency.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      KES {(vehicle.cost / 1000).toFixed(0)}K
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      {vehicle.distance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex items-center justify-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold">{vehicle.rating}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vehicle.rating >= 4.5 ? 'bg-green-100 text-green-700' :
                        vehicle.rating >= 4 ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {vehicle.rating >= 4.5 ? 'Excellent' :
                         vehicle.rating >= 4 ? 'Good' : 'Needs Work'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
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
          
          {avgUtilization < 75 && (
            <div className="flex gap-3 text-sm text-blue-800">
              <span>📊</span>
              <p>
                Fleet utilization is below 75%. Review route optimization and vehicle allocation 
                to maximize efficiency and reduce idle time.
              </p>
            </div>
          )}

          <div className="flex gap-3 text-sm text-blue-800">
            <span>🔧</span>
            <p>
              Regular vehicle maintenance can improve fuel efficiency by up to 15%. Ensure all vehicles 
              are serviced according to schedule. Vehicle {worstPerformer.vehicle} needs immediate attention.
            </p>
          </div>

          <div className="flex gap-3 text-sm text-blue-800">
            <span>🎯</span>
            <p>
              Best practices from {bestPerformer.vehicle} (achieving {bestPerformer.efficiency.toFixed(1)} km/L) 
              should be shared across the fleet for improved overall performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}