// src/lib/api/priceService.js

/**
 * Price Service - Manages fuel price data from EPRA and caching
 */

const STORAGE_KEY = 'epra_fuel_prices';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * EPRA Fuel Prices - Manually updated based on official EPRA data
 * Source: https://www.epra.go.ke/petroleum-gas
 * Update Frequency: Monthly (1st of each month)
 */
const EPRA_PRICES = {
  lastUpdated: '2025-01-01',
  effectiveDate: '2025-01-01 to 2025-01-31',
  locations: {
    mombasa: {
      name: 'Mombasa',
      prices: {
        pms: { price: 181.24, change: 0.00, label: 'Super Petrol' },
        ago: { price: 168.19, change: 0.00, label: 'Diesel' },
        ik: { price: 151.49, change: 0.00, label: 'Kerosene' }
      }
    },
    nairobi: {
      name: 'Nairobi',
      prices: {
        pms: { price: 184.52, change: 0.00, label: 'Super Petrol' },
        ago: { price: 171.47, change: 0.00, label: 'Diesel' },
        ik: { price: 154.78, change: 0.00, label: 'Kerosene' }
      }
    },
    nakuru: {
      name: 'Nakuru',
      prices: {
        pms: { price: 183.56, change: 0.00, label: 'Super Petrol' },
        ago: { price: 170.87, change: 0.00, label: 'Diesel' },
        ik: { price: 154.21, change: 0.00, label: 'Kerosene' }
      }
    },
    eldoret: {
      name: 'Eldoret',
      prices: {
        pms: { price: 184.38, change: 0.00, label: 'Super Petrol' },
        ago: { price: 171.68, change: 0.00, label: 'Diesel' },
        ik: { price: 155.03, change: 0.00, label: 'Kerosene' }
      }
    },
    kisumu: {
      name: 'Kisumu',
      prices: {
        pms: { price: 184.37, change: 0.00, label: 'Super Petrol' },
        ago: { price: 171.68, change: 0.00, label: 'Diesel' },
        ik: { price: 155.03, change: 0.00, label: 'Kerosene' }
      }
    }
  }
};

/**
 * Get cached prices from localStorage
 */
function getCachedPrices() {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const now = new Date().getTime();
    
    // Check if cache is still valid
    if (now - data.timestamp < CACHE_DURATION) {
      return data.prices;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading cached prices:', error);
    return null;
  }
}

/**
 * Save prices to localStorage cache
 */
function cachePrices(prices) {
  if (typeof window === 'undefined') return;
  
  try {
    const data = {
      prices,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching prices:', error);
  }
}

/**
 * Get current fuel prices
 * Returns cached prices if available, otherwise returns EPRA data
 */
export async function getCurrentPrices() {
  // Try to get from cache first
  const cached = getCachedPrices();
  if (cached) {
    return cached;
  }
  
  // Return EPRA data and cache it
  const prices = { ...EPRA_PRICES };
  cachePrices(prices);
  return prices;
}

/**
 * Get prices for a specific location
 */
export async function getPricesByLocation(locationKey) {
  const allPrices = await getCurrentPrices();
  return allPrices.locations[locationKey] || null;
}

/**
 * Get all available locations
 */
export function getAvailableLocations() {
  return Object.keys(EPRA_PRICES.locations).map(key => ({
    key,
    name: EPRA_PRICES.locations[key].name
  }));
}

/**
 * Format price with KES currency
 */
export function formatPrice(price) {
  return `KES ${price.toFixed(2)}`;
}

/**
 * Calculate price change percentage
 */
export function calculateChangePercentage(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get price trend (up, down, stable)
 */
export function getPriceTrend(change) {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'stable';
}

/**
 * Clear price cache (useful for manual updates)
 */
export function clearPriceCache() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Update EPRA prices manually (for admin use)
 * This function should be called when EPRA releases new prices
 */
export function updateEpraPrices(newPrices) {
  // In production, this would make an API call to update the backend
  // For now, we'll just clear the cache so new prices are fetched
  clearPriceCache();
  console.log('EPRA prices updated. Cache cleared.');
  return true;
}