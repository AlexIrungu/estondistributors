// src/lib/priceService.js

/**
 * Price Service - Manages fuel price data from API/MongoDB
 * Updated to work with Next.js API routes instead of localStorage
 */

/**
 * Get current fuel prices from API
 * Returns array of fuel types with prices for the specified location
 * @param {string} location - Location key (default: 'nairobi')
 * @returns {Promise<Array>} Array of fuel price objects
 */
export async function getCurrentPrices(location = 'nairobi') {
  try {
    const response = await fetch(`/api/prices?location=${location}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data into the format expected by QuickOrderForm
    if (data.locations && data.locations[location]) {
      const locationPrices = data.locations[location].prices;
      
      // Return as array with consistent structure
      return [
        {
          id: 'pms',
          name: locationPrices.pms.label || 'Super Petrol',
          price: locationPrices.pms.price,
          change: locationPrices.pms.change || 0,
          unit: locationPrices.pms.unit || 'KES/Litre'
        },
        {
          id: 'ago',
          name: locationPrices.ago.label || 'Diesel',
          price: locationPrices.ago.price,
          change: locationPrices.ago.change || 0,
          unit: locationPrices.ago.unit || 'KES/Litre'
        },
        {
          id: 'ik',
          name: locationPrices.ik.label || 'Kerosene',
          price: locationPrices.ik.price,
          change: locationPrices.ik.change || 0,
          unit: locationPrices.ik.unit || 'KES/Litre'
        }
      ];
    }
    
    throw new Error('Invalid price data structure from API');
  } catch (error) {
    console.error('Error fetching prices:', error);
    
    // Return fallback data so the form doesn't break
    return [
      { id: 'pms', name: 'Super Petrol', price: 184.52, change: 0, unit: 'KES/Litre' },
      { id: 'ago', name: 'Diesel', price: 171.47, change: 0, unit: 'KES/Litre' },
      { id: 'ik', name: 'Kerosene', price: 154.78, change: 0, unit: 'KES/Litre' }
    ];
  }
}

/**
 * Get all prices for all locations
 * @returns {Promise<Object>} Full price data object
 */
export async function getAllPrices() {
  try {
    const response = await fetch('/api/prices', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all prices:', error);
    throw error;
  }
}

/**
 * Get prices for a specific location (returns full location object)
 * @param {string} locationKey - Location identifier
 * @returns {Promise<Object|null>} Location price data
 */
export async function getPricesByLocation(locationKey) {
  try {
    const response = await fetch(`/api/prices?location=${locationKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prices for ${locationKey}`);
    }
    
    const data = await response.json();
    return data.locations?.[locationKey] || null;
  } catch (error) {
    console.error(`Error fetching prices for location ${locationKey}:`, error);
    return null;
  }
}

/**
 * Get price for a specific fuel type across all locations
 * @param {string} fuelType - Fuel type (pms, ago, ik)
 * @returns {Promise<Object>} Fuel prices by location
 */
export async function getPricesByFuelType(fuelType) {
  try {
    const response = await fetch(`/api/prices?fuelType=${fuelType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prices for fuel type ${fuelType}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching prices for fuel type ${fuelType}:`, error);
    throw error;
  }
}

/**
 * Get all available locations
 * @returns {Promise<Array>} Array of location objects
 */
export async function getAvailableLocations() {
  try {
    const data = await getAllPrices();
    
    if (data.locations) {
      return Object.keys(data.locations).map(key => ({
        key,
        name: data.locations[key].name
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    // Return default locations as fallback
    return [
      { key: 'nairobi', name: 'Nairobi' },
      { key: 'mombasa', name: 'Mombasa' },
      { key: 'nakuru', name: 'Nakuru' },
      { key: 'eldoret', name: 'Eldoret' },
      { key: 'kisumu', name: 'Kisumu' }
    ];
  }
}

/**
 * Format price with KES currency
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  return `KES ${price.toFixed(2)}`;
}

/**
 * Calculate price change percentage
 * @param {number} current - Current price
 * @param {number} previous - Previous price
 * @returns {number} Percentage change
 */
export function calculateChangePercentage(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get price trend indicator
 * @param {number} change - Price change value
 * @returns {string} Trend indicator ('up', 'down', or 'stable')
 */
export function getPriceTrend(change) {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'stable';
}

/**
 * Get price comparison between two locations
 * @param {string} location1 - First location key
 * @param {string} location2 - Second location key
 * @returns {Promise<Object>} Comparison data
 */
export async function comparePrices(location1, location2) {
  try {
    const [loc1Data, loc2Data] = await Promise.all([
      getPricesByLocation(location1),
      getPricesByLocation(location2)
    ]);
    
    if (!loc1Data || !loc2Data) {
      throw new Error('Failed to fetch location data for comparison');
    }
    
    const comparison = {};
    const fuelTypes = ['pms', 'ago', 'ik'];
    
    fuelTypes.forEach(type => {
      const price1 = loc1Data.prices[type]?.price || 0;
      const price2 = loc2Data.prices[type]?.price || 0;
      const difference = price2 - price1;
      
      comparison[type] = {
        location1: { name: loc1Data.name, price: price1 },
        location2: { name: loc2Data.name, price: price2 },
        difference,
        percentageDiff: price1 > 0 ? ((difference / price1) * 100) : 0,
        cheaper: difference < 0 ? location2 : location1
      };
    });
    
    return comparison;
  } catch (error) {
    console.error('Error comparing prices:', error);
    throw error;
  }
}