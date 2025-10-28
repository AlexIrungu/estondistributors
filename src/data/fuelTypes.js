// src/data/fuelTypes.js

/**
 * Fuel type configurations with current EPRA prices (January 2025)
 * Prices are for Nairobi - other locations may vary
 */

export const FUEL_TYPES = {
  pms: {
    id: 'pms',
    code: 'PMS',
    name: 'Super Petrol',
    fullName: 'Premium Motor Spirit',
    description: 'High-quality unleaded petrol for all gasoline vehicles',
    icon: '⛽',
    color: 'primary',
    currentPrice: {
      nairobi: 184.52,
      mombasa: 181.24
    },
    unit: 'KES/Liter',
    octaneRating: 95,
    uses: [
      'Passenger vehicles',
      'Light commercial vehicles',
      'Motorcycles',
      'Small generators'
    ],
    specifications: {
      density: '0.74-0.76 kg/L',
      flashPoint: '-43°C',
      sulphurContent: '< 50 ppm'
    }
  },
  ago: {
    id: 'ago',
    code: 'AGO',
    name: 'Diesel',
    fullName: 'Automotive Gas Oil',
    description: 'Reliable diesel fuel for heavy-duty and commercial vehicles',
    icon: '🚚',
    color: 'accent',
    currentPrice: {
      nairobi: 171.47,
      mombasa: 168.19
    },
    unit: 'KES/Liter',
    cetaneRating: 50,
    uses: [
      'Trucks and lorries',
      'Buses',
      'Heavy machinery',
      'Industrial generators',
      'Marine engines'
    ],
    specifications: {
      density: '0.82-0.85 kg/L',
      flashPoint: '> 55°C',
      sulphurContent: '< 50 ppm'
    }
  },
  ik: {
    id: 'ik',
    code: 'IK',
    name: 'Kerosene',
    fullName: 'Illuminating Kerosene',
    description: 'Multi-purpose fuel for heating, lighting, and cooking',
    icon: '🔥',
    color: 'amber',
    currentPrice: {
      nairobi: 154.78,
      mombasa: 151.49
    },
    unit: 'KES/Liter',
    uses: [
      'Domestic cooking',
      'Lighting',
      'Heating',
      'Small engines',
      'Aviation (jet fuel variant)'
    ],
    specifications: {
      density: '0.78-0.81 kg/L',
      flashPoint: '> 38°C',
      sulphurContent: '< 0.2%'
    }
  }
};

/**
 * Get fuel type by ID
 * @param {string} fuelTypeId - Fuel type identifier (pms, ago, ik)
 * @returns {object|null} - Fuel type object or null
 */
export function getFuelType(fuelTypeId) {
  return FUEL_TYPES[fuelTypeId] || null;
}

/**
 * Get current price for a fuel type and location
 * @param {string} fuelTypeId - Fuel type identifier
 * @param {string} location - Location (nairobi, mombasa)
 * @returns {number} - Price per liter
 */
export function getCurrentPrice(fuelTypeId, location = 'nairobi') {
  const fuelType = getFuelType(fuelTypeId);
  return fuelType?.currentPrice[location] || 0;
}

/**
 * Get all fuel types as array
 * @returns {array} - Array of fuel type objects
 */
export function getAllFuelTypes() {
  return Object.values(FUEL_TYPES);
}

/**
 * Get fuel types for dropdown/select
 * @returns {array} - Array of options for form select
 */
export function getFuelTypeOptions() {
  return getAllFuelTypes().map(fuel => ({
    value: fuel.id,
    label: `${fuel.name} (${fuel.code})`,
    price: fuel.currentPrice.nairobi,
    icon: fuel.icon
  }));
}

/**
 * Calculate energy content difference between fuel types
 * @param {string} fuelTypeId - Fuel type ID
 * @returns {object} - Energy content info
 */
export function getEnergyContent(fuelTypeId) {
  const energyData = {
    pms: { mj_per_liter: 32.4, kwh_per_liter: 9.0 },
    ago: { mj_per_liter: 35.8, kwh_per_liter: 9.9 },
    ik: { mj_per_liter: 34.5, kwh_per_liter: 9.6 }
  };
  return energyData[fuelTypeId] || null;
}

/**
 * Compare fuel types
 * @param {string} fuelType1 - First fuel type ID
 * @param {string} fuelType2 - Second fuel type ID
 * @param {string} location - Location for price comparison
 * @returns {object} - Comparison data
 */
export function compareFuelTypes(fuelType1, fuelType2, location = 'nairobi') {
  const fuel1 = getFuelType(fuelType1);
  const fuel2 = getFuelType(fuelType2);

  if (!fuel1 || !fuel2) return null;

  const price1 = fuel1.currentPrice[location];
  const price2 = fuel2.currentPrice[location];
  const priceDiff = price1 - price2;
  const percentDiff = ((priceDiff / price2) * 100).toFixed(2);

  return {
    fuel1: {
      name: fuel1.name,
      price: price1
    },
    fuel2: {
      name: fuel2.name,
      price: price2
    },
    difference: {
      absolute: priceDiff,
      percentage: percentDiff,
      cheaper: priceDiff > 0 ? fuel2.name : fuel1.name
    }
  };
}

export default FUEL_TYPES;