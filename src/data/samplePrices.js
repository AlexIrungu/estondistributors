// src/data/samplePrices.js

/**
 * Historical fuel price data for Kenya
 * Data represents monthly EPRA prices from 2024-2025
 */

export const historicalPrices = {
  nairobi: {
    pms: [
      { date: '2024-01-01', price: 177.30, change: 2.1 },
      { date: '2024-02-01', price: 179.50, change: 1.2 },
      { date: '2024-03-01', price: 181.20, change: 0.9 },
      { date: '2024-04-01', price: 178.90, change: -1.3 },
      { date: '2024-05-01', price: 180.40, change: 0.8 },
      { date: '2024-06-01', price: 182.60, change: 1.2 },
      { date: '2024-07-01', price: 185.10, change: 1.4 },
      { date: '2024-08-01', price: 183.70, change: -0.8 },
      { date: '2024-09-01', price: 181.20, change: -1.4 },
      { date: '2024-10-01', price: 182.80, change: 0.9 },
      { date: '2024-11-01', price: 184.20, change: 0.8 },
      { date: '2024-12-01', price: 184.52, change: 0.2 },
      { date: '2025-01-01', price: 184.52, change: 0.0 }
    ],
    ago: [
      { date: '2024-01-01', price: 163.50, change: 1.8 },
      { date: '2024-02-01', price: 165.20, change: 1.0 },
      { date: '2024-03-01', price: 167.10, change: 1.2 },
      { date: '2024-04-01', price: 164.80, change: -1.4 },
      { date: '2024-05-01', price: 166.30, change: 0.9 },
      { date: '2024-06-01', price: 168.50, change: 1.3 },
      { date: '2024-07-01', price: 170.90, change: 1.4 },
      { date: '2024-08-01', price: 169.40, change: -0.9 },
      { date: '2024-09-01', price: 167.20, change: -1.3 },
      { date: '2024-10-01', price: 168.90, change: 1.0 },
      { date: '2024-11-01', price: 170.70, change: 1.1 },
      { date: '2024-12-01', price: 171.47, change: 0.5 },
      { date: '2025-01-01', price: 171.47, change: 0.0 }
    ],
    ik: [
      { date: '2024-01-01', price: 147.20, change: 1.5 },
      { date: '2024-02-01', price: 148.90, change: 1.2 },
      { date: '2024-03-01', price: 150.40, change: 1.0 },
      { date: '2024-04-01', price: 148.10, change: -1.5 },
      { date: '2024-05-01', price: 149.50, change: 0.9 },
      { date: '2024-06-01', price: 151.30, change: 1.2 },
      { date: '2024-07-01', price: 153.60, change: 1.5 },
      { date: '2024-08-01', price: 152.20, change: -0.9 },
      { date: '2024-09-01', price: 150.40, change: -1.2 },
      { date: '2024-10-01', price: 152.10, change: 1.1 },
      { date: '2024-11-01', price: 153.90, change: 1.2 },
      { date: '2024-12-01', price: 154.78, change: 0.6 },
      { date: '2025-01-01', price: 154.78, change: 0.0 }
    ]
  },
  mombasa: {
    pms: [
      { date: '2024-01-01', price: 174.10, change: 2.0 },
      { date: '2024-02-01', price: 176.20, change: 1.2 },
      { date: '2024-03-01', price: 177.80, change: 0.9 },
      { date: '2024-04-01', price: 175.60, change: -1.2 },
      { date: '2024-05-01', price: 177.00, change: 0.8 },
      { date: '2024-06-01', price: 179.10, change: 1.2 },
      { date: '2024-07-01', price: 181.50, change: 1.3 },
      { date: '2024-08-01', price: 180.20, change: -0.7 },
      { date: '2024-09-01', price: 177.90, change: -1.3 },
      { date: '2024-10-01', price: 179.40, change: 0.8 },
      { date: '2024-11-01', price: 180.90, change: 0.8 },
      { date: '2024-12-01', price: 181.24, change: 0.2 },
      { date: '2025-01-01', price: 181.24, change: 0.0 }
    ],
    ago: [
      { date: '2024-01-01', price: 160.30, change: 1.7 },
      { date: '2024-02-01', price: 161.90, change: 1.0 },
      { date: '2024-03-01', price: 163.70, change: 1.1 },
      { date: '2024-04-01', price: 161.50, change: -1.3 },
      { date: '2024-05-01', price: 162.90, change: 0.9 },
      { date: '2024-06-01', price: 165.00, change: 1.3 },
      { date: '2024-07-01', price: 167.30, change: 1.4 },
      { date: '2024-08-01', price: 165.90, change: -0.8 },
      { date: '2024-09-01', price: 163.80, change: -1.3 },
      { date: '2024-10-01', price: 165.40, change: 1.0 },
      { date: '2024-11-01', price: 167.10, change: 1.0 },
      { date: '2024-12-01', price: 168.19, change: 0.7 },
      { date: '2025-01-01', price: 168.19, change: 0.0 }
    ],
    ik: [
      { date: '2024-01-01', price: 144.00, change: 1.4 },
      { date: '2024-02-01', price: 145.60, change: 1.1 },
      { date: '2024-03-01', price: 147.00, change: 1.0 },
      { date: '2024-04-01', price: 144.80, change: -1.5 },
      { date: '2024-05-01', price: 146.20, change: 1.0 },
      { date: '2024-06-01', price: 147.90, change: 1.2 },
      { date: '2024-07-01', price: 150.10, change: 1.5 },
      { date: '2024-08-01', price: 148.80, change: -0.9 },
      { date: '2024-09-01', price: 147.10, change: -1.1 },
      { date: '2024-10-01', price: 148.70, change: 1.1 },
      { date: '2024-11-01', price: 150.40, change: 1.1 },
      { date: '2024-12-01', price: 151.49, change: 0.7 },
      { date: '2025-01-01', price: 151.49, change: 0.0 }
    ]
  }
};

