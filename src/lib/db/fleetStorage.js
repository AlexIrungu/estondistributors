// src/lib/db/fleetStorage.js
// Fleet vehicle and fuel consumption management

const STORAGE_KEY = 'eston_fleet_vehicles';
const REFUEL_KEY = 'eston_fleet_refuels';

// Vehicle structure
const createVehicle = (data) => ({
  id: `veh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  userId: data.userId,
  vehicleNumber: data.vehicleNumber,
  vehicleName: data.vehicleName || '',
  vehicleType: data.vehicleType, // truck, van, car, motorcycle, etc.
  make: data.make || '',
  model: data.model || '',
  year: data.year || new Date().getFullYear(),
  fuelType: data.fuelType, // pms, ago, ik
  tankCapacity: data.tankCapacity || 0, // liters
  avgConsumption: data.avgConsumption || 0, // km per liter
  currentOdometer: data.currentOdometer || 0, // km
  status: 'active', // active, maintenance, retired
  notes: data.notes || '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  stats: {
    totalRefuels: 0,
    totalLiters: 0,
    totalCost: 0,
    totalDistance: 0,
    avgFuelEfficiency: 0,
    lastRefuelDate: null,
  }
});

// Refuel record structure
const createRefuel = (data) => ({
  id: `refuel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  vehicleId: data.vehicleId,
  userId: data.userId,
  date: data.date,
  odometer: data.odometer, // km
  liters: data.liters,
  pricePerLiter: data.pricePerLiter,
  totalCost: data.liters * data.pricePerLiter,
  fuelType: data.fuelType,
  location: data.location || '',
  fuelStation: data.fuelStation || '',
  isFull: data.isFull || false, // full tank or partial
  notes: data.notes || '',
  createdAt: new Date().toISOString(),
});

// Get all vehicles for a user
export function getUserVehicles(userId) {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allVehicles = stored ? JSON.parse(stored) : [];
    return allVehicles.filter(v => v.userId === userId && v.status !== 'deleted');
  } catch (error) {
    console.error('Error loading vehicles:', error);
    return [];
  }
}

// Get vehicle by ID
export function getVehicleById(vehicleId) {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const vehicles = stored ? JSON.parse(stored) : [];
    return vehicles.find(v => v.id === vehicleId);
  } catch (error) {
    console.error('Error loading vehicle:', error);
    return null;
  }
}

