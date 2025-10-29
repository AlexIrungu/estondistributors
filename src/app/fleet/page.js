// src/app/fleet/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import VehicleList from '@/components/fleet/VehicleList';
import AddVehicleForm from '@/components/fleet/AddVehicleForm';
import RefuelTracker from '@/components/fleet/RefuelTracker';
import FleetAnalytics from '@/components/fleet/FleetAnalytics';

export default function FleetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/fleet');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      loadFleetData();
    }
  }, [session]);

  const loadFleetData = async () => {
    try {
      setLoading(true);
      
      // Load vehicles
      const vehiclesRes = await fetch('/api/fleet?action=vehicles');
      const vehiclesData = await vehiclesRes.json();
      
      if (vehiclesData.success) {
        setVehicles(vehiclesData.vehicles || []);
      }

      // Load analytics
      const analyticsRes = await fetch('/api/fleet?action=analytics');
      const analyticsData = await analyticsRes.json();
      
      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }
    } catch (error) {
      console.error('Error loading fleet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      const res = await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-vehicle',
          vehicle: vehicleData
        })
      });

      const data = await res.json();
      
      if (data.success) {
        await loadFleetData();
        setShowAddVehicle(false);
        alert('Vehicle added successfully!');
      } else {
        alert(data.error || 'Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle');
    }
  };

  const handleCreateDemo = async () => {
    if (!confirm('This will create 3 demo vehicles with sample data. Continue?')) {
      return;
    }

    try {
      const res = await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-demo' })
      });

      const data = await res.json();
      
      if (data.success) {
        await loadFleetData();
        alert('Demo fleet created successfully!');
      }
    } catch (error) {
      console.error('Error creating demo:', error);
      alert('Failed to create demo fleet');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading fleet data...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Fleet Management</h1>
              <p className="text-neutral-600 mt-1">
                Manage your vehicles and track fuel consumption
              </p>
            </div>
            <div className="flex gap-3">
              {vehicles.length === 0 && (
                <button
                  onClick={handleCreateDemo}
                  className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
                >
                  Create Demo Fleet
                </button>
              )}
              <button
                onClick={() => setShowAddVehicle(true)}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                + Add Vehicle
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                <div className="text-sm text-neutral-600">Total Vehicles</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1">
                  {analytics.totalVehicles}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {analytics.activeVehicles} active
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                <div className="text-sm text-neutral-600">Total Fuel Cost</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1">
                  KES {analytics.totalFuelCost.toLocaleString()}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {analytics.totalLiters.toFixed(0)} liters consumed
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                <div className="text-sm text-neutral-600">Avg. Efficiency</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1">
                  {analytics.avgFuelEfficiency.toFixed(1)} km/L
                </div>
                <div className="text-xs text-neutral-500 mt-1">Fleet average</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                <div className="text-sm text-neutral-600">This Month</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1">
                  KES {analytics.monthlyTrend[analytics.monthlyTrend.length - 1]?.cost.toLocaleString() || 0}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {analytics.monthlyTrend[analytics.monthlyTrend.length - 1]?.liters.toFixed(0) || 0} liters
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'vehicles'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Vehicles ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('refuel')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'refuel'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Log Refuel
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          {activeTab === 'vehicles' && (
            <VehicleList
              vehicles={vehicles}
              onRefresh={loadFleetData}
              onSelectVehicle={setSelectedVehicle}
            />
          )}

          {activeTab === 'refuel' && (
            <RefuelTracker
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onRefuelAdded={loadFleetData}
            />
          )}

          {activeTab === 'analytics' && analytics && (
            <FleetAnalytics analytics={analytics} />
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">Add New Vehicle</h2>
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="text-neutral-500 hover:text-neutral-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <AddVehicleForm
              onSubmit={handleAddVehicle}
              onCancel={() => setShowAddVehicle(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}