/**
 * Crude oil historical prices (monthly averages)
 */
export const crudeOilHistory = {
  wti: [
    { date: '2024-01-01', price: 72.30 },
    { date: '2024-02-01', price: 74.10 },
    { date: '2024-03-01', price: 76.50 },
    { date: '2024-04-01', price: 73.80 },
    { date: '2024-05-01', price: 75.20 },
    { date: '2024-06-01', price: 77.40 },
    { date: '2024-07-01', price: 79.60 },
    { date: '2024-08-01', price: 78.10 },
    { date: '2024-09-01', price: 75.90 },
    { date: '2024-10-01', price: 76.80 },
    { date: '2024-11-01', price: 74.20 },
    { date: '2024-12-01', price: 73.45 },
    { date: '2025-01-01', price: 73.45 }
  ],
  brent: [
    { date: '2024-01-01', price: 77.50 },
    { date: '2024-02-01', price: 79.30 },
    { date: '2024-03-01', price: 81.70 },
    { date: '2024-04-01', price: 79.00 },
    { date: '2024-05-01', price: 80.40 },
    { date: '2024-06-01', price: 82.60 },
    { date: '2024-07-01', price: 84.80 },
    { date: '2024-08-01', price: 83.30 },
    { date: '2024-09-01', price: 81.10 },
    { date: '2024-10-01', price: 82.00 },
    { date: '2024-11-01', price: 79.40 },
    { date: '2024-12-01', price: 78.20 },
    { date: '2025-01-01', price: 78.20 }
  ]
};

/**
 * Get historical prices for a specific fuel type and location
 */
export function getHistoricalPrices(location, fuelType, months = 12) {
  const data = historicalPrices[location]?.[fuelType] || [];
  return data.slice(-months);
}

/**
 * Get crude oil historical prices
 */
export function getCrudeOilHistory(type = 'wti', months = 12) {
  const data = crudeOilHistory[type] || [];
  return data.slice(-months);
}

/**
 * Calculate average price for a period
 */
export function calculateAverage(priceArray) {
  if (!priceArray || priceArray.length === 0) return 0;
  const sum = priceArray.reduce((acc, item) => acc + item.price, 0);
  return sum / priceArray.length;
}

/**
 * Calculate price volatility (standard deviation)
 */
export function calculateVolatility(priceArray) {
  if (!priceArray || priceArray.length === 0) return 0;
  
  const avg = calculateAverage(priceArray);
  const squaredDiffs = priceArray.map(item => Math.pow(item.price - avg, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / priceArray.length;
  
  return Math.sqrt(variance);
}