// Add new vehicle
export function addVehicle(data) {
  try {
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Check if vehicle number already exists for this user
    const existing = vehicles.find(
      v => v.userId === data.userId && 
      v.vehicleNumber.toLowerCase() === data.vehicleNumber.toLowerCase() &&
      v.status !== 'deleted'
    );
    
    if (existing) {
      return {
        success: false,
        error: 'Vehicle number already exists'
      };
    }

    const newVehicle = createVehicle(data);
    vehicles.push(newVehicle);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    
    return {
      success: true,
      vehicle: newVehicle
    };
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update vehicle
export function updateVehicle(vehicleId, updates) {
  try {
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = vehicles.findIndex(v => v.id === vehicleId);
    
    if (index === -1) {
      return { success: false, error: 'Vehicle not found' };
    }

    vehicles[index] = {
      ...vehicles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    
    return {
      success: true,
      vehicle: vehicles[index]
    };
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Delete vehicle (soft delete)
export function deleteVehicle(vehicleId) {
  return updateVehicle(vehicleId, { status: 'deleted' });
}

// Get all refuel records for a vehicle
export function getVehicleRefuels(vehicleId) {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(REFUEL_KEY);
    const allRefuels = stored ? JSON.parse(stored) : [];
    return allRefuels
      .filter(r => r.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error loading refuels:', error);
    return [];
  }
}

// Get all refuel records for a user
export function getUserRefuels(userId) {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(REFUEL_KEY);
    const allRefuels = stored ? JSON.parse(stored) : [];
    return allRefuels
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error loading refuels:', error);
    return [];
  }
}

// Add refuel record
export function addRefuel(data) {
  try {
    const refuels = JSON.parse(localStorage.getItem(REFUEL_KEY) || '[]');
    const newRefuel = createRefuel(data);
    refuels.push(newRefuel);
    localStorage.setItem(REFUEL_KEY, JSON.stringify(refuels));
    
    // Update vehicle stats
    updateVehicleStats(data.vehicleId);
    
    return {
      success: true,
      refuel: newRefuel
    };
  } catch (error) {
    console.error('Error adding refuel:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update vehicle statistics
function updateVehicleStats(vehicleId) {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return;

  const refuels = getVehicleRefuels(vehicleId);
  
  if (refuels.length === 0) return;

  // Calculate statistics
  const totalRefuels = refuels.length;
  const totalLiters = refuels.reduce((sum, r) => sum + r.liters, 0);
  const totalCost = refuels.reduce((sum, r) => sum + r.totalCost, 0);
  const lastRefuelDate = refuels[0].date;
  
  // Calculate total distance and fuel efficiency
  let totalDistance = 0;
  let avgFuelEfficiency = vehicle.avgConsumption;
  
  if (refuels.length >= 2) {
    const sortedRefuels = [...refuels].sort((a, b) => new Date(a.date) - new Date(b.date));
    totalDistance = sortedRefuels[sortedRefuels.length - 1].odometer - sortedRefuels[0].odometer;
    
    if (totalDistance > 0 && totalLiters > 0) {
      avgFuelEfficiency = totalDistance / totalLiters;
    }
  }

  // Update vehicle
  updateVehicle(vehicleId, {
    currentOdometer: refuels[0].odometer,
    stats: {
      totalRefuels,
      totalLiters,
      totalCost,
      totalDistance,
      avgFuelEfficiency,
      lastRefuelDate,
    }
  });
}

// Get fleet analytics for a user
export function getFleetAnalytics(userId) {
  const vehicles = getUserVehicles(userId);
  const refuels = getUserRefuels(userId);
  
  if (vehicles.length === 0) {
    return {
      totalVehicles: 0,
      activeVehicles: 0,
      totalFuelCost: 0,
      totalLiters: 0,
      avgFuelEfficiency: 0,
      fuelTypeBreakdown: {},
      vehicleTypeBreakdown: {},
      monthlyTrend: [],
    };
  }

  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const totalFuelCost = refuels.reduce((sum, r) => sum + r.totalCost, 0);
  const totalLiters = refuels.reduce((sum, r) => sum + r.liters, 0);
  
  // Average fuel efficiency across fleet
  const vehiclesWithEfficiency = vehicles.filter(v => v.stats.avgFuelEfficiency > 0);
  const avgFuelEfficiency = vehiclesWithEfficiency.length > 0
    ? vehiclesWithEfficiency.reduce((sum, v) => sum + v.stats.avgFuelEfficiency, 0) / vehiclesWithEfficiency.length
    : 0;

  // Fuel type breakdown
  const fuelTypeBreakdown = {};
  refuels.forEach(r => {
    if (!fuelTypeBreakdown[r.fuelType]) {
      fuelTypeBreakdown[r.fuelType] = { liters: 0, cost: 0 };
    }
    fuelTypeBreakdown[r.fuelType].liters += r.liters;
    fuelTypeBreakdown[r.fuelType].cost += r.totalCost;
  });

  // Vehicle type breakdown
  const vehicleTypeBreakdown = {};
  vehicles.forEach(v => {
    if (!vehicleTypeBreakdown[v.vehicleType]) {
      vehicleTypeBreakdown[v.vehicleType] = 0;
    }
    vehicleTypeBreakdown[v.vehicleType]++;
  });

  // Monthly trend (last 6 months)
  const monthlyTrend = calculateMonthlyTrend(refuels);

  return {
    totalVehicles: vehicles.length,
    activeVehicles: activeVehicles.length,
    totalFuelCost,
    totalLiters,
    avgFuelEfficiency,
    fuelTypeBreakdown,
    vehicleTypeBreakdown,
    monthlyTrend,
  };
}

// Calculate monthly fuel consumption trend
function calculateMonthlyTrend(refuels) {
  const months = {};
  
  refuels.forEach(refuel => {
    const date = new Date(refuel.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!months[monthKey]) {
      months[monthKey] = { liters: 0, cost: 0, count: 0 };
    }
    
    months[monthKey].liters += refuel.liters;
    months[monthKey].cost += refuel.totalCost;
    months[monthKey].count++;
  });

  return Object.entries(months)
    .map(([month, data]) => ({
      month,
      ...data
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months
}

// Create demo fleet data
export function createDemoFleet(userId) {
  const demoVehicles = [
    {
      userId,
      vehicleNumber: 'KCA 123A',
      vehicleName: 'Delivery Truck 1',
      vehicleType: 'truck',
      make: 'Isuzu',
      model: 'FRR',
      year: 2020,
      fuelType: 'ago',
      tankCapacity: 100,
      avgConsumption: 8.5,
      currentOdometer: 45000,
    },
    {
      userId,
      vehicleNumber: 'KCB 456B',
      vehicleName: 'Delivery Van',
      vehicleType: 'van',
      make: 'Toyota',
      model: 'Hiace',
      year: 2019,
      fuelType: 'pms',
      tankCapacity: 70,
      avgConsumption: 10.2,
      currentOdometer: 62000,
    },
    {
      userId,
      vehicleNumber: 'KCC 789C',
      vehicleName: 'Company Car',
      vehicleType: 'car',
      make: 'Toyota',
      model: 'Corolla',
      year: 2021,
      fuelType: 'pms',
      tankCapacity: 50,
      avgConsumption: 14.5,
      currentOdometer: 28000,
    }
  ];

  const results = [];
  demoVehicles.forEach(vehicle => {
    const result = addVehicle(vehicle);
    if (result.success) {
      results.push(result.vehicle);
      
      // Add some demo refuel records
      const refuelDates = [-30, -20, -10, -3];
      refuelDates.forEach(daysAgo => {
        const date = new Date();
        date.setDate(date.getDate() + daysAgo);
        
        addRefuel({
          vehicleId: result.vehicle.id,
          userId,
          date: date.toISOString().split('T')[0],
          odometer: result.vehicle.currentOdometer + (daysAgo * -100),
          liters: Math.floor(Math.random() * 30) + 40,
          pricePerLiter: result.vehicle.fuelType === 'pms' ? 188.84 : 165.50,
          fuelType: result.vehicle.fuelType,
          isFull: true,
        });
      });
    }
  });

  return {
    success: true,
    vehicles: results
  };
}