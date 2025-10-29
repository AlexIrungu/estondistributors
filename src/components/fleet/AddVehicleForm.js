// src/components/fleet/AddVehicleForm.js
'use client';

import { useState } from 'react';

const VEHICLE_TYPES = [
  { value: 'truck', label: 'Truck 🚛' },
  { value: 'van', label: 'Van 🚐' },
  { value: 'car', label: 'Car 🚗' },
  { value: 'motorcycle', label: 'Motorcycle 🏍️' },
  { value: 'other', label: 'Other 🚙' }
];

const FUEL_TYPES = [
  { value: 'pms', label: 'Super Petrol (PMS)' },
  { value: 'ago', label: 'Diesel (AGO)' },
  { value: 'ik', label: 'Kerosene (IK)' }
];

const TRUCK_MAKES = [
  'Isuzu', 'Mitsubishi Fuso', 'Mercedes-Benz', 'Scania', 
  'Volvo', 'MAN', 'DAF', 'Hino', 'UD Trucks', 'Other'
];

export default function AddVehicleForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleName: '',
    vehicleType: 'truck',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    fuelType: 'ago',
    tankCapacity: '',
    avgConsumption: '',
    currentOdometer: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.fuelType) {
      newErrors.fuelType = 'Fuel type is required';
    }

    if (formData.tankCapacity && isNaN(formData.tankCapacity)) {
      newErrors.tankCapacity = 'Must be a valid number';
    }

    if (formData.avgConsumption && isNaN(formData.avgConsumption)) {
      newErrors.avgConsumption = 'Must be a valid number';
    }

    if (formData.currentOdometer && isNaN(formData.currentOdometer)) {
      newErrors.currentOdometer = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert string numbers to actual numbers
    const submitData = {
      ...formData,
      tankCapacity: formData.tankCapacity ? parseFloat(formData.tankCapacity) : 0,
      avgConsumption: formData.avgConsumption ? parseFloat(formData.avgConsumption) : 0,
      currentOdometer: formData.currentOdometer ? parseInt(formData.currentOdometer) : 0,
      year: parseInt(formData.year)
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g., KCA 123A"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.vehicleNumber ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.vehicleNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Vehicle Name (Optional)
              </label>
              <input
                type="text"
                name="vehicleName"
                value={formData.vehicleName}
                onChange={handleChange}
                placeholder="e.g., Delivery Truck 1"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Vehicle Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {VEHICLE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Make
              </label>
              <select
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select make...</option>
                {TRUCK_MAKES.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., FRR"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1980"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Fuel Info */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Fuel Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {FUEL_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tank Capacity (Liters)
              </label>
              <input
                type="number"
                name="tankCapacity"
                value={formData.tankCapacity}
                onChange={handleChange}
                placeholder="e.g., 100"
                step="0.1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.tankCapacity ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.tankCapacity && (
                <p className="text-red-500 text-sm mt-1">{errors.tankCapacity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Average Consumption (km/L)
              </label>
              <input
                type="number"
                name="avgConsumption"
                value={formData.avgConsumption}
                onChange={handleChange}
                placeholder="e.g., 8.5"
                step="0.1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.avgConsumption ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.avgConsumption && (
                <p className="text-red-500 text-sm mt-1">{errors.avgConsumption}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Current Odometer (km)
              </label>
              <input
                type="number"
                name="currentOdometer"
                value={formData.currentOdometer}
                onChange={handleChange}
                placeholder="e.g., 45000"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.currentOdometer ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.currentOdometer && (
                <p className="text-red-500 text-sm mt-1">{errors.currentOdometer}</p>
              )}
            </div>
          </div>
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
            placeholder="Any additional information about this vehicle..."
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Add Vehicle
          </button>
        </div>
      </div>
    </form>
  );
}