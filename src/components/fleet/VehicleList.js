// src/components/fleet/VehicleList.js
'use client';

import { useState } from 'react';

const VEHICLE_TYPE_ICONS = {
  truck: '🚛',
  van: '🚐',
  car: '🚗',
  motorcycle: '🏍️',
  other: '🚙'
};

const FUEL_TYPE_LABELS = {
  pms: 'Super Petrol',
  ago: 'Diesel',
  ik: 'Kerosene'
};

export default function VehicleList({ vehicles, onRefresh, onSelectVehicle }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚛</div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          No Vehicles Yet
        </h3>
        <p className="text-neutral-600 mb-6">
          Add your first vehicle to start tracking fuel consumption
        </p>
      </div>
    );
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      const res = await fetch(`/api/fleet?vehicleId=${vehicleId}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      
      if (data.success) {
        alert('Vehicle deleted successfully');
        onRefresh();
      } else {
        alert(data.error || 'Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle');
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`bg-neutral-50 rounded-lg p-4 border-2 transition-all cursor-pointer hover:shadow-md ${
              selectedVehicleId === vehicle.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200'
            }`}
            onClick={() => {
              setSelectedVehicleId(vehicle.id);
              onSelectVehicle(vehicle);
            }}
          >
            {/* Vehicle Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {VEHICLE_TYPE_ICONS[vehicle.vehicleType] || '🚙'}
                </div>
                <div>
                  <div className="font-bold text-lg text-neutral-900">
                    {vehicle.vehicleNumber}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {vehicle.vehicleName || `${vehicle.make} ${vehicle.model}`}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                vehicle.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {vehicle.status}
              </span>
            </div>

            {/* Vehicle Info */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Type:</span>
                <span className="font-medium text-neutral-900 capitalize">
                  {vehicle.vehicleType}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Fuel:</span>
                <span className="font-medium text-neutral-900">
                  {FUEL_TYPE_LABELS[vehicle.fuelType]}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Odometer:</span>
                <span className="font-medium text-neutral-900">
                  {vehicle.currentOdometer?.toLocaleString()} km
                </span>
              </div>
            </div>

            {/* Stats */}
            {vehicle.stats && vehicle.stats.totalRefuels > 0 && (
              <div className="border-t border-neutral-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Avg. Efficiency:</span>
                  <span className="font-bold text-primary-600">
                    {vehicle.stats.avgFuelEfficiency.toFixed(1)} km/L
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Total Fuel Cost:</span>
                  <span className="font-medium text-neutral-900">
                    KES {vehicle.stats.totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Total Refuels:</span>
                  <span className="font-medium text-neutral-900">
                    {vehicle.stats.totalRefuels}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(vehicle.id);
                }}
                className="flex-1 px-3 py-2 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteVehicle(vehicle.id);
                }}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Details Modal */}
      {showDetails && (
        <VehicleDetailsModal
          vehicleId={showDetails}
          onClose={() => setShowDetails(null)}
        />
      )}
    </div>
  );
}

// Vehicle Details Modal Component
function VehicleDetailsModal({ vehicleId, onClose }) {
  const [vehicle, setVehicle] = useState(null);
  const [refuels, setRefuels] = useState([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    loadVehicleData();
  }, [vehicleId]);

  const loadVehicleData = async () => {
    try {
      // Load vehicle
      const vehicleRes = await fetch(`/api/fleet?action=vehicle&vehicleId=${vehicleId}`);
      const vehicleData = await vehicleRes.json();
      
      if (vehicleData.success) {
        setVehicle(vehicleData.vehicle);
      }

      // Load refuels
      const refuelsRes = await fetch(`/api/fleet?action=refuels&vehicleId=${vehicleId}`);
      const refuelsData = await refuelsRes.json();
      
      if (refuelsData.success) {
        setRefuels(refuelsData.refuels || []);
      }
    } catch (error) {
      console.error('Error loading vehicle data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !vehicle) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">
                {VEHICLE_TYPE_ICONS[vehicle.vehicleType] || '🚙'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {vehicle.vehicleNumber}
                </h2>
                <p className="text-neutral-600">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 text-3xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Vehicle Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="text-sm text-neutral-600 mb-1">Fuel Type</div>
              <div className="font-bold text-neutral-900">
                {FUEL_TYPE_LABELS[vehicle.fuelType]}
              </div>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="text-sm text-neutral-600 mb-1">Tank Capacity</div>
              <div className="font-bold text-neutral-900">
                {vehicle.tankCapacity} L
              </div>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="text-sm text-neutral-600 mb-1">Odometer</div>
              <div className="font-bold text-neutral-900">
                {vehicle.currentOdometer.toLocaleString()} km
              </div>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="text-sm text-neutral-600 mb-1">Efficiency</div>
              <div className="font-bold text-primary-600">
                {vehicle.stats.avgFuelEfficiency.toFixed(1)} km/L
              </div>
            </div>
          </div>

          {/* Refuel History */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Refuel History ({refuels.length})
            </h3>
            {refuels.length === 0 ? (
              <div className="text-center py-8 text-neutral-600">
                No refuel records yet
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {refuels.map((refuel) => (
                  <div key={refuel.id} className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-neutral-900">
                          {new Date(refuel.date).toLocaleDateString('en-KE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {refuel.odometer.toLocaleString()} km
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-neutral-900">
                          KES {refuel.totalCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {refuel.liters} L @ KES {refuel.pricePerLiter}
                        </div>
                      </div>
                    </div>
                    {refuel.location && (
                      <div className="text-sm text-neutral-600">
                        📍 {refuel.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}