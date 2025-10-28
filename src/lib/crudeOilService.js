// src/lib/api/crudeOilService.js

/**
 * Crude Oil Service - Fetches crude oil prices from Alpha Vantage
 * Free tier: 25 requests/day
 */

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const CACHE_KEY = 'crude_oil_data';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Get cached crude oil data
 */
function getCachedData() {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const now = new Date().getTime();
    
    if (now - data.timestamp < CACHE_DURATION) {
      return data.prices;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading cached crude oil data:', error);
    return null;
  }
}

/**
 * Save crude oil data to cache
 */
function cacheData(prices) {
  if (typeof window === 'undefined') return;
  
  try {
    const data = {
      prices,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching crude oil data:', error);
  }
}

/**
 * Fetch WTI Crude Oil prices from Alpha Vantage
 */
export async function getWTICrudePrice() {
  const cached = getCachedData();
  if (cached?.wti) {
    return cached.wti;
  }
  
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey) {
      console.warn('Alpha Vantage API key not configured');
      return getMockWTIData();
    }
    
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=WTI&interval=daily&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch WTI data');
    }
    
    const data = await response.json();
    
    // Parse Alpha Vantage response
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Information']) {
      console.warn('API rate limit reached:', data['Information']);
      return getMockWTIData();
    }
    
    const timeSeries = data.data || [];
    const latest = timeSeries[0];
    
    if (!latest) {
      return getMockWTIData();
    }
    
    const wtiData = {
      price: parseFloat(latest.value),
      date: latest.date,
      unit: 'USD per barrel'
    };
    
    // Cache the data
    const allData = getCachedData() || {};
    allData.wti = wtiData;
    cacheData(allData);
    
    return wtiData;
  } catch (error) {
    console.error('Error fetching WTI price:', error);
    return getMockWTIData();
  }
}

/**
 * Fetch Brent Crude Oil prices from Alpha Vantage
 */
export async function getBrentCrudePrice() {
  const cached = getCachedData();
  if (cached?.brent) {
    return cached.brent;
  }
  
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey) {
      console.warn('Alpha Vantage API key not configured');
      return getMockBrentData();
    }
    
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=BRENT&interval=daily&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Brent data');
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Information']) {
      console.warn('API rate limit reached:', data['Information']);
      return getMockBrentData();
    }
    
    const timeSeries = data.data || [];
    const latest = timeSeries[0];
    
    if (!latest) {
      return getMockBrentData();
    }
    
    const brentData = {
      price: parseFloat(latest.value),
      date: latest.date,
      unit: 'USD per barrel'
    };
    
    // Cache the data
    const allData = getCachedData() || {};
    allData.brent = brentData;
    cacheData(allData);
    
    return brentData;
  } catch (error) {
    console.error('Error fetching Brent price:', error);
    return getMockBrentData();
  }
}

/**
 * Get both WTI and Brent prices
 */
export async function getAllCrudePrices() {
  const [wti, brent] = await Promise.all([
    getWTICrudePrice(),
    getBrentCrudePrice()
  ]);
  
  return { wti, brent };
}

/**
 * Mock data for development/fallback
 */
function getMockWTIData() {
  return {
    price: 73.45,
    date: new Date().toISOString().split('T')[0],
    unit: 'USD per barrel',
    isMock: true
  };
}

function getMockBrentData() {
  return {
    price: 78.20,
    date: new Date().toISOString().split('T')[0],
    unit: 'USD per barrel',
    isMock: true
  };
}

/**
 * Calculate correlation between crude oil and local fuel prices
 */
export function calculateCorrelation(crudePrice, localPrice) {
  // Simplified correlation calculation
  // In production, this would use historical data for accurate correlation
  const estimatedCorrelation = 0.75; // 75% correlation (typical for fuel markets)
  return estimatedCorrelation;
}

/**
 * Clear crude oil cache
 */
export function clearCrudeCache() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CACHE_KEY);
}