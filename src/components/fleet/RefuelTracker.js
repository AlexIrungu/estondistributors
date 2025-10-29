// src/components/fleet/RefuelTracker.js
'use client';

import { useState, useEffect } from 'react';

const FUEL_TYPE_LABELS = {
  pms: 'Super Petrol',
  ago: 'Diesel',
  ik: 'Kerosene'
};

const CURRENT_PRICES = {
  pms: 188.84,
  ago: 165.50,
  ik: 147.41
};

export default function RefuelTracker({ vehicles, selectedVehicle, onRefuelAdded }) {
  const [formData, setFormData] = useState({
    vehicleId: selectedVehicle?.id || '',
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    liters: '',
    pricePerLiter: '',
    fuelType: '',
    location: '',
    fuelStation: '',
    isFull: true,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [fuelEfficiency, setFuelEfficiency] = useState(null);

  // Update form when vehicle is selected
  useEffect(() => {
    if (selectedVehicle) {
      setFormData(prev => ({
        ...prev,
        vehicleId: selectedVehicle.id,
        fuelType: selectedVehicle.fuelType,
        pricePerLiter: CURRENT_PRICES[selectedVehicle.fuelType].toString(),
        odometer: selectedVehicle.currentOdometer?.toString() || ''
      }));
    }
  }, [selectedVehicle]);

  // Calculate total cost
  useEffect(() => {
    const liters = parseFloat(formData.liters) || 0;
    const price = parseFloat(formData.pricePerLiter) || 0;
    setTotalCost(liters * price);
  }, [formData.liters, formData.pricePerLiter]);

  // Calculate fuel efficiency based on previous refuel
  useEffect(() => {
    const calculateEfficiency = async () => {
      if (!formData.vehicleId || !formData.odometer || !formData.liters) {
        setFuelEfficiency(null);
        return;
      }

      try {
        const res = await fetch(`/api/fleet?action=refuels&vehicleId=${formData.vehicleId}`);
        const data = await res.json();
        
        if (data.success && data.refuels.length > 0) {
          const lastRefuel = data.refuels[0];
          const distanceTraveled = parseInt(formData.odometer) - lastRefuel.odometer;
          const liters = parseFloat(formData.liters);
          
          if (distanceTraveled > 0 && liters > 0) {
            const efficiency = distanceTraveled / liters;
            setFuelEfficiency(efficiency);
          }
        }
      } catch (error) {
        console.error('Error calculating efficiency:', error);
      }
    };

    calculateEfficiency();
  }, [formData.vehicleId, formData.odometer, formData.liters]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Please select a vehicle';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.odometer || isNaN(formData.odometer)) {
      newErrors.odometer = 'Valid odometer reading is required';
    }

    if (!formData.liters || isNaN(formData.liters) || parseFloat(formData.liters) <= 0) {
      newErrors.liters = 'Valid fuel amount is required';
    }

    if (!formData.pricePerLiter || isNaN(formData.pricePerLiter) || parseFloat(formData.pricePerLiter) <= 0) {
      newErrors.pricePerLiter = 'Valid price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-refuel',
          refuel: {
            ...formData,
            odometer: parseInt(formData.odometer),
            liters: parseFloat(formData.liters),
            pricePerLiter: parseFloat(formData.pricePerLiter)
          }
        })
      });

      const data = await res.json();
      
      if (data.success) {
        alert('Refuel logged successfully!');
        // Reset form
        setFormData({
          vehicleId: formData.vehicleId,
          date: new Date().toISOString().split('T')[0],
          odometer: '',
          liters: '',
          pricePerLiter: formData.pricePerLiter,
          fuelType: formData.fuelType,
          location: '',
          fuelStation: '',
          isFull: true,
          notes: ''
        });
        onRefuelAdded();
      } else {
        alert(data.error || 'Failed to log refuel');
      }
    } catch (error) {
      console.error('Error logging refuel:', error);
      alert('Failed to log refuel');
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⛽</div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          No Vehicles Available
        </h3>
        <p className="text-neutral-600">
          Please add a vehicle first before logging refuels
        </p>
      </div>
    );
  }

  const selectedVehicleData = vehicles.find(v => v.id === formData.vehicleId);

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="space-y-6">
        {/* Vehicle Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Select Vehicle <span className="text-red-500">*</span>
          </label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.vehicleId ? 'border-red-500' : 'border-neutral-300'
            }`}
          >
            <option value="">Choose a vehicle...</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.vehicleNumber} - {vehicle.vehicleName || `${vehicle.make} ${vehicle.model}`}
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>
          )}
        </div>

        {selectedVehicleData && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-neutral-600">Fuel Type</div>
                <div className="font-medium text-neutral-900">
                  {FUEL_TYPE_LABELS[selectedVehicleData.fuelType]}
                </div>
              </div>
              <div>
                <div className="text-neutral-600">Last Odometer</div>
                <div className="font-medium text-neutral-900">
                  {selectedVehicleData.currentOdometer?.toLocaleString()} km
                </div>
              </div>
              <div>
                <div className="text-neutral-600">Tank Capacity</div>
                <div className="font-medium text-neutral-900">
                  {selectedVehicleData.tankCapacity} L
                </div>
              </div>
              <div>
                <div className="text-neutral-600">Avg. Efficiency</div>
                <div className="font-medium text-primary-600">
                  {selectedVehicleData.stats?.avgFuelEfficiency?.toFixed(1) || 'N/A'} km/L
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refuel Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.date ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Odometer Reading (km) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="odometer"
              value={formData.odometer}
              onChange={handleChange}
              placeholder="e.g., 45100"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.odometer ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.odometer && (
              <p className="text-red-500 text-sm mt-1">{errors.odometer}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Liters <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="liters"
              value={formData.liters}
              onChange={handleChange}
              placeholder="e.g., 65"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.liters ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.liters && (
              <p className="text-red-500 text-sm mt-1">{errors.liters}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Price per Liter (KES) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="pricePerLiter"
              value={formData.pricePerLiter}
              onChange={handleChange}
              placeholder="e.g., 165.50"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.pricePerLiter ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.pricePerLiter && (
              <p className="text-red-500 text-sm mt-1">{errors.pricePerLiter}</p>
            )}
          </div>
        </div>

        {/* Total Cost Display */}
        {totalCost > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-700">Total Cost</div>
                <div className="text-2xl font-bold text-green-900">
                  KES {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              {fuelEfficiency && (
                <div className="text-right">
                  <div className="text-sm text-green-700">Fuel Efficiency</div>
                  <div className="text-xl font-bold text-green-900">
                    {fuelEfficiency.toFixed(2)} km/L
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Nairobi"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Fuel Station
            </label>
            <input
              type="text"
              name="fuelStation"
              value={formData.fuelStation}
              onChange={handleChange}
              placeholder="e.g., Total Energies"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Full Tank Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFull"
            id="isFull"
            checked={formData.isFull}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="isFull" className="ml-2 text-sm text-neutral-700">
            Full tank refuel
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Any additional notes..."
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-lg"
        >
          Log Refuel
        </button>
      </div>
    </form>
  );
}